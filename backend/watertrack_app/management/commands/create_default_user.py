from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

User = get_user_model()

class Command(BaseCommand):
    help = 'Create default admin user if no superuser exists'

    def handle(self, *args, **kwargs):
        username = os.getenv('DEFAULT_ADMIN_USERNAME', 'admin')
        password = os.getenv('DEFAULT_ADMIN_PASSWORD', 'admin123')
        email = os.getenv('DEFAULT_ADMIN_EMAIL', 'admin@example.com')
        force_password = os.getenv('FORCE_DEFAULT_ADMIN_PASSWORD', 'False').lower() in ('1', 'true', 'yes')

        if User.objects.filter(is_superuser=True).exists():
            self.stdout.write(self.style.SUCCESS('Superuser already exists, skipping default admin creation.'))
            if force_password:
                user = User.objects.filter(username=username).first()
                if user:
                    user.set_password(password)
                    user.save()
                    self.stdout.write(self.style.SUCCESS(f'Default admin password reset for: {username}'))
            return

        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            user.set_password(password)
            user.role = 'admin'
            user.is_superuser = True
            user.is_staff = True
            user.save()
            self.stdout.write(self.style.SUCCESS(f'Existing user updated to admin: {username}'))
            return

        user = User.objects.create_superuser(
            username=username,
            email=email,
            password=password,
        )
        user.role = 'admin'
        user.is_staff = True
        user.save()
        self.stdout.write(self.style.SUCCESS(f'Default admin user created: {username} / {password}'))
