from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models import UserProfile, CareerRecommendation, User, Progress
from dependencies import get_current_user

router = APIRouter()

APTITUDE_TOPICS = [
    {"topic": "Quantitative Aptitude", "subtopics": ["Percentages","Profit & Loss","Time & Work","Speed & Distance"]},
    {"topic": "Logical Reasoning",     "subtopics": ["Syllogisms","Blood Relations","Coding-Decoding","Puzzles"]},
    {"topic": "Verbal Ability",        "subtopics": ["Reading Comprehension","Fill in the Blanks","Sentence Correction"]},
]
CODING_TOPICS = [
    {"topic": "Data Structures", "subtopics": ["Arrays","Linked Lists","Stacks & Queues","Trees","Graphs"]},
    {"topic": "Algorithms",      "subtopics": ["Sorting","Searching","Dynamic Programming","Greedy","Backtracking"]},
    {"topic": "System Design",   "subtopics": ["REST APIs","Database Design","Caching","Load Balancing"]},
]
INTERVIEW_TOPICS = [
    "HR Questions & STAR Method","Technical MCQ Practice",
    "Group Discussion Tips","Resume Walkthrough Preparation","Situational & Behavioural Questions",
]
RESOURCES = {
    "aptitude" : [
        {"title": "IndiaBix Aptitude Practice",     "url": "https://www.indiabix.com"},
        {"title": "RS Aggarwal Solutions - YouTube", "url": "https://youtube.com/results?search_query=rs+aggarwal+aptitude"},
    ],
    "coding"   : [
        {"title": "LeetCode",                       "url": "https://leetcode.com"},
        {"title": "GeeksforGeeks DSA Course",       "url": "https://www.geeksforgeeks.org/data-structures"},
        {"title": "Striver DSA Sheet",              "url": "https://youtube.com/results?search_query=striver+dsa+sheet"},
    ],
    "interview": [
        {"title": "InterviewBit",                   "url": "https://www.interviewbit.com"},
        {"title": "Glassdoor Interview Questions",  "url": "https://www.glassdoor.com/Interview"},
    ],
    "ml"       : [
        {"title": "Andrew Ng ML Course",            "url": "https://www.coursera.org/learn/machine-learning"},
        {"title": "Kaggle Learn",                   "url": "https://www.kaggle.com/learn"},
    ],
}
JOBS_BY_DOMAIN = {
    "Software Engineer": ["Junior Developer","Backend Engineer","Full Stack Developer","Software Trainee"],
    "Data Scientist"   : ["Data Analyst","ML Engineer","Junior Data Scientist","BI Analyst"],
    "Web Developer"    : ["Frontend Developer","React Developer","UI/UX Developer"],
    "AI/ML Engineer"   : ["ML Researcher","AI Engineer Trainee","NLP Engineer"],
    "Cloud Engineer"   : ["Cloud Support Intern","DevOps Trainee","AWS/GCP/Azure Associate"],
}
COMPANY_REQUIREMENTS = {
    "TCS": ["Aptitude", "Java", "Python", "DBMS", "Software Engineering basics"],
    "Infosys": ["Reasoning", "Verbal", "Pseudocode", "Python", "Java"],
    "Wipro": ["Aptitude", "Written Communication", "Basic Coding", "Logic"],
    "Cognizant": ["Aptitude", "Automata Fix", "SQL", "OOPs"],
    "Accenture": ["Cognitive Ability", "Communication", "Coding", "Cloud Basics"],
    "Google": ["Advanced DSA", "System Design", "Graphs", "Dynamic Programming"],
    "Amazon": ["DSA", "System Design", "Problem Solving", "Trees"],
    "Microsoft": ["Arrays", "Strings", "System Design", "Object Oriented Design"],
    "Zoho": ["C", "C++", "Java", "Data Structures", "Puzzles"],
    "Freshworks": ["Web Technologies", "Ruby", "Python", "DSA"]
}

@router.get('/preparation')
def preparation(current_user: User = Depends(get_current_user)):
    return {
        'aptitude_topics' : APTITUDE_TOPICS,
        'coding_topics'   : CODING_TOPICS,
        'interview_topics': INTERVIEW_TOPICS,
        'resources'       : RESOURCES
    }

@router.get('/jobs')
def jobs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rec = db.query(CareerRecommendation)\
            .filter(CareerRecommendation.user_id == current_user.id)\
            .order_by(CareerRecommendation.generated_at.desc()).first()

    if rec and rec.top_careers:
        domain = rec.top_careers[0]['domain']
    else:
        profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
        domain  = (profile.career_goal or 'Software Engineer') if profile else 'Software Engineer'

    roles = JOBS_BY_DOMAIN.get(domain, JOBS_BY_DOMAIN['Software Engineer'])
    return {'career_domain': domain, 'recommended_roles': roles}

@router.get('/resources/{category}')
def resources(category: str, current_user: User = Depends(get_current_user)):
    if category not in RESOURCES:
        raise HTTPException(status_code=404, detail=f'Category not found. Available: {list(RESOURCES.keys())}')
    return {'category': category, 'resources': RESOURCES[category]}

@router.get('/company-requirements/{company_name}')
def company_requirements(company_name: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reqs = COMPANY_REQUIREMENTS.get(company_name, ["Aptitude", "Basic Coding", "Core Subjects"])
    
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    user_skills = set(profile.skills.keys() if profile and profile.skills else [])
    
    reqs_lower = [r.lower() for r in reqs]
    user_skills_lower = [s.lower() for s in user_skills]
    
    missing_skills = []
    matched_skills = []
    
    for idx, r in enumerate(reqs_lower):
        found = False
        for s in user_skills_lower:
            if r in s or s in r or r == s:
                found = True
                break
        if found:
            matched_skills.append(reqs[idx])
        else:
            missing_skills.append(reqs[idx])

    return {
        "company": company_name,
        "requirements": reqs,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }

class MarkDoneSchema(BaseModel):
    problem_name: str

@router.post('/mark-done')
def mark_done(data: MarkDoneSchema, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from models import Progress
    progress = db.query(Progress).filter(Progress.user_id == current_user.id).first()
    if not progress:
        progress = Progress(user_id=current_user.id, completed_dsa_problems=[])
        db.add(progress)
        db.commit()
    
    completed = progress.completed_dsa_problems if progress.completed_dsa_problems is not None else []
    
    if data.problem_name not in completed:
        # Create a new list to ensure SQLAlchemy detects the change to the JSON column
        new_completed = list(completed)
        new_completed.append(data.problem_name)
        progress.completed_dsa_problems = new_completed
        db.commit()
        
    return {"status": "success", "completed_count": len(progress.completed_dsa_problems)}

@router.get('/completed-dsa')
def get_completed_dsa(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    from models import Progress
    progress = db.query(Progress).filter(Progress.user_id == current_user.id).first()
    if not progress or not progress.completed_dsa_problems:
        return {"completed": []}
    return {"completed": progress.completed_dsa_problems}
