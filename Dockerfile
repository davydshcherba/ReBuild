# Етап 1: Білд фронтенду
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/. .
RUN npm run build

# Етап 2: Підготовка бекенду (залежності + код)
FROM python:3.12-slim AS backend-build
WORKDIR /app

# Встановлюємо залежності для компіляції (psycopg2 тощо)
RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# Встановлюємо uv
RUN pip install --no-cache-dir uv

# Копіюємо тільки файли залежностей і синхронізуємо
COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --frozen

# Копіюємо код бекенду
COPY backend/app ./app

# Етап 3: Фінальний образ — на базі python:3.12-slim
FROM python:3.12-slim

WORKDIR /app

# Встановлюємо nginx
RUN apt-get update && \
    apt-get install -y nginx libpq5 && \
    rm -rf /var/lib/apt/lists/*

# Копіюємо бекенд з готовим .venv
COPY --from=backend-build /app /app

# Копіюємо зібраний фронтенд в nginx html
COPY --from=frontend-build /frontend/dist /usr/share/nginx/html

# Копіюємо nginx конфіг (має бути в корені або backend/, залежно від розташування Dockerfile)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Додаємо .venv в PATH
ENV PATH="/app/.venv/bin:$PATH"

# Експонуємо порт 80
EXPOSE 80

# Запускаємо nginx у foreground + uvicorn
CMD sh -c "nginx -g 'daemon off;' & uvicorn app.main:app --host 0.0.0.0 --port 8000"