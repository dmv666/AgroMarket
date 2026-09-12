from rest_framework import serializers

from .models import Reporte


class ReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = [
            "id",
            "usuario_reporta",
            "publicacion_reportada",
            "usuario_reportado",
            "motivo",
            "descripcion",
            "estado",
            "revisado_por",
            "fecha_revision",
            "creado_en",
        ]
        read_only_fields = ["usuario_reporta", "estado", "revisado_por", "fecha_revision", "creado_en"]

    def validate(self, attrs):
        tiene_publicacion = bool(attrs.get("publicacion_reportada"))
        tiene_usuario = bool(attrs.get("usuario_reportado"))
        if tiene_publicacion == tiene_usuario:
            raise serializers.ValidationError(
                "Debes reportar exactamente una publicación o un usuario, no ambos ni ninguno."
            )
        return attrs
