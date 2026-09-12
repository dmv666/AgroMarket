from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Usuario


@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    model = Usuario
    ordering = ["-creado_en"]
    list_display = [
        "email",
        "nombre_completo",
        "estado_verificacion",
        "es_administrador",
        "is_staff",
    ]
    list_filter = ["estado_verificacion", "es_administrador", "is_staff"]
    search_fields = ["email", "nombre_completo", "numero_documento"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (
            "Información personal",
            {"fields": ("nombre_completo", "telefono", "ubicacion")},
        ),
        (
            "Verificación (RF01)",
            {
                "fields": (
                    "tipo_documento",
                    "numero_documento",
                    "documento_identidad_archivo",
                    "estado_verificacion",
                    "fecha_solicitud_verificacion",
                    "fecha_revision_verificacion",
                    "revisor_verificacion",
                )
            },
        ),
        (
            "Permisos",
            {
                "fields": (
                    "es_administrador",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "nombre_completo", "password1", "password2"),
            },
        ),
    )
