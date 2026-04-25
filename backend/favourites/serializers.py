from rest_framework import serializers
from .models import Favourite
from cars.serializers import CarListSerializer


class FavouriteSerializer(serializers.ModelSerializer):
    car = CarListSerializer(read_only=True)
    car_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Favourite
        fields = ['id', 'car', 'car_id', 'created_at']