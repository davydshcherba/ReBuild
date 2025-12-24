from fastapi import FastAPI, HTTPException, Depends
from authx import AuthX, AuthXConfig
from .core.database import Base, engine, User
from sqlalchemy import select
from sqlalchemy.orm import Session

config = AuthXConfig(
    JWT_ALGORITHM="HS256",
    JWT_SECRET_KEY="SECRET_KEY",  
    JWT_TOKEN_LOCATION=["headers"],
)

auth = AuthX(config=config)
app = FastAPI(title="My API")
Base.metadata.create_all(engine)


def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


@app.post('/login')  
def login(username: str, password: str, db: Session = Depends(get_db)):
    stmt = select(User).where(User.username == username)
    user = db.scalar(stmt)
    
    if user and user.hashed_password == password:
        token = auth.create_access_token(uid=username)
        return {"access_token": token}
    
    raise HTTPException(status_code=401, detail={"message": "Invalid credentials"})

@app.post("/register")
def register(username: str, email: str, password: str, db: Session = Depends(get_db)):
    stmt = select(User).where(User.username == username)
    existing_user = db.scalar(stmt)
    
    if existing_user:
        raise HTTPException(status_code=400, detail={"message": "Username already exists"})
    
    new_user = User(username=username, hashed_password=password, email=email)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}