from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        User = get_user_model()
        email = os.getenv('ADMIN_EMAIL', 'admin@sakthibalancars.com')
        password = os.getenv('ADMIN_PASSWORD', 'Admin@123')
        name = os.getenv('ADMIN_USERNAME', 'admin')
        if not User.objects.filter(email=email).exists():
            user = User.objects.create_superuser(email=email, password=password)
            user.name = name
            user.is_admin = True
            user.save()
            self.stdout.write('Admin created!')
        else:
            self.stdout.write('Admin already exists!')