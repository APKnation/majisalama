#!/usr/bin/env bash
set -e

echo "Starting deployment script..."

cd backend

echo "Running migrations..."
python3 manage.py migrate --noinput

echo "Collecting static files..."
python3 manage.py collectstatic --noinput

cd ..

echo "Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "Copying frontend build to static..."
mkdir -p backend/staticfiles/frontend
cp -r frontend/build/* backend/staticfiles/frontend/ || true

echo "Starting gunicorn..."
cd backend
exec gunicorn watertrack.wsgi:application --bind 0.0.0.0:$PORT
