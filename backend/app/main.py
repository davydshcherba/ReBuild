from fastapi import FastAPI, HTTPException, Depends, Response
from authx import AuthX, AuthXConfig, RequestToken
from .core.database import Base, engine, get_db
from .core.models import UserModel , ExerciseModel
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from pydantic import BaseModel
from datetime import date
import os

config = AuthXConfig(
    JWT_ALGORITHM="HS256",
    JWT_SECRET_KEY=os.getenv("SECRET_KEY", "SECRET_KEY"),  
    JWT_TOKEN_LOCATION=["cookies"],
    JWT_ACCESS_TOKEN_EXPIRES=36000000,
    JWT_ACCESS_COOKIE_NAME="access_token_cookie",
    JWT_COOKIE_SECURE=False,  # False for local development (HTTP), True for production (HTTPS)
    JWT_COOKIE_SAMESITE="lax",  # "lax" for local development, "none" for cross-origin in production (requires Secure=True)
    JWT_COOKIE_CSRF_PROTECT=False
)

auth = AuthX(config=config)
app = FastAPI(title="My API")
Base.metadata.create_all(engine)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



# CORS configuration - must specify exact origins when using credentials
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",  # Vite default port (fallback)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class ExerciseRequest(BaseModel):
    name: str
    group: str
    date: date

@app.post("/login")
def login(response: Response, request: LoginRequest, db: Session = Depends(get_db)):
    stmt = select(UserModel).where(UserModel.username == request.username)
    user = db.scalar(stmt)

    if not user:
        raise HTTPException(status_code=401, detail={"message": "Invalid credentials"})
    
    password_bytes = request.password.encode("utf-8")[:72]
    is_correct_password = pwd_context.verify(password_bytes, user.hashed_password)

    if is_correct_password:
        token = auth.create_access_token(uid=str(user.id))  
        auth.set_access_cookies(
            response=response,
            token=token
        )   
        return {"access_token": token}
    
    raise HTTPException(status_code=401, detail={"message": "Invalid credentials"})

@app.post("/register")
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    stmt = select(UserModel).where(UserModel.username == request.username)
    existing_user = db.scalar(stmt)

    if existing_user:
        raise HTTPException(
            status_code=400, detail={"message": "Username already exists"}
        )

    password_bytes = request.password.encode("utf-8")[:72]
    hashed_password = pwd_context.hash(password_bytes)

    new_user = UserModel(username=request.username, hashed_password=hashed_password, email=request.email)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

@app.get("/me")
def me(token: RequestToken = Depends(auth.access_token_required), db: Session = Depends(get_db)):
    user = db.execute(
        select(UserModel).where(UserModel.id == int(token.sub))
    ).scalars().first()

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "exercises": [
            {
                "id": e.id,
                "name": e.name,
                "group": e.group,
                "date": e.exercise_date.isoformat()
            }
            for e in user.exercises
        ]
    }

@app.post("/exercises")
def create_exercise(request: ExerciseRequest, db: Session = Depends(get_db), token: RequestToken = Depends(auth.access_token_required)):
    new_exercise = ExerciseModel(
        name=request.name,
        group=request.group,
        exercise_date=request.date,
        user_id=int(token.sub)
    )
    db.add(new_exercise)
    db.commit()
    return {"message": "Exercise created successfully"}