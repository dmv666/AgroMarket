from django.contrib import admin

from .models import Conversacion, Mensaje


@admin.register(Conversacion)
class ConversacionAdmin(admin.ModelAdmin):
    list_display = ["id", "publicacion", "comprador", "vendedor", "creado_en"]


@admin.register(Mensaje)
class MensajeAdmin(admin.ModelAdmin):
    list_display = ["id", "conversacion", "remitente", "leido", "creado_en"]
