# Project

## Dev
```bash
docker compose up --build
```

## local
```bash
cd backend
uvicorn app.main:app --reload 
```

fetch(import.meta.env.VITE_BACKEND_URL + '/some-endpoint')