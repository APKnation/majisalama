FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .
RUN python3 manage.py collectstatic --noinput || true

COPY frontend/ ./frontend/
RUN cd frontend && npm install && npm run build && cd ..

RUN mkdir -p staticfiles/frontend && cp -r frontend/build/* staticfiles/frontend/

EXPOSE 8000

CMD python3 manage.py migrate --noinput && gunicorn watertrack.wsgi:application --bind 0.0.0.0:$PORT
