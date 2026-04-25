from django.urls import path
from . import views
from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_analytics, name='analytics'),
    path('users/', views.get_all_users, name='all-users'),
     path('', views.get_analytics, name='analytics'),
    path('users/', views.get_all_users, name='all-users'),
    path('user-favourites/<int:user_id>/', views.get_user_favourites, name='user-favourites'),  # ← New!
]


