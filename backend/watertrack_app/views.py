# backend/watertrack_app/views.py

from rest_framework import viewsets, status, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import BasePermission, IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from django.db.models import Q
from django.conf import settings
import os
import joblib
from .models import *
from .serializers import *

class IsAppAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_superuser or request.user.role == 'admin' or request.user.is_staff)
        )

class IsVillageLeaderOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (
                request.user.is_superuser
                or request.user.role == 'admin'
                or request.user.role == 'village_leader'
            )
        )

# ✅ ONGEZA HII: Village ViewSet
class VillageViewSet(viewsets.ModelViewSet):
    queryset = Village.objects.all()
    serializer_class = VillageSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'district', 'region']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

class WaterSourceViewSet(viewsets.ModelViewSet):
    queryset = WaterSource.objects.all()
    serializer_class = WaterSourceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'source_type', 'village']
    search_fields = ['name', 'village__name']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'nearby', 'report_damage']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        lat = float(request.query_params.get('lat', -6.8))
        lng = float(request.query_params.get('lng', 39.28))
        radius_km = float(request.query_params.get('radius', 5))
        
        sources = WaterSource.objects.filter(
            latitude__isnull=False,
            longitude__isnull=False
        )
        
        sources = sources.filter(
            latitude__gte=lat - 0.045 * radius_km,
            latitude__lte=lat + 0.045 * radius_km,
            longitude__gte=lng - 0.045 * radius_km,
            longitude__lte=lng + 0.045 * radius_km,
        )
        
        serializer = self.get_serializer(sources, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def report_damage(self, request, pk=None):
        water_source = self.get_object()
        serializer = DamageReportSerializer(data=request.data)
        
        if serializer.is_valid():
            reported_by = request.user if request.user.is_authenticated else None
            serializer.save(
                water_source=water_source,
                reported_by=reported_by,
                latitude=water_source.latitude,
                longitude=water_source.longitude
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DamageReportViewSet(viewsets.ModelViewSet):
    queryset = DamageReport.objects.all()
    serializer_class = DamageReportSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'priority', 'water_source__village', 'assigned_to']

    def get_permissions(self):
        if self.action == 'recent':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return DamageReport.objects.all()
        if user.role == 'village_leader':
            # Mwenyekiti anaona ripoti za kijiji chake zinazomsubiri
            return DamageReport.objects.filter(
                water_source__village=user.village,
                status__in=['pending_village', 'village_approved', 'forwarded_to_district',
                            'rejected', 'assigned', 'in_progress', 'resolved', 'closed', 'pending']
            )
        if user.role == 'water_officer':
            # Afisa wa maji anaona zilizoidhinishwa na kijiji chake
            return DamageReport.objects.filter(
                water_source__village=user.village,
                status__in=['village_approved', 'forwarded_to_district',
                            'assigned', 'in_progress', 'resolved']
            )
        if user.role == 'district_officer':
            # Ofisa wa wilaya anaona zilizotumwa na zilizopewa wafanyakazi
            return DamageReport.objects.filter(
                status__in=['forwarded_to_district', 'assigned', 'in_progress', 'resolved']
            )
        if user.role == 'citizen':
            return DamageReport.objects.filter(reported_by=user)
        return DamageReport.objects.none()

    def perform_create(self, serializer):
        serializer.save(
            reported_by=self.request.user if self.request.user.is_authenticated else None,
            status='pending_village'
        )

    @action(detail=False, methods=['get'])
    def recent(self, request):
        reports = DamageReport.objects.all().order_by('-report_date')[:6]
        serializer = self.get_serializer(reports, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def village_approve(self, request, pk=None):
        """Mwenyekiti wa kijiji anaidhibitia ripoti."""
        report = self.get_object()
        if request.user.role not in ['village_leader', 'admin'] and not request.user.is_superuser:
            return Response({'error': 'Hauna ruhusa ya kuidhibitia ripoti hii.'}, status=status.HTTP_403_FORBIDDEN)
        if report.water_source.village != request.user.village and request.user.role == 'village_leader':
            return Response({'error': 'Ripoti hii si ya kijiji chako.'}, status=status.HTTP_403_FORBIDDEN)
        if report.status != 'pending_village':
            return Response({'error': f'Ripoti hii iko katika hali "{report.status}" na haiwezi kuidhibitiwa tena.'}, status=status.HTTP_400_BAD_REQUEST)

        report.status = 'village_approved'
        report.village_approved_by = request.user
        report.village_approved_at = timezone.now()
        report.save()

        # Tuma arifa kwa water_officer wa kijiji hicho
        officers = User.objects.filter(village=report.water_source.village, role='water_officer')
        if officers.exists():
            alert = Alert.objects.create(
                water_source=report.water_source,
                alert_type='damage',
                message=f"Ripoti mpya imeidhinishwa na mwenyekiti: {report.title}. Tafadhali iangalie."
            )
            alert.recipients.set(officers)

        return Response({'message': 'Ripoti imeidhibitiwa. Afisa wa Maji ataarifiwa.'})

    @action(detail=True, methods=['post'])
    def village_reject(self, request, pk=None):
        """Mwenyekiti wa kijiji anakataa ripoti."""
        report = self.get_object()
        if request.user.role not in ['village_leader', 'admin'] and not request.user.is_superuser:
            return Response({'error': 'Hauna ruhusa ya kukataa ripoti hii.'}, status=status.HTTP_403_FORBIDDEN)
        if report.water_source.village != request.user.village and request.user.role == 'village_leader':
            return Response({'error': 'Ripoti hii si ya kijiji chako.'}, status=status.HTTP_403_FORBIDDEN)
        if report.status not in ['pending_village', 'village_approved']:
            return Response({'error': 'Ripoti hii haiwezi kukataliwa katika hali yake ya sasa.'}, status=status.HTTP_400_BAD_REQUEST)

        reason = request.data.get('reason', '')
        report.status = 'rejected'
        report.rejection_reason = reason
        report.save()

        # Arifa mripoti
        if report.reported_by:
            alert = Alert.objects.create(
                water_source=report.water_source,
                alert_type='general',
                message=f"Ripoti yako imekataliwa: {report.title}. Sababu: {reason or 'Haikutolewa'}"
            )
            alert.recipients.add(report.reported_by)

        return Response({'message': 'Ripoti imekataliwa.'})

    @action(detail=True, methods=['post'])
    def forward_to_district(self, request, pk=None):
        """Afisa wa Maji anatuma ripoti kwa Ofisa wa Wilaya."""
        report = self.get_object()
        if request.user.role not in ['water_officer', 'admin'] and not request.user.is_superuser:
            return Response({'error': 'Ni Afisa wa Maji tu anayeweza kutuma ripoti kwa Wilaya.'}, status=status.HTTP_403_FORBIDDEN)
        if report.status != 'village_approved':
            return Response({'error': f'Ripoti lazima iwe katika hali "village_approved" kwanza. Hali ya sasa: {report.status}'}, status=status.HTTP_400_BAD_REQUEST)

        report.status = 'forwarded_to_district'
        report.forwarded_by = request.user
        report.forwarded_at = timezone.now()
        report.save()

        # Tuma arifa kwa district_officer wote
        district_officers = User.objects.filter(role='district_officer')
        if district_officers.exists():
            alert = Alert.objects.create(
                water_source=report.water_source,
                alert_type='damage',
                message=f"Ripoti mpya imetumwa kutoka kijiji cha {report.water_source.village}: {report.title}. Tafadhali ipe mfanyakazi."
            )
            alert.recipients.set(district_officers)

        return Response({'message': 'Ripoti imetumwa kwa Ofisa wa Wilaya.'})

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """Ofisa wa Wilaya anapanga ripoti kwa mfanyakazi."""
        report = self.get_object()
        if request.user.role not in ['district_officer', 'village_leader', 'admin'] and not request.user.is_superuser:
            return Response({'error': 'Hauna ruhusa ya kupanga kazi.'}, status=status.HTTP_403_FORBIDDEN)
            
        if request.user.role == 'village_leader' and report.water_source.village != request.user.village:
            return Response({'error': 'Unaweza tu kupanga kazi kwenye ripoti za kijiji chako.'}, status=status.HTTP_403_FORBIDDEN)

        allowed_statuses = ['pending_village', 'village_approved', 'forwarded_to_district', 'assigned']
        if report.status not in allowed_statuses:
            return Response({'error': 'Hali ya ripoti hairuhusu kupangwa kwa sasa.'}, status=status.HTTP_400_BAD_REQUEST)

        worker_id = request.data.get('worker_id')
        try:
            worker = User.objects.get(id=worker_id, role='water_officer')
            report.assigned_to = worker
            report.status = 'assigned'
            report.save()

            # Arifa mfanyakazi
            alert = Alert.objects.create(
                water_source=report.water_source,
                alert_type='general',
                message=f"Umepewa kazi mpya: {report.title}. Tafadhali anza mara moja."
            )
            alert.recipients.add(worker)

            return Response({'message': f'Kazi imepewa {worker.username} mafanikio.'})
        except User.DoesNotExist:
            return Response({'error': 'Mfanyakazi huyo hayupatikani.'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def in_progress(self, request, pk=None):
        report = self.get_object()
        if request.user.role == 'water_officer' and report.assigned_to != request.user:
            return Response({'error': 'Hauna ruhusa. Kazi hii haijapangiwa wewe.'}, status=status.HTTP_403_FORBIDDEN)
        
        report.status = 'in_progress'
        report.save()
        return Response({'message': 'Ripoti sasa inafanyiwa kazi'})

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        report = self.get_object()
        if request.user.role == 'village_leader' and report.water_source.village != request.user.village:
            return Response({'error': 'Hauna ruhusa ya kutatua ripoti hii'}, status=status.HTTP_403_FORBIDDEN)
        
        if request.user.role == 'water_officer' and report.assigned_to != request.user:
            return Response({'error': 'Hauna ruhusa. Kazi hii haijapangiwa wewe.'}, status=status.HTTP_403_FORBIDDEN)

        report.status = 'resolved'
        report.resolved_at = timezone.now()
        report.resolution_notes = request.data.get('notes', '')
        report.save()

        # Notify the reporter and the assigned worker
        alert = Alert.objects.create(
            water_source=report.water_source,
            alert_type='general',
            message=f"Ripoti yako imetatuliwa: {report.title}"
        )
        if report.reported_by:
            alert.recipients.add(report.reported_by)
        if report.assigned_to and report.assigned_to != report.reported_by:
            alert.recipients.add(report.assigned_to)

        return Response({'message': 'Ripoti imetatuliwa'})

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('username')
    serializer_class = UserSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['role', 'village']
    search_fields = ['username', 'email', 'first_name', 'last_name']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAuthenticated()]
        return [IsAppAdmin()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return User.objects.none()
        if user.is_superuser or user.role == 'admin':
            return User.objects.all().order_by('username')
        if user.role == 'district_officer':
            return User.objects.filter(role__in=['village_leader', 'water_officer', 'district_officer']).order_by('username')
        if user.role == 'village_leader':
            return User.objects.filter(
                Q(village=user.village, role='water_officer') |
                Q(role__in=['village_leader', 'district_officer'])
            ).order_by('username')
        if user.role == 'water_officer':
            return User.objects.filter(
                Q(village=user.village, role='village_leader') |
                Q(role='district_officer') |
                Q(id=user.id)
            ).order_by('username')
        if user.role == 'citizen':
            return User.objects.filter(village=user.village, role='village_leader').order_by('username')
        return User.objects.filter(id=user.id)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Message.objects.filter(recipient=user) | Message.objects.filter(sender=user)
        folder = self.request.query_params.get('folder')
        if folder == 'inbox':
            queryset = queryset.filter(recipient=user)
        elif folder == 'sent':
            queryset = queryset.filter(sender=user)
        return queryset.distinct().order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class QualityReportViewSet(viewsets.ModelViewSet):
    queryset = QualityReport.objects.all()
    serializer_class = QualityReportSerializer
    permission_classes = [IsAuthenticated]

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['alert_type', 'water_source']
    search_fields = ['message']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Alert.objects.none()
        if user.is_superuser or user.role == 'admin':
            return Alert.objects.all().order_by('-created_at')
        return Alert.objects.filter(recipients=user).distinct().order_by('-created_at')

    def perform_create(self, serializer):
        alert = serializer.save()
        if not alert.recipients.exists():
            if alert.water_source and alert.water_source.village:
                users = User.objects.filter(village=alert.water_source.village)
                alert.recipients.set(users)
            else:
                alert.recipients.set(User.objects.all())

@api_view(['POST'])
@permission_classes([AllowAny])
def custom_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)
    
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': user.role,
            'phone': user.phone,
            'village': VillageSerializer(user.village).data if user.village else None,
            'is_superuser': user.is_superuser,
        }
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def model_insights(request):
    try:
        import pandas as pd
        import numpy as np
        from datetime import datetime
        
        model_path = os.path.join(settings.BASE_DIR, 'water_model.pkl')
        csv_path = os.path.join(settings.BASE_DIR, 'water.csv')
        
        if not os.path.exists(model_path):
            return Response({'error': 'Model not found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        if not os.path.exists(csv_path):
            return Response({'error': 'Training data not found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        model = joblib.load(model_path)
        
        # Load training data
        df = pd.read_csv(csv_path)
        numerical_features = [
            'temperature', 'rainfall', 'humidity', 'population', 'water_level', 'pH', 'turbidity', 'flow_rate',
            'year', 'day_of_week', 'is_weekend', 'is_holiday',
            'income_level', 'industrial_activity', 'tourism',
            'pipe_age', 'leakage_rate', 'storage_capacity',
            'forecast_rainfall', 'forecast_temperature',
            'demand_lag_1m', 'demand_lag_3m', 'demand_lag_6m'
        ]
        categorical_features = ['district', 'month', 'season']
        X = df[numerical_features + categorical_features]
        y = df['demand']
        
        # Compute R² on the full training set
        y_pred_per_capita = model.predict(X)
        y_pred_total = y_pred_per_capita * df['population'].values
        
        ss_res = np.sum((y - y_pred_total) ** 2)
        ss_tot = np.sum((y - y.mean()) ** 2)
        r2_score = 1 - (ss_res / ss_tot)
        
        # Feature importances from the RandomForest regressor
        regressor = model.named_steps['regressor']
        preprocessor = model.named_steps['preprocessor']
        
        # Get feature names after preprocessing
        try:
            feature_names = list(preprocessor.get_feature_names_out())
        except Exception:
            feature_names = [f"feature_{i}" for i in range(len(regressor.feature_importances_))]
        
        importances = regressor.feature_importances_
        
        # Map feature names back to original readable names
        readable_names = []
        for name in feature_names:
            if name.startswith('cat__'):
                parts = name.replace('cat__', '').split('_', 1)
                if len(parts) == 2:
                    readable_names.append(f"{parts[0]}: {parts[1]}")
                else:
                    readable_names.append(name)
            elif name.startswith('num__'):
                readable_names.append(name.replace('num__', ''))
            else:
                readable_names.append(name)
        
        # Sort by importance descending
        sorted_indices = np.argsort(importances)[::-1]
        top_features = []
        for idx in sorted_indices[:20]:
            top_features.append({
                'feature': readable_names[idx] if idx < len(readable_names) else f"feature_{idx}",
                'importance': round(float(importances[idx]), 4)
            })
        
        # Prepare sample predictions for visualization
        sample_size = min(50, len(df))
        sample_indices = np.random.choice(len(df), sample_size, replace=False)
        sample_predictions = []
        for idx in sample_indices:
            sample_predictions.append({
                'actual': round(float(y.iloc[idx]), 2),
                'predicted': round(float(y_pred_total[idx]), 2)
            })
        
        # Model metadata
        metadata = {
            'model_type': 'RandomForestRegressor',
            'n_estimators': regressor.n_estimators,
            'max_depth': regressor.max_depth,
            'min_samples_split': regressor.min_samples_split,
            'min_samples_leaf': regressor.min_samples_leaf,
            'n_features': len(feature_names),
            'training_samples': len(df),
            'test_size': '20%',
            'random_state': 42,
            'trained_at': datetime.fromtimestamp(os.path.getmtime(model_path)).isoformat()
        }
        
        # Actual vs Predicted statistics
        errors = y - y_pred_total
        error_stats = {
            'mae': round(float(np.mean(np.abs(errors))), 2),
            'rmse': round(float(np.sqrt(np.mean(errors ** 2))), 2),
            'max_error': round(float(np.max(np.abs(errors))), 2),
            'mean_error': round(float(np.mean(errors)), 2)
        }
        
        return Response({
            'r2_score': round(float(r2_score), 4),
            'model_metadata': metadata,
            'feature_importances': top_features,
            'sample_predictions': sample_predictions,
            'error_stats': error_stats
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def predict_water_demand(request):
    try:
        from datetime import datetime
        
        data = request.data
        temperature = float(data.get('temperature', 0))
        rainfall = float(data.get('rainfall', 0))
        humidity = float(data.get('humidity', 65.0))
        population = float(data.get('population', 0))
        water_level = float(data.get('water_level', 0))
        ph = float(data.get('pH', 7.5))
        turbidity = float(data.get('turbidity', 2.7))
        flow_rate = float(data.get('flow_rate', 55.0))
        district = data.get('district', 'Ilala')
        
        current_month_name = datetime.now().strftime('%b')
        month_name = data.get('month', current_month_name)
        
        month_map = {"Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4, "May": 5, "Jun": 6,
                     "Jul": 7, "Aug": 8, "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12,
                     "January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6,
                     "July": 7, "August": 8, "September": 9, "October": 10, "November": 11, "December": 12}
        month = month_map.get(month_name, datetime.now().month)
        
        now = datetime.now()
        year = int(data.get('year', now.year))
        
        date = datetime(year, month, 1)
        day_of_week = date.weekday()
        season = "Rainy" if month in [3, 4, 5, 11] else "Dry" if month in [6, 7, 8, 9, 10] else "Short Rains" if month == 12 else "Hot"
        is_weekend = 1 if day_of_week >= 5 else 0
        is_holiday = int(data.get('is_holiday', 0))
        
        district_profiles = {
            'Ilala': {'income_level': 3, 'industrial_activity': 60, 'tourism': 70, 'pipe_age': 25, 'leakage_rate': 22.5, 'storage_capacity': 250000},
            'Kinondoni': {'income_level': 4, 'industrial_activity': 40, 'tourism': 50, 'pipe_age': 20, 'leakage_rate': 18.0, 'storage_capacity': 300000},
            'Temeke': {'income_level': 2, 'industrial_activity': 70, 'tourism': 30, 'pipe_age': 30, 'leakage_rate': 28.0, 'storage_capacity': 200000},
            'Kigamboni': {'income_level': 3, 'industrial_activity': 20, 'tourism': 40, 'pipe_age': 15, 'leakage_rate': 15.0, 'storage_capacity': 150000},
            'Ubungo': {'income_level': 3, 'industrial_activity': 50, 'tourism': 45, 'pipe_age': 22, 'leakage_rate': 20.0, 'storage_capacity': 220000},
            'Arusha': {'income_level': 3, 'industrial_activity': 45, 'tourism': 80, 'pipe_age': 18, 'leakage_rate': 17.0, 'storage_capacity': 180000},
            'Mwanza': {'income_level': 2, 'industrial_activity': 35, 'tourism': 60, 'pipe_age': 28, 'leakage_rate': 25.0, 'storage_capacity': 170000},
            'Dodoma': {'income_level': 2, 'industrial_activity': 30, 'tourism': 40, 'pipe_age': 32, 'leakage_rate': 30.0, 'storage_capacity': 140000},
            'Mbeya': {'income_level': 2, 'industrial_activity': 40, 'tourism': 55, 'pipe_age': 24, 'leakage_rate': 23.0, 'storage_capacity': 190000},
            'Morogoro': {'income_level': 2, 'industrial_activity': 25, 'tourism': 50, 'pipe_age': 26, 'leakage_rate': 24.0, 'storage_capacity': 160000},
        }
        
        profile = district_profiles.get(district, {
            'income_level': 3, 'industrial_activity': 50, 'tourism': 50,
            'pipe_age': 25, 'leakage_rate': 25.0, 'storage_capacity': 200000
        })
        
        forecast_rainfall = float(data.get('forecast_rainfall', rainfall))
        forecast_temperature = float(data.get('forecast_temperature', temperature))
        demand_lag_1m = float(data.get('demand_lag_1m', 0))
        demand_lag_3m = float(data.get('demand_lag_3m', 0))
        demand_lag_6m = float(data.get('demand_lag_6m', 0))
        
        model_path = os.path.join(settings.BASE_DIR, 'water_model.pkl')
        if not os.path.exists(model_path):
            return Response({'error': 'Model not found'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
        model = joblib.load(model_path)
        
        import pandas as pd
        input_data = pd.DataFrame([{
            'temperature': temperature,
            'rainfall': rainfall,
            'humidity': humidity,
            'population': population,
            'water_level': water_level,
            'pH': ph,
            'turbidity': turbidity,
            'flow_rate': flow_rate,
            'district': district,
            'month': month,
            'year': year,
            'day_of_week': day_of_week,
            'season': season,
            'is_weekend': is_weekend,
            'is_holiday': is_holiday,
            'income_level': profile['income_level'],
            'industrial_activity': profile['industrial_activity'],
            'tourism': profile['tourism'],
            'pipe_age': profile['pipe_age'],
            'leakage_rate': profile['leakage_rate'],
            'storage_capacity': profile['storage_capacity'],
            'forecast_rainfall': forecast_rainfall,
            'forecast_temperature': forecast_temperature,
            'demand_lag_1m': demand_lag_1m,
            'demand_lag_3m': demand_lag_3m,
            'demand_lag_6m': demand_lag_6m
        }])
        
        predicted_per_capita = model.predict(input_data)[0]
        prediction = predicted_per_capita * population
        
        return Response({
            'predicted_demand': round(prediction, 2),
            'predicted_per_capita': round(predicted_per_capita, 4),
            'inputs': {
                'temperature': temperature,
                'rainfall': rainfall,
                'humidity': humidity,
                'population': population,
                'water_level': water_level,
                'pH': ph,
                'turbidity': turbidity,
                'flow_rate': flow_rate,
                'district': district,
                'month': month_name,
                'year': year,
                'day_of_week': day_of_week,
                'season': season,
                'is_weekend': bool(is_weekend),
                'is_holiday': bool(is_holiday),
                'income_level': profile['income_level'],
                'industrial_activity': profile['industrial_activity'],
                'tourism': profile['tourism'],
                'pipe_age': profile['pipe_age'],
                'leakage_rate': profile['leakage_rate'],
                'storage_capacity': profile['storage_capacity'],
                'forecast_rainfall': forecast_rainfall,
                'forecast_temperature': forecast_temperature,
                'demand_lag_1m': demand_lag_1m,
                'demand_lag_3m': demand_lag_3m,
                'demand_lag_6m': demand_lag_6m
            }
        })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)