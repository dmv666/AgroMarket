from django.contrib import admin

from .models import Reporte


@admin.register(Reporte)
class ReporteAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "usuario_reporta",
        "publicacion_reportada",
        "usuario_reportado",
        "motivo",
        "estado",
        "creado_en",
    ]
    list_filter = ["estado"]
