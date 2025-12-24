# Етап 1: Білд фронтенду
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/. .
RUN npm run build

# Етап 2: Підготовка бекенду з повним .venv
FROM python:3.12-slim AS backend-build
WORKDIR /app

RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir uv

COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --frozen

COPY backend/app ./app

# Етап 3: Фінальний образ
FROM nginx:alpine

# Копіюємо зібраний фронтенд
COPY --from=frontend-build /frontend/dist /usr/share/nginx/html

# Копіюємо nginx конфіг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Встановлюємо тільки Python (без pip, щоб уникнути проблем)
RUN apk add --no-cache python3

# Копіюємо весь бекенд з .venv
WORKDIR /app
COPY --from=backend-build /app /app

# ЯВНО додаємо шлях до bin віртуального оточення
ENV PATH="/app/.venv/bin:$PATH"

# Експонуємо порт 80 (Nginx)
EXPOSE 80

# Запускаємо Nginx у foreground, потім бекенд
# & — фоновий режим для Nginx, основний процес — uvicorn (важливо для Docker)
CMD nginx -g 'daemon off;' & uvicorn app.main:app --host 0.0.0.0 --port 8000