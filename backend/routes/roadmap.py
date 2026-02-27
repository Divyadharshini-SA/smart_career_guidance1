from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Roadmap, SkillGap, Progress, User
from schemas import RoadmapSchema, CompleteStepSchema
from dependencies import get_current_user
from ml.skill_gap_engine import SkillGapEngine

router = APIRouter()

@router.post('/generate')
def generate_roadmap(
    data        : RoadmapSchema,
    current_user: User    = Depends(get_current_user),
    db          : Session = Depends(get_db)
):
    engine    = SkillGapEngine()
    gap_data  = engine.analyze(current_user.id, data.career_domain, db)
    roadmap   = engine.generate_roadmap(data.career_domain, gap_data['missing_skills'])

    db.add(SkillGap(
        user_id         = current_user.id,
        career_domain   = data.career_domain,
        required_skills = gap_data['required_skills'],
        current_skills  = gap_data['current_skills'],
        missing_skills  = gap_data['missing_skills'],
        gap_percentage  = gap_data['gap_percentage']
    ))
    db.add(Roadmap(
        user_id       = current_user.id,
        career_domain = data.career_domain,
        steps         = roadmap['steps'],
        timeline      = roadmap['timeline']
    ))
    db.commit()
    return {'skill_gap': gap_data, 'roadmap': roadmap}

@router.get('/latest')
def latest(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rm = db.query(Roadmap).filter(Roadmap.user_id == current_user.id)\
           .order_by(Roadmap.generated_at.desc()).first()
    sg = db.query(SkillGap).filter(SkillGap.user_id == current_user.id)\
           .order_by(SkillGap.analyzed_at.desc()).first()
    if not rm:
        raise HTTPException(status_code=404, detail='No roadmap found. Generate one first.')
    return {
        'roadmap'  : {'steps': rm.steps, 'timeline': rm.timeline, 'career_domain': rm.career_domain},
        'skill_gap': {'missing_skills': sg.missing_skills, 'gap_percentage': sg.gap_percentage} if sg else {}
    }

@router.post('/complete-step')
def complete_step(
    data        : CompleteStepSchema,
    current_user: User    = Depends(get_current_user),
    db          : Session = Depends(get_db)
):
    prog = db.query(Progress).filter(Progress.user_id == current_user.id).first()
    if not prog:
        raise HTTPException(status_code=404, detail='Progress not found')

    completed = prog.completed_roadmap_steps or []
    if data.step not in completed:
        completed.append(data.step)
        prog.completed_roadmap_steps = completed

    rm = db.query(Roadmap).filter(Roadmap.user_id == current_user.id)\
           .order_by(Roadmap.generated_at.desc()).first()
    if rm:
        all_steps = (rm.steps.get('beginner', []) +
                     rm.steps.get('intermediate', []) +
                     rm.steps.get('advanced', []))
        prog.roadmap_completion = round(len(completed) / max(len(all_steps), 1) * 100, 2)

    db.commit()
    return {'roadmap_completion': prog.roadmap_completion}
