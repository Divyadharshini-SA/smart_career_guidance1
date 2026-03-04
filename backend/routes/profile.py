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
        return {
            'interests'   : [],
            'skills'      : {},
            'personality' : "",
            'career_goal' : "",
            'personality_openness'         : 0,
            'personality_conscientiousness': 0,
            'personality_extraversion'     : 0,
            'personality_agreeableness'    : 0,
            'personality_neuroticism'      : 0,
            'personality_label'            : "Not assessed yet",
        }
    return {
        'interests'   : p.interests,
        'skills'      : p.skills,
        'personality' : p.personality,
        'career_goal' : p.career_goal,
        'personality_openness'         : getattr(p, 'personality_openness', 0)          or 0,
        'personality_conscientiousness': getattr(p, 'personality_conscientiousness', 0) or 0,
        'personality_extraversion'     : getattr(p, 'personality_extraversion', 0)      or 0,
        'personality_agreeableness'    : getattr(p, 'personality_agreeableness', 0)     or 0,
        'personality_neuroticism'      : getattr(p, 'personality_neuroticism', 0)       or 0,
        'personality_label'            : _big_five_label(p),
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

    if hasattr(p, 'personality_openness'): getattr(data, 'personality_openness', None) and setattr(p, 'personality_openness', data.personality_openness)
    if hasattr(p, 'personality_conscientiousness'): getattr(data, 'personality_conscientiousness', None) and setattr(p, 'personality_conscientiousness', data.personality_conscientiousness)
    if hasattr(p, 'personality_extraversion'): getattr(data, 'personality_extraversion', None) and setattr(p, 'personality_extraversion', data.personality_extraversion)
    if hasattr(p, 'personality_agreeableness'): getattr(data, 'personality_agreeableness', None) and setattr(p, 'personality_agreeableness', data.personality_agreeableness)
    if hasattr(p, 'personality_neuroticism'): getattr(data, 'personality_neuroticism', None) and setattr(p, 'personality_neuroticism', data.personality_neuroticism)

    db.commit()
    return {'message': 'Profile updated'}


def _big_five_label(p: UserProfile) -> str:
    scores = {
        'Openness'         : getattr(p, 'personality_openness', 0)          or 0,
        'Conscientiousness': getattr(p, 'personality_conscientiousness', 0) or 0,
        'Extraversion'     : getattr(p, 'personality_extraversion', 0)      or 0,
        'Agreeableness'    : getattr(p, 'personality_agreeableness', 0)     or 0,
        'Neuroticism'      : getattr(p, 'personality_neuroticism', 0)       or 0,
    }
    if all(v == 0 for v in scores.values()):
        return "Not assessed yet"
    dominant = max(scores, key=scores.get)
    labels = {
        'Openness'         : 'Creative & Curious',
        'Conscientiousness': 'Organized & Dependable',
        'Extraversion'     : 'Outgoing & Energetic',
        'Agreeableness'    : 'Cooperative & Friendly',
        'Neuroticism'      : 'Emotionally Sensitive',
    }
    return labels[dominant]
    @router.get('/')
    def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
        p = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        if not p:
            # Return empty profile instead of 404 — frontend handles missing data
            return {
                'interests': [], 'skills': {}, 'personality': {}, 'career_goal': '',
                'personality_openness': 0, 'personality_conscientiousness': 0,
                'personality_extraversion': 0, 'personality_agreeableness': 0,
                'personality_neuroticism': 0, 'personality_label': 'Not assessed yet',
            }
        return {
            'interests'   : p.interests or [],
            'skills'      : p.skills    or {},
            'personality' : p.personality or {},
            'career_goal' : p.career_goal or '',
            'personality_openness'         : p.personality_openness          or 0,
            'personality_conscientiousness': p.personality_conscientiousness or 0,
            'personality_extraversion'     : p.personality_extraversion      or 0,
            'personality_agreeableness'    : p.personality_agreeableness     or 0,
            'personality_neuroticism'      : p.personality_neuroticism       or 0,
            'personality_label'            : _big_five_label(p),
        }

# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
# from database import get_db
# from models import UserProfile, User
# from schemas import ProfileUpdateSchema
# from dependencies import get_current_user

# router = APIRouter()

# @router.get('/')
# def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
#     p = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
#     if not p:
#         raise HTTPException(status_code=404, detail='Profile not found')
#     return {
#         'interests'  : p.interests,
#         'skills'     : p.skills,
#         'personality': p.personality,
#         'career_goal': p.career_goal
#     }

# @router.put('/')
# def update_profile(
#     data        : ProfileUpdateSchema,
#     current_user: User    = Depends(get_current_user),
#     db          : Session = Depends(get_db)
# ):
#     p = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
#     if not p:
#         p = UserProfile(user_id=current_user.id)
#         db.add(p)

#     if data.interests   is not None: p.interests   = data.interests
#     if data.skills      is not None: p.skills      = data.skills
#     if data.personality is not None: p.personality = data.personality
#     if data.career_goal is not None: p.career_goal = data.career_goal

#     db.commit()
#     return {'message': 'Profile updated'}
