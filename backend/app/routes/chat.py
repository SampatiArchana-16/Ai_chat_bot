from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Chat

from dotenv import load_dotenv
import os
from groq import Groq
import uuid

load_dotenv()

router = APIRouter()

print("API KEY:", os.getenv("GROQ_API_KEY"))

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


# ================= CHAT =================
@router.post("/chat")
def chat(data: dict, db: Session = Depends(get_db)):

    email = data["email"]
    message = data["message"]
    session_id = data.get("session_id")

    # 🆕 create session if first message
    if not session_id:
        session_id = str(uuid.uuid4())

    # 💾 save user message
    db.add(Chat(
        email=email,
        role="user",
        message=message,
        session_id=session_id
    ))
    db.commit()

    # 🧠 get chat history
    history = db.query(Chat)\
        .filter(Chat.session_id == session_id)\
        .order_by(Chat.id.asc())\
        .all()

    # 🧠 prepare messages for AI
    messages = [
        {
            "role": "system",
            "content": "You are a helpful AI assistant. Keep answers short and natural."
        }
    ]

    for h in history:
        role = "assistant" if h.role == "bot" else "user"
        messages.append({
            "role": role,
            "content": h.message
        })

    # 🤖 AI call
    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=messages
    )

    bot_reply = response.choices[0].message.content

    # 💾 save bot reply
    db.add(Chat(
        email=email,
        role="bot",
        message=bot_reply,
        session_id=session_id
    ))
    db.commit()

    # ✅ IMPORTANT RESPONSE
    return {
        "response": bot_reply,
        "session_id": session_id
    }


# ================= GET SESSIONS =================
@router.get("/sessions/{email}")
def get_sessions(email: str, db: Session = Depends(get_db)):

    sessions = db.query(Chat.session_id)\
        .filter(Chat.email == email)\
        .distinct()\
        .all()

    result = []

    for s in sessions:
        session_id = s[0]

        # 👉 get FIRST message of that session
        first_chat = db.query(Chat)\
            .filter(Chat.session_id == session_id)\
            .order_by(Chat.id.asc())\
            .first()

        title = first_chat.message[:30] if first_chat else "New Chat"

        result.append({
            "id": session_id,
            "title": title
        })

    return result

# ================= LOAD CHAT =================
@router.get("/chat/{session_id}")
def get_chat(session_id: str, db: Session = Depends(get_db)):

    chats = db.query(Chat)\
        .filter(Chat.session_id == session_id)\
        .order_by(Chat.id.asc())\
        .all()

    # ✅ FIX: convert to frontend format
    return [
        {
            "role": "assistant" if c.role == "bot" else "user",
            "content": c.message
        }
        for c in chats
    ]