from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from apps.catalog.models import Publicacion
from apps.core.models import TimeStampedModel


class Transaccion(TimeStampedModel):
    """Ningún RF describe un flujo de pago/checkout; RF07 y RF08 solo
    presuponen que existe un cierre de transacción para poder calificar y
    para el historial. El vendedor la registra y la marca completada
    manualmente — es el mínimo que ambos RF necesitan, sin inventar un
    módulo de pagos fuera de alcance."""

    class Estado(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        COMPLETADA = "completada", "Completada"

    publicacion = models.ForeignKey(
        Publicacion, on_delete=models.CASCADE, related_name="transacciones"
    )
    comprador = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="compras"
    )
    vendedor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ventas"
    )
    estado = models.CharField(
        max_length=20, choices=Estado.choices, default=Estado.PENDIENTE
    )

    class Meta:
        ordering = ["-creado_en"]


class Calificacion(TimeStampedModel):
    """RF07 — una calificación por transacción, del comprador hacia el
    vendedor (el criterio de aceptación es unidireccional: "un comprador
    califica a un vendedor")."""

    transaccion = models.OneToOneField(Transaccion, on_delete=models.CASCADE)
    comprador = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="calificaciones_dadas"
    )
    vendedor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="calificaciones_recibidas"
    )
    puntuacion = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comentario = models.TextField(blank=True)

    class Meta:
        ordering = ["-creado_en"]
