from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.models import User

# ✅ Import chat router
from app.routes.chat import router as chat_router

# 🏗️ Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# 🌐 CORS (React frontend)
origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===========================
# ✅ REGISTER API
# ===========================
@app.post("/register")
def register(data: dict, db: Session = Depends(get_db)):
    email = data["email"]
    password = data["password"]

    # check if user exists
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = User(email=email, password=password)
    db.add(new_user)
    db.commit()

    return {"message": "Registered successfully"}


# ===========================
# ✅ LOGIN API
# ===========================
@app.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    email = data["email"]
    password = data["password"]

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if user.password != password:
        raise HTTPException(status_code=400, detail="Wrong password")

    return {"message": "Login successful"}


# ===========================
# ✅ LOAD CHAT HISTORY
# ===========================
@app.get("/history/{email}")
def get_history(email: str, db: Session = Depends(get_db)):
    from app.models import Chat

    chats = db.query(Chat)\
        .filter(Chat.email == email)\
        .order_by(Chat.id.asc())\
        .all()

    return chats


# ===========================
# ✅ INCLUDE CHAT ROUTER
# ===========================
app.include_router(chat_router)