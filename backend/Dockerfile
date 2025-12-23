FROM python:3.12-slim

WORKDIR /app

RUN pip install uv

# Copy from backend/ directory since Railway's build context is the repo root
COPY backend/pyproject.toml backend/uv.lock ./

RUN uv sync

# Copy the app directory from backend/
COPY backend/app ./app

CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]