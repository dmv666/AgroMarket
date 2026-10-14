"""Carga datos de ejemplo para que el catálogo no se vea vacío en una demo.

Uso: docker compose exec backend python manage.py seed_demo

Idempotente: si el admin de ejemplo ya existe, no duplica nada.
"""
from django.core.management.base import BaseCommand

from apps.accounts.models import Usuario
from apps.catalog.models import AlimentoBalanceado, AnimalGenetica, InsumoVeterinario, Publicacion


class Command(BaseCommand):
    help = "Crea un administrador, dos usuarios verificados y publicaciones de ejemplo."

    def handle(self, *args, **options):
        if Usuario.objects.filter(email="admin@agromarket.co").exists():
            self.stdout.write(self.style.WARNING("Los datos de ejemplo ya existen, no se repite la carga."))
            return

        admin = Usuario.objects.create_superuser(
            email="admin@agromarket.co", password="AgroMarket2026", nombre_completo="Admin AgroMarket"
        )

        vendedor = Usuario.objects.create_user(
            email="finca.esperanza@agromarket.co",
            password="AgroMarket2026",
            nombre_completo="Finca La Esperanza",
            ubicacion="Puerto López, Meta",
            estado_verificacion=Usuario.EstadoVerificacion.APROBADO,
            revisor_verificacion=admin,
        )
        Usuario.objects.create_user(
            email="comprador.demo@agromarket.co",
            password="AgroMarket2026",
            nombre_completo="Comprador Demo",
            ubicacion="Villavicencio, Meta",
            estado_verificacion=Usuario.EstadoVerificacion.APROBADO,
            revisor_verificacion=admin,
        )

        publicaciones = [
            dict(
                categoria=Publicacion.Categoria.INSUMO_VETERINARIO,
                titulo="Vacuna Triple Bovina (caja x50)",
                descripcion="Ántrax, carbón sintomático y septicemia hemorrágica. Cadena de frío garantizada.",
                precio="310000",
                cantidad_disponible=20,
                ubicacion="Yopal, Casanare",
                detalle_modelo=InsumoVeterinario,
                detalle=dict(tipo_insumo="Vacuna", fabricante="Labs Agroveterinarios"),
            ),
            dict(
                categoria=Publicacion.Categoria.ALIMENTO_BALANCEADO,
                titulo="Concentrado engorde bovino 40%",
                descripcion="Formulado con maíz y torta de soya. Entrega en finca.",
                precio="98000",
                cantidad_disponible=100,
                ubicacion="Villavicencio, Meta",
                detalle_modelo=AlimentoBalanceado,
                detalle=dict(tipo_alimento="Concentrado engorde", presentacion="Bulto 40kg", peso_kg="40"),
            ),
            dict(
                categoria=Publicacion.Categoria.ANIMAL_GENETICA,
                titulo="Novillas F1 Brahman x Angus",
                descripcion="Lote de 12 novillas, 15-18 meses, vacunadas y con registro sanitario al día.",
                precio="2850000",
                cantidad_disponible=12,
                ubicacion="Puerto López, Meta",
                detalle_modelo=AnimalGenetica,
                detalle=dict(
                    especie="Bovino",
                    raza="F1 Brahman x Angus",
                    edad="15-18 meses",
                    estado_salud="Buen estado corporal, vacunadas, sin signos de enfermedad.",
                    tipo_genetica=AnimalGenetica.TipoGenetica.CRIA,
                ),
            ),
        ]

        for datos in publicaciones:
            detalle_modelo = datos.pop("detalle_modelo")
            detalle = datos.pop("detalle")
            publicacion = Publicacion.objects.create(
                vendedor=vendedor,
                estado=Publicacion.Estado.APROBADA,
                revisado_por=admin,
                **datos,
            )
            detalle_modelo.objects.create(publicacion=publicacion, **detalle)

        self.stdout.write(self.style.SUCCESS("Datos de ejemplo cargados."))
        self.stdout.write("  Admin:     admin@agromarket.co / AgroMarket2026")
        self.stdout.write("  Vendedor:  finca.esperanza@agromarket.co / AgroMarket2026")
        self.stdout.write("  Comprador: comprador.demo@agromarket.co / AgroMarket2026")
