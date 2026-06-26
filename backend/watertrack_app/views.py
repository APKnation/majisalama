# backend/watertrack_app/views.py

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import *
from .serializers import *

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
        if self.action in ['list', 'retrieve', 'nearby']:
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
            serializer.save(
                water_source=water_source,
                reported_by=request.user,
                latitude=water_source.latitude,
                longitude=water_source.longitude
            )
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DamageReportViewSet(viewsets.ModelViewSet):
    queryset = DamageReport.objects.all()
    serializer_class = DamageReportSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'priority', 'water_source__village']
    
    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        report = self.get_object()
        worker_id = request.data.get('worker_id')
        
        try:
            worker = User.objects.get(id=worker_id, role='water_officer')
            report.assigned_to = worker
            report.status = 'assigned'
            report.save()
            return Response({'message': 'Kazi imepewa mafanikio'})
        except User.DoesNotExist:
            return Response({'error': 'Wafanyakazi hayupatikani'}, status=400)
    
    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        report = self.get_object()
        report.status = 'resolved'
        report.resolved_at = timezone.now()
        report.resolution_notes = request.data.get('notes', '')
        report.save()
        return Response({'message': 'Ripoti imetatuliwa'})

class QualityReportViewSet(viewsets.ModelViewSet):
    queryset = QualityReport.objects.all()
    serializer_class = QualityReportSerializer
    permission_classes = [IsAuthenticated]

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer