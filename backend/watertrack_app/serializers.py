# backend/watertrack_app/serializers.py

from rest_framework import serializers
from .models import *

class VillageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Village
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    village = VillageSerializer(read_only=True)
    village_id = serializers.PrimaryKeyRelatedField(
        queryset=Village.objects.all(), source='village', write_only=True, required=False, allow_null=True
    )
    password = serializers.CharField(write_only=True, required=False)
    is_superuser = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'phone', 'village', 'village_id', 'password', 'is_superuser'
        ]

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = super().create(validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user

class UserDetailsSerializer(serializers.ModelSerializer):
    village = VillageSerializer(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'village', 'is_superuser']

class LoginSerializer(serializers.ModelSerializer):
    village = VillageSerializer(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'village', 'is_superuser', 'access', 'refresh']

class WaterSourceSerializer(serializers.ModelSerializer):
    village = VillageSerializer(read_only=True)
    village_id = serializers.PrimaryKeyRelatedField(
        queryset=Village.objects.all(), source='village', write_only=True
    )
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    source_type_display = serializers.CharField(source='get_source_type_display', read_only=True)
    latest_quality = serializers.SerializerMethodField()
    
    class Meta:
        model = WaterSource
        fields = [
            'id', 'name', 'source_type', 'source_type_display', 'status', 'status_display',
            'village', 'village_id', 'latitude', 'longitude', 'ph_level', 'bacteria_count',
            'last_tested', 'last_cleaned', 'next_cleaning', 'image',
            'latest_quality', 'created_at'
        ]
    
    def get_latest_quality(self, obj):
        latest = obj.quality_reports.first()
        if latest:
            return {
                'ph': latest.ph_level,
                'bacteria': latest.bacteria_count,
                'tested_at': latest.test_date,
                'is_safe': latest.is_safe
            }
        return None

class QualityReportSerializer(serializers.ModelSerializer):
    water_source = WaterSourceSerializer(read_only=True)
    tested_by = UserSerializer(read_only=True)
    
    class Meta:
        model = QualityReport
        fields = '__all__'

class DamageReportSerializer(serializers.ModelSerializer):
    water_source = WaterSourceSerializer(read_only=True)
    water_source_id = serializers.PrimaryKeyRelatedField(
        queryset=WaterSource.objects.all(), source='water_source', write_only=True, required=False
    )
    reported_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    priority_display = serializers.CharField(source='get_priority_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = DamageReport
        fields = '__all__'

class QualityReportSerializer(serializers.ModelSerializer):
    water_source = WaterSourceSerializer(read_only=True)
    water_source_id = serializers.PrimaryKeyRelatedField(
        queryset=WaterSource.objects.all(), source='water_source', write_only=True
    )
    tested_by = UserSerializer(read_only=True)
    
    class Meta:
        model = QualityReport
        fields = '__all__'

class AlertSerializer(serializers.ModelSerializer):
    water_source = WaterSourceSerializer(read_only=True)
    water_source_id = serializers.PrimaryKeyRelatedField(
        queryset=WaterSource.objects.all(), source='water_source', write_only=True, required=False, allow_null=True
    )
    alert_type_display = serializers.CharField(source='get_alert_type_display', read_only=True)
    
    class Meta:
        model = Alert
        fields = '__all__'