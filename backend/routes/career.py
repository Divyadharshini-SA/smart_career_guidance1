from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import UserProfile, Assessment, Resume, CareerRecommendation, User
from dependencies import get_current_user
from ml.career_engine import CareerEngine

router = APIRouter()

@router.get('/recommend')
def recommend(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    uid     = current_user.id
    profile = db.query(UserProfile).filter(UserProfile.user_id == uid).first()
    resume  = db.query(Resume).filter(Resume.user_id == uid)\
                .order_by(Resume.uploaded_at.desc()).first()

    apt_rec  = db.query(Assessment).filter(Assessment.user_id == uid, Assessment.type == 'aptitude')\
                 .order_by(Assessment.taken_at.desc()).first()
    tech_rec = db.query(Assessment).filter(Assessment.user_id == uid, Assessment.type == 'technical')\
                 .order_by(Assessment.taken_at.desc()).first()

    engine = CareerEngine()
    result = engine.predict(
        skills         = profile.skills    if profile  else {},
        interests      = profile.interests if profile  else [],
        aptitude_score = apt_rec.percentage if apt_rec else 0,
        resume_skills  = resume.extracted_skills if resume else [],
        tech_score     = tech_rec.percentage if tech_rec else 0
    )

    db.add(CareerRecommendation(
        user_id              = uid,
        top_careers          = result['top_careers'],
        skill_match_score    = result['skill_match_score'],
        aptitude_score       = result.get('aptitude_score', 0),
        interest_match_score = result['interest_match_score'],
        confidence_score     = result['confidence_score']
    ))
    db.commit()
    return result

@router.get('/history')
def history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    records = db.query(CareerRecommendation)\
                .filter(CareerRecommendation.user_id == current_user.id)\
                .order_by(CareerRecommendation.generated_at.desc()).all()
    return [{
        'top_careers'     : r.top_careers,
        'confidence_score': r.confidence_score,
        'generated_at'    : r.generated_at.isoformat()
    } for r in records]
