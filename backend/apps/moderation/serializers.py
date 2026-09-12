from rest_framework import serializers

from .models import Reporte


class ReporteSerializer(serializers.ModelSerializer):
    """Los campos `_nombre`/`_titulo` evitan que el panel admin tenga que
    resolver cada id a un nombre con una llamada aparte — solo son de
    lectura, la relación real sigue siendo el id."""

    usuario_reporta_nombre = serializers.CharField(source="usuario_reporta.nombre_completo", read_only=True)
    usuario_reportado_nombre = serializers.CharField(
        source="usuario_reportado.nombre_completo", read_only=True, default=None
    )
    publicacion_reportada_titulo = serializers.CharField(
        source="publicacion_reportada.titulo", read_only=True, default=None
    )

    class Meta:
        model = Reporte
        fields = [
            "id",
            "usuario_reporta",
            "usuario_reporta_nombre",
            "publicacion_reportada",
            "publicacion_reportada_titulo",
            "usuario_reportado",
            "usuario_reportado_nombre",
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
