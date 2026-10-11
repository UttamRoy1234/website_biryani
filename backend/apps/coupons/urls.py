from django.urls import path
from .views import CouponListView, CouponValidateView

urlpatterns = [
    path('', CouponListView.as_view(), name='coupon_list'),
    path('validate/', CouponValidateView.as_view(), name='coupon_validate'),
]
