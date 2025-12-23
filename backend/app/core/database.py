from sqlalchemy import create_engine, text

engine = create_engine("postgresql+psycopg2://postgres:postgres@localhost:5434/app_db")


def db_func():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version();"))
        return result.scalar()