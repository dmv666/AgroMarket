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

echo "Iniciando servidor ASGI (daphne)..."
exec daphne -b 0.0.0.0 -p 8000 config.asgi:application
