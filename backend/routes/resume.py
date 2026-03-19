import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models import Resume, Progress, User
from dependencies import get_current_user
from schemas import MatchJDSchema
from services.resume_service import ResumeService

router      = APIRouter()
UPLOAD_DIR  = os.path.join(os.path.dirname(__file__), '..', 'uploads')
ALLOWED_EXT = {'pdf', 'doc', 'docx'}
os.makedirs(UPLOAD_DIR, exist_ok=True)

def allowed(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT

@router.post('/upload', status_code=201)
async def upload_resume(
    file        : UploadFile    = File(...),
    current_user: User          = Depends(get_current_user),
    db          : Session       = Depends(get_db)
):
    if not allowed(file.filename):
        raise HTTPException(status_code=400, detail='Invalid file type. Use PDF or DOC/DOCX')

    filename  = f"user_{current_user.id}_{file.filename}"
    save_path = os.path.join(UPLOAD_DIR, filename)

    with open(save_path, 'wb') as f:
        f.write(await file.read())

    service = ResumeService()
    text    = service.extract_text(save_path)
    skills  = service.extract_skills(text)
    score   = service.calculate_resume_score(text, skills)

    db.add(Resume(
        user_id          = current_user.id,
        filename         = filename,
        extracted_text   = text,
        extracted_skills = skills,
        resume_score     = score
    ))

    prog = db.query(Progress).filter(Progress.user_id == current_user.id).first()
    if prog:
        prog.resume_score        = score
        prog.placement_readiness = round(
            (prog.skill_score * 0.4) + (prog.aptitude_score * 0.3) +
            (score * 0.2) + (prog.roadmap_completion * 0.1), 2
        )

    db.commit()
    feedback = service.generate_feedback(text, skills, score)
    return {
        'message'         : 'Resume uploaded and analyzed',
        'extracted_skills': skills,
        'resume_score'    : score,
        'feedback'        : feedback,
    }

@router.get('/latest')
def latest_resume(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id)\
               .order_by(Resume.uploaded_at.desc()).first()
    if not resume:
        raise HTTPException(status_code=404, detail='No resume found')
    service  = ResumeService()
    text     = resume.extracted_text or ''
    feedback = service.generate_feedback(text, resume.extracted_skills or [], resume.resume_score or 0)
    return {
        'filename'        : resume.filename,
        'extracted_skills': resume.extracted_skills,
        'resume_score'    : resume.resume_score,
        'uploaded_at'     : resume.uploaded_at.isoformat(),
        'feedback'        : feedback,
    }

@router.post('/match-jd')
def match_jd(data: MatchJDSchema, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id)\
               .order_by(Resume.uploaded_at.desc()).first()
    if not resume:
        raise HTTPException(status_code=404, detail='No resume found. Please upload one first.')
    
    service = ResumeService()
    text = resume.extracted_text or ''
    
    match_score = service.tfidf_match(text, data.job_description)
    jd_skills = service.extract_skills(data.job_description.lower())
    resume_skills = set([s.lower() for s in (resume.extracted_skills or [])])
    
    matched_skills = [s for s in jd_skills if s.lower() in resume_skills]
    missing_skills = [s for s in jd_skills if s.lower() not in resume_skills]
    
    return {
        'match_score'   : match_score,
        'matched_skills': matched_skills,
        'missing_skills': missing_skills
    }

# import os
# from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
# from sqlalchemy.orm import Session
# from database import get_db
# from models import Resume, Progress, User
# from dependencies import get_current_user
# from services.resume_service import ResumeService

# router      = APIRouter()
# UPLOAD_DIR  = os.path.join(os.path.dirname(__file__), '..', 'uploads')
# ALLOWED_EXT = {'pdf', 'doc', 'docx'}
# os.makedirs(UPLOAD_DIR, exist_ok=True)

# def allowed(filename: str) -> bool:
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT

# @router.post('/upload', status_code=201)
# async def upload_resume(
#     file        : UploadFile    = File(...),
#     current_user: User          = Depends(get_current_user),
#     db          : Session       = Depends(get_db)
# ):
#     if not allowed(file.filename):
#         raise HTTPException(status_code=400, detail='Invalid file type. Use PDF or DOC/DOCX')

#     filename  = f"user_{current_user.id}_{file.filename}"
#     save_path = os.path.join(UPLOAD_DIR, filename)

#     with open(save_path, 'wb') as f:
#         f.write(await file.read())

#     service = ResumeService()
#     text    = service.extract_text(save_path)
#     skills  = service.extract_skills(text)
#     score   = service.calculate_resume_score(text, skills)

#     db.add(Resume(
#         user_id          = current_user.id,
#         filename         = filename,
#         extracted_text   = text,
#         extracted_skills = skills,
#         resume_score     = score
#     ))

#     prog = db.query(Progress).filter(Progress.user_id == current_user.id).first()
#     if prog:
#         prog.resume_score        = score
#         prog.placement_readiness = round(
#             (prog.skill_score * 0.4) + (prog.aptitude_score * 0.3) +
#             (score * 0.2) + (prog.roadmap_completion * 0.1), 2
#         )

#     db.commit()
#     return {'message': 'Resume uploaded and analyzed', 'extracted_skills': skills, 'resume_score': score}

# @router.get('/latest')
# def latest_resume(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
#     resume = db.query(Resume).filter(Resume.user_id == current_user.id)\
#                .order_by(Resume.uploaded_at.desc()).first()
#     if not resume:
#         raise HTTPException(status_code=404, detail='No resume found')
#     return {
#         'filename'        : resume.filename,
#         'extracted_skills': resume.extracted_skills,
#         'resume_score'    : resume.resume_score,
#         'uploaded_at'     : resume.uploaded_at.isoformat()
#     }
