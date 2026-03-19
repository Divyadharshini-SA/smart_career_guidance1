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
        prog.roadmap_completion = round(float(len(completed) / max(len(all_steps), 1) * 100), 2)

    db.commit()
    return {'roadmap_completion': prog.roadmap_completion}



# # ════════════════════════════════════════════════════════════════
# # services/roadmap_service.py
# # Enhanced with: full learning resources + YouTube search links
# # for all 7 career domains across 3 levels each
# # ════════════════════════════════════════════════════════════════

# def _yt(query: str) -> str:
#     """Build a YouTube search URL from a query string."""
#     return f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}"


# ROADMAP_TEMPLATES = {

#     # ── SOFTWARE ENGINEER ─────────────────────────────────────────
#     "Software Engineer": {
#         "beginner": [
#             {
#                 "title": "Python or Java Basics — pick one and master it",
#                 "url": "https://cs50.harvard.edu/python/",
#                 "youtube": _yt("python full course beginners 2024"),
#                 "alt_resource": "https://www.codecademy.com/catalog/language/python",
#             },
#             {
#                 "title": "Object-Oriented Programming (OOP) Concepts",
#                 "url": "https://realpython.com/python3-object-oriented-programming/",
#                 "youtube": _yt("OOP object oriented programming python explained"),
#                 "alt_resource": "https://www.freecodecamp.org/news/object-oriented-programming-concepts-21bb035f7260/",
#             },
#             {
#                 "title": "SQL & DBMS Fundamentals",
#                 "url": "https://sqlbolt.com/",
#                 "youtube": _yt("SQL tutorial complete beginners mysql"),
#                 "alt_resource": "https://www.w3schools.com/sql/",
#             },
#             {
#                 "title": "Version Control with Git & GitHub",
#                 "url": "https://learngitbranching.js.org/",
#                 "youtube": _yt("git and github full course beginners"),
#                 "alt_resource": "https://skills.github.com/",
#             },
#             {
#                 "title": "Build your first CRUD web app",
#                 "url": "https://www.theodinproject.com/",
#                 "youtube": _yt("build CRUD app python flask beginners project"),
#                 "alt_resource": "https://realpython.com/flask-project/",
#             },
#         ],
#         "intermediate": [
#             {
#                 "title": "Data Structures & Algorithms (DSA)",
#                 "url": "https://takeuforward.org/strivers-a2z-dsa-course/",
#                 "youtube": _yt("data structures and algorithms full course striver"),
#                 "alt_resource": "https://leetcode.com/explore/",
#             },
#             {
#                 "title": "Build REST APIs with Flask or Django",
#                 "url": "https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world",
#                 "youtube": _yt("flask REST API tutorial python complete"),
#                 "alt_resource": "https://www.django-rest-framework.org/tutorial/quickstart/",
#             },
#             {
#                 "title": "Databases — PostgreSQL + SQLAlchemy ORM",
#                 "url": "https://www.postgresqltutorial.com/",
#                 "youtube": _yt("PostgreSQL SQLAlchemy python ORM tutorial"),
#                 "alt_resource": "https://docs.sqlalchemy.org/en/20/orm/quickstart.html",
#             },
#             {
#                 "title": "Deploy apps on Render / Railway / Heroku",
#                 "url": "https://render.com/docs",
#                 "youtube": _yt("deploy python flask app render railway beginners"),
#                 "alt_resource": "https://railway.app/",
#             },
#             {
#                 "title": "Testing — Unit Tests with pytest",
#                 "url": "https://docs.pytest.org/en/stable/getting-started.html",
#                 "youtube": _yt("pytest unit testing python tutorial"),
#                 "alt_resource": "https://realpython.com/pytest-python-testing/",
#             },
#         ],
#         "advanced": [
#             {
#                 "title": "System Design Fundamentals",
#                 "url": "https://github.com/donnemartin/system-design-primer",
#                 "youtube": _yt("system design interview concepts full course"),
#                 "alt_resource": "https://bytebytego.com/",
#             },
#             {
#                 "title": "Microservices Architecture",
#                 "url": "https://microservices.io/",
#                 "youtube": _yt("microservices architecture explained tutorial"),
#                 "alt_resource": "https://docs.microsoft.com/en-us/azure/architecture/microservices/",
#             },
#             {
#                 "title": "Docker & Containerisation",
#                 "url": "https://docs.docker.com/get-started/",
#                 "youtube": _yt("docker tutorial beginners full course"),
#                 "alt_resource": "https://www.docker.com/101-tutorial/",
#             },
#             {
#                 "title": "Cloud Deployment — AWS / GCP Basics",
#                 "url": "https://aws.amazon.com/training/",
#                 "youtube": _yt("AWS cloud practitioner full course 2024"),
#                 "alt_resource": "https://www.cloudskillsboost.google/",
#             },
#             {
#                 "title": "Contribute to Open Source",
#                 "url": "https://goodfirstissue.dev/",
#                 "youtube": _yt("how to contribute to open source github beginners"),
#                 "alt_resource": "https://firstcontributions.github.io/",
#             },
#         ],
#         "timeline": {
#             "weeks_1_2": "Core language (Python/Java) + OOP",
#             "weeks_3_4": "SQL + Git + first CRUD project",
#             "weeks_5_8": "DSA + REST API + testing",
#             "weeks_9_12": "System design + Docker + Cloud deploy",
#         },
#     },

#     # ── DATA SCIENTIST ────────────────────────────────────────────
#     "Data Scientist": {
#         "beginner": [
#             {
#                 "title": "Python for Data Science — Numpy & Pandas",
#                 "url": "https://pandas.pydata.org/docs/user_guide/10min.html",
#                 "youtube": _yt("pandas numpy tutorial data science beginners"),
#                 "alt_resource": "https://www.datacamp.com/",
#             },
#             {
#                 "title": "Statistics & Probability Foundations",
#                 "url": "https://www.khanacademy.org/math/statistics-probability",
#                 "youtube": _yt("statistics for data science full course"),
#                 "alt_resource": "https://statquest.org/",
#             },
#             {
#                 "title": "Data Visualisation — Matplotlib & Seaborn",
#                 "url": "https://seaborn.pydata.org/tutorial.html",
#                 "youtube": _yt("matplotlib seaborn data visualisation python tutorial"),
#                 "alt_resource": "https://plotly.com/python/",
#             },
#             {
#                 "title": "Exploratory Data Analysis (EDA) with Pandas",
#                 "url": "https://www.kaggle.com/learn/pandas",
#                 "youtube": _yt("exploratory data analysis EDA python pandas tutorial"),
#                 "alt_resource": "https://www.kaggle.com/learn/data-visualization",
#             },
#         ],
#         "intermediate": [
#             {
#                 "title": "Machine Learning with Scikit-learn",
#                 "url": "https://scikit-learn.org/stable/tutorial/index.html",
#                 "youtube": _yt("machine learning scikit learn full course beginners"),
#                 "alt_resource": "https://www.coursera.org/learn/machine-learning",
#             },
#             {
#                 "title": "Feature Engineering & Model Evaluation",
#                 "url": "https://www.kaggle.com/learn/feature-engineering",
#                 "youtube": _yt("feature engineering machine learning tutorial"),
#                 "alt_resource": "https://featuretools.alteryx.com/",
#             },
#             {
#                 "title": "SQL for Data Analysis",
#                 "url": "https://mode.com/sql-tutorial/",
#                 "youtube": _yt("SQL for data analysis tutorial advanced"),
#                 "alt_resource": "https://www.w3resource.com/sql-exercises/",
#             },
#             {
#                 "title": "Kaggle Competitions — apply your skills",
#                 "url": "https://www.kaggle.com/competitions",
#                 "youtube": _yt("kaggle competition walkthrough beginners tips"),
#                 "alt_resource": "https://zindi.africa/",
#             },
#         ],
#         "advanced": [
#             {
#                 "title": "Deep Learning — TensorFlow / PyTorch",
#                 "url": "https://pytorch.org/tutorials/",
#                 "youtube": _yt("pytorch deep learning full course tutorial"),
#                 "alt_resource": "https://www.tensorflow.org/tutorials",
#             },
#             {
#                 "title": "NLP & Transformers (BERT, GPT)",
#                 "url": "https://huggingface.co/course/chapter1/1",
#                 "youtube": _yt("NLP transformers BERT huggingface tutorial"),
#                 "alt_resource": "https://www.fast.ai/",
#             },
#             {
#                 "title": "MLOps — Model Deployment & Monitoring",
#                 "url": "https://ml-ops.org/",
#                 "youtube": _yt("MLOps model deployment monitoring tutorial"),
#                 "alt_resource": "https://mlflow.org/docs/latest/",
#             },
#             {
#                 "title": "Read Research Papers on Papers With Code",
#                 "url": "https://paperswithcode.com/",
#                 "youtube": _yt("how to read machine learning research papers"),
#                 "alt_resource": "https://arxiv.org/list/cs.LG/recent",
#             },
#         ],
#         "timeline": {
#             "weeks_1_2": "Python + NumPy + Pandas + Stats",
#             "weeks_3_4": "Visualisation + EDA",
#             "weeks_5_8": "ML models + Scikit-learn + Kaggle",
#             "weeks_9_12": "Deep Learning + MLOps + Paper reading",
#         },
#     },

#     # ── WEB DEVELOPER ─────────────────────────────────────────────
#     "Web Developer": {
#         "beginner": [
#             {
#                 "title": "HTML5 & CSS3 Fundamentals",
#                 "url": "https://www.theodinproject.com/paths/foundations/courses/foundations",
#                 "youtube": _yt("HTML CSS full course beginners 2024"),
#                 "alt_resource": "https://developer.mozilla.org/en-US/docs/Learn/HTML",
#             },
#             {
#                 "title": "JavaScript ES6+ Core Concepts",
#                 "url": "https://javascript.info/",
#                 "youtube": _yt("javascript full course beginners modern ES6"),
#                 "alt_resource": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
#             },
#             {
#                 "title": "Responsive Web Design — Flexbox & Grid",
#                 "url": "https://web.dev/learn/css/",
#                 "youtube": _yt("CSS flexbox grid responsive design tutorial"),
#                 "alt_resource": "https://flexboxfroggy.com/",
#             },
#             {
#                 "title": "Version Control with Git",
#                 "url": "https://learngitbranching.js.org/",
#                 "youtube": _yt("git github full course web developers"),
#                 "alt_resource": "https://skills.github.com/",
#             },
#         ],
#         "intermediate": [
#             {
#                 "title": "React.js — Components, Hooks, State",
#                 "url": "https://react.dev/learn",
#                 "youtube": _yt("react js full course beginners 2024 hooks"),
#                 "alt_resource": "https://www.scrimba.com/learn/learnreact",
#             },
#             {
#                 "title": "Node.js & Express.js — Server-side JS",
#                 "url": "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs",
#                 "youtube": _yt("node js express js crash course tutorial"),
#                 "alt_resource": "https://expressjs.com/en/starter/installing.html",
#             },
#             {
#                 "title": "MongoDB / PostgreSQL — Database Integration",
#                 "url": "https://www.mongodb.com/basics",
#                 "youtube": _yt("mongodb tutorial nodejs CRUD application"),
#                 "alt_resource": "https://www.postgresql.org/docs/current/tutorial.html",
#             },
#             {
#                 "title": "REST API Design & Consumption (Axios/Fetch)",
#                 "url": "https://www.postman.com/api-platform/api-client/",
#                 "youtube": _yt("REST API design tutorial fetch axios react"),
#                 "alt_resource": "https://restfulapi.net/",
#             },
#         ],
#         "advanced": [
#             {
#                 "title": "Full Stack Project — MERN or PERN Stack",
#                 "url": "https://fullstackopen.com/en/",
#                 "youtube": _yt("full stack MERN project tutorial 2024"),
#                 "alt_resource": "https://www.theodinproject.com/paths/full-stack-javascript",
#             },
#             {
#                 "title": "Authentication — JWT, OAuth2, Sessions",
#                 "url": "https://auth0.com/docs/",
#                 "youtube": _yt("JWT authentication react node.js full tutorial"),
#                 "alt_resource": "https://www.passportjs.org/",
#             },
#             {
#                 "title": "Web Performance Optimisation",
#                 "url": "https://web.dev/fast/",
#                 "youtube": _yt("web performance optimisation tips 2024"),
#                 "alt_resource": "https://developer.chrome.com/docs/lighthouse/",
#             },
#             {
#                 "title": "DevOps Basics — Docker + CI/CD Pipeline",
#                 "url": "https://docs.docker.com/get-started/",
#                 "youtube": _yt("docker ci cd pipeline github actions beginners"),
#                 "alt_resource": "https://docs.github.com/en/actions",
#             },
#         ],
#         "timeline": {
#             "weeks_1_2": "HTML + CSS + JS fundamentals",
#             "weeks_3_4": "React + Git",
#             "weeks_5_8": "Node.js + DB + REST APIs",
#             "weeks_9_12": "Full stack project + Auth + Deploy",
#         },
#     },

#     # ── AI/ML ENGINEER ────────────────────────────────────────────
#     "AI/ML Engineer": {
#         "beginner": [
#             {
#                 "title": "Mathematics for ML — Linear Algebra & Calculus",
#                 "url": "https://www.deeplearning.ai/courses/mathematics-for-machine-learning-and-data-science-specialization/",
#                 "youtube": _yt("mathematics for machine learning linear algebra calculus"),
#                 "alt_resource": "https://www.khanacademy.org/math/linear-algebra",
#             },
#             {
#                 "title": "Statistics & Probability for ML",
#                 "url": "https://www.khanacademy.org/math/statistics-probability",
#                 "youtube": _yt("statistics probability machine learning explained"),
#                 "alt_resource": "https://statquest.org/",
#             },
#             {
#                 "title": "Python for ML — NumPy, Pandas, Scikit-learn",
#                 "url": "https://scikit-learn.org/stable/getting_started.html",
#                 "youtube": _yt("python machine learning scikit learn crash course"),
#                 "alt_resource": "https://www.kaggle.com/learn",
#             },
#             {
#                 "title": "EDA & Feature Engineering",
#                 "url": "https://www.kaggle.com/learn/feature-engineering",
#                 "youtube": _yt("EDA feature engineering machine learning tutorial python"),
#                 "alt_resource": "https://towardsdatascience.com/",
#             },
#         ],
#         "intermediate": [
#             {
#                 "title": "Deep Learning Fundamentals — Neural Networks",
#                 "url": "https://www.deeplearning.ai/",
#                 "youtube": _yt("deep learning neural networks explained from scratch"),
#                 "alt_resource": "https://www.fast.ai/",
#             },
#             {
#                 "title": "PyTorch / TensorFlow — Hands-on Coding",
#                 "url": "https://www.tensorflow.org/tutorials",
#                 "youtube": _yt("pytorch tutorial deep learning full course 2024"),
#                 "alt_resource": "https://pytorch.org/tutorials/",
#             },
#             {
#                 "title": "Computer Vision — CNNs (CS231n Stanford)",
#                 "url": "https://cs231n.github.io/",
#                 "youtube": _yt("CNN convolutional neural network tutorial image classification"),
#                 "alt_resource": "https://keras.io/guides/",
#             },
#             {
#                 "title": "NLP — Transformers, BERT, GPT (Hugging Face)",
#                 "url": "https://huggingface.co/course/",
#                 "youtube": _yt("NLP transformers BERT hugging face fine tuning tutorial"),
#                 "alt_resource": "https://www.nltk.org/book/",
#             },
#         ],
#         "advanced": [
#             {
#                 "title": "MLOps — MLflow, Docker, Kubernetes, CI/CD for ML",
#                 "url": "https://mlflow.org/docs/latest/tutorials-and-examples/index.html",
#                 "youtube": _yt("MLOps full course mlflow docker kubernetes tutorial"),
#                 "alt_resource": "https://madewithml.com/",
#             },
#             {
#                 "title": "Model Optimisation — Pruning, Quantisation",
#                 "url": "https://pytorch.org/tutorials/recipes/recipes/tuning_guide.html",
#                 "youtube": _yt("model optimization pruning quantization pytorch tutorial"),
#                 "alt_resource": "https://developer.nvidia.com/tensorrt",
#             },
#             {
#                 "title": "Research Papers — Read & Implement",
#                 "url": "https://paperswithcode.com/",
#                 "youtube": _yt("how to read AI research papers and implement them"),
#                 "alt_resource": "https://arxiv.org/list/cs.AI/recent",
#             },
#             {
#                 "title": "Production ML Systems — Serving at Scale",
#                 "url": "https://madewithml.com/",
#                 "youtube": _yt("production ML system design serving deployment tutorial"),
#                 "alt_resource": "https://www.seldon.io/",
#             },
#         ],
#         "timeline": {
#             "weeks_1_3": "Math (Lin Algebra + Stats) + Python basics",
#             "weeks_4_6": "ML algorithms + Scikit-learn + Kaggle",
#             "weeks_7_10": "Deep Learning (CNN + NLP) + PyTorch",
#             "weeks_11_14": "MLOps + Model Optimization + Projects",
#         },
#     },

#     # ── CLOUD ENGINEER ────────────────────────────────────────────
#     "Cloud Engineer": {
#         "beginner": [
#             {
#                 "title": "Linux Command Line Essentials",
#                 "url": "https://linuxcommand.org/",
#                 "youtube": _yt("linux command line full course beginners 2024"),
#                 "alt_resource": "https://ubuntu.com/tutorials/command-line-for-beginners",
#             },
#             {
#                 "title": "Networking Fundamentals — TCP/IP, DNS, HTTP",
#                 "url": "https://www.networklessons.com/",
#                 "youtube": _yt("networking fundamentals TCP IP DNS explained"),
#                 "alt_resource": "https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/How_does_the_Internet_work",
#             },
#             {
#                 "title": "AWS Cloud Practitioner Essentials",
#                 "url": "https://aws.amazon.com/training/",
#                 "youtube": _yt("AWS cloud practitioner essentials full course 2024"),
#                 "alt_resource": "https://www.cloudskillsboost.google/",
#             },
#             {
#                 "title": "Bash Scripting for Automation",
#                 "url": "https://www.learnshell.org/",
#                 "youtube": _yt("bash scripting full course beginners linux"),
#                 "alt_resource": "https://tldp.org/LDP/abs/html/",
#             },
#         ],
#         "intermediate": [
#             {
#                 "title": "Docker — Containerisation from Scratch",
#                 "url": "https://docs.docker.com/get-started/",
#                 "youtube": _yt("docker tutorial beginners full course 2024"),
#                 "alt_resource": "https://www.docker.com/101-tutorial/",
#             },
#             {
#                 "title": "Kubernetes — Orchestrating Containers",
#                 "url": "https://kubernetes.io/docs/tutorials/",
#                 "youtube": _yt("kubernetes tutorial beginners k8s full course"),
#                 "alt_resource": "https://kodekloud.com/courses/kubernetes-for-the-absolute-beginners-hands-on/",
#             },
#             {
#                 "title": "Terraform — Infrastructure as Code (IaC)",
#                 "url": "https://developer.hashicorp.com/terraform/tutorials",
#                 "youtube": _yt("terraform infrastructure as code tutorial beginners"),
#                 "alt_resource": "https://www.pulumi.com/learn/",
#             },
#             {
#                 "title": "CI/CD Pipelines — GitHub Actions / Jenkins",
#                 "url": "https://docs.github.com/en/actions",
#                 "youtube": _yt("CI CD pipeline github actions tutorial full course"),
#                 "alt_resource": "https://www.jenkins.io/doc/tutorials/",
#             },
#         ],
#         "advanced": [
#             {
#                 "title": "AWS Solutions Architect — Associate Certification",
#                 "url": "https://aws.amazon.com/certification/certified-solutions-architect-associate/",
#                 "youtube": _yt("AWS solutions architect associate exam prep 2024"),
#                 "alt_resource": "https://acloudguru.com/",
#             },
#             {
#                 "title": "Google Cloud Professional — GCP Qwiklabs",
#                 "url": "https://www.cloudskillsboost.google/",
#                 "youtube": _yt("Google Cloud Platform GCP tutorial full course 2024"),
#                 "alt_resource": "https://cloud.google.com/learn/training",
#             },
#             {
#                 "title": "Site Reliability Engineering (SRE) Principles",
#                 "url": "https://sre.google/sre-book/table-of-contents/",
#                 "youtube": _yt("site reliability engineering SRE full course tutorial"),
#                 "alt_resource": "https://kodekloud.com/",
#             },
#             {
#                 "title": "Multi-cloud Architecture & Cost Optimisation",
#                 "url": "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
#                 "youtube": _yt("multi cloud architecture design AWS Azure GCP"),
#                 "alt_resource": "https://cloud.google.com/architecture",
#             },
#         ],
#         "timeline": {
#             "weeks_1_2": "Linux + Networking + Bash",
#             "weeks_3_4": "AWS basics + Cloud concepts",
#             "weeks_5_8": "Docker + Kubernetes + Terraform + CI/CD",
#             "weeks_9_12": "Cloud certifications + SRE + Projects",
#         },
#     },

#     # ── CYBERSECURITY ANALYST ─────────────────────────────────────
#     "Cybersecurity Analyst": {
#         "beginner": [
#             {
#                 "title": "Cybersecurity Fundamentals — TryHackMe (Free)",
#                 "url": "https://tryhackme.com/",
#                 "youtube": _yt("cybersecurity full course beginners 2024 ethical hacking"),
#                 "alt_resource": "https://www.cybrary.it/",
#             },
#             {
#                 "title": "Networking for Security — TCP/IP, Firewalls, VPN",
#                 "url": "https://www.networklessons.com/",
#                 "youtube": _yt("networking for cybersecurity beginners TCP IP firewalls"),
#                 "alt_resource": "https://professor-messer.com/",
#             },
#             {
#                 "title": "Linux for Security — Command Line & Permissions",
#                 "url": "https://linuxcommand.org/",
#                 "youtube": _yt("linux for cybersecurity ethical hacking kali linux"),
#                 "alt_resource": "https://overthewire.org/wargames/bandit/",
#             },
#             {
#                 "title": "OWASP Top 10 — Web Vulnerabilities",
#                 "url": "https://owasp.org/www-project-top-ten/",
#                 "youtube": _yt("OWASP top 10 vulnerabilities explained tutorial"),
#                 "alt_resource": "https://portswigger.net/web-security",
#             },
#         ],
#         "intermediate": [
#             {
#                 "title": "Ethical Hacking — HackTheBox & CTF Challenges",
#                 "url": "https://www.hackthebox.com/",
#                 "youtube": _yt("ethical hacking full course kali linux 2024"),
#                 "alt_resource": "https://picoctf.org/",
#             },
#             {
#                 "title": "Cryptography Fundamentals",
#                 "url": "https://cryptohack.org/",
#                 "youtube": _yt("cryptography fundamentals symmetric asymmetric encryption"),
#                 "alt_resource": "https://www.crypto101.io/",
#             },
#             {
#                 "title": "Wireshark — Packet Analysis & Network Forensics",
#                 "url": "https://www.wireshark.org/docs/",
#                 "youtube": _yt("wireshark tutorial full course network analysis"),
#                 "alt_resource": "https://www.tcpdump.org/",
#             },
#             {
#                 "title": "Metasploit & Penetration Testing",
#                 "url": "https://www.metasploit.com/",
#                 "youtube": _yt("metasploit penetration testing tutorial beginners"),
#                 "alt_resource": "https://tryhackme.com/module/metasploit",
#             },
#         ],
#         "advanced": [
#             {
#                 "title": "SIEM & SOC Analyst — Splunk / Elastic",
#                 "url": "https://www.splunk.com/en_us/training.html",
#                 "youtube": _yt("SIEM SOC analyst splunk elastic tutorial 2024"),
#                 "alt_resource": "https://www.elastic.co/training/",
#             },
#             {
#                 "title": "Bug Bounty Hunting — HackerOne & Bugcrowd",
#                 "url": "https://www.hackerone.com/",
#                 "youtube": _yt("bug bounty hunting beginners guide web hacking"),
#                 "alt_resource": "https://www.bugcrowd.com/",
#             },
#             {
#                 "title": "Digital Forensics & Incident Response (DFIR)",
#                 "url": "https://www.sans.org/",
#                 "youtube": _yt("digital forensics incident response DFIR tutorial"),
#                 "alt_resource": "https://www.autopsy.com/",
#             },
#             {
#                 "title": "CompTIA Security+ / CEH Certification Prep",
#                 "url": "https://www.comptia.org/certifications/security",
#                 "youtube": _yt("CompTIA Security+ full course exam prep 2024"),
#                 "alt_resource": "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/",
#             },
#         ],
#         "timeline": {
#             "weeks_1_2": "Networking + Linux + OWASP basics",
#             "weeks_3_4": "TryHackMe rooms + Cryptography",
#             "weeks_5_8": "HackTheBox + Wireshark + Metasploit",
#             "weeks_9_12": "SIEM + Bug bounty + Certification prep",
#         },
#     },

#     # ── DATA ENGINEER ─────────────────────────────────────────────
#     "Data Engineer": {
#         "beginner": [
#             {
#                 "title": "Python for Data Engineering",
#                 "url": "https://realpython.com/",
#                 "youtube": _yt("python data engineering tutorial beginners 2024"),
#                 "alt_resource": "https://www.datacamp.com/",
#             },
#             {
#                 "title": "Advanced SQL — Joins, Window Functions, CTEs",
#                 "url": "https://mode.com/sql-tutorial/",
#                 "youtube": _yt("advanced SQL window functions CTEs data engineering"),
#                 "alt_resource": "https://www.postgresqltutorial.com/",
#             },
#             {
#                 "title": "Data Modelling — Star Schema, Data Warehouse",
#                 "url": "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/",
#                 "youtube": _yt("data modelling star schema data warehouse tutorial"),
#                 "alt_resource": "https://www.databricks.com/glossary/data-pipeline",
#             },
#             {
#                 "title": "Introduction to ETL Pipelines",
#                 "url": "https://www.databricks.com/glossary/data-pipeline",
#                 "youtube": _yt("ETL pipeline data engineering tutorial python"),
#                 "alt_resource": "https://docs.getdbt.com/",
#             },
#         ],
#         "intermediate": [
#             {
#                 "title": "Apache Spark — Distributed Data Processing",
#                 "url": "https://spark.apache.org/docs/latest/",
#                 "youtube": _yt("apache spark pyspark tutorial beginners 2024"),
#                 "alt_resource": "https://www.databricks.com/learn/training",
#             },
#             {
#                 "title": "Apache Kafka — Real-time Streaming",
#                 "url": "https://kafka.apache.org/documentation/",
#                 "youtube": _yt("apache kafka tutorial beginners real time streaming"),
#                 "alt_resource": "https://developer.confluent.io/learn-kafka/",
#             },
#             {
#                 "title": "Apache Airflow — Workflow Orchestration",
#                 "url": "https://airflow.apache.org/docs/",
#                 "youtube": _yt("apache airflow tutorial DAGs pipeline orchestration"),
#                 "alt_resource": "https://astronomer.io/learn/",
#             },
#             {
#                 "title": "dbt (data build tool) — Transform in Warehouse",
#                 "url": "https://docs.getdbt.com/",
#                 "youtube": _yt("dbt data build tool tutorial analytics engineering"),
#                 "alt_resource": "https://www.getdbt.com/learn/",
#             },
#         ],
#         "advanced": [
#             {
#                 "title": "Databricks Lakehouse Platform",
#                 "url": "https://docs.databricks.com/",
#                 "youtube": _yt("databricks lakehouse platform tutorial delta lake"),
#                 "alt_resource": "https://www.databricks.com/learn/training",
#             },
#             {
#                 "title": "Cloud Data — AWS Glue + S3 + Redshift",
#                 "url": "https://aws.amazon.com/glue/",
#                 "youtube": _yt("AWS glue S3 Redshift data pipeline tutorial"),
#                 "alt_resource": "https://aws.amazon.com/redshift/getting-started/",
#             },
#             {
#                 "title": "Google BigQuery for Large-Scale Analytics",
#                 "url": "https://cloud.google.com/bigquery/docs",
#                 "youtube": _yt("google bigquery tutorial full course data engineering"),
#                 "alt_resource": "https://cloud.google.com/bigquery/docs/quickstarts",
#             },
#             {
#                 "title": "Real-Time Streaming — Kafka Streams / Flink",
#                 "url": "https://kafka.apache.org/documentation/streams/",
#                 "youtube": _yt("kafka streams apache flink real time data processing"),
#                 "alt_resource": "https://nightlies.apache.org/flink/flink-docs-stable/",
#             },
#         ],
#         "timeline": {
#             "weeks_1_2": "Python + Advanced SQL + Data Modelling",
#             "weeks_3_4": "ETL Pipelines + dbt basics",
#             "weeks_5_8": "Spark + Kafka + Airflow",
#             "weeks_9_12": "Cloud (AWS/GCP) + Databricks + Projects",
#         },
#     },
# }


# class RoadmapService:
#     """
#     RoadmapService — How it works:
#     ────────────────────────────────────────────────────────────────
#     Algorithm 1: Hash Map Lookup  O(1)
#         - ROADMAP_TEMPLATES[career_domain] → returns pre-built plan
#         - Falls back to "Software Engineer" if domain not found

#     Algorithm 2: Priority Injection  O(k)
#         - Missing skills (from SkillGapEngine) are prepended to
#           the beginner steps so students fill gaps FIRST
#         - Only top 5 missing skills injected to avoid overload

#     Algorithm 3: YouTube URL Builder  O(n)
#         - Every injected missing-skill step automatically gets a
#           YouTube search link: youtube.com/results?search_query=...
#     ────────────────────────────────────────────────────────────────
#     """

#     def get_roadmap(self, career_domain: str, missing_skills: list = None) -> dict:
#         template = ROADMAP_TEMPLATES.get(
#             career_domain,
#             ROADMAP_TEMPLATES["Software Engineer"]   # fallback
#         )

#         steps = {
#             "beginner":     [s.copy() for s in template["beginner"]],
#             "intermediate": [s.copy() for s in template["intermediate"]],
#             "advanced":     [s.copy() for s in template["advanced"]],
#         }

#         # ── Priority Injection: missing skills go to the TOP ──────
#         if missing_skills:
#             injected = [
#                 {
#                     "title": f"Learn & practise: {skill.title()}",
#                     "url":   f"https://www.google.com/search?q={skill.replace(' ', '+')}+tutorial+for+beginners",
#                     "youtube": _yt(f"{skill} tutorial for beginners"),
#                     "alt_resource": f"https://www.geeksforgeeks.org/search/?q={skill.replace(' ', '+')}",
#                 }
#                 for skill in missing_skills[:5]   # limit to top 5
#             ]
#             steps["beginner"] = injected + steps["beginner"]

#         return {
#             "steps":         steps,
#             "timeline":      template["timeline"],
#             "career_domain": career_domain,
#         }