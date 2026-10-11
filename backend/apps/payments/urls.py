from django.urls import path
from .views import CreateRazorpayOrderView, VerifyPaymentView, RazorpayWebhookView

urlpatterns = [
    path('create-order/', CreateRazorpayOrderView.as_view(), name='payment_create_order'),
    path('verify/', VerifyPaymentView.as_view(), name='payment_verify'),
    path('webhook/', RazorpayWebhookView.as_view(), name='payment_webhook'),
]
