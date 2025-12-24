import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import Session

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
    DB_NAME = os.getenv("DB_NAME", "app_db")
    DB_PORT = os.getenv("DB_PORT", "5434")
    DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
Base = declarative_base()


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


