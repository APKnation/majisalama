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
        if request.user.role not in ['district_officer', 'admin'] and not request.user.is_superuser:
            return Response({'error': 'Ni Ofisa wa Wilaya tu anayeweza kupanga kazi.'}, status=status.HTTP_403_FORBIDDEN)
        if report.status not in ['forwarded_to_district', 'assigned']:
            return Response({'error': 'Ripoti lazima iwe na hali "forwarded_to_district" ili kupangwa.'}, status=status.HTTP_400_BAD_REQUEST)

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