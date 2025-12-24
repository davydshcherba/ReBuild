from fastapi import FastAPI
from .core.database import db_func 

app = FastAPI(title="My API")

