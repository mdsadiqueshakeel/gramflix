#!bin/bash
set -e
cd "$(dirname "$0")/.."

echo "📥 Pulling latest code..."
git pull origin master

echo "🐳 Rebuilding containers..."
docker-compose build

echo "🔄 Restarting services..."
docker-compose up -d

echo "✅ Deployment complete!"