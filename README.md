# Project

## Dev
```bash
docker compose up --build
```

## local
```bash
cd backend
uvicorn app.main:app --reload 

cd frontend
npm i 
npm run dev
```


fetch(import.meta.env.VITE_BACKEND_URL + '/some-endpoint')