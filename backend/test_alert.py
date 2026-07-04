import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "watertrack.settings")
django.setup()

from django.test import Client
from watertrack_app.models import User
import json

admin, _ = User.objects.get_or_create(username='admin_test', defaults={'role': 'admin'})
admin.set_password('admin')
admin.save()

client = Client(HTTP_HOST='localhost')
login_response = client.post('/api/login/', {'username': 'admin_test', 'password': 'admin'}, content_type='application/json')
token = login_response.json().get('access')

response = client.post('/api/alerts/', {
    'alert_type': 'general',
    'message': 'Test alert created programmatically'
}, content_type='application/json', HTTP_AUTHORIZATION=f'Bearer {token}')

print(response.status_code)
print(response.content.decode('utf-8'))
