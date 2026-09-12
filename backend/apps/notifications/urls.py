from django.urls import path

from .views import MarcarLeidasView, NotificacionListView

urlpatterns = [
    path("", NotificacionListView.as_view(), name="notificaciones"),
    path("marcar-leidas/", MarcarLeidasView.as_view(), name="notificaciones-marcar-leidas"),
]
