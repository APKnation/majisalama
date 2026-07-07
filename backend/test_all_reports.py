import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "watertrack.settings")
django.setup()

from watertrack_app.models import DamageReport, User

print("All Reports:")
for r in DamageReport.objects.all():
    print(f"ID: {r.id}, Title: {r.title}, Status: {r.status}, AssignedTo: {r.assigned_to}")

print("\nAll Water Officers:")
for u in User.objects.filter(role='water_officer'):
    print(f"ID: {u.id}, Username: {u.username}")

