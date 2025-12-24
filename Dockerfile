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

RUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*

# Встановлюємо uv глобально (в slim це працює нормально)
RUN pip install --no-cache-dir uv

COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --frozen

COPY backend/app ./app

# Етап 3: Фінальний образ — Nginx + бекенд з готовим .venv
FROM nginx:alpine

# Копіюємо фронтенд
COPY --from=frontend-build /frontend/dist /usr/share/nginx/html

# Копіюємо nginx конфіг
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Встановлюємо Python 3
RUN apk add --no-cache python3

# Копіюємо весь бекенд з backend-build (включаючи .venv з uv sync)
WORKDIR /app
COPY --from=backend-build /app /app

# Додаємо шлях до віртуального оточення uv в PATH
ENV PATH="/app/.venv/bin:$PATH"

# Експонуємо порт Nginx
EXPOSE 80

# Запускаємо Nginx у foreground + Uvicorn
CMD sh -c "nginx -g 'daemon off;' & uvicorn app.main:app --host 0.0.0.0 --port 8000"