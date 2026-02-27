from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import UserProfile, CareerRecommendation, User
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
