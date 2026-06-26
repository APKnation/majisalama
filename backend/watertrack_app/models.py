# backend/watertrack_app/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('citizen', 'Mwananchi'),
        ('village_leader', 'Kiongozi wa Kijiji'),
        ('water_officer', 'Wafanyakazi wa Maji'),
        ('district_officer', 'Mfanyikazi wa Wilaya'),
        ('admin', 'Msimamizi'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='citizen')
    phone = models.CharField(max_length=15, blank=True)
    village = models.ForeignKey('Village', on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        db_table = 'watertrack_users'

class Village(models.Model):
    name = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    population = models.PositiveIntegerField(default=0)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    def __str__(self):
        return f"{self.name}, {self.district}"

class WaterSource(models.Model):
    SOURCE_TYPES = [
        ('shallow_well', 'Kisima cha Juu'),
        ('deep_well', 'Kisima cha Kina'),
        ('spring', 'Chemchem'),
        ('river', 'Mto'),
        ('dam', 'Bwawa'),
        ('borehole', 'Bomba la Kuchimba'),
        ('rainwater', 'Maji ya Mvua'),
    ]
    
    STATUS_CHOICES = [
        ('safe', 'Salama'),
        ('caution', 'Tahadhari'),
        ('unsafe', 'Hatarini'),
        ('under_repair', 'Inatengenezwa'),
        ('dry', 'Kavu'),
    ]
    
    name = models.CharField(max_length=200)
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPES)
    village = models.ForeignKey(Village, on_delete=models.CASCADE, related_name='water_sources')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='safe')
    
    ph_level = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    bacteria_count = models.PositiveIntegerField(null=True, blank=True)
    iron_level = models.DecimalField(max_digits=6, decimal_places=3, null=True, blank=True)
    turbidity = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    last_tested = models.DateTimeField(null=True, blank=True)
    
    managed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    last_cleaned = models.DateField(null=True, blank=True)
    next_cleaning = models.DateField(null=True, blank=True)
    construction_year = models.PositiveIntegerField(null=True, blank=True)
    
    image = models.ImageField(upload_to='water_sources/', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"

class QualityReport(models.Model):
    water_source = models.ForeignKey(WaterSource, on_delete=models.CASCADE, related_name='quality_reports')
    tested_by = models.ForeignKey(User, on_delete=models.CASCADE)
    test_date = models.DateTimeField(auto_now_add=True)
    ph_level = models.DecimalField(max_digits=4, decimal_places=2)
    bacteria_count = models.PositiveIntegerField()
    iron_level = models.DecimalField(max_digits=6, decimal_places=3)
    turbidity = models.DecimalField(max_digits=5, decimal_places=2)
    chlorine_level = models.DecimalField(max_digits=5, decimal_places=3, null=True, blank=True)
    is_safe = models.BooleanField()
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-test_date']

class DamageReport(models.Model):
    PRIORITY_CHOICES = [
        ('low', 'Ndogo'),
        ('medium', 'Wastani'),
        ('high', 'Kubwa'),
        ('critical', 'Dharura'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Inasubiri'),
        ('assigned', 'Imepewa Wafanyakazi'),
        ('in_progress', 'Inafanywa Kazi'),
        ('resolved', 'Imetatuliwa'),
        ('closed', 'Imefungwa'),
    ]
    
    water_source = models.ForeignKey(WaterSource, on_delete=models.CASCADE, related_name='damage_reports')
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports_made')
    report_date = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='pending')
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    images = models.JSONField(default=list, blank=True)
    assigned_to = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_reports')
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolution_notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-report_date']

class Alert(models.Model):
    ALERT_TYPES = [
        ('quality_drop', 'Ubora Umeshuka'),
        ('source_dry', 'Chanzo Kimekauka'),
        ('damage', 'Uharibifu'),
        ('maintenance_due', 'Usafishaji Umekaribia'),
        ('general', 'Ujumbe Mkuu'),
    ]
    
    water_source = models.ForeignKey(WaterSource, on_delete=models.CASCADE, null=True, blank=True)
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES)
    message = models.TextField()
    recipients = models.ManyToManyField(User, related_name='alerts')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']