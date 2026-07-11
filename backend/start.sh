#!/usr/bin/env bash
set -e

echo "Starting deployment script..."
echo "Python3 location: $(command -v python3 || echo 'NOT FOUND')"
echo "PATH: $PATH"

echo "Running migrations..."
python3 manage.py migrate --noinput

echo "Collecting static files..."
python3 manage.py collectstatic --noinput

echo "Building frontend..."
cd ../frontend
npm install
npm run build

echo "Copying frontend build to static..."
mkdir -p ../staticfiles/frontend
cp -r build/* ../staticfiles/frontend/ || true

echo "Starting gunicorn..."
cd ..
exec gunicorn watertrack.wsgi:application --bind 0.0.0.0:$PORT
