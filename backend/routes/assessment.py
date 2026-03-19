from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
import random, csv, io
from datetime import datetime, date, timedelta
from database import get_db
from models import Assessment, Progress, Question, User
from schemas import SubmitSchema, AddQuestionSchema
from dependencies import get_current_user, get_admin_user

router = APIRouter()

@router.post('/upload-questions', status_code=201)
def upload_questions(file: UploadFile = File(...), admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
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
            db.add(Question(test_type=row[0].strip().lower(), topic=row[1].strip(), level=row[2].strip().lower(),
                question=row[3].strip(), option_a=row[4].strip(), option_b=row[5].strip(),
                option_c=row[6].strip(), option_d=row[7].strip(), answer=row[8].strip(),
                source=row[9].strip() if len(row) > 9 else 'csv'))
            added += 1
        except Exception as e:
            errors.append(f'Row {i}: {e}'); skipped += 1
    db.commit()
    return {'message': f'{added} questions added, {skipped} skipped', 'errors': errors[:10]}

@router.post('/add-question', status_code=201)
def add_question(data: AddQuestionSchema, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    q = Question(**data.dict()); db.add(q); db.commit(); db.refresh(q)
    return {'message': 'Question added', 'id': q.id}

@router.get('/stats')
def stats(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    result = {}
    for test_type in ['aptitude', 'technical', 'soft_skill']:
        total  = db.query(Question).filter_by(test_type=test_type).count()
        topics = db.query(Question.topic, func.count(Question.id)).filter(Question.test_type == test_type).group_by(Question.topic).all()
        result[test_type] = {'total': total, 'topics': {t: c for t, c in topics}}
    return result

@router.get('/topics/{test_type}')
def get_topics(test_type: str, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
    topics = db.query(Question.topic).filter(Question.test_type == test_type).distinct().all()
    return {'topics': [t[0] for t in topics]}

@router.get('/questions/{test_type}')
def get_questions(test_type: str, level: str = 'all', topic: str = 'all', count: int = 10, skip: int = 0, db: Session = Depends(get_db)):
    query = db.query(Question).filter(Question.test_type == test_type)
    if level != 'all': query = query.filter(Question.level == level)
    if topic != 'all': query = query.filter(Question.topic == topic)
    all_qs = query.all(); total_db = len(all_qs)
    if total_db == 0:
        raise HTTPException(status_code=404, detail='No questions found. Please upload questions first.')
    if topic != 'all':
        sliced = all_qs[skip: skip + count]; selected = sliced if sliced else all_qs[:count]
    else:
        selected = random.sample(all_qs, min(count, total_db))
    questions = [{'id': q.id, 'topic': q.topic, 'level': q.level, 'question': q.question,
                  'options': [q.option_a, q.option_b, q.option_c, q.option_d]} for q in selected]
    return {'questions': questions, 'total': len(questions), 'available': total_db}

@router.post('/submit')
def submit_assessment(data: SubmitSchema, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not data.answers:
        raise HTTPException(status_code=400, detail='No answers submitted')
    q_ids = [int(k) for k in data.answers.keys()]
    questions = db.query(Question).filter(Question.id.in_(q_ids)).all()
    q_map = {q.id: q for q in questions}
    topic_correct, topic_total = {}, {}
    correct = 0; review_data = []
    for qid_str, user_ans in data.answers.items():
        qid = int(qid_str); q = q_map.get(qid)
        if not q: continue
        topic_total[q.topic]   = topic_total.get(q.topic, 0) + 1
        topic_correct[q.topic] = topic_correct.get(q.topic, 0)
        if user_ans.strip() == q.answer.strip():
            correct += 1; topic_correct[q.topic] += 1
        review_data.append({'question': q.question, 'chosen': user_ans, 'correct': q.answer,
                             'options': [q.option_a, q.option_b, q.option_c, q.option_d]})
    total = len(data.answers)
    percentage = round((correct / total) * 100, 2)
    topic_pct = {t: round((topic_correct.get(t, 0) / topic_total[t]) * 100, 1) for t in topic_total}
    if data.topic: topic_pct['_topic'] = data.topic
    if data.test_index is not None: topic_pct['_test_index'] = data.test_index
    db.add(Assessment(user_id=current_user.id, type=data.type, scores=topic_pct,
                      total_score=correct, max_score=total, percentage=percentage))
    prog = db.query(Progress).filter(Progress.user_id == current_user.id).first()
    if prog:
        if data.type in ('aptitude', 'soft_skill'):
            history_count = db.query(Assessment).filter(Assessment.user_id == current_user.id,
                              Assessment.type.in_(['aptitude','soft_skill'])).count()
            prog.aptitude_score = _rolling_avg(prog.aptitude_score, percentage, history_count)
        elif data.type == 'technical':
            history_count = db.query(Assessment).filter(Assessment.user_id == current_user.id,
                              Assessment.type == 'technical').count()
            prog.skill_score = _rolling_avg(prog.skill_score, percentage, history_count)
        prog.placement_readiness = round(
            (prog.skill_score * 0.40) + (prog.aptitude_score * 0.30) +
            (prog.resume_score * 0.20) + (prog.roadmap_completion * 0.10), 2)
            
        # Streak logic
        from datetime import date, datetime
        today = date.today()
        if prog.last_test_date:
            delta = (today - prog.last_test_date.date()).days
            if delta == 1:
                prog.streak_days = (prog.streak_days or 0) + 1
            elif delta > 1:
                prog.streak_days = 1
            # streak stays same if same day
        else:
            prog.streak_days = 1
        if (prog.streak_days or 0) > (prog.best_streak or 0):
            prog.best_streak = prog.streak_days
        prog.last_test_date = datetime.utcnow()

        # Readiness history — keep last 60 entries
        history = list(prog.readiness_history or [])
        history.append({"date": today.isoformat(), "score": round(prog.placement_readiness, 1)})
        prog.readiness_history = history[-60:]

    db.commit()
    total_taken = db.query(Assessment).filter(Assessment.user_id == current_user.id,
                    Assessment.type == data.type).count()
    return {'score': correct, 'total': total, 'percentage': percentage,
            'topic_scores': topic_pct, 'review': review_data,
            'reliability': _reliability_message(total_taken), 'tests_taken': total_taken}

@router.get('/history')
def history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    records = db.query(Assessment).filter(Assessment.user_id == current_user.id)\
                .order_by(Assessment.taken_at.desc()).limit(50).all()
    return [{'id': r.id, 'type': r.type, 'percentage': r.percentage,
             'scores': r.scores, 'taken_at': r.taken_at.isoformat()} for r in records]

@router.get('/topic-counts/{test_type}')
def topic_counts(test_type: str, db: Session = Depends(get_db)):
    topics = db.query(Question.topic, func.count(Question.id)).filter(Question.test_type == test_type).group_by(Question.topic).all()
    return {t: c for t, c in topics}

def _rolling_avg(current_avg: float, new_score: float, history_count: int) -> float:
    if history_count <= 1: return round(new_score, 2)
    weight = 0.40 if history_count <= 5 else 0.25
    return round((1 - weight) * current_avg + weight * new_score, 2)

def _reliability_message(tests_taken: int) -> dict:
    if tests_taken < 3:
        return {'level': 'low', 'message': f'Score based on {tests_taken} test(s). Take at least 3 for a reliable score.', 'color': '#FF6B6B'}
    if tests_taken < 6:
        return {'level': 'medium', 'message': f'Score based on {tests_taken} tests. Getting more reliable!', 'color': '#FFD93D'}
    return {'level': 'high', 'message': f'Score based on {tests_taken} tests. Highly reliable average.', 'color': '#06D6A0'}


# from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
# from sqlalchemy.orm import Session
# from sqlalchemy import func
# import random, csv, io
# from database import get_db
# from models import Assessment, Progress, Question, User
# from schemas import SubmitSchema, AddQuestionSchema
# from dependencies import get_current_user, get_admin_user

# router = APIRouter()

# # ── ADMIN: Upload questions via CSV ───────────────────────────
# @router.post('/upload-questions', status_code=201)
# def upload_questions(
#     file: UploadFile = File(...),
#     admin: User      = Depends(get_admin_user),
#     db: Session      = Depends(get_db)
# ):
#     content = file.file.read().decode('utf-8')
#     reader  = csv.reader(io.StringIO(content))
#     added, skipped, errors = 0, 0, []

#     for i, row in enumerate(reader, 1):
#         if i == 1 and row[0].strip().lower() in ['test_type', 'type']:
#             continue
#         if len(row) < 9:
#             errors.append(f'Row {i}: need 9 columns, got {len(row)}')
#             continue
#         try:
#             db.add(Question(
#                 test_type = row[0].strip().lower(),
#                 topic     = row[1].strip(),
#                 level     = row[2].strip().lower(),
#                 question  = row[3].strip(),
#                 option_a  = row[4].strip(),
#                 option_b  = row[5].strip(),
#                 option_c  = row[6].strip(),
#                 option_d  = row[7].strip(),
#                 answer    = row[8].strip(),
#                 source    = row[9].strip() if len(row) > 9 else 'csv'
#             ))
#             added += 1
#         except Exception as e:
#             errors.append(f'Row {i}: {e}')
#             skipped += 1

#     db.commit()
#     return {'message': f'{added} questions added, {skipped} skipped', 'errors': errors[:10]}


# # ── ADMIN: Add single question ────────────────────────────────
# @router.post('/add-question', status_code=201)
# def add_question(
#     data : AddQuestionSchema,
#     admin: User    = Depends(get_admin_user),
#     db   : Session = Depends(get_db)
# ):
#     q = Question(**data.dict())
#     db.add(q)
#     db.commit()
#     db.refresh(q)
#     return {'message': 'Question added', 'id': q.id}


# # ── ADMIN: Stats ──────────────────────────────────────────────
# @router.get('/stats')
# def stats(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
#     result = {}
#     for test_type in ['aptitude', 'technical', 'soft_skill']:
#         total  = db.query(Question).filter_by(test_type=test_type).count()
#         topics = db.query(Question.topic, func.count(Question.id))\
#                    .filter(Question.test_type == test_type)\
#                    .group_by(Question.topic).all()
#         result[test_type] = {'total': total, 'topics': {t: c for t, c in topics}}
#     return result


# # ── ADMIN: Get topics ─────────────────────────────────────────
# @router.get('/topics/{test_type}')
# def get_topics(test_type: str, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
#     topics = db.query(Question.topic).filter(Question.test_type == test_type).distinct().all()
#     return {'topics': [t[0] for t in topics]}


# # ── STUDENT: Get questions ────────────────────────────────────
# @router.get('/questions/{test_type}')
# def get_questions(
#     test_type: str,
#     level    : str = 'all',
#     topic    : str = 'all',
#     count    : int = 10,
#     skip     : int = 0,
#     db       : Session = Depends(get_db)
# ):
#     query = db.query(Question).filter(Question.test_type == test_type)
#     if level != 'all':
#         query = query.filter(Question.level == level)
#     if topic != 'all':
#         query = query.filter(Question.topic == topic)

#     all_qs   = query.all()
#     total_db = len(all_qs)

#     if total_db == 0:
#         raise HTTPException(status_code=404, detail='No questions found. Please upload questions first.')

#     if topic != 'all' and skip > 0:
#         sliced   = all_qs[skip: skip + count]
#         selected = sliced if sliced else all_qs[:count]
#     else:
#         selected = random.sample(all_qs, min(count, total_db))

#     questions = [{
#         'id'      : q.id,
#         'topic'   : q.topic,
#         'level'   : q.level,
#         'question': q.question,
#         'options' : [q.option_a, q.option_b, q.option_c, q.option_d]
#     } for q in selected]

#     return {'questions': questions, 'total': len(questions), 'available': total_db}


# # ── STUDENT: Submit assessment ────────────────────────────────
# @router.post('/submit')
# def submit_assessment(
#     data        : SubmitSchema,
#     current_user: User    = Depends(get_current_user),
#     db          : Session = Depends(get_db)
# ):
#     if not data.answers:
#         raise HTTPException(status_code=400, detail='No answers submitted')

#     q_ids     = [int(k) for k in data.answers.keys()]
#     questions = db.query(Question).filter(Question.id.in_(q_ids)).all()
#     q_map     = {q.id: q for q in questions}

#     topic_correct, topic_total = {}, {}
#     correct = 0

#     for qid_str, user_ans in data.answers.items():
#         qid = int(qid_str)
#         q   = q_map.get(qid)
#         if not q:
#             continue
#         topic_total[q.topic]   = topic_total.get(q.topic, 0) + 1
#         topic_correct[q.topic] = topic_correct.get(q.topic, 0)
#         if user_ans.strip() == q.answer.strip():
#             correct += 1
#             topic_correct[q.topic] += 1

#     total      = len(data.answers)
#     percentage = round((correct / total) * 100, 2)
#     topic_pct  = {
#         t: round((topic_correct.get(t, 0) / topic_total[t]) * 100, 1)
#         for t in topic_total
#     }

#     db.add(Assessment(
#         user_id     = current_user.id,
#         type        = data.type,
#         scores      = topic_pct,
#         total_score = correct,
#         max_score   = total,
#         percentage  = percentage
#     ))

#     prog = db.query(Progress).filter(Progress.user_id == current_user.id).first()
#     if prog:
#         if data.type == 'aptitude':
#             # Count PREVIOUS aptitude tests (before this new one is committed)
#             prev_count = db.query(Assessment).filter(
#                 Assessment.user_id == current_user.id,
#                 Assessment.type    == 'aptitude'
#             ).count()
#             old_avg = prog.aptitude_score or 0
#             if prev_count == 0:
#                 # Very first test — give 50% weight (unreliable single test)
#                 prog.aptitude_score = round(percentage * 0.5, 2)
#             elif prev_count < 5:
#                 # 2-5 tests: 40% new, 60% old
#                 prog.aptitude_score = round((old_avg * 0.6) + (percentage * 0.4), 2)
#             else:
#                 # 5+ tests: 25% new, 75% old (stable average)
#                 prog.aptitude_score = round((old_avg * 0.75) + (percentage * 0.25), 2)

#         elif data.type == 'technical':
#             prev_count = db.query(Assessment).filter(
#                 Assessment.user_id == current_user.id,
#                 Assessment.type    == 'technical'
#             ).count()
#             old_avg = prog.skill_score or 0
#             if prev_count == 0:
#                 prog.skill_score = round(percentage * 0.5, 2)
#             elif prev_count < 5:
#                 prog.skill_score = round((old_avg * 0.6) + (percentage * 0.4), 2)
#             else:
#                 prog.skill_score = round((old_avg * 0.75) + (percentage * 0.25), 2)

#         elif data.type == 'soft_skill':
#             prev_count = db.query(Assessment).filter(
#                 Assessment.user_id == current_user.id,
#                 Assessment.type    == 'soft_skill'
#             ).count()
#             old_avg = prog.skill_score or 0
#             if prev_count == 0:
#                 prog.skill_score = round((old_avg * 0.85) + (percentage * 0.15), 2)
#             else:
#                 prog.skill_score = round((old_avg * 0.88) + (percentage * 0.12), 2)

#         prog.placement_readiness = round(
#             (prog.skill_score * 0.4) + (prog.aptitude_score * 0.3) +
#             (prog.resume_score * 0.2) + (prog.roadmap_completion * 0.1), 2
#         )

#     db.commit()

#     # Count total tests of this type now (after commit) for reliability message
#     total_tests_type = db.query(Assessment).filter(
#         Assessment.user_id == current_user.id,
#         Assessment.type    == data.type
#     ).count()

#     reliability = 'low' if total_tests_type <= 1 else 'medium' if total_tests_type <= 5 else 'high'
#     reliability_msg = (
#         f'⚠️ Only {total_tests_type} test(s) taken. Complete 5+ tests across different topics for an accurate score.'
#         if reliability == 'low' else
#         f'📈 Based on {total_tests_type} tests. A few more will make this very accurate!'
#         if reliability == 'medium' else
#         f'✅ High confidence score based on {total_tests_type} tests.'
#     )

#     return {
#         'score'            : correct,
#         'total'            : total,
#         'percentage'       : percentage,
#         'topic_scores'     : topic_pct,
#         'review'           : review_data,
#         'reliability'      : reliability,
#         'reliability_msg'  : reliability_msg,
#         'tests_taken_type' : total_tests_type,
#     }


# # ── STUDENT: History ──────────────────────────────────────────
# @router.get('/history')
# def history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
#     records = db.query(Assessment)\
#                 .filter(Assessment.user_id == current_user.id)\
#                 .order_by(Assessment.taken_at.desc()).all()
#     return [{
#         'id'        : r.id,
#         'type'      : r.type,
#         'percentage': r.percentage,
#         'scores'    : r.scores,
#         'taken_at'  : r.taken_at.isoformat()
#     } for r in records]


# # ── Topic counts ──────────────────────────────────────────────
# @router.get('/topic-counts/{test_type}')
# def topic_counts(test_type: str, db: Session = Depends(get_db)):
#     topics = db.query(Question.topic, func.count(Question.id))\
#                .filter(Question.test_type == test_type)\
#                .group_by(Question.topic).all()
#     return {t: c for t, c in topics}


# # from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
# # from sqlalchemy.orm import Session
# # from sqlalchemy import func
# # import random, csv, io
# # from database import get_db
# # from models import Assessment, Progress, Question, User
# # from schemas import SubmitSchema, AddQuestionSchema
# # from dependencies import get_current_user, get_admin_user

# # router = APIRouter()

# # # ── ADMIN: Upload questions via CSV ───────────────────────────
# # @router.post('/upload-questions', status_code=201)
# # def upload_questions(
# #     file: UploadFile = File(...),
# #     admin: User      = Depends(get_admin_user),
# #     db: Session      = Depends(get_db)
# # ):
# #     content = file.file.read().decode('utf-8')
# #     reader  = csv.reader(io.StringIO(content))
# #     added, skipped, errors = 0, 0, []

# #     for i, row in enumerate(reader, 1):
# #         if i == 1 and row[0].strip().lower() in ['test_type', 'type']:
# #             continue
# #         if len(row) < 9:
# #             errors.append(f'Row {i}: need 9 columns, got {len(row)}')
# #             continue
# #         try:
# #             db.add(Question(
# #                 test_type = row[0].strip().lower(),
# #                 topic     = row[1].strip(),
# #                 level     = row[2].strip().lower(),
# #                 question  = row[3].strip(),
# #                 option_a  = row[4].strip(),
# #                 option_b  = row[5].strip(),
# #                 option_c  = row[6].strip(),
# #                 option_d  = row[7].strip(),
# #                 answer    = row[8].strip(),
# #                 source    = row[9].strip() if len(row) > 9 else 'csv'
# #             ))
# #             added += 1
# #         except Exception as e:
# #             errors.append(f'Row {i}: {e}')
# #             skipped += 1

# #     db.commit()
# #     return {'message': f'{added} questions added, {skipped} skipped', 'errors': errors[:10]}


# # # ── ADMIN: Add single question ────────────────────────────────
# # @router.post('/add-question', status_code=201)
# # def add_question(
# #     data : AddQuestionSchema,
# #     admin: User    = Depends(get_admin_user),
# #     db   : Session = Depends(get_db)
# # ):
# #     q = Question(**data.dict())
# #     db.add(q)
# #     db.commit()
# #     db.refresh(q)
# #     return {'message': 'Question added', 'id': q.id}


# # # ── ADMIN: Stats ──────────────────────────────────────────────
# # @router.get('/stats')
# # def stats(admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
# #     result = {}
# #     for test_type in ['aptitude', 'technical', 'soft_skill']:
# #         total  = db.query(Question).filter_by(test_type=test_type).count()
# #         topics = db.query(Question.topic, func.count(Question.id))\
# #                    .filter(Question.test_type == test_type)\
# #                    .group_by(Question.topic).all()
# #         result[test_type] = {'total': total, 'topics': {t: c for t, c in topics}}
# #     return result


# # # ── ADMIN: Get topics ─────────────────────────────────────────
# # @router.get('/topics/{test_type}')
# # def get_topics(test_type: str, admin: User = Depends(get_admin_user), db: Session = Depends(get_db)):
# #     topics = db.query(Question.topic).filter(Question.test_type == test_type).distinct().all()
# #     return {'topics': [t[0] for t in topics]}


# # # ── STUDENT: Get questions ────────────────────────────────────
# # @router.get('/questions/{test_type}')
# # def get_questions(
# #     test_type: str,
# #     level    : str = 'all',
# #     topic    : str = 'all',
# #     count    : int = 10,
# #     skip     : int = 0,
# #     db       : Session = Depends(get_db)
# # ):
# #     query = db.query(Question).filter(Question.test_type == test_type)
# #     if level != 'all':
# #         query = query.filter(Question.level == level)
# #     if topic != 'all':
# #         query = query.filter(Question.topic == topic)

# #     all_qs   = query.all()
# #     total_db = len(all_qs)

# #     if total_db == 0:
# #         raise HTTPException(status_code=404, detail='No questions found. Please upload questions first.')

# #     if topic != 'all':
# #         sliced   = all_qs[skip: skip + count]
# #         selected = sliced if sliced else all_qs[:count]
# #     else:
# #         selected = random.sample(all_qs, min(count, total_db))

# #     questions = [{
# #         'id'      : q.id,
# #         'topic'   : q.topic,
# #         'level'   : q.level,
# #         'question': q.question,
# #         'options' : [q.option_a, q.option_b, q.option_c, q.option_d]
# #     } for q in selected]

# #     return {'questions': questions, 'total': len(questions), 'available': total_db}


# # # ── STUDENT: Submit assessment ────────────────────────────────
# # @router.post('/submit')
# # def submit_assessment(
# #     data        : SubmitSchema,
# #     current_user: User    = Depends(get_current_user),
# #     db          : Session = Depends(get_db)
# # ):
# #     if not data.answers:
# #         raise HTTPException(status_code=400, detail='No answers submitted')

# #     q_ids     = [int(k) for k in data.answers.keys()]
# #     questions = db.query(Question).filter(Question.id.in_(q_ids)).all()
# #     q_map     = {q.id: q for q in questions}

# #     topic_correct, topic_total = {}, {}
# #     correct = 0
# #     review_data = []

# #     for qid_str, user_ans in data.answers.items():
# #         qid = int(qid_str)
# #         q   = q_map.get(qid)
# #         if not q:
# #             continue
# #         topic_total[q.topic]   = topic_total.get(q.topic, 0) + 1
# #         topic_correct[q.topic] = topic_correct.get(q.topic, 0)
# #         if user_ans.strip() == q.answer.strip():
# #             correct += 1
# #             topic_correct[q.topic] += 1
            
# #         review_data.append({
# #             'question': q.question,
# #             'chosen'  : user_ans,
# #             'correct' : q.answer,
# #             'options' : [q.option_a, q.option_b, q.option_c, q.option_d]
# #         })

# #     total      = len(data.answers)
# #     percentage = round((correct / total) * 100, 2)
# #     topic_pct  = {
# #         t: round((topic_correct.get(t, 0) / topic_total[t]) * 100, 1)
# #         for t in topic_total
# #     }

# #     if data.topic:
# #         topic_pct['_topic'] = data.topic
# #     if data.test_index is not None:
# #         topic_pct['_test_index'] = data.test_index

# #     db.add(Assessment(
# #         user_id     = current_user.id,
# #         type        = data.type,
# #         scores      = topic_pct,
# #         total_score = correct,
# #         max_score   = total,
# #         percentage  = percentage
# #     ))

# #     prog = db.query(Progress).filter(Progress.user_id == current_user.id).first()
# #     if prog:
# #         if data.type == 'aptitude':
# #             prog.aptitude_score = percentage
# #         elif data.type == 'technical':
# #             prog.skill_score = percentage
# #         prog.placement_readiness = round(
# #             (prog.skill_score * 0.4) + (prog.aptitude_score * 0.3) +
# #             (prog.resume_score * 0.2) + (prog.roadmap_completion * 0.1), 2
# #         )

# #     db.commit()
# #     return {
# #         'score': correct, 
# #         'total': total, 
# #         'percentage': percentage, 
# #         'topic_scores': topic_pct,
# #         'review': review_data
# #     }


# # # ── STUDENT: History ──────────────────────────────────────────
# # @router.get('/history')
# # def history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
# #     records = db.query(Assessment)\
# #                 .filter(Assessment.user_id == current_user.id)\
# #                 .order_by(Assessment.taken_at.desc()).all()
# #     return [{
# #         'id'        : r.id,
# #         'type'      : r.type,
# #         'percentage': r.percentage,
# #         'scores'    : r.scores,
# #         'taken_at'  : r.taken_at.isoformat()
# #     } for r in records]


# # # ── Topic counts ──────────────────────────────────────────────
# # @router.get('/topic-counts/{test_type}')
# # def topic_counts(test_type: str, db: Session = Depends(get_db)):
# #     topics = db.query(Question.topic, func.count(Question.id))\
# #                .filter(Question.test_type == test_type)\
# #                .group_by(Question.topic).all()
# #     return {t: c for t, c in topics}
