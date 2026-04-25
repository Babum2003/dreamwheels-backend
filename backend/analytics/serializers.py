from rest_framework import serializers
from .models import LoginHistory
from users.serializers import UserSerializer


class LoginHistorySerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = LoginHistory
        fields = ['id', 'user', 'timestamp', 'ip_address']