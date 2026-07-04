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
        if self.action in ['assign', 'resolve']:
            return [IsAuthenticated(), IsVillageLeaderOrAdmin()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.role == 'admin':
            return DamageReport.objects.all()
        if user.role == 'village_leader':
            return DamageReport.objects.filter(water_source__village=user.village)
        if user.role == 'water_officer':
            return DamageReport.objects.filter(assigned_to=user)
        if user.role == 'citizen':
            return DamageReport.objects.filter(reported_by=user)
        return DamageReport.objects.none()

    def perform_create(self, serializer):
        serializer.save(reported_by=self.request.user)

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        report = self.get_object()
        if request.user.role == 'village_leader' and report.water_source.village != request.user.village:
            return Response({'error': 'Hauna ruhusa ya kugawa ripoti hii'}, status=status.HTTP_403_FORBIDDEN)

        worker_id = request.data.get('worker_id')
        try:
            worker = User.objects.get(id=worker_id, role='water_officer')
            if request.user.role == 'village_leader' and worker.village != request.user.village:
                return Response({'error': 'Mafanyakazi lazima awe wa kijiji chako'}, status=status.HTTP_400_BAD_REQUEST)
            report.assigned_to = worker
            report.status = 'assigned'
            report.save()

            # Create an automated alert
            alert = Alert.objects.create(
                water_source=report.water_source,
                alert_type='general',
                message=f"Umepewa kazi mpya kwenye ripoti: {report.title}"
            )
            alert.recipients.add(worker)

            return Response({'message': 'Kazi imepewa mafanikio'})
        except User.DoesNotExist:
            return Response({'error': 'Wafanyakazi hayupatikani'}, status=400)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        report = self.get_object()
        if request.user.role == 'village_leader' and report.water_source.village != request.user.village:
            return Response({'error': 'Hauna ruhusa ya kutatua ripoti hii'}, status=status.HTTP_403_FORBIDDEN)
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