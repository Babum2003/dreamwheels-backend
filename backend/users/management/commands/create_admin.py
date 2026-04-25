from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        User = get_user_model()
        phone_number = os.getenv('ADMIN_PHONE', '9999999999')
        password = os.getenv('ADMIN_PASSWORD', 'Admin@123')
        name = os.getenv('ADMIN_USERNAME', 'admin')
        if not User.objects.filter(phone_number=phone_number).exists():
            user = User(phone_number=phone_number, name=name)
            user.set_password(password)
            user.is_admin = True
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write('Admin created!')
        else:
            self.stdout.write('Admin already exists!')