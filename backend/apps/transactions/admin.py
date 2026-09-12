from django.contrib import admin

from .models import Calificacion, Transaccion


@admin.register(Transaccion)
class TransaccionAdmin(admin.ModelAdmin):
    list_display = ["id", "publicacion", "comprador", "vendedor", "estado", "creado_en"]
    list_filter = ["estado"]


@admin.register(Calificacion)
class CalificacionAdmin(admin.ModelAdmin):
    list_display = ["id", "transaccion", "comprador", "vendedor", "puntuacion", "creado_en"]
