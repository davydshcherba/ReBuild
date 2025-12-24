# Етап 1: Білд фронтенду
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/. .
RUN npm run build

# Етап 2: Підготовка бекенду
FROM python:3.12-slim AS backend-build
WORKDIR /app

RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir uv

COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --frozen

COPY backend/app ./app

# Етап 3: Фінальний образ
FROM python:3.12-slim

WORKDIR /app

# Встановлюємо nginx та runtime залежності
RUN apt-get update && \
    apt-get install -y nginx libpq5 && \
    rm -rf /var/lib/apt/lists/*

# Спочатку очищаємо всі дефолтні конфіги
RUN rm -rf /etc/nginx/conf.d/* && \
    rm -rf /etc/nginx/sites-enabled/* && \
    rm -rf /etc/nginx/sites-available/*

# Копіюємо бекенд з .venv
COPY --from=backend-build /app /app

# Копіюємо фронтенд
COPY --from=frontend-build /frontend/dist /usr/share/nginx/html

# Копіюємо наш повний nginx.conf як головний
COPY nginx.conf /etc/nginx/nginx.conf

# Додаємо .venv в PATH
ENV PATH="/app/.venv/bin:$PATH"

# Експонуємо порт
EXPOSE 80

# Запускаємо nginx (foreground) + uvicorn
CMD ["sh", "-c", "nginx -g 'daemon off;' & uvicorn app.main:app --host 0.0.0.0 --port 8000"]