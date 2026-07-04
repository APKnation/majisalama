import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "watertrack.settings")
django.setup()

from rest_framework.test import APIClient
from watertrack_app.models import User
from django.conf import settings

settings.ALLOWED_HOSTS = ['*']

client = APIClient()
admin = User.objects.get(username='admin_test')
client.force_authenticate(user=admin)

response = client.get('/api/alerts/', format='json')
print("Status code:", response.status_code)
if response.status_code != 200:
    print(response.content.decode('utf-8')[:1000])
else:
    print(response.json())
