from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from apps.orders.models import Order
from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(is_approved=True)
    serializer_class = ReviewSerializer
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)

    def perform_create(self, serializer):
        user = self.request.user
        product = serializer.validated_data['product']

        # Check if user has an order for this product
        has_purchased = Order.objects.filter(
            user=user,
            status=Order.Status.DELIVERED,
            items__variant__product=product
        ).exists()

        serializer.save(
            user=user,
            is_verified_purchase=has_purchased,
            is_approved=True
        )
