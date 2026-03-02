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
        'interests'   : p.interests,
        'skills'      : p.skills,
        'personality' : p.personality,
        'career_goal' : p.career_goal,
        'personality_openness'         : p.personality_openness          or 0,
        'personality_conscientiousness': p.personality_conscientiousness or 0,
        'personality_extraversion'     : p.personality_extraversion      or 0,
        'personality_agreeableness'    : p.personality_agreeableness     or 0,
        'personality_neuroticism'      : p.personality_neuroticism       or 0,
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

    if data.personality_openness          is not None: p.personality_openness          = data.personality_openness
    if data.personality_conscientiousness is not None: p.personality_conscientiousness = data.personality_conscientiousness
    if data.personality_extraversion      is not None: p.personality_extraversion      = data.personality_extraversion
    if data.personality_agreeableness     is not None: p.personality_agreeableness     = data.personality_agreeableness
    if data.personality_neuroticism       is not None: p.personality_neuroticism       = data.personality_neuroticism

    db.commit()
    return {'message': 'Profile updated'}


def _big_five_label(p: UserProfile) -> str:
    scores = {
        'Openness'         : p.personality_openness          or 0,
        'Conscientiousness': p.personality_conscientiousness or 0,
        'Extraversion'     : p.personality_extraversion      or 0,
        'Agreeableness'    : p.personality_agreeableness     or 0,
        'Neuroticism'      : p.personality_neuroticism       or 0,
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
