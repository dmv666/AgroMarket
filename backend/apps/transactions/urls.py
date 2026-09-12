from django.urls import path

from .views import CalificacionCreateView, TransaccionCompletarView, TransaccionCreateListView

urlpatterns = [
    path("", TransaccionCreateListView.as_view(), name="transacciones"),
    path("<int:pk>/completar/", TransaccionCompletarView.as_view(), name="transaccion-completar"),
    path("calificaciones/", CalificacionCreateView.as_view(), name="calificaciones"),
]
