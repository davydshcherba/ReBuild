from fastapi import FastAPI, HTTPException, Depends
from authx import AuthX, AuthXConfig
from .core.database import Base, engine, get_db
from .core.models import User
from sqlalchemy import select
from sqlalchemy.orm import Session
from passlib.context import CryptContext

config = AuthXConfig(
    JWT_ALGORITHM="HS256",
    JWT_SECRET_KEY="SECRET_KEY",
    JWT_TOKEN_LOCATION=["headers"],
)

auth = AuthX(config=config)
app = FastAPI(title="My API")
Base.metadata.create_all(engine)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@app.post("/login")
def login(username: str, password: str, db: Session = Depends(get_db)):
    stmt = select(User).where(User.username == username)
    user = db.scalar(stmt)

    if not user:
        raise HTTPException(status_code=401, detail={"message": "Invalid credentials"})

    password_bytes = password.encode("utf-8")[:72]
    is_correct_password = pwd_context.verify(password_bytes, user.hashed_password)

    if is_correct_password:
        token = auth.create_access_token(uid=username)
        return {"access_token": token}

    raise HTTPException(status_code=401, detail={"message": "Invalid credentials"})


@app.post("/register")
def register(username: str, email: str, password: str, db: Session = Depends(get_db)):
    stmt = select(User).where(User.username == username)
    existing_user = db.scalar(stmt)

    if existing_user:
        raise HTTPException(
            status_code=400, detail={"message": "Username already exists"}
        )

    password_bytes = password.encode("utf-8")[:72]
    hashed_password = pwd_context.hash(password_bytes)

    new_user = User(username=username, hashed_password=hashed_password, email=email)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}
