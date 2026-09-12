from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel


class Notificacion(TimeStampedModel):
    """RF10. `creado_en` (heredado) es la fecha de creación exigida por el
    criterio de aceptación ("no mayor a un minuto luego de generado el
    evento") — no se necesita un campo de fecha aparte.
    """

    class Tipo(models.TextChoices):
        MENSAJE = "mensaje", "Nuevo mensaje"
        PUBLICACION_APROBADA = "publicacion_aprobada", "Publicación aprobada"
        PUBLICACION_RECHAZADA = "publicacion_rechazada", "Publicación rechazada"
        PUBLICACION_REPORTADA = "publicacion_reportada", "Publicación reportada"
        CALIFICACION_RECIBIDA = "calificacion_recibida", "Nueva calificación"
        VERIFICACION_APROBADA = "verificacion_aprobada", "Verificación aprobada"
        VERIFICACION_RECHAZADA = "verificacion_rechazada", "Verificación rechazada"

    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notificaciones",
    )
    tipo = models.CharField(max_length=30, choices=Tipo.choices)
    contenido = models.CharField(max_length=255)
    leida = models.BooleanField(default=False)

    class Meta:
        ordering = ["-creado_en"]

    def __str__(self):
        return f"[{self.tipo}] {self.usuario_id}: {self.contenido[:40]}"
