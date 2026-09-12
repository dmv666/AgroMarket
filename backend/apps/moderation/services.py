from django.utils import timezone

from apps.accounts.models import Usuario
from apps.catalog.models import Publicacion
from apps.notifications.models import Notificacion
from apps.notifications.services import notify

from .models import Reporte


def aprobar_verificacion(usuario: Usuario, admin: Usuario) -> Usuario:
    usuario.estado_verificacion = Usuario.EstadoVerificacion.APROBADO
    usuario.revisor_verificacion = admin
    usuario.fecha_revision_verificacion = timezone.now()
    usuario.save(
        update_fields=["estado_verificacion", "revisor_verificacion", "fecha_revision_verificacion"]
    )
    notify(usuario, Notificacion.Tipo.VERIFICACION_APROBADA, "Tu identidad fue verificada. Ya puedes publicar y contactar vendedores.")
    return usuario


def rechazar_verificacion(usuario: Usuario, admin: Usuario) -> Usuario:
    usuario.estado_verificacion = Usuario.EstadoVerificacion.RECHAZADO
    usuario.revisor_verificacion = admin
    usuario.fecha_revision_verificacion = timezone.now()
    usuario.save(
        update_fields=["estado_verificacion", "revisor_verificacion", "fecha_revision_verificacion"]
    )
    notify(usuario, Notificacion.Tipo.VERIFICACION_RECHAZADA, "Tu verificación de identidad fue rechazada. Revisa tu documento y vuelve a intentarlo.")
    return usuario


def aprobar_publicacion(publicacion: Publicacion, admin: Usuario) -> Publicacion:
    publicacion.estado = Publicacion.Estado.APROBADA
    publicacion.motivo_moderacion = ""
    publicacion.revisado_por = admin
    publicacion.save(update_fields=["estado", "motivo_moderacion", "revisado_por", "actualizado_en"])
    notify(publicacion.vendedor, Notificacion.Tipo.PUBLICACION_APROBADA, f'Tu publicación "{publicacion.titulo}" fue aprobada.')
    return publicacion


def rechazar_publicacion(publicacion: Publicacion, admin: Usuario, motivo: str) -> Publicacion:
    publicacion.estado = Publicacion.Estado.RECHAZADA
    publicacion.motivo_moderacion = motivo
    publicacion.revisado_por = admin
    publicacion.save(update_fields=["estado", "motivo_moderacion", "revisado_por", "actualizado_en"])
    notify(publicacion.vendedor, Notificacion.Tipo.PUBLICACION_RECHAZADA, f'Tu publicación "{publicacion.titulo}" fue rechazada: {motivo}')
    return publicacion


def suspender_publicacion(publicacion: Publicacion, admin: Usuario, motivo: str) -> Publicacion:
    """RF09: una publicación suspendida deja de listarse de inmediato — se
    resuelve reutilizando el mismo filtro estado=aprobada que ya usa el
    catálogo público, no con un flag aparte."""
    publicacion.estado = Publicacion.Estado.SUSPENDIDA
    publicacion.motivo_moderacion = motivo
    publicacion.revisado_por = admin
    publicacion.save(update_fields=["estado", "motivo_moderacion", "revisado_por", "actualizado_en"])
    notify(publicacion.vendedor, Notificacion.Tipo.PUBLICACION_RECHAZADA, f'Tu publicación "{publicacion.titulo}" fue suspendida: {motivo}')
    return publicacion


def crear_reporte(usuario_reporta: Usuario, motivo: str, descripcion: str, publicacion=None, usuario_reportado=None) -> Reporte:
    """RF11. Si el objetivo es una publicación, se avisa a su dueño (RF10:
    "cuando una de sus publicaciones sea... reportada")."""
    reporte = Reporte.objects.create(
        usuario_reporta=usuario_reporta,
        publicacion_reportada=publicacion,
        usuario_reportado=usuario_reportado,
        motivo=motivo,
        descripcion=descripcion,
    )
    if publicacion is not None:
        notify(
            publicacion.vendedor,
            Notificacion.Tipo.PUBLICACION_REPORTADA,
            f'Tu publicación "{publicacion.titulo}" fue reportada y está en revisión.',
        )
    return reporte


def resolver_reporte(reporte: Reporte, admin: Usuario) -> Reporte:
    reporte.estado = Reporte.Estado.RESUELTO
    reporte.revisado_por = admin
    reporte.fecha_revision = timezone.now()
    reporte.save(update_fields=["estado", "revisado_por", "fecha_revision", "actualizado_en"])
    return reporte
