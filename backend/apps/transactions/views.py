from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import Usuario
from apps.catalog.models import Publicacion

from .models import Calificacion, Transaccion
from .serializers import CalificacionSerializer, TransaccionSerializer
from .services import calificar_transaccion


class TransaccionCreateListView(generics.ListCreateAPIView):
    """RF08 (historial) + soporte de RF07: el vendedor registra el cierre de
    una venta para poder marcarla completada y ser calificado por ella."""

    serializer_class = TransaccionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        usuario = self.request.user
        return Transaccion.objects.filter(comprador=usuario) | Transaccion.objects.filter(
            vendedor=usuario
        )

    def create(self, request, *args, **kwargs):
        publicacion = get_object_or_404(Publicacion, pk=request.data.get("publicacion"))
        if publicacion.vendedor_id != request.user.id:
            raise PermissionDenied("Solo el vendedor de la publicación puede registrar la venta.")

        comprador = get_object_or_404(Usuario, pk=request.data.get("comprador"))
        transaccion = Transaccion.objects.create(
            publicacion=publicacion, comprador=comprador, vendedor=request.user
        )
        return Response(
            self.get_serializer(transaccion).data, status=status.HTTP_201_CREATED
        )


class TransaccionCompletarView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        transaccion = get_object_or_404(Transaccion, pk=pk)
        if transaccion.vendedor_id != request.user.id:
            raise PermissionDenied("Solo el vendedor puede marcar la transacción como completada.")
        transaccion.estado = Transaccion.Estado.COMPLETADA
        transaccion.save(update_fields=["estado", "actualizado_en"])
        return Response(TransaccionSerializer(transaccion).data)


class CalificacionCreateView(generics.CreateAPIView):
    """RF07 — solo el comprador de una transacción completada puede
    calificarla, y solo una vez (OneToOneField transacción<->calificación)."""

    serializer_class = CalificacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        transaccion = get_object_or_404(Transaccion, pk=request.data.get("transaccion"))
        if transaccion.comprador_id != request.user.id:
            raise PermissionDenied("Solo el comprador de esta transacción puede calificarla.")
        if transaccion.estado != Transaccion.Estado.COMPLETADA:
            raise ValidationError("La transacción debe estar completada antes de calificarla.")
        if Calificacion.objects.filter(transaccion=transaccion).exists():
            raise ValidationError("Esta transacción ya fue calificada.")

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        calificacion = calificar_transaccion(
            transaccion,
            request.user,
            serializer.validated_data["puntuacion"],
            serializer.validated_data.get("comentario", ""),
        )
        return Response(
            self.get_serializer(calificacion).data, status=status.HTTP_201_CREATED
        )
