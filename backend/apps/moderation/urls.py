from django.urls import path

from .views import (
    PublicacionAprobarView,
    PublicacionModeracionListView,
    PublicacionRechazarView,
    PublicacionSuspenderView,
    ReporteListCreateView,
    ReporteResolverView,
    VerificacionAprobarView,
    VerificacionPendienteListView,
    VerificacionRechazarView,
)

urlpatterns = [
    path("verificaciones/", VerificacionPendienteListView.as_view(), name="verificaciones-pendientes"),
    path("verificaciones/<int:pk>/aprobar/", VerificacionAprobarView.as_view(), name="verificacion-aprobar"),
    path("verificaciones/<int:pk>/rechazar/", VerificacionRechazarView.as_view(), name="verificacion-rechazar"),
    path("publicaciones/", PublicacionModeracionListView.as_view(), name="moderacion-publicaciones"),
    path("publicaciones/<int:pk>/aprobar/", PublicacionAprobarView.as_view(), name="publicacion-aprobar"),
    path("publicaciones/<int:pk>/rechazar/", PublicacionRechazarView.as_view(), name="publicacion-rechazar"),
    path("publicaciones/<int:pk>/suspender/", PublicacionSuspenderView.as_view(), name="publicacion-suspender"),
    path("reportes/", ReporteListCreateView.as_view(), name="reportes"),
    path("reportes/<int:pk>/resolver/", ReporteResolverView.as_view(), name="reporte-resolver"),
]
