# Project

## Dev
```bash
docker compose up --build
```

## local
```bash
cd backend

if you use uv
source .venv/bin/activate
uv sync

uvicorn app.main:app --reload 

cd frontend
npm i 
npm run dev
```


