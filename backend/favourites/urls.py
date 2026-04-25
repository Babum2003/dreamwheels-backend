from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_favourites, name='favourites'),
    path('toggle/', views.toggle_favourite, name='toggle-favourite'),
]