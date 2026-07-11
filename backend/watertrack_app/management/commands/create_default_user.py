from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

User = get_user_model()

class Command(BaseCommand):
    help = 'Create default admin user if no users exist'

    def handle(self, *args, **kwargs):
        if User.objects.exists():
            self.stdout.write(self.style.SUCCESS('Users already exist, skipping default user creation.'))
            return

        username = os.getenv('DEFAULT_ADMIN_USERNAME', 'admin')
        password = os.getenv('DEFAULT_ADMIN_PASSWORD', 'admin123')
        email = os.getenv('DEFAULT_ADMIN_EMAIL', 'admin@example.com')

        if not User.objects.filter(username=username).exists():
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS(f'Default admin user created: {username} / {password}'))
        else:
            self.stdout.write(self.style.WARNING(f'User {username} already exists.'))
