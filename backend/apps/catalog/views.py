from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Category, Product, Accompaniment
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    AccompanimentSerializer
)
from .filters import ProductFilter

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = None

class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.filter(is_active=True).prefetch_related('variants', 'category')
    permission_classes = (permissions.AllowAny,)
    lookup_field = 'slug'
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_class = ProductFilter
    search_fields = ('name', 'subtitle', 'description', 'ingredients')
    ordering_fields = ('created_at', 'spice_level')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    @action(detail=False, methods=['get'])
    def featured(self, request):
        bestsellers = self.get_queryset().filter(is_bestseller=True)[:6]
        serializer = self.get_serializer(bestsellers, many=True)
        return Response(serializer.data)

class AccompanimentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Accompaniment.objects.filter(is_active=True)
    serializer_class = AccompanimentSerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = None
