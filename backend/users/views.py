from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from .models import CustomUser
from .serializers import UserSerializer, LoginSerializer, AdminLoginSerializer
from analytics.models import LoginHistory


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


@api_view(['POST'])
@permission_classes([AllowAny])
def login_or_register(request):
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    name = serializer.validated_data['name']
    phone_number = serializer.validated_data['phone_number']

    user, created = CustomUser.objects.get_or_create(
        phone_number=phone_number,
        defaults={'name': name}
    )

    if not created:
        user.name = name
        user.save()

    # Log login history
    ip = request.META.get('REMOTE_ADDR')
    LoginHistory.objects.create(user=user, ip_address=ip)

    tokens = get_tokens_for_user(user)

    return Response({
        'user': UserSerializer(user).data,
        'tokens': tokens,
        'created': created
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
    except Exception:
        pass
    return Response({'message': 'Logged out successfully'})


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    serializer = AdminLoginSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    username = serializer.validated_data['username']
    password = serializer.validated_data['password']

    admin_username = settings.ADMIN_USERNAME
    admin_password = settings.ADMIN_PASSWORD

    if username == admin_username and password == admin_password:
        user, _ = CustomUser.objects.get_or_create(
            phone_number='0000000000',
            defaults={'name': 'Admin', 'is_staff': True, 'is_admin': True}
        )
        tokens = get_tokens_for_user(user)
        return Response({
            'message': 'Admin login successful',
            'tokens': tokens
        })

    return Response(
        {'error': 'Invalid credentials'},
        status=status.HTTP_401_UNAUTHORIZED
    )


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def toggle_contacted(request, user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
        user.is_contacted = not user.is_contacted
        user.save()
        return Response({
            'id': user.id,
            'is_contacted': user.is_contacted
        })
    except CustomUser.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )