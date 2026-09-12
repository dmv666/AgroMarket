from django.conf import settings
from django.db import models

from apps.catalog.models import Publicacion
from apps.core.models import TimeStampedModel


class Reporte(TimeStampedModel):
    """RF11 — reporta exactamente uno de los dos objetivos posibles (una
    publicación o un usuario), nunca ambos ni ninguno. Se valida dos veces:
    en el serializer (para un mensaje de error claro al usuario) y con un
    CheckConstraint en la base de datos (para que la regla se sostenga sin
    importar por qué camino se inserte la fila)."""

    class Estado(models.TextChoices):
        SIN_REVISAR = "sin_revisar", "Sin revisar"
        EN_REVISION = "en_revision", "En revisión"
        RESUELTO = "resuelto", "Resuelto"

    usuario_reporta = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reportes_hechos"
    )
    publicacion_reportada = models.ForeignKey(
        Publicacion, on_delete=models.CASCADE, null=True, blank=True, related_name="reportes"
    )
    usuario_reportado = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="reportes_recibidos",
    )
    motivo = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    estado = models.CharField(
        max_length=20, choices=Estado.choices, default=Estado.SIN_REVISAR
    )
    revisado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="reportes_revisados",
    )
    fecha_revision = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-creado_en"]
        constraints = [
            models.CheckConstraint(
                condition=(
                    models.Q(publicacion_reportada__isnull=False, usuario_reportado__isnull=True)
                    | models.Q(publicacion_reportada__isnull=True, usuario_reportado__isnull=False)
                ),
                name="reporte_tiene_exactamente_un_objetivo",
            )
        ]
