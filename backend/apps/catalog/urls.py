from django.urls import path

from .views import (
    ImagenPublicacionCreateView,
    MisPublicacionesView,
    PublicacionDetailView,
    PublicacionListCreateView,
)

urlpatterns = [
    path("publicaciones/", PublicacionListCreateView.as_view(), name="publicaciones"),
    path(
        "publicaciones/<int:pk>/",
        PublicacionDetailView.as_view(),
        name="publicacion-detalle",
    ),
    path(
        "publicaciones/<int:publicacion_id>/imagenes/",
        ImagenPublicacionCreateView.as_view(),
        name="publicacion-imagenes",
    ),
    path("mis-publicaciones/", MisPublicacionesView.as_view(), name="mis-publicaciones"),
]
