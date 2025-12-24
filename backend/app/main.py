from fastapi import FastAPI, HTTPException, Depends, Response
from authx import AuthX, AuthXConfig, RequestToken
from .core.database import Base, engine, get_db
from .core.models import UserModel , ExerciseModel
from sqlalchemy import select
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import os

config = AuthXConfig(
    JWT_ALGORITHM="HS256",
    JWT_SECRET_KEY=os.getenv("SECRET_KEY", "SECRET_KEY"),  
    JWT_TOKEN_LOCATION=["cookies"],
    JWT_ACCESS_TOKEN_EXPIRES=36000000,
    JWT_ACCESS_COOKIE_NAME="access_token_cookie",
    JWT_COOKIE_SECURE=False, 
    JWT_COOKIE_SAMESITE="lax",
    JWT_COOKIE_CSRF_PROTECT=False
)

auth = AuthX(config=config)
app = FastAPI(title="My API")
Base.metadata.create_all(engine)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@app.post("/login")
def login(response: Response,username: str, password: str, db: Session = Depends(get_db)):
    stmt = select(UserModel).where(UserModel.username == username)
    user = db.scalar(stmt)

    if not user:
        raise HTTPException(status_code=401, detail={"message": "Invalid credentials"})
    
    password_bytes = password.encode("utf-8")[:72]
    is_correct_password = pwd_context.verify(password_bytes, user.hashed_password)

    if is_correct_password:
        token = auth.create_access_token(uid=username)
        auth.set_access_cookies(
            response=response,
            token=token
        )   
        return {"access_token": token}
    
    raise HTTPException(status_code=401, detail={"message": "Invalid credentials"})


@app.post("/register")
def register(username: str, email: str, password: str, db: Session = Depends(get_db)):
    stmt = select(UserModel).where(UserModel.username == username)
    existing_user = db.scalar(stmt)

    if existing_user:
        raise HTTPException(
            status_code=400, detail={"message": "Username already exists"}
        )

    password_bytes = password.encode("utf-8")[:72]
    hashed_password = pwd_context.hash(password_bytes)

    new_user = UserModel(username=username, hashed_password=hashed_password, email=email)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

@app.get("/me")
def me(token: RequestToken = Depends(auth.access_token_required)):
    for db in get_db():
        user = db.execute(
            select(UserModel).where(UserModel.username == token.sub)
        ).scalars().first()

        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            # "favorite_quotes": [
            #     {
            #         "id": q.id,
            #         "text": q.text,
            #         "author": q.author,
            #         "thinking": q.thinking
            #     }
            #     for q in user.favorite_quotes
            # ]
        }


@app.post("/exercises")
def create_exercise(name: str, group: str, user_id: int, db: Session = Depends(get_db)):
    new_exercise = ExerciseModel(name=name, group=group, user_id=user_id)
    db.add(new_exercise)
    db.commit()
    return {"message": "Exercise created successfully"}