from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel


class Publicacion(TimeStampedModel):
    """Entidad base del catálogo (RF02-RF05). Cada categoría tiene una tabla
    de especialización 1-1 (InsumoVeterinario / AlimentoBalanceado /
    AnimalGenetica) en vez de columnas nulas compartidas: cada una valida
    sus propios campos obligatorios (en particular RF04, que exige
    estado_salud) sin que las demás categorías carguen con campos que no
    usan.
    """

    class Categoria(models.TextChoices):
        INSUMO_VETERINARIO = "insumo_veterinario", "Insumo veterinario"
        ALIMENTO_BALANCEADO = "alimento_balanceado", "Alimento balanceado"
        ANIMAL_GENETICA = "animal_genetica", "Animal / genética"

    class Estado(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente de revisión"
        APROBADA = "aprobada", "Aprobada"
        RECHAZADA = "rechazada", "Rechazada"
        SUSPENDIDA = "suspendida", "Suspendida"

    vendedor = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="publicaciones"
    )
    categoria = models.CharField(max_length=30, choices=Categoria.choices)
    titulo = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=12, decimal_places=2)
    cantidad_disponible = models.PositiveIntegerField(default=1)
    ubicacion = models.CharField(max_length=150)

    estado = models.CharField(
        max_length=20, choices=Estado.choices, default=Estado.PENDIENTE
    )
    motivo_moderacion = models.TextField(blank=True)
    revisado_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="publicaciones_moderadas",
    )

    class Meta:
        ordering = ["-creado_en"]

    def __str__(self):
        return f"{self.titulo} ({self.get_categoria_display()})"


class InsumoVeterinario(models.Model):
    """RF02 — especialización 1-1 de Publicacion."""

    publicacion = models.OneToOneField(
        Publicacion, on_delete=models.CASCADE, primary_key=True
    )
    tipo_insumo = models.CharField(max_length=100)
    fabricante = models.CharField(max_length=100, blank=True)
    fecha_vencimiento = models.DateField(null=True, blank=True)


class AlimentoBalanceado(models.Model):
    """RF03 — especialización 1-1 de Publicacion."""

    publicacion = models.OneToOneField(
        Publicacion, on_delete=models.CASCADE, primary_key=True
    )
    tipo_alimento = models.CharField(max_length=100)
    presentacion = models.CharField(max_length=100)
    peso_kg = models.DecimalField(max_digits=8, decimal_places=2)


class AnimalGenetica(models.Model):
    """RF04 — especialización 1-1 de Publicacion. `estado_salud` es
    obligatorio a nivel de modelo Y de serializer: el criterio de
    aceptación de RF04 dice literalmente que no se puede guardar sin él.
    """

    class TipoGenetica(models.TextChoices):
        CRIA = "cria", "Cría"
        REPRODUCTOR = "reproductor", "Reproductor"
        SEMEN = "semen", "Semen"

    publicacion = models.OneToOneField(
        Publicacion, on_delete=models.CASCADE, primary_key=True
    )
    especie = models.CharField(max_length=100)
    raza = models.CharField(max_length=100)
    edad = models.CharField(max_length=50)
    estado_salud = models.TextField()
    certificados_sanitarios = models.FileField(
        upload_to="publicaciones/certificados/", null=True, blank=True
    )
    tipo_genetica = models.CharField(max_length=20, choices=TipoGenetica.choices)


class ImagenPublicacion(TimeStampedModel):
    publicacion = models.ForeignKey(
        Publicacion, on_delete=models.CASCADE, related_name="imagenes"
    )
    archivo = models.ImageField(upload_to="publicaciones/imagenes/")
    orden = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["orden", "creado_en"]
