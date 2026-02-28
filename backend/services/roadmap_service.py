ROADMAP_TEMPLATES = {
    "Software Engineer": {
        "beginner"    : [
            {"title": "Learn Python/Java basics", "url": "https://www.codecademy.com/catalog/language/python"},
            {"title": "Understand OOP concepts", "url": "https://www.freecodecamp.org/news/object-oriented-programming-concepts-21bb035f7260/"},
            {"title": "Learn SQL & DBMS fundamentals", "url": "https://sqlbolt.com/"},
            {"title": "Build a simple CRUD app", "url": "https://www.theodinproject.com/"}
        ],
        "intermediate": [
            {"title": "Learn Data Structures & Algorithms", "url": "https://leetcode.com/explore/"},
            {"title": "Build REST APIs with Flask/Django", "url": "https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world"},
            {"title": "Learn Git & GitHub", "url": "https://skills.github.com/"},
            {"title": "Deploy on Heroku/Render", "url": "https://render.com/docs"}
        ],
        "advanced"    : [
            {"title": "System Design fundamentals", "url": "https://github.com/donnemartin/system-design-primer"},
            {"title": "Microservices architecture", "url": "https://microservices.io/"},
            {"title": "Cloud deployment (AWS/GCP)", "url": "https://aws.amazon.com/training/"},
            {"title": "Contribute to open source", "url": "https://goodfirstissue.dev/"}
        ],
        "timeline"    : {"weeks_1_2": "Core language", "weeks_3_4": "OOP + DB", "weeks_5_8": "DSA + APIs", "weeks_9_12": "Projects + Deploy"}
    },
    "Data Scientist": {
        "beginner"    : [
            {"title": "Python basics", "url": "https://www.datacamp.com/"},
            {"title": "NumPy & Pandas", "url": "https://pandas.pydata.org/docs/user_guide/10min.html"},
            {"title": "Statistics fundamentals", "url": "https://www.khanacademy.org/math/statistics-probability"},
            {"title": "Data visualization with Matplotlib/Seaborn", "url": "https://seaborn.pydata.org/tutorial.html"}
        ],
        "intermediate": [
            {"title": "Machine Learning with Scikit-learn", "url": "https://scikit-learn.org/stable/tutorial/index.html"},
            {"title": "Feature engineering", "url": "https://www.coursera.org/"},
            {"title": "SQL for data analysis", "url": "https://mode.com/sql-tutorial/"},
            {"title": "Kaggle competitions", "url": "https://www.kaggle.com/"}
        ],
        "advanced"    : [
            {"title": "Deep Learning (TensorFlow/PyTorch)", "url": "https://pytorch.org/tutorials/"},
            {"title": "NLP & Computer Vision", "url": "https://huggingface.co/course/chapter1/1"},
            {"title": "MLOps & model deployment", "url": "https://ml-ops.org/"},
            {"title": "Research papers", "url": "https://paperswithcode.com/"}
        ],
        "timeline"    : {"weeks_1_2": "Python + Stats", "weeks_3_4": "Pandas + Viz", "weeks_5_8": "ML models", "weeks_9_12": "DL + Deployment"}
    },
    "Web Developer": {
        "beginner"    : [
            {"title": "HTML5 & CSS3", "url": "https://www.theodinproject.com/paths/foundations/courses/foundations"},
            {"title": "JavaScript ES6+", "url": "https://javascript.info/"},
            {"title": "Responsive design", "url": "https://web.dev/responsive/"},
            {"title": "Version control with Git", "url": "https://learngitbranching.js.org/"}
        ],
        "intermediate": [
            {"title": "React.js / Vue.js", "url": "https://react.dev/learn"},
            {"title": "Node.js & Express", "url": "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs"},
            {"title": "REST API consumption", "url": "https://www.postman.com/api-platform/api-client/"},
            {"title": "Database integration (MongoDB/MySQL)", "url": "https://www.mongodb.com/basics"}
        ],
        "advanced"    : [
            {"title": "Full stack project", "url": "https://fullstackopen.com/en/"},
            {"title": "Authentication & security", "url": "https://auth0.com/docs/"},
            {"title": "Performance optimisation", "url": "https://web.dev/fast/"},
            {"title": "DevOps basics (Docker/CI-CD)", "url": "https://docs.docker.com/get-started/"}
        ],
        "timeline"    : {"weeks_1_2": "HTML+CSS+JS", "weeks_3_4": "React basics", "weeks_5_8": "Backend + DB", "weeks_9_12": "Full project"}
    },
    "AI/ML Engineer": {
        "beginner"    : [
            {"title": "Python & Mathematics", "url": "https://www.deeplearning.ai/courses/mathematics-for-machine-learning-and-data-science-specialization/"},
            {"title": "Statistics & Probability", "url": "https://www.khanacademy.org/math/statistics-probability"},
            {"title": "Scikit-learn basics", "url": "https://scikit-learn.org/stable/getting_started.html"},
            {"title": "EDA with Pandas", "url": "https://towardsdatascience.com/exploratory-data-analysis-eda-with-pandas-profiling-a-comprehensive-guide-22fb11d4e687"}
        ],
        "intermediate": [
            {"title": "Deep Learning fundamentals", "url": "https://www.deeplearning.ai/"},
            {"title": "PyTorch/TensorFlow", "url": "https://www.tensorflow.org/tutorials"},
            {"title": "Computer Vision (CNN)", "url": "https://cs231n.github.io/"},
            {"title": "NLP (BERT, Transformers)", "url": "https://huggingface.co/course/"}
        ],
        "advanced"    : [
            {"title": "MLOps (MLflow, Docker, Kubernetes)", "url": "https://mlflow.org/docs/latest/tutorials-and-examples/index.html"},
            {"title": "Model optimisation", "url": "https://pytorch.org/tutorials/recipes/recipes/tuning_guide.html"},
            {"title": "Research & paper reading", "url": "https://paperswithcode.com/"},
            {"title": "Production ML systems", "url": "https://madewithml.com/"}
        ],
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
            extra = [{"title": f"Learn & practise: {skill}", "url": f"https://www.youtube.com/results?search_query={skill.replace(' ', '+')}+tutorial"} for skill in missing_skills[:5]]
            steps["beginner"] = extra + steps["beginner"]
        return {"steps": steps, "timeline": template["timeline"], "career_domain": career_domain}
