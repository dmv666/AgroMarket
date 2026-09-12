from rest_framework.pagination import PageNumberPagination


class PaginacionEstandar(PageNumberPagination):
    """Paginación por defecto de toda la API: previsible para el frontend y
    barata para el backend bajo RNF04 (escalabilidad) y RNF05 (rendimiento
    en conexiones lentas) — nunca se devuelve un catálogo completo sin paginar.
    """

    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100
