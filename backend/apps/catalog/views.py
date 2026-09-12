from django.http import Http404
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.parsers import FormParser, MultiPartParser

from apps.accounts.permissions import EsUsuarioVerificado
from apps.core.permissions import EsPropietario

from .filters import PublicacionFilter
from .models import Publicacion
from .serializers import ImagenPublicacionSerializer, PublicacionSerializer


class PublicacionListCreateView(generics.ListCreateAPIView):
    """RF02-RF05. Lectura pública (cualquiera puede buscar/filtrar, RF05);
    creación exige sesión + verificación aprobada (RF01)."""

    serializer_class = PublicacionSerializer
    filterset_class = PublicacionFilter

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAuthenticated(), EsUsuarioVerificado()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        return Publicacion.objects.filter(
            estado=Publicacion.Estado.APROBADA
        ).select_related("vendedor").prefetch_related("imagenes")


class MisPublicacionesView(generics.ListAPIView):
    """RF08 — historial de publicaciones propias, en cualquier estado."""

    serializer_class = PublicacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Publicacion.objects.filter(vendedor=self.request.user)


class PublicacionDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PublicacionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, EsPropietario]
    owner_field = "vendedor_id"

    def get_queryset(self):
        return Publicacion.objects.select_related("vendedor").prefetch_related("imagenes")

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs["pk"])
        es_visible_publicamente = obj.estado == Publicacion.Estado.APROBADA
        usuario = self.request.user
        es_dueno_o_admin = usuario.is_authenticated and (
            usuario.id == obj.vendedor_id or usuario.es_administrador
        )
        if not es_visible_publicamente and not es_dueno_o_admin:
            raise Http404
        self.check_object_permissions(self.request, obj)
        return obj


class ImagenPublicacionCreateView(generics.CreateAPIView):
    """Subida de fotos de una publicación propia (RF02-RF04)."""

    serializer_class = ImagenPublicacionSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        publicacion = get_object_or_404(
            Publicacion, pk=self.kwargs["publicacion_id"], vendedor=self.request.user
        )
        serializer.save(publicacion=publicacion)
