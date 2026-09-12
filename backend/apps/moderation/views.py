from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import Usuario
from apps.accounts.serializers import UsuarioSerializer
from apps.catalog.models import Publicacion
from apps.catalog.serializers import PublicacionSerializer
from apps.core.permissions import EsAdministrador

from .models import Reporte
from .serializers import ReporteSerializer
from .services import (
    aprobar_publicacion,
    aprobar_verificacion,
    crear_reporte,
    rechazar_publicacion,
    rechazar_verificacion,
    resolver_reporte,
    suspender_publicacion,
)

# --- RF09: cola de verificación de usuarios ---


class VerificacionPendienteListView(generics.ListAPIView):
    serializer_class = UsuarioSerializer
    permission_classes = [EsAdministrador]
    queryset = Usuario.objects.filter(estado_verificacion=Usuario.EstadoVerificacion.PENDIENTE)


class VerificacionAprobarView(APIView):
    permission_classes = [EsAdministrador]

    def post(self, request, pk):
        usuario = get_object_or_404(Usuario, pk=pk)
        aprobar_verificacion(usuario, request.user)
        return Response(UsuarioSerializer(usuario).data)


class VerificacionRechazarView(APIView):
    permission_classes = [EsAdministrador]

    def post(self, request, pk):
        usuario = get_object_or_404(Usuario, pk=pk)
        rechazar_verificacion(usuario, request.user)
        return Response(UsuarioSerializer(usuario).data)


# --- RF09: moderación de publicaciones ---


class PublicacionModeracionListView(generics.ListAPIView):
    serializer_class = PublicacionSerializer
    permission_classes = [EsAdministrador]

    def get_queryset(self):
        estado = self.request.query_params.get("estado", Publicacion.Estado.PENDIENTE)
        return Publicacion.objects.filter(estado=estado).select_related("vendedor")


class PublicacionAprobarView(APIView):
    permission_classes = [EsAdministrador]

    def post(self, request, pk):
        publicacion = get_object_or_404(Publicacion, pk=pk)
        aprobar_publicacion(publicacion, request.user)
        return Response(PublicacionSerializer(publicacion).data)


class PublicacionRechazarView(APIView):
    permission_classes = [EsAdministrador]

    def post(self, request, pk):
        publicacion = get_object_or_404(Publicacion, pk=pk)
        motivo = request.data.get("motivo", "")
        rechazar_publicacion(publicacion, request.user, motivo)
        return Response(PublicacionSerializer(publicacion).data)


class PublicacionSuspenderView(APIView):
    permission_classes = [EsAdministrador]

    def post(self, request, pk):
        publicacion = get_object_or_404(Publicacion, pk=pk)
        motivo = request.data.get("motivo", "")
        suspender_publicacion(publicacion, request.user, motivo)
        return Response(PublicacionSerializer(publicacion).data)


# --- RF11: reportes de fraude ---


class ReporteListCreateView(generics.ListCreateAPIView):
    """Cualquier usuario autenticado puede reportar (POST); solo un
    administrador puede ver la cola completa (GET)."""

    serializer_class = ReporteSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [EsAdministrador()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return Reporte.objects.all().select_related("usuario_reporta", "publicacion_reportada", "usuario_reportado")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reporte = crear_reporte(
            usuario_reporta=request.user,
            motivo=serializer.validated_data["motivo"],
            descripcion=serializer.validated_data.get("descripcion", ""),
            publicacion=serializer.validated_data.get("publicacion_reportada"),
            usuario_reportado=serializer.validated_data.get("usuario_reportado"),
        )
        return Response(self.get_serializer(reporte).data, status=201)


class ReporteResolverView(APIView):
    permission_classes = [EsAdministrador]

    def post(self, request, pk):
        reporte = get_object_or_404(Reporte, pk=pk)
        resolver_reporte(reporte, request.user)
        return Response(ReporteSerializer(reporte).data)
