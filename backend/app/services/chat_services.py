from langchain_groq import ChatGroq
from langchain.prompts import PromptTemplate
from app.config import GROQ_API_KEY
from app.memory.memory_store import get_conversation
from app.database import SessionLocal
from app.models.chat_model import Chat

llm = ChatGroq(
    groq_api_key=GROQ_API_KEY,
    model_name="llama-3.1-8b-instant"
)

prompt = PromptTemplate(
    input_variables=["history", "input"],
    template="""
You are a helpful AI assistant.
Remember user details like name.

Conversation history:
{history}

User: {input}
AI:
"""
)

def chat_with_ai(email, message):
    db = SessionLocal()

    # 👉 Get AI response
    conversation = get_conversation(email, llm, prompt)
    response = conversation.predict(input=message)

    # 👉 Save to DB
    chat = Chat(
        email=email,
        message=message,
        response=response
    )

    db.add(chat)
    db.commit()

    return response