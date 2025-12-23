from fastapi import FastAPI
from .core.database import db_func #! Test Function

app = FastAPI(title="My API")

@app.get("/health")
def health():
    result = db_func()
    return {"result": result}