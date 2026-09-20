#!/usr/bin/env sh
set -eu
if [ ! -f .env ]; then echo "Créez .env à partir de .env.example"; exit 1; fi
docker compose up -d --build
echo "Campus disponible sur http://localhost:3000"
