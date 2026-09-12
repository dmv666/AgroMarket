from rest_framework import serializers

from apps.accounts.serializers import UsuarioPublicoSerializer

from .models import Conversacion, Mensaje


class MensajeSerializer(serializers.ModelSerializer):
    remitente = UsuarioPublicoSerializer(read_only=True)

    class Meta:
        model = Mensaje
        fields = ["id", "conversacion", "remitente", "contenido", "leido", "creado_en"]
        read_only_fields = ["remitente", "leido", "creado_en"]


class ConversacionSerializer(serializers.ModelSerializer):
    comprador = UsuarioPublicoSerializer(read_only=True)
    vendedor = UsuarioPublicoSerializer(read_only=True)
    ultimo_mensaje = serializers.SerializerMethodField()

    class Meta:
        model = Conversacion
        fields = [
            "id",
            "publicacion",
            "comprador",
            "vendedor",
            "ultimo_mensaje",
            "creado_en",
        ]
        read_only_fields = ["comprador", "vendedor"]

    def get_ultimo_mensaje(self, obj):
        ultimo = obj.mensajes.last()
        return MensajeSerializer(ultimo).data if ultimo else None
