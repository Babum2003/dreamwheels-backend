from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_or_register, name='login'),
    path('profile/', views.get_profile, name='profile'),
    path('logout/', views.logout, name='logout'),
    path('admin-login/', views.admin_login, name='admin-login'),
    path('toggle-contacted/<int:user_id>/', views.toggle_contacted, name='toggle-contacted'),  # ✅ NEW
]