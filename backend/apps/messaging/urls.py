from django.urls import path

from .views import ConversacionListCreateView, MensajeListCreateView

urlpatterns = [
    path("conversaciones/", ConversacionListCreateView.as_view(), name="conversaciones"),
    path(
        "conversaciones/<int:conversacion_id>/mensajes/",
        MensajeListCreateView.as_view(),
        name="mensajes",
    ),
]
