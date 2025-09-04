#!/bin/bash
set -e

BACKEND_REPO=referral-wallet-system
FRONTEND_REPO=my-app
TAG=$(date +%s)

echo "🚀 Building backend..."
docker build -t $BACKEND_REPO ./referral-wallet-system

echo "🚀 Building frontend..."
docker build -t $FRONTEND_REPO ./my-app

echo $TAG > .tag
echo "✅ Build complete. Tag = $TAG"