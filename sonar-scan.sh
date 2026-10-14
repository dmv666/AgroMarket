#!/bin/sh
# Ejecuta los tests del backend con cobertura y analiza todo el repo en el
# SonarQube local (http://localhost:9000). Requiere que estén corriendo:
#   docker compose up -d                                   (app: backend + db)
#   docker compose -f docker-compose.sonar.yml up -d       (SonarQube)
# y un token de análisis en .env.sonar (ver README).
set -e
cd "$(dirname "$0")"

if [ ! -f .env.sonar ]; then
  echo "Falta .env.sonar con SONAR_TOKEN=... (ver README, sección SonarQube)." >&2
  exit 1
fi

echo "==> Tests del backend con cobertura..."
# coverage.xml sale con rutas relativas a backend/ (<source>apps</source>); el
# scanner ve el repo desde la raíz, así que se reescribe a backend/apps.
docker compose run --rm backend sh -c \
  "python -m pytest apps --cov=apps --cov-report=xml -q && \
   sed -i 's#<source>apps</source>#<source>backend/apps</source>#' coverage.xml"

echo "==> Análisis de SonarQube..."
docker compose -f docker-compose.sonar.yml run --rm scanner

echo "==> Listo: http://localhost:9000/dashboard?id=agromarket"
