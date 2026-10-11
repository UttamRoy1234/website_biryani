"""
Root URL Configuration for Dum & Co.
"""
from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),

    # OpenAPI Schema & Docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # Modular API v1 Routes
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/', include('apps.catalog.urls')),
    path('api/v1/cart/', include('apps.cart.urls')),
    path('api/v1/coupons/', include('apps.coupons.urls')),
    path('api/v1/orders/', include('apps.orders.urls')),
    path('api/v1/payments/', include('apps.payments.urls')),
    path('api/v1/delivery/', include('apps.delivery.urls')),
    path('api/v1/reviews/', include('apps.reviews.urls')),
    path('api/v1/restaurant/', include('apps.restaurant.urls')),
]
