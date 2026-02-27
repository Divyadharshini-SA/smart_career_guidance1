from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import ChatSchema
from dependencies import get_current_user
from services.chatbot_service import ChatbotService

router  = APIRouter()
service = ChatbotService()

@router.post('/ask')
def ask(data: ChatSchema, current_user: User = Depends(get_current_user)):
    if not data.message.strip():
        raise HTTPException(status_code=400, detail='Empty message')
    response = service.get_response(current_user.id, data.message.strip())
    return {'response': response}

@router.get('/history')
def history(current_user: User = Depends(get_current_user)):
    return {'history': service.get_history(current_user.id)}
