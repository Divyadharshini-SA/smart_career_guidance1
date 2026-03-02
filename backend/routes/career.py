from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import UserProfile, Assessment, Resume, CareerRecommendation, User
from dependencies import get_current_user
from ml.career_engine import CareerEngineV2

router = APIRouter()


def _compute_assessment_trend(records: list) -> str:
    """Compare avg of first-half vs second-half of recent assessments."""
    if len(records) < 4:
        return "stable"
    scores = [r.percentage for r in records]
    mid    = len(scores) // 2
    older  = sum(scores[mid:]) / len(scores[mid:])
    newer  = sum(scores[:mid]) / len(scores[:mid])
    if newer - older >= 5:
        return "improving"
    if older - newer >= 5:
        return "declining"
    return "stable"


@router.get('/recommend')
def recommend(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    uid     = current_user.id
    profile = db.query(UserProfile).filter(UserProfile.user_id == uid).first()
    resume  = db.query(Resume).filter(Resume.user_id == uid)\
                .order_by(Resume.uploaded_at.desc()).first()

    apt_recs  = db.query(Assessment)\
                  .filter(Assessment.user_id == uid, Assessment.type == 'aptitude')\
                  .order_by(Assessment.taken_at.desc()).limit(10).all()
    tech_recs = db.query(Assessment)\
                  .filter(Assessment.user_id == uid, Assessment.type == 'technical')\
                  .order_by(Assessment.taken_at.desc()).limit(10).all()

    apt_score  = apt_recs[0].percentage  if apt_recs  else 0
    tech_score = tech_recs[0].percentage if tech_recs else 0
    apt_trend  = _compute_assessment_trend(apt_recs)

    personality_scores = {}
    if profile:
        personality_scores = {
            "openness"         : profile.personality_openness          or 0,
            "conscientiousness": profile.personality_conscientiousness or 0,
            "extraversion"     : profile.personality_extraversion      or 0,
            "agreeableness"    : profile.personality_agreeableness     or 0,
            "neuroticism"      : profile.personality_neuroticism       or 0,
        }

    engine = CareerEngineV2()
    result = engine.predict(
        skills           = profile.skills    if profile else {},
        interests        = profile.interests if profile else [],
        aptitude_score   = apt_score,
        resume_skills    = resume.extracted_skills if resume else [],
        tech_score       = tech_score,
        assessment_trend = apt_trend,
    )

    result["assessment_trend"]   = apt_trend
    result["personality_scores"] = personality_scores
    result["branch"]             = current_user.branch

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
                .order_by(CareerRecommendation.generated_at.desc())\
                .limit(10).all()
    return [{
        'top_careers'         : r.top_careers,
        'skill_match_score'   : r.skill_match_score,
        'aptitude_score'      : r.aptitude_score,
        'interest_match_score': r.interest_match_score,
        'confidence_score'    : r.confidence_score,
        'generated_at'        : r.generated_at.isoformat()
    } for r in records]


# from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
# from database import get_db
# from models import UserProfile, Assessment, Resume, CareerRecommendation, User
# from dependencies import get_current_user
# from ml.career_engine import CareerEngineV2

# router = APIRouter()

# @router.get('/recommend')
# def recommend(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
#     uid     = current_user.id
#     profile = db.query(UserProfile).filter(UserProfile.user_id == uid).first()
#     resume  = db.query(Resume).filter(Resume.user_id == uid)\
#                 .order_by(Resume.uploaded_at.desc()).first()

#     apt_rec  = db.query(Assessment).filter(Assessment.user_id == uid, Assessment.type == 'aptitude')\
#                  .order_by(Assessment.taken_at.desc()).first()
#     tech_rec = db.query(Assessment).filter(Assessment.user_id == uid, Assessment.type == 'technical')\
#                  .order_by(Assessment.taken_at.desc()).first()

#     engine = CareerEngineV2()
#     result = engine.predict(
#         skills         = profile.skills    if profile  else {},
#         interests      = profile.interests if profile  else [],
#         aptitude_score = apt_rec.percentage if apt_rec else 0,
#         resume_skills  = resume.extracted_skills if resume else [],
#         tech_score     = tech_rec.percentage if tech_rec else 0,
#         branch         = current_user.branch, # Add branch to fix the domain issue
#     )

#     db.add(CareerRecommendation(
#         user_id              = uid,
#         top_careers          = result['top_careers'],
#         skill_match_score    = result['skill_match_score'],
#         aptitude_score       = result.get('aptitude_score', 0),
#         interest_match_score = result['interest_match_score'],
#         confidence_score     = result['confidence_score']
#     ))
#     db.commit()
#     return result

# @router.get('/history')
# def history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
#     records = db.query(CareerRecommendation)\
#                 .filter(CareerRecommendation.user_id == current_user.id)\
#                 .order_by(CareerRecommendation.generated_at.desc()).all()
#     return [{
#         'top_careers'         : r.top_careers,
#         'skill_match_score'   : r.skill_match_score,
#         'aptitude_score'      : r.aptitude_score,
#         'interest_match_score': r.interest_match_score,
#         'confidence_score'    : r.confidence_score,
#         'generated_at'        : r.generated_at.isoformat()
#     } for r in records]
