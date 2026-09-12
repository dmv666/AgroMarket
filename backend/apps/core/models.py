from django.db import models


class TimeStampedModel(models.Model):
    """Abstracta: añade fecha de creación/actualización a cualquier modelo del proyecto.

    Evita repetir estos dos campos (y su lógica de auto_now) en cada una de las
    doce entidades del dominio — DRY entre apps que no se conocen entre sí.
    """

    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
