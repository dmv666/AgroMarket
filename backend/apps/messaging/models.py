from django.conf import settings
from django.db import models

from apps.catalog.models import Publicacion
from apps.core.models import TimeStampedModel


class Conversacion(TimeStampedModel):
    """RF06. Única por (publicación, comprador): si el mismo comprador vuelve
    a escribir sobre la misma ficha, continúa la conversación existente en
    vez de crear una duplicada."""

    publicacion = models.ForeignKey(
        Publicacion, on_delete=models.CASCADE, related_name="conversaciones"
    )
    comprador = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="conversaciones_como_comprador"
    )
    vendedor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="conversaciones_como_vendedor"
    )

    class Meta:
        ordering = ["-actualizado_en"]
        constraints = [
            models.UniqueConstraint(
                fields=["publicacion", "comprador"], name="unica_conversacion_por_comprador_y_publicacion"
            )
        ]


class Mensaje(TimeStampedModel):
    conversacion = models.ForeignKey(
        Conversacion, on_delete=models.CASCADE, related_name="mensajes"
    )
    remitente = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    contenido = models.TextField()
    leido = models.BooleanField(default=False)

    class Meta:
        ordering = ["creado_en"]
