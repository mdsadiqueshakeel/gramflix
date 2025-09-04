#!/usr/bin/env bash
set -e

ENV=${1:-local}  # default to local

if [ "$ENV" = "local" ]; then
  echo "🌱 Running local environment..."
  docker-compose -f docker-compose.local.yml up -d --build
else
  echo "🚀 Running production environment..."
  docker-compose -f docker-compose.prod.yml up -d --build
fi
