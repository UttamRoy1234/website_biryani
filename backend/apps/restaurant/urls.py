from django.urls import path
from .views import RestaurantSettingsView

urlpatterns = [
    path('settings/', RestaurantSettingsView.as_view(), name='restaurant_settings'),
]
