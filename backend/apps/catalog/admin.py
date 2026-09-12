from django.contrib import admin

from .models import (
    AlimentoBalanceado,
    AnimalGenetica,
    ImagenPublicacion,
    InsumoVeterinario,
    Publicacion,
)


class ImagenInline(admin.TabularInline):
    model = ImagenPublicacion
    extra = 0


@admin.register(Publicacion)
class PublicacionAdmin(admin.ModelAdmin):
    list_display = ["id", "titulo", "categoria", "vendedor", "estado", "precio", "creado_en"]
    list_filter = ["categoria", "estado"]
    search_fields = ["titulo", "vendedor__email"]
    inlines = [ImagenInline]


admin.site.register(InsumoVeterinario)
admin.site.register(AlimentoBalanceado)
admin.site.register(AnimalGenetica)
