from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.models import PermissionsMixin
from django.db import models

from apps.core.models import TimeStampedModel


class UsuarioManager(BaseUserManager):
    """El email es el identificador de login (no hay concepto de username)."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("El usuario debe tener un email.")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("es_administrador", True)
        # Un superusuario no necesita pasar por la cola de verificación de RF01.
        extra_fields.setdefault("estado_verificacion", Usuario.EstadoVerificacion.APROBADO)
        return self._create_user(email, password, **extra_fields)


class Usuario(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    """Productores, proveedores y compradores comparten este mismo modelo
    (RF01): el rol de "vendedor" o "comprador" no es un campo fijo, es algo
    que cada usuario ejerce según publique o contacte. `creado_en` (de
    TimeStampedModel) hace las veces de fecha_registro del modelo ER.
    """

    class TipoDocumento(models.TextChoices):
        CEDULA = "cedula", "Cédula de ciudadanía"
        NIT = "nit", "NIT"
        CEDULA_EXTRANJERIA = "cedula_extranjeria", "Cédula de extranjería"

    class EstadoVerificacion(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        APROBADO = "aprobado", "Aprobado"
        RECHAZADO = "rechazado", "Rechazado"

    email = models.EmailField(unique=True)
    nombre_completo = models.CharField(max_length=150)
    telefono = models.CharField(max_length=30, blank=True)
    ubicacion = models.CharField(max_length=150, blank=True)

    tipo_documento = models.CharField(
        max_length=20, choices=TipoDocumento.choices, blank=True
    )
    numero_documento = models.CharField(
        max_length=30, unique=True, null=True, blank=True
    )
    documento_identidad_archivo = models.FileField(
        upload_to="verificacion/documentos/", null=True, blank=True
    )

    estado_verificacion = models.CharField(
        max_length=20,
        choices=EstadoVerificacion.choices,
        default=EstadoVerificacion.PENDIENTE,
    )
    fecha_solicitud_verificacion = models.DateTimeField(null=True, blank=True)
    fecha_revision_verificacion = models.DateTimeField(null=True, blank=True)
    revisor_verificacion = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="verificaciones_revisadas",
    )

    es_administrador = models.BooleanField(default=False)

    # Caché de reputación (RF07): se recalcula en apps.transactions al crear
    # una Calificacion. Vive aquí porque es lo que se muestra en el perfil.
    promedio_calificacion = models.DecimalField(
        max_digits=3, decimal_places=2, null=True, blank=True
    )
    total_calificaciones = models.PositiveIntegerField(default=0)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nombre_completo"]

    class Meta:
        ordering = ["-creado_en"]

    def __str__(self):
        return f"{self.nombre_completo} <{self.email}>"

    @property
    def esta_verificado(self):
        return self.estado_verificacion == self.EstadoVerificacion.APROBADO
