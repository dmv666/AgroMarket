from django.db.models import Avg, Count

from apps.notifications.models import Notificacion
from apps.notifications.services import notify

from .models import Calificacion, Transaccion


def calificar_transaccion(transaccion: Transaccion, comprador, puntuacion: int, comentario: str) -> Calificacion:
    """RF07: crea la calificación y recalcula el caché de reputación del
    vendedor a partir de la fuente de verdad (todas sus calificaciones) en
    vez de ir sumando a mano — así nunca se desincroniza."""
    calificacion = Calificacion.objects.create(
        transaccion=transaccion,
        comprador=comprador,
        vendedor=transaccion.vendedor,
        puntuacion=puntuacion,
        comentario=comentario,
    )

    agregados = Calificacion.objects.filter(vendedor=transaccion.vendedor).aggregate(
        promedio=Avg("puntuacion"), total=Count("id")
    )
    vendedor = transaccion.vendedor
    vendedor.promedio_calificacion = agregados["promedio"]
    vendedor.total_calificaciones = agregados["total"]
    vendedor.save(update_fields=["promedio_calificacion", "total_calificaciones"])

    notify(
        vendedor,
        Notificacion.Tipo.CALIFICACION_RECIBIDA,
        f"{comprador.nombre_completo} te calificó con {puntuacion} estrellas.",
    )
    return calificacion
