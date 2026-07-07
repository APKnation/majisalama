import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "watertrack.settings")
django.setup()

from watertrack_app.models import DamageReport, User

try:
    report = DamageReport.objects.get(id=5)
    print(f"Report 5 Status: {report.status}")
except DamageReport.DoesNotExist:
    print("Report 5 does not exist")

print("Water officers:")
for w in User.objects.filter(role='water_officer'):
    print(f"ID: {w.id}, username: {w.username}, role: {w.role}")
