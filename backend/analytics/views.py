from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count
from django.utils import timezone
from datetime import timedelta
from .models import LoginHistory
from cars.models import Car
from users.models import CustomUser
from .serializers import LoginHistorySerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_analytics(request):
    if not request.user.is_admin:
        return Response({'error': 'Admin only'}, status=403)

    # Total cars
    total_cars = Car.objects.count()
    sold_cars = Car.objects.filter(is_sold=True).count()
    available_cars = Car.objects.filter(is_sold=False).count()

    # Total users
    total_users = CustomUser.objects.exclude(phone_number='0000000000').count()

    # Monthly visitors (last 30 days)
    thirty_days_ago = timezone.now() - timedelta(days=30)
    monthly_visitors = LoginHistory.objects.filter(
        timestamp__gte=thirty_days_ago
    ).values('user').distinct().count()

    # Daily logins last 7 days
    seven_days_ago = timezone.now() - timedelta(days=7)
    daily_logins = LoginHistory.objects.filter(
        timestamp__gte=seven_days_ago
    ).extra({'date': "date(timestamp)"}).values('date').annotate(
        count=Count('id')
    ).order_by('date')

    return Response({
        'total_cars': total_cars,
        'sold_cars': sold_cars,
        'available_cars': available_cars,
        'total_users': total_users,
        'monthly_visitors': monthly_visitors,
        'daily_logins': list(daily_logins),
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_users(request):
    if not request.user.is_admin:
        return Response({'error': 'Admin only'}, status=403)

    from users.serializers import UserSerializer

    users = CustomUser.objects.exclude(phone_number='0000000000')
    data = []
    for user in users:
        user_data = UserSerializer(user).data
        user_data['login_count'] = user.login_history.count()
        user_data['last_login'] = user.login_history.first().timestamp if user.login_history.exists() else None
        user_data['favourites_count'] = user.favourites.count()
        user_data['is_contacted'] = user.is_contacted  # ✅ NEW
        data.append(user_data)

    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_favourites(request, user_id):
    if not request.user.is_admin:
        return Response({'error': 'Admin only'}, status=403)
    from favourites.models import Favourite
    from favourites.serializers import FavouriteSerializer
    favourites = Favourite.objects.filter(user_id=user_id)
    serializer = FavouriteSerializer(favourites, many=True)
    return Response(serializer.data)