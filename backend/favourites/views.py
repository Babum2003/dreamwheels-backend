from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Favourite
from .serializers import FavouriteSerializer
from cars.models import Car


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favourites(request):
    favourites = Favourite.objects.filter(user=request.user)
    serializer = FavouriteSerializer(favourites, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_favourite(request):
    car_id = request.data.get('car_id')
    try:
        car = Car.objects.get(pk=car_id)
    except Car.DoesNotExist:
        return Response({'error': 'Car not found'}, status=status.HTTP_404_NOT_FOUND)

    favourite, created = Favourite.objects.get_or_create(
        user=request.user,
        car=car
    )

    if not created:
        favourite.delete()
        return Response({'message': 'Removed from favourites', 'is_favourite': False})

    return Response({'message': 'Added to favourites', 'is_favourite': True})