from rest_framework import serializers

from apps.accounts.serializers import UsuarioPublicoSerializer

from .models import (
    AlimentoBalanceado,
    AnimalGenetica,
    ImagenPublicacion,
    InsumoVeterinario,
    Publicacion,
)


class InsumoVeterinarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsumoVeterinario
        fields = ["tipo_insumo", "fabricante", "fecha_vencimiento"]


class AlimentoBalanceadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlimentoBalanceado
        fields = ["tipo_alimento", "presentacion", "peso_kg"]


class AnimalGeneticaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnimalGenetica
        fields = [
            "especie",
            "raza",
            "edad",
            "estado_salud",
            "certificados_sanitarios",
            "tipo_genetica",
        ]
        extra_kwargs = {"estado_salud": {"allow_blank": False}}


class ImagenPublicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenPublicacion
        fields = ["id", "archivo", "orden"]


# Mapa único categoría -> (serializer de detalle, modelo, nombre del accessor
# reverso en Publicacion). Es la única fuente de verdad del polimorfismo:
# agregar una cuarta categoría el día de mañana implica tocar solo esta línea
# más el modelo correspondiente, nada de lo que sigue abajo cambia.
DETALLE_POR_CATEGORIA = {
    Publicacion.Categoria.INSUMO_VETERINARIO: (
        InsumoVeterinarioSerializer,
        InsumoVeterinario,
        "insumoveterinario",
    ),
    Publicacion.Categoria.ALIMENTO_BALANCEADO: (
        AlimentoBalanceadoSerializer,
        AlimentoBalanceado,
        "alimentobalanceado",
    ),
    Publicacion.Categoria.ANIMAL_GENETICA: (
        AnimalGeneticaSerializer,
        AnimalGenetica,
        "animalgenetica",
    ),
}


class PublicacionSerializer(serializers.ModelSerializer):
    vendedor = UsuarioPublicoSerializer(read_only=True)
    imagenes = ImagenPublicacionSerializer(many=True, read_only=True)
    detalle = serializers.DictField(write_only=True)

    class Meta:
        model = Publicacion
        fields = [
            "id",
            "vendedor",
            "categoria",
            "titulo",
            "descripcion",
            "precio",
            "cantidad_disponible",
            "ubicacion",
            "estado",
            "motivo_moderacion",
            "imagenes",
            "detalle",
            "creado_en",
        ]
        read_only_fields = ["estado", "motivo_moderacion"]

    def validate(self, attrs):
        categoria = attrs.get("categoria") or getattr(self.instance, "categoria", None)
        detalle_serializer_cls, _, _ = DETALLE_POR_CATEGORIA[categoria]
        detalle_serializer = detalle_serializer_cls(data=attrs.get("detalle", {}))
        detalle_serializer.is_valid(raise_exception=True)
        self._detalle_validado = detalle_serializer.validated_data
        return attrs

    def create(self, validated_data):
        validated_data.pop("detalle", None)
        _, modelo, _ = DETALLE_POR_CATEGORIA[validated_data["categoria"]]
        publicacion = Publicacion.objects.create(
            vendedor=self.context["request"].user, **validated_data
        )
        modelo.objects.create(publicacion=publicacion, **self._detalle_validado)
        return publicacion

    def update(self, instance, validated_data):
        validated_data.pop("detalle", None)
        _, modelo, related_name = DETALLE_POR_CATEGORIA[instance.categoria]
        instance = super().update(instance, validated_data)
        modelo.objects.filter(publicacion=instance).update(**self._detalle_validado)
        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        detalle_serializer_cls, _, related_name = DETALLE_POR_CATEGORIA[instance.categoria]
        detalle_obj = getattr(instance, related_name, None)
        data["detalle"] = detalle_serializer_cls(detalle_obj).data if detalle_obj else None
        return data
