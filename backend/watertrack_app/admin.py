# backend/watertrack_app/admin.py

from django.contrib import admin
from django.contrib.gis.admin import GISModelAdmin  # ✅ BADILISHA HII
from .models import *

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'village', 'phone']
    list_filter = ['role', 'village']
    search_fields = ['username', 'email']

@admin.register(Village)
class VillageAdmin(GISModelAdmin):  # ✅ BADILISHA HII
    list_display = ['name', 'district', 'region', 'population']
    search_fields = ['name', 'district']

@admin.register(WaterSource)
class WaterSourceAdmin(GISModelAdmin):  # ✅ BADILISHA HII
    list_display = ['name', 'source_type', 'village', 'status', 'last_tested']
    list_filter = ['status', 'source_type']
    search_fields = ['name']

@admin.register(DamageReport)
class DamageReportAdmin(admin.ModelAdmin):
    list_display = ['title', 'water_source', 'priority', 'status', 'report_date']
    list_filter = ['status', 'priority']

@admin.register(QualityReport)
class QualityReportAdmin(admin.ModelAdmin):
    list_display = ['water_source', 'ph_level', 'bacteria_count', 'is_safe', 'test_date']

@admin.register(Alert)
class AlertAdmin(admin.ModelAdmin):
    list_display = ['alert_type', 'water_source', 'created_at']
    list_filter = ['alert_type']