from django.urls import path
from .views import CartView, CartItemDetailView, CheckoutQuoteView

urlpatterns = [
    path('', CartView.as_view(), name='cart_detail'),
    path('items/<uuid:item_id>/', CartItemDetailView.as_view(), name='cart_item_detail'),
    path('quote/', CheckoutQuoteView.as_view(), name='checkout_quote'),
]
