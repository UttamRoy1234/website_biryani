FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies for psycopg and pillow
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    libjpeg-dev \
    zlib1g-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements/ /app/requirements/
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements/production.txt

COPY . /app/

RUN python manage.py collectstatic --noinput || true

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "config.wsgi:application"]
