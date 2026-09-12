from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from apps.accounts.permissions import EsUsuarioVerificado
from apps.catalog.models import Publicacion

from .models import Conversacion, Mensaje
from .serializers import ConversacionSerializer, MensajeSerializer
from .services import enviar_mensaje


class ConversacionListCreateView(generics.ListCreateAPIView):
    """RF06. Crear una conversación exige verificación aprobada (RF01,
    "contactar a otro usuario"). Si ya existe una conversación entre este
    comprador y esa publicación, se reutiliza en vez de duplicarla."""

    serializer_class = ConversacionSerializer
    permission_classes = [permissions.IsAuthenticated, EsUsuarioVerificado]

    def get_queryset(self):
        usuario = self.request.user
        return Conversacion.objects.filter(comprador=usuario) | Conversacion.objects.filter(
            vendedor=usuario
        )

    def create(self, request, *args, **kwargs):
        publicacion_id = request.data.get("publicacion")
        publicacion = get_object_or_404(Publicacion, pk=publicacion_id)

        if publicacion.vendedor_id == request.user.id:
            raise ValidationError("No puedes iniciar una conversación contigo mismo.")

        conversacion, creada = Conversacion.objects.get_or_create(
            publicacion=publicacion,
            comprador=request.user,
            defaults={"vendedor": publicacion.vendedor},
        )
        serializer = self.get_serializer(conversacion)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if creada else status.HTTP_200_OK,
        )


class MensajeListCreateView(generics.ListCreateAPIView):
    """Historial de una conversación + envío por REST (el WS en
    `/ws/chat/<id>/` es el canal principal; este endpoint comparte la misma
    lógica de negocio vía `enviar_mensaje()`)."""

    serializer_class = MensajeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_conversacion(self):
        conversacion = get_object_or_404(Conversacion, pk=self.kwargs["conversacion_id"])
        usuario = self.request.user
        if usuario.id not in (conversacion.comprador_id, conversacion.vendedor_id):
            raise ValidationError("No participas en esta conversación.")
        return conversacion

    def get_queryset(self):
        return Mensaje.objects.filter(conversacion=self.get_conversacion())

    def create(self, request, *args, **kwargs):
        conversacion = self.get_conversacion()
        contenido = request.data.get("contenido", "").strip()
        if not contenido:
            raise ValidationError({"contenido": "Este campo es requerido."})
        mensaje = enviar_mensaje(conversacion, request.user, contenido)
        return Response(
            self.get_serializer(mensaje).data, status=status.HTTP_201_CREATED
        )
