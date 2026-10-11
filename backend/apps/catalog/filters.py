import django_filters
from .models import Product

class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category__slug')
    dietary = django_filters.ChoiceFilter(choices=Product.Dietary.choices)
    spice_level = django_filters.NumberFilter(field_name='spice_level')
    min_price = django_filters.NumberFilter(field_name='variants__price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='variants__price', lookup_expr='lte')
    is_bestseller = django_filters.BooleanFilter(field_name='is_bestseller')

    class Meta:
        model = Product
        fields = ['category', 'dietary', 'spice_level', 'min_price', 'max_price', 'is_bestseller']
