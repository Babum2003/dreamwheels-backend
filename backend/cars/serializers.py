from rest_framework import serializers
from .models import Car


class CarSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = '__all__'


class CarListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Car
        fields = [
            'id', 'name', 'price', 'fuel_type',
            'year', 'km_driven', 'location',
            'images', 'is_sold', 'created_at'
        ]