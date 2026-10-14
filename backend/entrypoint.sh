#!/bin/sh
set -e

# `docker compose run backend <comando>` (makemigrations, createsuperuser,
# shell, pytest...) debe ejecutar exactamente ese comando, sin el
# migrate+daphne automático que solo tiene sentido para `docker compose up`.
if [ "$#" -gt 0 ]; then
  exec "$@"
fi

echo "Aplicando migraciones..."
python manage.py migrate --noinput

# Archivos estáticos del admin y de DRF; en producción los sirve Caddy desde
# STATIC_ROOT (ver docker-compose.prod.yml). En desarrollo no estorba.
python manage.py collectstatic --noinput --verbosity 0

echo "Iniciando servidor ASGI (daphne)..."
exec daphne -b 0.0.0.0 -p 8000 config.asgi:application
