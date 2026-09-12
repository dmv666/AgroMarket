from rest_framework import serializers

from apps.accounts.serializers import UsuarioPublicoSerializer

from .models import Calificacion, Transaccion


class TransaccionSerializer(serializers.ModelSerializer):
    comprador = UsuarioPublicoSerializer(read_only=True)
    vendedor = UsuarioPublicoSerializer(read_only=True)

    class Meta:
        model = Transaccion
        fields = ["id", "publicacion", "comprador", "vendedor", "estado", "creado_en"]
        read_only_fields = ["comprador", "vendedor", "estado"]


class CalificacionSerializer(serializers.ModelSerializer):
    comprador = UsuarioPublicoSerializer(read_only=True)

    class Meta:
        model = Calificacion
        fields = ["id", "transaccion", "comprador", "puntuacion", "comentario", "creado_en"]
        read_only_fields = ["comprador", "creado_en"]
