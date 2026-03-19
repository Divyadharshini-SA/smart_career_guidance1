"""
roadmap_service.py — Complete roadmap templates for ALL 12 domains.
Previously only had 4 domains. Now covers every domain in skill_gap.py.
"""

ROADMAP_TEMPLATES = {

    # ── 1. Software Engineer ──────────────────────────────────
    "Software Engineer": {
        "beginner": [
            {"title": "Learn Python or Java basics",            "url": "https://www.codecademy.com/catalog/language/python"},
            {"title": "Understand OOP concepts",                "url": "https://www.freecodecamp.org/news/object-oriented-programming-concepts-21bb035f7260/"},
            {"title": "Learn SQL & DBMS fundamentals",          "url": "https://sqlbolt.com/"},
            {"title": "Build a simple CRUD application",        "url": "https://www.theodinproject.com/"},
        ],
        "intermediate": [
            {"title": "Master Data Structures & Algorithms",    "url": "https://leetcode.com/explore/"},
            {"title": "Build REST APIs with FastAPI or Django", "url": "https://fastapi.tiangolo.com/tutorial/"},
            {"title": "Learn Git & GitHub workflows",           "url": "https://skills.github.com/"},
            {"title": "Deploy your app on Render or Railway",   "url": "https://render.com/docs"},
        ],
        "advanced": [
            {"title": "System Design fundamentals",             "url": "https://github.com/donnemartin/system-design-primer"},
            {"title": "Microservices architecture patterns",    "url": "https://microservices.io/"},
            {"title": "Cloud deployment on AWS or GCP",        "url": "https://aws.amazon.com/training/"},
            {"title": "Contribute to open source projects",     "url": "https://goodfirstissue.dev/"},
        ],
        "timeline": {"weeks_1_2": "Core language + OOP", "weeks_3_4": "SQL + Git", "weeks_5_8": "DSA + APIs", "weeks_9_12": "Deploy + Projects"},
    },

    # ── 2. Web Developer (Frontend) ──────────────────────────
    "Web Developer (Frontend)": {
        "beginner": [
            {"title": "HTML5 & CSS3 fundamentals",              "url": "https://www.theodinproject.com/paths/foundations"},
            {"title": "JavaScript ES6+ basics",                 "url": "https://javascript.info/"},
            {"title": "Responsive design with Flexbox & Grid",  "url": "https://web.dev/responsive/"},
            {"title": "Version control with Git",               "url": "https://learngitbranching.js.org/"},
        ],
        "intermediate": [
            {"title": "React.js — components, hooks, state",    "url": "https://react.dev/learn"},
            {"title": "TypeScript for large apps",              "url": "https://www.typescriptlang.org/docs/"},
            {"title": "Tailwind CSS for rapid styling",         "url": "https://tailwindcss.com/docs"},
            {"title": "Consuming REST APIs with Axios/Fetch",   "url": "https://axios-http.com/docs/intro"},
        ],
        "advanced": [
            {"title": "Next.js — SSR, SSG, App Router",         "url": "https://nextjs.org/docs"},
            {"title": "Performance optimisation & Core Web Vitals", "url": "https://web.dev/fast/"},
            {"title": "Authentication (OAuth, JWT)",             "url": "https://auth0.com/docs/"},
            {"title": "Build and deploy a full portfolio",       "url": "https://vercel.com/docs"},
        ],
        "timeline": {"weeks_1_2": "HTML + CSS + JS", "weeks_3_4": "React basics", "weeks_5_8": "TypeScript + Tailwind", "weeks_9_12": "Next.js + Deploy"},
    },

    # ── 3. Web Developer (Backend) ───────────────────────────
    "Web Developer (Backend)": {
        "beginner": [
            {"title": "Python fundamentals + OOP",              "url": "https://cs50.harvard.edu/python/"},
            {"title": "SQL — joins, indexes, transactions",     "url": "https://mode.com/sql-tutorial/"},
            {"title": "HTTP basics & REST API concepts",        "url": "https://restfulapi.net/"},
            {"title": "Git & GitHub basics",                    "url": "https://skills.github.com/"},
        ],
        "intermediate": [
            {"title": "FastAPI — build production-ready APIs",  "url": "https://fastapi.tiangolo.com/tutorial/"},
            {"title": "JWT Authentication & OAuth2",            "url": "https://fastapi.tiangolo.com/tutorial/security/"},
            {"title": "SQLAlchemy ORM & database design",       "url": "https://docs.sqlalchemy.org/en/14/tutorial/"},
            {"title": "Docker — containerize your app",         "url": "https://docs.docker.com/get-started/"},
        ],
        "advanced": [
            {"title": "System design — caching, queues, scaling", "url": "https://github.com/donnemartin/system-design-primer"},
            {"title": "Redis for caching & sessions",           "url": "https://redis.io/docs/getting-started/"},
            {"title": "CI/CD with GitHub Actions",              "url": "https://docs.github.com/en/actions"},
            {"title": "Deploy on AWS EC2 / RDS",                "url": "https://aws.amazon.com/getting-started/"},
        ],
        "timeline": {"weeks_1_2": "Python + SQL", "weeks_3_4": "FastAPI + Auth", "weeks_5_8": "Docker + ORM", "weeks_9_12": "System Design + Deploy"},
    },

    # ── 4. Data Scientist ─────────────────────────────────────
    "Data Scientist": {
        "beginner": [
            {"title": "Python basics for data",                 "url": "https://www.datacamp.com/"},
            {"title": "NumPy & Pandas — data manipulation",     "url": "https://pandas.pydata.org/docs/user_guide/10min.html"},
            {"title": "Statistics & probability fundamentals",  "url": "https://www.khanacademy.org/math/statistics-probability"},
            {"title": "Data visualisation with Matplotlib/Seaborn", "url": "https://seaborn.pydata.org/tutorial.html"},
        ],
        "intermediate": [
            {"title": "Machine Learning with Scikit-learn",     "url": "https://scikit-learn.org/stable/tutorial/index.html"},
            {"title": "Feature engineering & EDA",              "url": "https://www.kaggle.com/learn/feature-engineering"},
            {"title": "SQL for data analysis",                  "url": "https://mode.com/sql-tutorial/"},
            {"title": "Kaggle competitions — practical ML",     "url": "https://www.kaggle.com/"},
        ],
        "advanced": [
            {"title": "Deep Learning — TensorFlow or PyTorch",  "url": "https://pytorch.org/tutorials/"},
            {"title": "NLP & Computer Vision basics",           "url": "https://huggingface.co/course/chapter1/1"},
            {"title": "MLOps & model deployment",               "url": "https://ml-ops.org/"},
            {"title": "Read research papers on Papers With Code","url": "https://paperswithcode.com/"},
        ],
        "timeline": {"weeks_1_2": "Python + Stats", "weeks_3_4": "Pandas + Viz", "weeks_5_8": "ML models", "weeks_9_12": "DL + Deployment"},
    },

    # ── 5. AI / ML Engineer ───────────────────────────────────
    "AI / ML Engineer": {
        "beginner": [
            {"title": "Python & Mathematics for ML",            "url": "https://www.deeplearning.ai/courses/mathematics-for-machine-learning-and-data-science-specialization/"},
            {"title": "Statistics & probability",               "url": "https://www.khanacademy.org/math/statistics-probability"},
            {"title": "Scikit-learn basics",                    "url": "https://scikit-learn.org/stable/getting_started.html"},
            {"title": "EDA & feature engineering with Pandas",  "url": "https://www.kaggle.com/learn/pandas"},
        ],
        "intermediate": [
            {"title": "Deep Learning fundamentals",             "url": "https://www.deeplearning.ai/"},
            {"title": "PyTorch — neural networks from scratch", "url": "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html"},
            {"title": "Computer Vision — CNN, YOLO",            "url": "https://cs231n.github.io/"},
            {"title": "NLP — BERT, Transformers, HuggingFace",  "url": "https://huggingface.co/course/"},
        ],
        "advanced": [
            {"title": "MLOps — MLflow, DVC, Docker",            "url": "https://mlflow.org/docs/latest/tutorials-and-examples/index.html"},
            {"title": "Model optimisation & quantisation",      "url": "https://pytorch.org/tutorials/recipes/recipes/tuning_guide.html"},
            {"title": "Production ML systems",                  "url": "https://madewithml.com/"},
            {"title": "Read & implement research papers",       "url": "https://paperswithcode.com/"},
        ],
        "timeline": {"weeks_1_3": "Math + Python", "weeks_4_6": "ML basics", "weeks_7_10": "Deep Learning", "weeks_11_14": "MLOps + Projects"},
    },

    # ── 6. Data Engineer ──────────────────────────────────────
    "Data Engineer": {
        "beginner": [
            {"title": "Python for data processing",             "url": "https://cs50.harvard.edu/python/"},
            {"title": "Advanced SQL — window functions, CTEs",  "url": "https://mode.com/sql-tutorial/"},
            {"title": "Data warehousing concepts",              "url": "https://www.youtube.com/results?search_query=data+warehousing+tutorial"},
            {"title": "Git & Linux command line basics",        "url": "https://linuxjourney.com/"},
        ],
        "intermediate": [
            {"title": "Apache Spark — big data processing",     "url": "https://spark.apache.org/docs/latest/quick-start.html"},
            {"title": "ETL pipelines with Apache Airflow",      "url": "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html"},
            {"title": "Apache Kafka — event streaming",         "url": "https://kafka.apache.org/quickstart"},
            {"title": "Docker for data engineering",            "url": "https://docs.docker.com/get-started/"},
        ],
        "advanced": [
            {"title": "AWS — S3, Glue, Redshift, Lambda",       "url": "https://aws.amazon.com/training/"},
            {"title": "dbt — transform data in the warehouse",  "url": "https://docs.getdbt.com/docs/introduction"},
            {"title": "Schema design & data modelling",         "url": "https://www.youtube.com/results?search_query=data+modeling+dimensional+modeling"},
            {"title": "Real-time data pipelines project",       "url": "https://github.com/DataTalksClub/data-engineering-zoomcamp"},
        ],
        "timeline": {"weeks_1_2": "Python + SQL", "weeks_3_5": "Spark + Airflow", "weeks_6_8": "Kafka + Docker", "weeks_9_12": "AWS + Project"},
    },

    # ── 7. Cloud / DevOps Engineer ───────────────────────────
    "Cloud / DevOps Engineer": {
        "beginner": [
            {"title": "Linux fundamentals",                     "url": "https://linuxjourney.com/"},
            {"title": "Bash scripting basics",                  "url": "https://www.shellscript.sh/"},
            {"title": "Networking — TCP/IP, DNS, HTTP",         "url": "https://www.youtube.com/results?search_query=computer+networking+full+course"},
            {"title": "Git & version control workflows",        "url": "https://learngitbranching.js.org/"},
        ],
        "intermediate": [
            {"title": "Docker — containers from scratch",       "url": "https://docs.docker.com/get-started/"},
            {"title": "Kubernetes — orchestration basics",      "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/"},
            {"title": "CI/CD with GitHub Actions",              "url": "https://docs.github.com/en/actions"},
            {"title": "AWS core services — EC2, S3, VPC, IAM", "url": "https://aws.amazon.com/free/"},
        ],
        "advanced": [
            {"title": "Terraform — infrastructure as code",     "url": "https://developer.hashicorp.com/terraform/tutorials"},
            {"title": "Monitoring — Prometheus + Grafana",      "url": "https://prometheus.io/docs/introduction/overview/"},
            {"title": "AWS Solutions Architect certification",  "url": "https://aws.amazon.com/certification/certified-solutions-architect-associate/"},
            {"title": "Site Reliability Engineering practices", "url": "https://sre.google/books/"},
        ],
        "timeline": {"weeks_1_2": "Linux + Bash", "weeks_3_4": "Docker + Git", "weeks_5_8": "Kubernetes + AWS", "weeks_9_12": "Terraform + Cert"},
    },

    # ── 8. Cybersecurity Analyst ──────────────────────────────
    "Cybersecurity Analyst": {
        "beginner": [
            {"title": "Networking fundamentals — TCP/IP, OSI",  "url": "https://www.youtube.com/results?search_query=networking+fundamentals+cybersecurity"},
            {"title": "Linux for security",                     "url": "https://linuxjourney.com/"},
            {"title": "Python basics for scripting",            "url": "https://cs50.harvard.edu/python/"},
            {"title": "OWASP Top 10 — web vulnerabilities",     "url": "https://owasp.org/www-project-top-ten/"},
        ],
        "intermediate": [
            {"title": "Ethical hacking — Kali Linux, Metasploit", "url": "https://www.kali.org/docs/"},
            {"title": "Web penetration testing",                "url": "https://portswigger.net/web-security"},
            {"title": "Cryptography fundamentals",              "url": "https://www.coursera.org/learn/crypto"},
            {"title": "Security operations & SIEM tools",       "url": "https://www.youtube.com/results?search_query=SIEM+tutorial+splunk"},
        ],
        "advanced": [
            {"title": "Incident response & forensics",          "url": "https://www.sans.org/cyber-security-courses/"},
            {"title": "Cloud security — AWS/Azure security",    "url": "https://aws.amazon.com/security/"},
            {"title": "CEH or CompTIA Security+ certification", "url": "https://www.comptia.org/certifications/security"},
            {"title": "CTF challenges on HackTheBox",           "url": "https://www.hackthebox.com/"},
        ],
        "timeline": {"weeks_1_2": "Networking + Linux", "weeks_3_4": "OWASP + Python", "weeks_5_8": "Pen Testing + Crypto", "weeks_9_12": "Certifications + CTF"},
    },

    # ── 9. Android Developer ─────────────────────────────────
    "Android Developer": {
        "beginner": [
            {"title": "Kotlin fundamentals",                    "url": "https://developer.android.com/courses/android-basics-compose/course"},
            {"title": "Android Studio setup & first app",       "url": "https://developer.android.com/studio/intro"},
            {"title": "Java basics (for legacy codebases)",     "url": "https://www.codecademy.com/learn/learn-java"},
            {"title": "Git & GitHub version control",           "url": "https://skills.github.com/"},
        ],
        "intermediate": [
            {"title": "Jetpack Compose — modern UI",            "url": "https://developer.android.com/courses/jetpack-compose/course"},
            {"title": "MVVM architecture pattern",              "url": "https://developer.android.com/topic/architecture"},
            {"title": "Retrofit — REST API calls",              "url": "https://square.github.io/retrofit/"},
            {"title": "Room DB — local database",               "url": "https://developer.android.com/training/data-storage/room"},
        ],
        "advanced": [
            {"title": "Firebase — auth, Firestore, FCM",        "url": "https://firebase.google.com/docs/android/setup"},
            {"title": "Coroutines & Flow for async work",       "url": "https://developer.android.com/kotlin/coroutines"},
            {"title": "Publish to Google Play Store",           "url": "https://developer.android.com/distribute"},
            {"title": "Performance profiling & testing",        "url": "https://developer.android.com/studio/profile"},
        ],
        "timeline": {"weeks_1_2": "Kotlin + Android basics", "weeks_3_4": "Jetpack Compose + MVVM", "weeks_5_8": "APIs + Room DB", "weeks_9_12": "Firebase + Publish"},
    },

    # ── 10. iOS Developer ────────────────────────────────────
    "iOS Developer": {
        "beginner": [
            {"title": "Swift fundamentals",                     "url": "https://developer.apple.com/swift/"},
            {"title": "Xcode setup & first iOS app",            "url": "https://developer.apple.com/tutorials/swiftui"},
            {"title": "SwiftUI — declarative UI basics",        "url": "https://developer.apple.com/tutorials/swiftui/creating-and-combining-views"},
            {"title": "Git & GitHub version control",           "url": "https://skills.github.com/"},
        ],
        "intermediate": [
            {"title": "UIKit — programmatic + storyboard UI",   "url": "https://developer.apple.com/documentation/uikit"},
            {"title": "MVVM architecture in Swift",             "url": "https://www.youtube.com/results?search_query=mvvm+swift+tutorial"},
            {"title": "Core Data — local persistence",          "url": "https://developer.apple.com/documentation/coredata"},
            {"title": "Networking with URLSession + Codable",   "url": "https://www.hackingwithswift.com/books/ios-swiftui/sending-and-receiving-codable-data-with-urlsession-and-swiftui"},
        ],
        "advanced": [
            {"title": "Firebase for iOS — auth & Firestore",    "url": "https://firebase.google.com/docs/ios/setup"},
            {"title": "Combine — reactive programming",         "url": "https://developer.apple.com/documentation/combine"},
            {"title": "Publish to the App Store",               "url": "https://developer.apple.com/distribute/"},
            {"title": "App performance & Instruments profiling","url": "https://developer.apple.com/documentation/xcode/improving-your-app-s-performance"},
        ],
        "timeline": {"weeks_1_2": "Swift + Xcode", "weeks_3_4": "SwiftUI + UIKit", "weeks_5_8": "MVVM + Networking", "weeks_9_12": "Firebase + Publish"},
    },

    # ── 11. Product Manager ───────────────────────────────────
    "Product Manager": {
        "beginner": [
            {"title": "What is product management — PM basics", "url": "https://www.youtube.com/results?search_query=product+management+fundamentals"},
            {"title": "User research & interviews",             "url": "https://www.nngroup.com/articles/user-interviews/"},
            {"title": "Writing user stories & PRDs",            "url": "https://www.atlassian.com/agile/project-management/user-stories"},
            {"title": "Communication & stakeholder management", "url": "https://www.coursera.org/learn/communication-in-the-age-of-confusion"},
        ],
        "intermediate": [
            {"title": "Product metrics — DAU, retention, NPS",  "url": "https://www.reforge.com/blog/growth-metrics"},
            {"title": "A/B testing fundamentals",               "url": "https://www.optimizely.com/optimization-glossary/ab-testing/"},
            {"title": "Figma — wireframing & prototyping",      "url": "https://www.figma.com/resources/learn-design/"},
            {"title": "Agile & Scrum for PMs",                  "url": "https://www.atlassian.com/agile/scrum"},
        ],
        "advanced": [
            {"title": "SQL for product analytics",              "url": "https://mode.com/sql-tutorial/"},
            {"title": "Market research & competitive analysis",  "url": "https://www.youtube.com/results?search_query=product+market+analysis"},
            {"title": "Product roadmap planning & prioritisation", "url": "https://www.productplan.com/learn/how-to-build-product-roadmap/"},
            {"title": "PM interview prep — case studies",       "url": "https://www.productalliance.com/"},
        ],
        "timeline": {"weeks_1_2": "PM basics + User research", "weeks_3_4": "Metrics + A/B testing", "weeks_5_8": "Figma + Agile + SQL", "weeks_9_12": "Roadmap + Interview prep"},
    },

    # ── 12. UI/UX Designer ────────────────────────────────────
    "UI/UX Designer": {
        "beginner": [
            {"title": "Design fundamentals — typography, colour", "url": "https://www.coursera.org/learn/fundamentals-of-graphic-design"},
            {"title": "Figma — from zero to productive",        "url": "https://www.figma.com/resources/learn-design/"},
            {"title": "User research methods",                  "url": "https://www.nngroup.com/articles/which-ux-research-methods/"},
            {"title": "Wireframing & low-fidelity prototypes",  "url": "https://www.interaction-design.org/literature/topics/wireframing"},
        ],
        "intermediate": [
            {"title": "Design systems & component libraries",   "url": "https://www.designsystems.com/"},
            {"title": "Usability testing techniques",           "url": "https://www.nngroup.com/articles/usability-testing-101/"},
            {"title": "Interaction design & micro-animations",  "url": "https://www.interaction-design.org/"},
            {"title": "Accessibility — WCAG guidelines",        "url": "https://www.w3.org/WAI/WCAG21/quickref/"},
        ],
        "advanced": [
            {"title": "HTML/CSS basics for designer handoffs",  "url": "https://www.theodinproject.com/paths/foundations"},
            {"title": "Adobe XD — advanced prototyping",        "url": "https://helpx.adobe.com/xd/tutorials.html"},
            {"title": "Build a full UX case study for portfolio","url": "https://www.youtube.com/results?search_query=ux+case+study+portfolio"},
            {"title": "Framer — advanced interactive prototypes","url": "https://www.framer.com/learn/"},
        ],
        "timeline": {"weeks_1_2": "Design basics + Figma", "weeks_3_4": "User research + Wireframing", "weeks_5_8": "Design systems + Accessibility", "weeks_9_12": "Portfolio case study"},
    },
}


class RoadmapService:
    def get_roadmap(self, career_domain: str, missing_skills: list = None) -> dict:
        # Normalize domain name — handle slight differences
        domain_key = career_domain
        if domain_key not in ROADMAP_TEMPLATES:
            # Fuzzy match: try to find closest domain
            for key in ROADMAP_TEMPLATES:
                if career_domain.lower() in key.lower() or key.lower() in career_domain.lower():
                    domain_key = key
                    break
            else:
                domain_key = "Software Engineer"  # final fallback

        template = ROADMAP_TEMPLATES[domain_key]
        steps = {
            "beginner"    : template["beginner"][:],
            "intermediate": template["intermediate"][:],
            "advanced"    : template["advanced"][:],
        }

        # Prepend missing skills as custom beginner steps
        if missing_skills:
            extra = [
                {
                    "title": f"Learn & practise: {skill.title()}",
                    "url"  : f"https://www.youtube.com/results?search_query={skill.replace(' ', '+')}+tutorial+for+beginners"
                }
                for skill in missing_skills[:5]
            ]
            steps["beginner"] = extra + steps["beginner"]

        return {
            "steps"        : steps,
            "timeline"     : template["timeline"],
            "career_domain": domain_key,
        }


# ROADMAP_TEMPLATES = {
#     "Software Engineer": {
#         "beginner"    : [
#             {"title": "Learn Python/Java basics", "url": "https://www.codecademy.com/catalog/language/python"},
#             {"title": "Understand OOP concepts", "url": "https://www.freecodecamp.org/news/object-oriented-programming-concepts-21bb035f7260/"},
#             {"title": "Learn SQL & DBMS fundamentals", "url": "https://sqlbolt.com/"},
#             {"title": "Build a simple CRUD app", "url": "https://www.theodinproject.com/"}
#         ],
#         "intermediate": [
#             {"title": "Learn Data Structures & Algorithms", "url": "https://leetcode.com/explore/"},
#             {"title": "Build REST APIs with Flask/Django", "url": "https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world"},
#             {"title": "Learn Git & GitHub", "url": "https://skills.github.com/"},
#             {"title": "Deploy on Heroku/Render", "url": "https://render.com/docs"}
#         ],
#         "advanced"    : [
#             {"title": "System Design fundamentals", "url": "https://github.com/donnemartin/system-design-primer"},
#             {"title": "Microservices architecture", "url": "https://microservices.io/"},
#             {"title": "Cloud deployment (AWS/GCP)", "url": "https://aws.amazon.com/training/"},
#             {"title": "Contribute to open source", "url": "https://goodfirstissue.dev/"}
#         ],
#         "timeline"    : {"weeks_1_2": "Core language", "weeks_3_4": "OOP + DB", "weeks_5_8": "DSA + APIs", "weeks_9_12": "Projects + Deploy"}
#     },
#     "Data Scientist": {
#         "beginner"    : [
#             {"title": "Python basics", "url": "https://www.datacamp.com/"},
#             {"title": "NumPy & Pandas", "url": "https://pandas.pydata.org/docs/user_guide/10min.html"},
#             {"title": "Statistics fundamentals", "url": "https://www.khanacademy.org/math/statistics-probability"},
#             {"title": "Data visualization with Matplotlib/Seaborn", "url": "https://seaborn.pydata.org/tutorial.html"}
#         ],
#         "intermediate": [
#             {"title": "Machine Learning with Scikit-learn", "url": "https://scikit-learn.org/stable/tutorial/index.html"},
#             {"title": "Feature engineering", "url": "https://www.coursera.org/"},
#             {"title": "SQL for data analysis", "url": "https://mode.com/sql-tutorial/"},
#             {"title": "Kaggle competitions", "url": "https://www.kaggle.com/"}
#         ],
#         "advanced"    : [
#             {"title": "Deep Learning (TensorFlow/PyTorch)", "url": "https://pytorch.org/tutorials/"},
#             {"title": "NLP & Computer Vision", "url": "https://huggingface.co/course/chapter1/1"},
#             {"title": "MLOps & model deployment", "url": "https://ml-ops.org/"},
#             {"title": "Research papers", "url": "https://paperswithcode.com/"}
#         ],
#         "timeline"    : {"weeks_1_2": "Python + Stats", "weeks_3_4": "Pandas + Viz", "weeks_5_8": "ML models", "weeks_9_12": "DL + Deployment"}
#     },
#     "Web Developer": {
#         "beginner"    : [
#             {"title": "HTML5 & CSS3", "url": "https://www.theodinproject.com/paths/foundations/courses/foundations"},
#             {"title": "JavaScript ES6+", "url": "https://javascript.info/"},
#             {"title": "Responsive design", "url": "https://web.dev/responsive/"},
#             {"title": "Version control with Git", "url": "https://learngitbranching.js.org/"}
#         ],
#         "intermediate": [
#             {"title": "React.js / Vue.js", "url": "https://react.dev/learn"},
#             {"title": "Node.js & Express", "url": "https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs"},
#             {"title": "REST API consumption", "url": "https://www.postman.com/api-platform/api-client/"},
#             {"title": "Database integration (MongoDB/MySQL)", "url": "https://www.mongodb.com/basics"}
#         ],
#         "advanced"    : [
#             {"title": "Full stack project", "url": "https://fullstackopen.com/en/"},
#             {"title": "Authentication & security", "url": "https://auth0.com/docs/"},
#             {"title": "Performance optimisation", "url": "https://web.dev/fast/"},
#             {"title": "DevOps basics (Docker/CI-CD)", "url": "https://docs.docker.com/get-started/"}
#         ],
#         "timeline"    : {"weeks_1_2": "HTML+CSS+JS", "weeks_3_4": "React basics", "weeks_5_8": "Backend + DB", "weeks_9_12": "Full project"}
#     },
#     "AI/ML Engineer": {
#         "beginner"    : [
#             {"title": "Python & Mathematics", "url": "https://www.deeplearning.ai/courses/mathematics-for-machine-learning-and-data-science-specialization/"},
#             {"title": "Statistics & Probability", "url": "https://www.khanacademy.org/math/statistics-probability"},
#             {"title": "Scikit-learn basics", "url": "https://scikit-learn.org/stable/getting_started.html"},
#             {"title": "EDA with Pandas", "url": "https://towardsdatascience.com/exploratory-data-analysis-eda-with-pandas-profiling-a-comprehensive-guide-22fb11d4e687"}
#         ],
#         "intermediate": [
#             {"title": "Deep Learning fundamentals", "url": "https://www.deeplearning.ai/"},
#             {"title": "PyTorch/TensorFlow", "url": "https://www.tensorflow.org/tutorials"},
#             {"title": "Computer Vision (CNN)", "url": "https://cs231n.github.io/"},
#             {"title": "NLP (BERT, Transformers)", "url": "https://huggingface.co/course/"}
#         ],
#         "advanced"    : [
#             {"title": "MLOps (MLflow, Docker, Kubernetes)", "url": "https://mlflow.org/docs/latest/tutorials-and-examples/index.html"},
#             {"title": "Model optimisation", "url": "https://pytorch.org/tutorials/recipes/recipes/tuning_guide.html"},
#             {"title": "Research & paper reading", "url": "https://paperswithcode.com/"},
#             {"title": "Production ML systems", "url": "https://madewithml.com/"}
#         ],
#         "timeline"    : {"weeks_1_3": "Math + Python", "weeks_4_6": "ML basics", "weeks_7_10": "Deep Learning", "weeks_11_14": "MLOps + Projects"}
#     },
# }

# class RoadmapService:
#     def get_roadmap(self, career_domain: str, missing_skills: list = None) -> dict:
#         template = ROADMAP_TEMPLATES.get(career_domain, ROADMAP_TEMPLATES["Software Engineer"])
#         steps = {
#             "beginner"    : template["beginner"][:],
#             "intermediate": template["intermediate"],
#             "advanced"    : template["advanced"],
#         }
#         if missing_skills:
#             extra = [{"title": f"Learn & practise: {skill}", "url": f"https://www.youtube.com/results?search_query={skill.replace(' ', '+')}+tutorial"} for skill in missing_skills[:5]]
#             steps["beginner"] = extra + steps["beginner"]
#         return {"steps": steps, "timeline": template["timeline"], "career_domain": career_domain}
