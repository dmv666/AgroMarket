#!/bin/sh
set -e

# node_modules vive en un volumen nombrado aparte (ver docker-compose.yml)
# para que el bind mount de ./frontend no lo tape con el filesystem del
# host. Ese volumen empieza vacío, así que hay que instalar en cada arranque
# del contenedor; con node_modules ya presente, `npm install` no reinstala
# nada y tarda menos de un segundo.
echo "Instalando dependencias de Node..."
npm install

exec "$@"
