ROADMAP_TEMPLATES = {
    "Software Engineer": {
        "beginner"    : ["Learn Python/Java basics","Understand OOP concepts","Learn SQL & DBMS fundamentals","Build a simple CRUD app"],
        "intermediate": ["Learn Data Structures & Algorithms","Build REST APIs with Flask/Django","Learn Git & GitHub","Deploy on Heroku/Render"],
        "advanced"    : ["System Design fundamentals","Microservices architecture","Cloud deployment (AWS/GCP)","Contribute to open source"],
        "timeline"    : {"weeks_1_2": "Core language", "weeks_3_4": "OOP + DB", "weeks_5_8": "DSA + APIs", "weeks_9_12": "Projects + Deploy"}
    },
    "Data Scientist": {
        "beginner"    : ["Python basics","NumPy & Pandas","Statistics fundamentals","Data visualization with Matplotlib/Seaborn"],
        "intermediate": ["Machine Learning with Scikit-learn","Feature engineering","SQL for data analysis","Kaggle competitions"],
        "advanced"    : ["Deep Learning (TensorFlow/PyTorch)","NLP & Computer Vision","MLOps & model deployment","Research papers"],
        "timeline"    : {"weeks_1_2": "Python + Stats", "weeks_3_4": "Pandas + Viz", "weeks_5_8": "ML models", "weeks_9_12": "DL + Deployment"}
    },
    "Web Developer": {
        "beginner"    : ["HTML5 & CSS3","JavaScript ES6+","Responsive design","Version control with Git"],
        "intermediate": ["React.js / Vue.js","Node.js & Express","REST API consumption","Database integration (MongoDB/MySQL)"],
        "advanced"    : ["Full stack project","Authentication & security","Performance optimisation","DevOps basics (Docker/CI-CD)"],
        "timeline"    : {"weeks_1_2": "HTML+CSS+JS", "weeks_3_4": "React basics", "weeks_5_8": "Backend + DB", "weeks_9_12": "Full project"}
    },
    "AI/ML Engineer": {
        "beginner"    : ["Python & Mathematics (Linear Algebra, Calculus)","Statistics & Probability","Scikit-learn basics","EDA with Pandas"],
        "intermediate": ["Deep Learning fundamentals","PyTorch/TensorFlow","Computer Vision (CNN)","NLP (BERT, Transformers)"],
        "advanced"    : ["MLOps (MLflow, Docker, Kubernetes)","Model optimisation","Research & paper reading","Production ML systems"],
        "timeline"    : {"weeks_1_3": "Math + Python", "weeks_4_6": "ML basics", "weeks_7_10": "Deep Learning", "weeks_11_14": "MLOps + Projects"}
    },
}

class RoadmapService:
    def get_roadmap(self, career_domain: str, missing_skills: list = None) -> dict:
        template = ROADMAP_TEMPLATES.get(career_domain, ROADMAP_TEMPLATES["Software Engineer"])
        steps = {
            "beginner"    : template["beginner"][:],
            "intermediate": template["intermediate"],
            "advanced"    : template["advanced"],
        }
        if missing_skills:
            extra = [f"Learn & practise: {skill}" for skill in missing_skills[:5]]
            steps["beginner"] = extra + steps["beginner"]
        return {"steps": steps, "timeline": template["timeline"], "career_domain": career_domain}
