from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import User, Assessment, CareerRecommendation, Resume, Progress, Question, UserProfile
from schemas import CreateAdminSchema
from dependencies import get_admin_user, get_current_user
from passlib.context import CryptContext
import csv
import io

router  = APIRouter()
pwd_ctx = CryptContext(schemes=['bcrypt'], deprecated='auto')

# ── Platform overview stats ───────────────────────────────────
@router.get('/stats')
def admin_stats(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    total_users       = db.query(User).filter(User.role == 'student').count()
    total_assessments = db.query(Assessment).count()
    total_careers     = db.query(CareerRecommendation).count()
    total_resumes     = db.query(Resume).count()
    total_questions   = db.query(Question).count()

    # Average placement readiness across all students
    avg_readiness = db.query(func.avg(Progress.placement_readiness)).scalar() or 0

    # Question counts by type
    q_counts = {}
    for test_type in ['aptitude', 'technical', 'soft_skill']:
        q_counts[test_type] = db.query(Question).filter(Question.test_type == test_type).count()

    # Top 5 career domains predicted
    recs = db.query(CareerRecommendation).order_by(CareerRecommendation.generated_at.desc()).limit(200).all()
    domain_counter: dict[str, int] = {}
    for r in recs:
        if r.top_careers:
            top = r.top_careers[0].get('domain', 'Unknown')
            domain_counter[top] = domain_counter.get(top, 0) + 1
    
    top_entries = sorted(domain_counter.items(), key=lambda x: x[1], reverse=True)
    top_domains = [top_entries[i] for i in range(min(5, len(top_entries)))]

    return {
        'total_students'        : total_users,
        'total_assessments'     : total_assessments,
        'total_career_predictions': total_careers,
        'total_resumes_uploaded': total_resumes,
        'total_questions'       : total_questions,
        'avg_placement_readiness': float(f"{float(avg_readiness):.1f}"),
        'questions_by_type'     : q_counts,
        'top_predicted_domains' : [{'domain': d, 'count': c} for d, c in top_domains],
    }


# ── List all students ─────────────────────────────────────────
@router.get('/users')
def list_users(
    skip  : int = 0,
    limit : int = 50,
    admin : User    = Depends(get_admin_user),
    db    : Session = Depends(get_db)
):
    users = db.query(User).filter(User.role == 'student')\
              .offset(skip).limit(limit).all()
    result = []
    for u in users:
        prog = db.query(Progress).filter(Progress.user_id == u.id).first()
        result.append({
            'id'                 : u.id,
            'name'               : u.name,
            'email'              : u.email,
            'college'            : u.college,
            'branch'             : u.branch,
            'year'               : u.year,
            'placement_readiness': prog.placement_readiness if prog else 0,
            'aptitude_score'     : prog.aptitude_score      if prog else 0,
            'skill_score'        : prog.skill_score         if prog else 0,
            'resume_score'       : prog.resume_score        if prog else 0,
            'joined'             : u.created_at.isoformat(),
        })
    total = db.query(User).filter(User.role == 'student').count()
    return {'users': result, 'total': total}


# ── Export Students as CSV ────────────────────────────────────
@router.get('/export-users')
def export_users(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    users = db.query(User).filter(User.role == 'student').all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(['id', 'name', 'email', 'college', 'branch', 'year', 'cgpa', 'skill_score', 'aptitude_score', 'resume_score', 'placement_readiness', 'joined'])
    
    for u in users:
        prog = db.query(Progress).filter(Progress.user_id == u.id).first()
        writer.writerow([
            u.id, u.name, u.email, u.college, u.branch, u.year, u.cgpa,
            prog.skill_score if prog else 0,
            prog.aptitude_score if prog else 0,
            prog.resume_score if prog else 0,
            prog.placement_readiness if prog else 0,
            u.created_at.isoformat()
        ])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=users_export.csv"}
    )


# ── Model performance metrics (IEEE paper comparison) ─────────
@router.get('/model-metrics')
def model_metrics(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    return {
        'paper_reference': 'ICAISS 2025, DOI: 10.1109/ICAISS61471.2025.11041827',
        'algorithm_used' : 'LightGBM-Inspired Gradient Boosting Ensemble (CareerEngineV2)',
        'comparison_table': [
            {
                'model'    : 'Decision Tree',
                'accuracy' : 79.2,
                'auc'      : 0.669,
                'precision': 0.2898,
                'f1_score' : 0.2697,
                'source'   : 'IEEE Paper Table 1',
            },
            {
                'model'    : 'Random Forest',
                'accuracy' : 80.42,
                'auc'      : 0.349,
                'precision': 0.2374,
                'f1_score' : 0.2341,
                'source'   : 'IEEE Paper Table 1',
            },
            {
                'model'    : 'XGBoost',
                'accuracy' : 80.1,
                'auc'      : 0.426,
                'precision': 0.2266,
                'f1_score' : 0.2264,
                'source'   : 'IEEE Paper Table 1',
            },
            {
                'model'    : 'LightGBM (Proposed — Paper)',
                'accuracy' : 80.5,
                'auc'      : 0.447,
                'precision': 0.2912,
                'f1_score' : 0.2888,
                'source'   : 'IEEE Paper Table 1',
                'is_paper_model': True,
            },
            {
                'model'    : 'CareerEngineV2 (Your System)',
                'accuracy' : None,   # rule-based ensemble — accuracy measured by user satisfaction
                'auc'      : None,
                'precision': None,
                'f1_score' : None,
                'source'   : 'LightGBM-inspired: 6 weak learners, critical skill penalty, soft skill bonus',
                'is_your_model': True,
            },
        ],
        'engine_features': {
            'weak_learners'       : 6,
            'skill_weighting'     : 'Proficiency 1–10 per skill',
            'aptitude_modifier'   : 'Domain difficulty × aptitude score',
            'critical_penalty'    : 'Up to 50% penalty for missing critical skills',
            'soft_skill_bonus'    : 'Up to +15% for communication, leadership, etc.',
            'transferable_skills' : '1.08–1.15x cross-domain boost',
            'assessment_trend'    : 'Improving/declining modifier ±5%',
            'evidence_generation' : '3–5 human-readable reasoning sentences per career',
        }
    }


# ── Assessment topic management ───────────────────────────────
@router.get('/question-stats')
def question_stats(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    result = {}
    for test_type in ['aptitude', 'technical', 'soft_skill']:
        total  = db.query(Question).filter(Question.test_type == test_type).count()
        topics = db.query(Question.topic, func.count(Question.id))\
                   .filter(Question.test_type == test_type)\
                   .group_by(Question.topic).all()
        result[test_type] = {'total': total, 'topics': {t: c for t, c in topics}}
    return result


# ── Create admin user (secure — requires existing admin JWT) ──
@router.post('/create-admin', status_code=201)
def create_admin(
    data  : CreateAdminSchema,
    admin : User    = Depends(get_admin_user),
    db    : Session = Depends(get_db)
):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=409, detail='Email already registered')
    new_admin = User(
        name          = data.name,
        email         = data.email,
        password_hash = pwd_ctx.hash(data.password),
        role          = 'admin'
    )
    db.add(new_admin)
    db.commit()
    return {'message': f'Admin user {data.email} created successfully'}


# ── Delete a student (admin only) ─────────────────────────────
@router.delete('/users/{user_id}')
def delete_user(
    user_id: int,
    admin  : User    = Depends(get_admin_user),
    db     : Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id, User.role == 'student').first()
    if not user:
        raise HTTPException(status_code=404, detail='Student not found')
    db.delete(user)
    db.commit()
    return {'message': f'User {user_id} deleted'}