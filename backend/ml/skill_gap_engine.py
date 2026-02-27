from sqlalchemy.orm import Session
from models import UserProfile, Resume
from services.roadmap_service import RoadmapService

DOMAIN_SKILLS = {
    "Software Engineer"        : ["python","java","c++","data structures","algorithms","git","sql","rest api","oop","linux"],
    "Data Scientist"           : ["python","statistics","machine learning","pandas","numpy","sql","data visualization","scikit-learn","jupyter"],
    "Web Developer"            : ["html","css","javascript","react","node","git","rest api","mongodb","responsive design"],
    "AI/ML Engineer"           : ["python","machine learning","deep learning","tensorflow","pytorch","nlp","computer vision","mlops","docker"],
    "Cloud Engineer"           : ["aws","azure","gcp","docker","kubernetes","linux","networking","terraform","ci/cd","bash"],
    "Cybersecurity Analyst"    : ["networking","linux","python","security","ethical hacking","cryptography","siem","firewalls"],
    "Embedded Systems Engineer": ["c","c++","microcontrollers","iot","rtos","hardware","embedded","python","pcb design"],
    "Data Engineer"            : ["python","sql","spark","hadoop","kafka","airflow","etl","data pipelines","aws","scala"],
}


class SkillGapEngine:

    def analyze(self, user_id: int, career_domain: str, db: Session) -> dict:
        profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        resume  = db.query(Resume).filter(Resume.user_id == user_id)\
                    .order_by(Resume.uploaded_at.desc()).first()

        current = set()
        if profile and profile.skills:
            current.update(k.lower() for k in profile.skills.keys())
        if resume and resume.extracted_skills:
            current.update(s.lower() for s in resume.extracted_skills)

        required      = set(s.lower() for s in DOMAIN_SKILLS.get(career_domain, DOMAIN_SKILLS["Software Engineer"]))
        missing       = required - current
        gap_percentage = round(len(missing) / max(len(required), 1) * 100, 2)

        return {
            "career_domain"   : career_domain,
            "required_skills" : sorted(required),
            "current_skills"  : sorted(current & required),
            "missing_skills"  : sorted(missing),
            "gap_percentage"  : gap_percentage,
            "match_percentage": round(100 - gap_percentage, 2),
        }

    def generate_roadmap(self, career_domain: str, missing_skills: list) -> dict:
        return RoadmapService().get_roadmap(career_domain, missing_skills)
