from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
import random, csv, io
from database import get_db
from models import Assessment, Progress, Question, User
from schemas import SubmitSchema, AddQuestionSchema
from dependencies import get_current_user, get_admin_user

router = APIRouter()

# ── ADMIN: Upload questions via CSV ───────────────────────────
@router.post('/upload-questions', status_code=201)
def upload_questions(
    file: UploadFile = File(...),
    admin: User      = Depends(get_admin_user),
    db: Session      = Depends(get_db)
):
    content = file.file.read().decode('utf-8')
    reader  = csv.reader(io.StringIO(content))
    added, skipped, errors = 0, 0, []

    for i, row in enumerate(reader, 1):
        if i == 1 and row[0].strip().lower() in ['test_type', 'type']:
            continue
        if len(row) < 9:
            errors.append(f'Row {i}: need 9 columns, got {len(row)}')
            continue
        try:
            db.add(Question(
                test_type = row[0].strip().lower(),
                topic     = row[1].strip(),
                level     = row[2].strip().lower(),
                question  = row[3].strip(),
                option_a  = row[4].strip(),
                option_b  = row[5].strip(),
                option_c  = row[6].strip(),
                option_d  = row[7].strip(),
                answer    = row[8].strip(),
                source    = row[9].strip() if len(row) > 9 else 'csv'
            ))
            added += 1
        except Exception as e:
            errors.append(f'Row {i}: {e}')
            skipped += 1

    db.commit()
    return {'message': f'{added} questions added, {skipped} skipped', 'errors': errors[:10]}


# ── ADMIN: Add single question ────────────────────────────────
@router.post('/add-question', status_code=201)
def add_question(
    data : AddQuestionSchema,
    admin: User    = Depends(get_admin_user),
    db   : Session = Depends(get_db)
):
    q = Question(**data.dict())
    db.add(q)
    db.commit()
    db.refresh(q)
    return {'message': 'Question added', 'id': q.id}


# ── ADMIN: Stats ──────────────────────────────────────────────
@router.get('/stats')
def stats(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    result = {}
    for test_type in ['aptitude', 'technical', 'soft_skill']:
        total  = db.query(Question).filter_by(test_type=test_type).count()
        topics = db.query(Question.topic, func.count(Question.id))\
                   .filter(Question.test_type == test_type)\
                   .group_by(Question.topic).all()
        result[test_type] = {'total': total, 'topics': {t: c for t, c in topics}}
    return result


# ── ADMIN: Get topics ─────────────────────────────────────────
@router.get('/topics/{test_type}')
def get_topics(test_type: str, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    topics = db.query(Question.topic).filter(Question.test_type == test_type).distinct().all()
    return {'topics': [t[0] for t in topics]}


# ── STUDENT: Get questions ────────────────────────────────────
@router.get('/questions/{test_type}')
def get_questions(
    test_type: str,
    level    : str = 'all',
    topic    : str = 'all',
    count    : int = 10,
    skip     : int = 0,
    db       : Session = Depends(get_db)
):
    query = db.query(Question).filter(Question.test_type == test_type)
    if level != 'all':
        query = query.filter(Question.level == level)
    if topic != 'all':
        query = query.filter(Question.topic == topic)

    all_qs   = query.all()
    total_db = len(all_qs)

    if total_db == 0:
        raise HTTPException(status_code=404, detail='No questions found. Please upload questions first.')

    if topic != 'all':
        sliced   = all_qs[skip: skip + count]
        selected = sliced if sliced else all_qs[:count]
    else:
        selected = random.sample(all_qs, min(count, total_db))

    questions = [{
        'id'      : q.id,
        'topic'   : q.topic,
        'level'   : q.level,
        'question': q.question,
        'options' : [q.option_a, q.option_b, q.option_c, q.option_d]
    } for q in selected]

    return {'questions': questions, 'total': len(questions), 'available': total_db}


# ── STUDENT: Submit assessment ────────────────────────────────
@router.post('/submit')
def submit_assessment(
    data        : SubmitSchema,
    current_user: User    = Depends(get_current_user),
    db          : Session = Depends(get_db)
):
    if not data.answers:
        raise HTTPException(status_code=400, detail='No answers submitted')

    q_ids     = [int(k) for k in data.answers.keys()]
    questions = db.query(Question).filter(Question.id.in_(q_ids)).all()
    q_map     = {q.id: q for q in questions}

    topic_correct, topic_total = {}, {}
    correct = 0
    review_data = []

    for qid_str, user_ans in data.answers.items():
        qid = int(qid_str)
        q   = q_map.get(qid)
        if not q:
            continue
        topic_total[q.topic]   = topic_total.get(q.topic, 0) + 1
        topic_correct[q.topic] = topic_correct.get(q.topic, 0)
        if user_ans.strip() == q.answer.strip():
            correct += 1
            topic_correct[q.topic] += 1
            
        review_data.append({
            'question': q.question,
            'chosen'  : user_ans,
            'correct' : q.answer,
            'options' : [q.option_a, q.option_b, q.option_c, q.option_d]
        })

    total      = len(data.answers)
    percentage = round((correct / total) * 100, 2)
    topic_pct  = {
        t: round((topic_correct.get(t, 0) / topic_total[t]) * 100, 1)
        for t in topic_total
    }

    if data.topic:
        topic_pct['_topic'] = data.topic
    if data.test_index is not None:
        topic_pct['_test_index'] = data.test_index

    db.add(Assessment(
        user_id     = current_user.id,
        type        = data.type,
        scores      = topic_pct,
        total_score = correct,
        max_score   = total,
        percentage  = percentage
    ))

    prog = db.query(Progress).filter(Progress.user_id == current_user.id).first()
    if prog:
        if data.type == 'aptitude':
            prog.aptitude_score = percentage
        elif data.type == 'technical':
            prog.skill_score = percentage
        prog.placement_readiness = round(
            (prog.skill_score * 0.4) + (prog.aptitude_score * 0.3) +
            (prog.resume_score * 0.2) + (prog.roadmap_completion * 0.1), 2
        )

    db.commit()
    return {
        'score': correct, 
        'total': total, 
        'percentage': percentage, 
        'topic_scores': topic_pct,
        'review': review_data
    }


# ── STUDENT: History ──────────────────────────────────────────
@router.get('/history')
def history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    records = db.query(Assessment)\
                .filter(Assessment.user_id == current_user.id)\
                .order_by(Assessment.taken_at.desc()).all()
    return [{
        'id'        : r.id,
        'type'      : r.type,
        'percentage': r.percentage,
        'scores'    : r.scores,
        'taken_at'  : r.taken_at.isoformat()
    } for r in records]


# ── Topic counts ──────────────────────────────────────────────
@router.get('/topic-counts/{test_type}')
def topic_counts(test_type: str, db: Session = Depends(get_db)):
    topics = db.query(Question.topic, func.count(Question.id))\
               .filter(Question.test_type == test_type)\
               .group_by(Question.topic).all()
    return {t: c for t, c in topics}
