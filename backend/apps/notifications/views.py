from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notificacion
from .serializers import NotificacionSerializer


class NotificacionListView(generics.ListAPIView):
    """RF10 — historial de notificaciones del usuario autenticado, más
    reciente primero. El WS (`/ws/notificaciones/`) las entrega en vivo;
    este endpoint es lo que carga la campana al abrir la página."""

    serializer_class = NotificacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notificacion.objects.filter(usuario=self.request.user)


class MarcarLeidasView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        actualizadas = Notificacion.objects.filter(
            usuario=request.user, leida=False
        ).update(leida=True)
        return Response({"actualizadas": actualizadas})
