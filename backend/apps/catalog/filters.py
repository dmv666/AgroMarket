import django_filters

from .models import Publicacion


class PublicacionFilter(django_filters.FilterSet):
    """RF05: categoría, ubicación y rango de precio, siempre combinables
    entre sí (django-filter los aplica con AND por defecto)."""

    precio_min = django_filters.NumberFilter(field_name="precio", lookup_expr="gte")
    precio_max = django_filters.NumberFilter(field_name="precio", lookup_expr="lte")
    ubicacion = django_filters.CharFilter(field_name="ubicacion", lookup_expr="icontains")

    class Meta:
        model = Publicacion
        fields = ["categoria", "ubicacion", "precio_min", "precio_max"]
