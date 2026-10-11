from rest_framework import generics, views, permissions, status
from rest_framework.response import Response
from .models import Coupon
from .serializers import CouponSerializer

class CouponListView(generics.ListAPIView):
    queryset = Coupon.objects.filter(is_active=True)
    serializer_class = CouponSerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = None

class CouponValidateView(views.APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        code = request.query_params.get('code', '').strip().upper()
        subtotal_str = request.query_params.get('subtotal', '0')

        if not code:
            return Response({'error': 'Please provide coupon code.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            subtotal = float(subtotal_str)
        except ValueError:
            subtotal = 0.0

        try:
            coupon = Coupon.objects.get(code=code)
        except Coupon.DoesNotExist:
            return Response({'is_valid': False, 'error': f'Coupon "{code}" does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        if not coupon.is_valid_now():
            return Response({'is_valid': False, 'error': 'Coupon is expired or redemption cap reached.'}, status=status.HTTP_400_BAD_REQUEST)

        if subtotal < float(coupon.min_order_value):
            return Response({
                'is_valid': False,
                'error': f'Coupon requires a minimum order of ₹{coupon.min_order_value}.'
            }, status=status.HTTP_400_BAD_REQUEST)

        discount = coupon.calculate_discount(subtotal)

        return Response({
            'is_valid': True,
            'code': coupon.code,
            'description': coupon.description,
            'discount_amount': discount,
        })
