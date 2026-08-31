from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/cars/', include('cars.urls')),
    path('api/favourites/', include('favourites.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]