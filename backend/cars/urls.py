from django.urls import path
from . import views

urlpatterns = [
    path('', views.CarListView.as_view(), name='car-list'),
    path('<int:pk>/', views.CarDetailView.as_view(), name='car-detail'),
    path('create/', views.create_car, name='car-create'),
    path('<int:pk>/update/', views.update_car, name='car-update'),
    path('<int:pk>/delete/', views.delete_car, name='car-delete'),
    path('<int:pk>/mark-sold/', views.mark_sold, name='car-mark-sold'),
]