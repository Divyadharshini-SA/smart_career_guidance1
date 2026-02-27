from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Progress, User
from dependencies import get_current_user

router = APIRouter()

@router.get('/')
def get_progress(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    prog = db.query(Progress).filter(Progress.user_id == current_user.id).first()
    if not prog:
        raise HTTPException(status_code=404, detail='Progress not found')
    return {
        'skill_score'            : prog.skill_score,
        'aptitude_score'         : prog.aptitude_score,
        'resume_score'           : prog.resume_score,
        'roadmap_completion'     : prog.roadmap_completion,
        'placement_readiness'    : prog.placement_readiness,
        'completed_roadmap_steps': prog.completed_roadmap_steps or []
    }
