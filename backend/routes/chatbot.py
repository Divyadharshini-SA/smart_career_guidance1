from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, UserProfile, Progress, SkillGap, CareerRecommendation
from schemas import ChatSchema
from dependencies import get_current_user
from services.chatbot_service import ChatbotService
import os

router  = APIRouter()
service = ChatbotService()

def _build_user_profile(current_user: User, db: Session) -> dict:
    try:
        # Fetch data from all 4 required tables
        profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        progress = db.query(Progress).filter(Progress.user_id == current_user.id).first()
        skill_gap = db.query(SkillGap).filter(SkillGap.user_id == current_user.id).first()
        
        # Get the latest career recommendation ordered by generated_at desc
        latest_career = db.query(CareerRecommendation).filter(
            CareerRecommendation.user_id == current_user.id
        ).order_by(CareerRecommendation.generated_at.desc()).first()

        # Handle potential None cases for each query result with default values
        skills      = profile.skills if profile and profile.skills else {}
        career_goal = profile.career_goal if profile and profile.career_goal else 'Not set yet'
        
        top_predicted_career = 'Not predicted yet'
        if latest_career and latest_career.top_careers and len(latest_career.top_careers) > 0:
            # Safely navigate the JSON structure
            top_best = latest_career.top_careers[0]
            if isinstance(top_best, dict):
                top_predicted_career = top_best.get('domain') or 'Not predicted yet'

        placement_readiness = progress.placement_readiness if progress and progress.placement_readiness else 0
        aptitude_score      = progress.aptitude_score if progress and progress.aptitude_score else 0
        resume_score        = progress.resume_score if progress and progress.resume_score else 0
        
        missing_skills = skill_gap.missing_skills if skill_gap and skill_gap.missing_skills else []
        core_missing   = [s for i, s in enumerate(missing_skills) if i < 5] if missing_skills else []

        return {
            'skills'              : skills,
            'career_goal'         : career_goal,
            'top_predicted_career': top_predicted_career,
            'placement_readiness' : placement_readiness,
            'aptitude_score'      : aptitude_score,
            'resume_score'        : resume_score,
            'core_missing'        : core_missing,
            'branch'              : current_user.branch or 'Not set',
            'year'                : current_user.year or 'Not set',
            'cgpa'                : current_user.cgpa or 0,
        }
    except Exception as e:
        # Log error locally if needed and return safe defaults to avoid breaking the chatbot
        print(f"[Chatbot] Error building profile: {e}")
        return {
            'skills'              : {},
            'career_goal'         : 'Not set yet',
            'top_predicted_career': 'Not predicted yet',
            'placement_readiness' : 0,
            'aptitude_score'      : 0,
            'resume_score'        : 0,
            'core_missing'        : [],
            'branch'              : current_user.branch or 'Not set',
            'year'                : current_user.year or 'Not set',
            'cgpa'                : current_user.cgpa or 0,
        }

@router.post('/ask')
def ask(data: ChatSchema, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not data.message.strip():
        raise HTTPException(status_code=400, detail='Empty message')
    
    # Debug print statement to verify API key status in uvicorn terminal
    key = str(os.getenv('GEMINI_API_KEY', ''))
    print(f'[Chatbot] Key loaded: {bool(key)} | length: {len(key)}')

    # Build the personalized user profile context
    user_profile = _build_user_profile(current_user, db)
    
    # Call the service with all 3 required arguments
    response = service.get_response(current_user.id, data.message.strip(), user_profile)
    
    return {'response': response}

@router.get('/history')
def history(current_user: User = Depends(get_current_user)):
    return {'history': service.get_history(current_user.id)}
