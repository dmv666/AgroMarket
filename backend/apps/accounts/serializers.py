from django.utils import timezone
from rest_framework import serializers

from .models import Usuario


class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = Usuario
        fields = [
            "id",
            "email",
            "password",
            "nombre_completo",
            "telefono",
            "ubicacion",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")
        return Usuario.objects.create_user(password=password, **validated_data)


class UsuarioSerializer(serializers.ModelSerializer):
    """Vista propia (GET/PATCH /api/auth/me/) y, reutilizada por
    apps.moderation, la cola de verificación del admin — por eso incluye
    `documento_identidad_archivo`: sin verlo, un administrador no puede
    revisar de verdad la solicitud (RF01/RF09), solo aprobarla a ciegas."""

    class Meta:
        model = Usuario
        fields = [
            "id",
            "email",
            "nombre_completo",
            "telefono",
            "ubicacion",
            "tipo_documento",
            "numero_documento",
            "documento_identidad_archivo",
            "estado_verificacion",
            "fecha_solicitud_verificacion",
            "es_administrador",
            "promedio_calificacion",
            "total_calificaciones",
            "creado_en",
        ]
        read_only_fields = [
            "id",
            "email",
            "documento_identidad_archivo",
            "estado_verificacion",
            "fecha_solicitud_verificacion",
            "es_administrador",
            "promedio_calificacion",
            "total_calificaciones",
            "creado_en",
        ]


class UsuarioPublicoSerializer(serializers.ModelSerializer):
    """Perfil público de vendedor (RF07): nunca expone email/teléfono/documento
    a un usuario no autenticado — eso lo garantiza el propio listado de campos.
    """

    class Meta:
        model = Usuario
        fields = [
            "id",
            "nombre_completo",
            "ubicacion",
            "estado_verificacion",
            "promedio_calificacion",
            "total_calificaciones",
            "creado_en",
        ]


class VerificacionSerializer(serializers.ModelSerializer):
    """RF01: el usuario envía su documento; queda en estado pendiente hasta
    que un administrador lo revise (ver apps.moderation).
    """

    class Meta:
        model = Usuario
        fields = ["tipo_documento", "numero_documento", "documento_identidad_archivo"]

    def validate(self, attrs):
        # No se permite una segunda solicitud mientras la primera sigue sin
        # revisar (evita que la cola de un admin se llene de reenvíos del
        # mismo usuario). Una vez que la revisión queda resuelta (aprobada o
        # rechazada), estado_verificacion ya no es PENDIENTE y esto no aplica.
        instance = self.instance
        if (
            instance.estado_verificacion == Usuario.EstadoVerificacion.PENDIENTE
            and instance.fecha_solicitud_verificacion is not None
        ):
            raise serializers.ValidationError(
                "Ya tienes una verificación en curso. Un administrador la revisará en un máximo de 48 horas."
            )
        return attrs

    def update(self, instance, validated_data):
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.estado_verificacion = Usuario.EstadoVerificacion.PENDIENTE
        instance.fecha_solicitud_verificacion = timezone.now()
        instance.fecha_revision_verificacion = None
        instance.revisor_verificacion = None
        instance.save()
        return instance
