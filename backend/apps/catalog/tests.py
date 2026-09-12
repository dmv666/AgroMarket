import pytest
from rest_framework.test import APIClient

from apps.accounts.models import Usuario

from .models import Publicacion


def _vendedor_verificado():
    return Usuario.objects.create_user(
        email="vendedor@test.co",
        password="claveSegura123",
        nombre_completo="Vendedor",
        estado_verificacion=Usuario.EstadoVerificacion.APROBADO,
    )


@pytest.mark.django_db
class TestValidacionAnimalGeneticaRF04:
    """RF04: 'Una publicación de animales o genética no puede guardarse si el
    campo de información sanitaria está vacío.'"""

    def test_sin_estado_salud_falla(self):
        client = APIClient()
        client.force_authenticate(_vendedor_verificado())

        respuesta = client.post(
            "/api/catalog/publicaciones/",
            {
                "categoria": "animal_genetica",
                "titulo": "Novilla",
                "precio": "2000000",
                "ubicacion": "Meta",
                "detalle": {"especie": "bovino", "raza": "Brahman", "edad": "18 meses", "tipo_genetica": "cria"},
            },
            format="json",
        )

        assert respuesta.status_code == 400
        assert "estado_salud" in respuesta.data
        assert Publicacion.objects.count() == 0

    def test_con_estado_salud_se_crea(self):
        client = APIClient()
        client.force_authenticate(_vendedor_verificado())

        respuesta = client.post(
            "/api/catalog/publicaciones/",
            {
                "categoria": "animal_genetica",
                "titulo": "Novilla",
                "precio": "2000000",
                "ubicacion": "Meta",
                "detalle": {
                    "especie": "bovino",
                    "raza": "Brahman",
                    "edad": "18 meses",
                    "estado_salud": "Sana, vacunada",
                    "tipo_genetica": "cria",
                },
            },
            format="json",
        )

        assert respuesta.status_code == 201
        assert Publicacion.objects.get().animalgenetica.estado_salud == "Sana, vacunada"


@pytest.mark.django_db
class TestVisibilidadCatalogoRF02:
    """RF02: una publicación solo es visible en el catálogo si está aprobada."""

    def test_publicacion_pendiente_no_aparece_en_catalogo_publico(self):
        vendedor = _vendedor_verificado()
        Publicacion.objects.create(
            vendedor=vendedor,
            categoria=Publicacion.Categoria.INSUMO_VETERINARIO,
            titulo="Vacuna",
            precio="1000",
            ubicacion="Meta",
        )

        respuesta = APIClient().get("/api/catalog/publicaciones/")

        assert respuesta.status_code == 200
        assert respuesta.data["count"] == 0

    def test_publicacion_aprobada_si_aparece(self):
        vendedor = _vendedor_verificado()
        Publicacion.objects.create(
            vendedor=vendedor,
            categoria=Publicacion.Categoria.INSUMO_VETERINARIO,
            titulo="Vacuna",
            precio="1000",
            ubicacion="Meta",
            estado=Publicacion.Estado.APROBADA,
        )

        respuesta = APIClient().get("/api/catalog/publicaciones/")

        assert respuesta.data["count"] == 1
