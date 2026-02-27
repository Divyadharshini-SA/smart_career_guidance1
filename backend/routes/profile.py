from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import UserProfile, User
from schemas import ProfileUpdateSchema
from dependencies import get_current_user

router = APIRouter()

@router.get('/')
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not p:
        raise HTTPException(status_code=404, detail='Profile not found')
    return {
        'interests'  : p.interests,
        'skills'     : p.skills,
        'personality': p.personality,
        'career_goal': p.career_goal
    }

@router.put('/')
def update_profile(
    data        : ProfileUpdateSchema,
    current_user: User    = Depends(get_current_user),
    db          : Session = Depends(get_db)
):
    p = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not p:
        p = UserProfile(user_id=current_user.id)
        db.add(p)

    if data.interests   is not None: p.interests   = data.interests
    if data.skills      is not None: p.skills      = data.skills
    if data.personality is not None: p.personality = data.personality
    if data.career_goal is not None: p.career_goal = data.career_goal

    db.commit()
    return {'message': 'Profile updated'}
