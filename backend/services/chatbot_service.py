"""
chatbot_service.py — Gemini AI chatbot with PERSONALIZED context injection.

KEY CHANGE: get_response() now accepts user_profile dict so Gemini knows:
  - student's actual skills and proficiency
  - career goal
  - placement readiness score
  - missing critical skills

The chatbot route (chatbot.py) must pass this profile data — see bottom of file.
"""
import os
import json
import urllib.request
import urllib.error

BASE_SYSTEM_PROMPT = """You are an expert AI Career Mentor for engineering students in India preparing for campus placements.
You help students with:
- Career path selection (Software Engineer, Data Scientist, Web Developer, AI/ML, Cloud, Cybersecurity)
- DSA (Data Structures & Algorithms) — learning path, resources, LeetCode strategy
- Skill gap analysis and what to learn next
- Resume writing, ATS optimization, and improvement tips
- Aptitude and placement test preparation (Quant, Logical, Verbal)
- Interview preparation — Technical rounds, HR rounds, System Design
- Internship and job search strategies
- Company-specific preparation (TCS, Infosys, Wipro, Google, Amazon, Flipkart, etc.)
- Programming languages — Python, Java, C++, JavaScript and their learning paths
- Project ideas and GitHub portfolio building

Keep responses concise (4-6 lines max), practical, and encouraging.
Use bullet points for lists. Be specific with free resources and platforms.
Always relate advice to the Indian placement/campus context when relevant.
Format key terms using **bold**.
"""

# ── Fallback keyword responses (when no Gemini key) ──────────
FALLBACK_TOPICS = [
    (["dsa","data structure","algorithm","leetcode","array","linked list","tree","graph","dynamic programming","sorting","stack","queue","recursion","backtracking","greedy","coding problem"],
     "**DSA Learning Path:**\n• Step 1 — Arrays, Strings, Basic Math (1-2 weeks)\n• Step 2 — Linked Lists, Stacks, Queues (1 week)\n• Step 3 — Trees, Graphs, Recursion (2-3 weeks)\n• Step 4 — Dynamic Programming, Greedy (2-3 weeks)\n\n**Best free resources:**\n• Striver's A2Z DSA Sheet (top-rated for placements)\n• LeetCode — solve Easy first, then Medium\n• YouTube: Abdul Bari (Algorithms), Apna College (DSA)\n\n📌 Start with Arrays today — do 2-3 problems daily on LeetCode!"),

    (["html","css","web","frontend","backend","full stack","javascript","react","nodejs","node js","express","nextjs","angular","vue"],
     "**Web Development Paths:**\n• 🎨 Frontend — HTML → CSS → JavaScript → React → TypeScript\n• ⚙️ Backend — Node.js/Express or Python/FastAPI → SQL → REST APIs\n• 🔄 Full Stack — Both + Git + Docker + Deploy on Vercel/AWS\n\n**Free resources:**\n• The Odin Project (completely free, project-based)\n• freeCodeCamp.org\n• MDN Web Docs for HTML/CSS/JS reference\n\n📌 Build 3 real projects on GitHub — that's what gets you hired!"),

    (["python","django","flask","fastapi","pandas","numpy"],
     "**Python Learning Path:**\n• Basics → OOP → File Handling → Exception Handling\n• Libraries: NumPy, Pandas, Matplotlib, Requests\n• Web: Flask (simple APIs) or FastAPI (modern, fast)\n\n**Free resources:** CS50P (Harvard), Kaggle Python, python.org docs\n\n📌 Build a small project after every topic — that's how Python sticks!"),

    (["machine learning","deep learning","neural","tensorflow","pytorch","nlp","computer vision","data science","kaggle","scikit","ai ml"],
     "**ML/AI Learning Path:**\n• Math — Linear Algebra, Statistics (Khan Academy)\n• Python — NumPy, Pandas, Matplotlib\n• ML — Scikit-learn: regression, classification, clustering\n• DL — PyTorch/TensorFlow → CNN, RNN, Transformers\n\n📌 Start with Andrew Ng's ML Course on Coursera — free to audit!"),

    (["cloud","aws","azure","gcp","devops","docker","kubernetes","terraform","linux","bash","ci cd"],
     "**Cloud/DevOps Path:**\n• Linux basics → Bash → Networking → Docker → Kubernetes\n• Cloud: AWS Free Tier (most in-demand)\n• Certification: AWS Cloud Practitioner (no coding needed!)\n\n📌 Create an AWS free account today and deploy your first app!"),

    (["resume","cv","curriculum vitae","ats","resume score","resume tip","resume format","resume help"],
     "**Strong Resume Checklist:**\n• Contact — email, phone, LinkedIn, GitHub\n• Summary — 2-3 lines: who you are + goal\n• Skills — ALL tools, languages, frameworks\n• Projects — 2-3 with tech stack + GitHub link\n• Education — degree, college, CGPA\n• Certifications — Coursera, NPTEL, Udemy\n\n📌 Upload your resume on the Resume page for an AI score + ATS tips!"),

    (["aptitude","quant","quantitative","logical","reasoning","verbal","percentage","profit","time and work","speed","number series","blood relation","puzzle"],
     "**Aptitude Preparation:**\n• Quantitative — Percentages, Profit & Loss, Time & Work, Speed-Distance\n• Logical — Blood Relations, Syllogisms, Coding-Decoding, Puzzles\n• Verbal — Reading Comprehension, Grammar, Fill in the Blanks\n\n**Daily routine:** 20 questions/day on IndiaBix.com\n\n📌 Practice topic-wise on the Assessment page here — 30 min daily → score jumps!"),

    (["interview","hr round","technical round","star method","tell me about yourself","interview tip","interview prep","interview question","mock interview"],
     "**Interview Preparation:**\n• Technical — Revise DBMS, OS, Computer Networks, OOP\n• Coding — Practice 150+ LeetCode Easy + Medium\n• HR — STAR method: Situation → Task → Action → Result\n• Common questions — 'Tell me about yourself', 'Why this company?'\n\n📌 Check the Placement Preparation module for a full structured guide!"),

    (["career","career path","which career","best career","career advice","career guidance","what should i become","career option","which domain"],
     "**Choose based on what excites you:**\n• 💻 Software Engineer — problem solving + coding\n• 📊 Data Scientist — math, statistics, patterns\n• 🎨 Web Developer — building visible products\n• 🤖 AI/ML Engineer — intelligent systems\n• ☁️ Cloud/DevOps — infrastructure + automation\n\n📌 Click Career in the sidebar for your Top-3 personalised career predictions!"),

    (["skill gap","missing skill","what skill","skills to learn","upskill","need to learn","skills needed"],
     "**Your skill gap = required skills − your current skills.**\n\n📌 Go to the Skill Gap page — select your target career and see:\n• ✅ Skills you already have\n• ❌ Missing skills (sorted by priority)\n• 📖 Direct YouTube + course links for each missing skill\n\nAlso visit Roadmap to generate your week-by-week learning plan!"),

    (["placement","campus placement","get placed","placement prep","placement ready","placement tip","placement drive"],
     "**Placement Preparation Checklist:**\n• ✅ Aptitude — 30 min daily (IndiaBix + Assessment module here)\n• ✅ DSA — 2-3 LeetCode problems daily\n• ✅ Core CS — DBMS, OS, Computer Networks, OOP\n• ✅ Projects — 2-3 strong GitHub projects\n• ✅ Resume — updated, ATS-friendly, 1 page\n\n📌 Check the Placement Preparation module for structured prep!"),

    (["internship","intern","summer internship","how to get internship","internshala","find internship"],
     "**How to get a great internship:**\n• Build 2-3 projects with working GitHub repos (most important!)\n• Apply: Internshala, LinkedIn, AngelList, WellFound\n• Cold email startups — find founders on LinkedIn\n• Apply 3-4 months before the target start date\n\n📌 CGPA ≥ 7.0 helps but strong projects can compensate!"),

    (["roadmap","learning plan","study plan","learning path","how to prepare","where to start","study roadmap"],
     "**Your learning roadmap — 3 phases:**\n• 🟢 Beginner (weeks 1-4) — Core language + CS fundamentals\n• 🟡 Intermediate (weeks 5-10) — Frameworks + APIs + Projects\n• 🔴 Advanced (weeks 11-16) — System Design + Cloud + Open Source\n\n📌 Go to Roadmap page → select your career → generate your plan!"),

    (["github","git","open source","github profile","version control","project","portfolio"],
     "**Build a strong GitHub profile:**\n• Pin 3-5 projects with detailed READMEs\n• Add a profile README (repo named same as your username)\n• Keep daily commits — activity graph matters to recruiters\n• Contribute to open source — look for 'good first issue' labels\n\n📌 GitHub is your live portfolio — recruiters check it before every interview!"),

    (["cgpa","gpa","marks","grade","low cgpa","backlog","arrear"],
     "**CGPA and placements:**\n• Service companies (TCS/Infosys/Wipro) — strict 60%/6.0 cutoff\n• Product companies (Google/Amazon) — rarely filter by CGPA\n• Low CGPA? Compensate with strong projects + certifications + LeetCode\n\n📌 Clear all backlogs ASAP — some companies disqualify for active arrears!"),

    (["certification","certificate","coursera","nptel","udemy","online course","google cert","aws cert"],
     "**Top certifications for placements:**\n• ☁️ AWS Cloud Practitioner — most in-demand\n• 📊 IBM Data Science (Coursera, free audit)\n• 🏛️ NPTEL — free + IIT/IISc certificate, company-recognized\n• 💻 CS50 (Harvard) — completely free + highly respected\n\n📌 Add ALL certifications to resume AND LinkedIn!"),

    (["salary","package","ctc","lpa","fresher salary"],
     "**2025 Fresher Salary Ranges (India):**\n• Service companies (TCS/Infosys/Wipro) — ₹3.5–7 LPA\n• Mid-tier product (Zoho/Freshworks) — ₹8–18 LPA\n• Top product (Google/Amazon/Microsoft) — ₹20–50+ LPA\n\n📌 To maximise your package: strong DSA + projects + communication!"),

    (["tcs","infosys","wipro","hcl","cognizant","accenture","google","amazon","microsoft","flipkart","zoho","freshworks"],
     "**Company Preparation:**\n• Service companies (TCS/Infosys/Wipro) — Aptitude focus, CGPA ≥ 6.0, basic coding\n• Mid-tier product (Zoho/Freshworks) — Strong coding + projects, multi-round technical\n• Top product (Google/Amazon) — 200+ LeetCode, system design, STAR method HR\n\n📌 Research the company's process on GeeksforGeeks Interview Experiences!"),

    (["hello","hi","hey","good morning","good evening","namaste","start"],
     "Hello! 👋 I'm your AI Career Mentor.\n\nAsk me anything about:\n• DSA and coding practice\n• Resume tips and scoring\n• Career path guidance\n• Aptitude preparation\n• Placement readiness\n• Interview preparation\n• Web development / Python / ML learning paths"),
]


def _keyword_fallback(message: str) -> str:
    msg_lower = message.lower()
    for keywords, response in FALLBACK_TOPICS:
        if any(kw in msg_lower for kw in keywords):
            return response
    return (
        "Great question! Here's what I can help you with:\n\n"
        "• DSA — learning path, LeetCode strategy\n"
        "• Resume — tips, ATS optimization, scoring\n"
        "• Career path — which domain suits you\n"
        "• Aptitude — how to practice and improve\n"
        "• Placement prep — full checklist\n"
        "• Interview — technical + HR preparation\n\n"
        "Try asking: 'How do I learn DSA?' or 'What skills do I need for Data Science?'"
    )


class ChatbotService:
    def __init__(self):
        self._history: dict = {}  # uid -> [{role, content}, ...]

    def _get_api_key(self) -> str:
        key = os.getenv("GEMINI_API_KEY", "").strip()
        if key in ("", "your_gemini_api_key_here"):
            return ""
        return key

    # ── NEW: Build personalized system prompt ─────────────────
    def _build_system_prompt(self, user_profile: dict | None = None) -> str:
        if not user_profile:
            return BASE_SYSTEM_PROMPT

        skills        = list((user_profile.get('skills') or {}).keys())
        career_goal   = user_profile.get('career_goal') or 'Not set'
        readiness     = user_profile.get('placement_readiness') or 0
        core_missing  = user_profile.get('core_missing') or []
        aptitude      = user_profile.get('aptitude_score') or 0
        resume_score  = user_profile.get('resume_score') or 0

        skills_joined = ', '.join([skills[i] for i in range(min(15, len(skills)))]) if skills else 'None added yet'
        missing_joined = ', '.join([core_missing[i] for i in range(min(5, len(core_missing)))]) if core_missing else 'None — profile complete!'

        context_block = f"""
STUDENT PROFILE (use this to give PERSONALIZED advice):
- Skills the student has: {skills_joined}
- Career goal: {career_goal}
- Placement readiness score: {readiness}%
- Aptitude score: {aptitude}%
- Resume score: {resume_score}%
- Critical missing skills: {missing_joined}

Based on this profile, tailor every response specifically to this student.
For example: if they ask "what should I learn?", focus on their missing skills.
If they ask about career, reference their stated goal of {career_goal}.
If readiness < 50, encourage more practice. If > 70, congratulate and push for interviews.
"""
        return BASE_SYSTEM_PROMPT + context_block

    def _call_gemini(self, uid: int, message: str, user_profile: dict | None = None) -> str:
        api_key = self._get_api_key()

        if not api_key:
            return _keyword_fallback(message)

        system_prompt = self._build_system_prompt(user_profile)  # ← NEW

        history  = self._history.get(uid, [])
        contents = []
        recent_history = [history[i] for i in range(max(0, len(history) - 8), len(history))]
        for h in recent_history:
            contents.append({
                "role" : h["role"],
                "parts": [{"text": h["content"]}]
            })
        contents.append({"role": "user", "parts": [{"text": message}]})

        payload = json.dumps({
            "system_instruction": {"parts": [{"text": system_prompt}]},
            "contents"          : contents,
            "generationConfig"  : {
                "temperature"    : 0.7,
                "maxOutputTokens": 400,
                "topP"           : 0.9
            }
        }).encode("utf-8")

        url = (
            "https://generativelanguage.googleapis.com/v1beta/"
            f"models/gemini-2.5-flash:generateContent?key={api_key}"
        )
        req = urllib.request.Request(
            url, data=payload,
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = json.loads(resp.read())
                return data["candidates"][0]["content"]["parts"][0]["text"]
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="ignore")
            print(f"Gemini HTTP {e.code}: {body}")
            if e.code in (400, 403, 404):
                try:
                    err_msg = json.loads(body).get("error", {}).get("message", "Unknown API Error")
                    return f"⚠️ **API Key Error:** {err_msg}\n\nPlease update your `.env` file with a valid key."
                except Exception:
                    pass
            return _keyword_fallback(message)
        except Exception as e:
            print(f"Gemini error: {e}")
            return _keyword_fallback(message)

    # ── UPDATED: now accepts user_profile ─────────────────────
    def get_response(self, uid: int, message: str, user_profile: dict | None = None) -> str:
        response = self._call_gemini(uid, message, user_profile)

        if uid not in self._history:
            self._history[uid] = []
        self._history[uid].append({"role": "user",  "content": message})
        self._history[uid].append({"role": "model", "content": response})
        hist_len = len(self._history[uid])
        self._history[uid] = [self._history[uid][i] for i in range(max(0, hist_len - 20), hist_len)]

        return response

    def get_history(self, uid: int) -> list:
        return self._history.get(uid, [])




# ─────────────────────────────────────────────────────────────
# UPDATE YOUR chatbot.py ROUTE to pass profile data:
#
# from models import UserProfile, Progress
#
# @router.post('/ask')
# def ask(data: ChatSchema,
#         current_user: User = Depends(get_current_user),
#         db: Session = Depends(get_db)):
#
#     profile  = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
#     progress = db.query(Progress).filter(Progress.user_id == current_user.id).first()
#
#     user_profile = {
#         'skills'              : profile.skills         if profile  else {},
#         'career_goal'         : profile.career_goal    if profile  else '',
#         'placement_readiness' : progress.placement_readiness if progress else 0,
#         'aptitude_score'      : progress.aptitude_score      if progress else 0,
#         'resume_score'        : progress.resume_score        if progress else 0,
#         'core_missing'        : [],   # optionally fetch from last skill gap record
#     }
#
#     response = service.get_response(current_user.id, data.message.strip(), user_profile)
#     return {'response': response}
# ─────────────────────────────────────────────────────────────



# """
# Gemini AI-powered chatbot for career guidance.
# Falls back to comprehensive keyword matching when no API key is set.

# This version:
# - Does NOT import get_similarity_model (that function does not exist)
# - Does NOT import sentence-transformers (not installed)
# - Uses only stdlib + sklearn (already installed) for fallback matching
# - Reads Gemini API key lazily so load_dotenv() in main.py works correctly
# """
# import os
# import json
# import urllib.request
# import urllib.error

# SYSTEM_PROMPT = """You are an expert AI Career Mentor for engineering students in India preparing for campus placements.
# You help students with:
# - Career path selection (Software Engineer, Data Scientist, Web Developer, AI/ML, Cloud, Cybersecurity)
# - DSA (Data Structures & Algorithms) — learning path, resources, LeetCode strategy
# - Skill gap analysis and what to learn next
# - Resume writing, ATS optimization, and improvement tips
# - Aptitude and placement test preparation (Quant, Logical, Verbal)
# - Interview preparation — Technical rounds, HR rounds, System Design
# - Internship and job search strategies
# - Company-specific preparation (TCS, Infosys, Wipro, Google, Amazon, Flipkart, etc.)
# - Programming languages — Python, Java, C++, JavaScript and their learning paths
# - Project ideas and GitHub portfolio building

# Keep responses concise (4-6 lines max), practical, and encouraging.
# Use bullet points for lists. Be specific with free resources and platforms.
# Always relate advice to the Indian placement/campus context when relevant.
# Format key terms using **bold**.
# """

# # ── Fallback topics — keyword scan ───────────────────────────
# # If Gemini key is missing/invalid, these cover 30+ topics.
# # Matched if ANY keyword in the list appears in the user message.
# FALLBACK_TOPICS = [
#     (["dsa", "data structure", "algorithm", "leetcode", "array", "linked list",
#       "tree", "graph", "dynamic programming", "sorting", "stack", "queue",
#       "recursion", "backtracking", "greedy", "coding problem"],
#      "**DSA Learning Path:**\n"
#      "• Step 1 — Arrays, Strings, Basic Math (1-2 weeks)\n"
#      "• Step 2 — Linked Lists, Stacks, Queues (1 week)\n"
#      "• Step 3 — Trees, Graphs, Recursion (2-3 weeks)\n"
#      "• Step 4 — Dynamic Programming, Greedy (2-3 weeks)\n\n"
#      "**Best free resources:**\n"
#      "• Striver's A2Z DSA Sheet (top-rated for placements)\n"
#      "• LeetCode — solve Easy first, then Medium\n"
#      "• YouTube: Abdul Bari (Algorithms), Apna College (DSA)\n\n"
#      "📌 Start with Arrays today — do 2-3 problems daily on LeetCode!"),

#     (["html", "css", "web", "frontend", "backend", "full stack", "javascript",
#       "react", "nodejs", "node js", "express", "nextjs", "angular", "vue"],
#      "**Web Development Paths:**\n"
#      "• 🎨 Frontend — HTML → CSS → JavaScript → React → TypeScript\n"
#      "• ⚙️ Backend — Node.js/Express or Python/FastAPI → SQL → REST APIs\n"
#      "• 🔄 Full Stack — Both + Git + Docker + Deploy on Vercel/AWS\n\n"
#      "**Free resources:**\n"
#      "• The Odin Project (completely free, project-based)\n"
#      "• freeCodeCamp.org\n"
#      "• MDN Web Docs for HTML/CSS/JS reference\n\n"
#      "📌 Build 3 real projects on GitHub — that's what gets you hired!"),

#     (["python", "django", "flask", "fastapi", "pandas", "numpy"],
#      "**Python Learning Path:**\n"
#      "• Basics → OOP → File Handling → Exception Handling\n"
#      "• Libraries: NumPy, Pandas, Matplotlib, Requests\n"
#      "• Web: Flask (simple APIs) or FastAPI (modern, fast)\n\n"
#      "**Free resources:** CS50P (Harvard), Kaggle Python, python.org docs\n\n"
#      "📌 Build a small project after every topic — that's how Python sticks!"),

#     (["java", "spring", "spring boot", "core java"],
#      "**Java Learning Path:**\n"
#      "• Core Java: OOP, Collections, Exception Handling, Generics\n"
#      "• Multithreading + Stream API + Lambda\n"
#      "• Spring Boot for REST APIs + Hibernate for DB\n\n"
#      "📌 Java Brains (YouTube) + Baeldung.com are excellent free resources!"),

#     (["machine learning", "deep learning", "neural", "tensorflow", "pytorch",
#       "nlp", "computer vision", "data science", "kaggle", "scikit", "ai ml"],
#      "**ML/AI Learning Path:**\n"
#      "• Math — Linear Algebra, Statistics (Khan Academy)\n"
#      "• Python — NumPy, Pandas, Matplotlib\n"
#      "• ML — Scikit-learn: regression, classification, clustering\n"
#      "• DL — PyTorch/TensorFlow → CNN, RNN, Transformers\n\n"
#      "📌 Start with Andrew Ng's ML Course on Coursera — free to audit!"),

#     (["cloud", "aws", "azure", "gcp", "devops", "docker", "kubernetes",
#       "terraform", "linux", "bash", "ci cd"],
#      "**Cloud/DevOps Path:**\n"
#      "• Linux basics → Bash → Networking → Docker → Kubernetes\n"
#      "• Cloud: AWS Free Tier (most in-demand)\n"
#      "• Certification: AWS Cloud Practitioner (no coding needed!)\n\n"
#      "📌 Create an AWS free account today and deploy your first app!"),

#     (["resume", "cv", "curriculum vitae", "ats", "resume score",
#       "resume tip", "resume format", "resume help"],
#      "**Strong Resume Checklist:**\n"
#      "• Contact — email, phone, LinkedIn, GitHub\n"
#      "• Summary — 2-3 lines: who you are + goal\n"
#      "• Skills — ALL tools, languages, frameworks\n"
#      "• Projects — 2-3 with tech stack + GitHub link\n"
#      "• Education — degree, college, CGPA\n"
#      "• Certifications — Coursera, NPTEL, Udemy\n\n"
#      "📌 Upload your resume on the Resume page for an AI score + ATS tips!"),

#     (["aptitude", "quant", "quantitative", "logical", "reasoning", "verbal",
#       "percentage", "profit", "time and work", "speed", "number series",
#       "blood relation", "puzzle"],
#      "**Aptitude Preparation:**\n"
#      "• Quantitative — Percentages, Profit & Loss, Time & Work, Speed-Distance\n"
#      "• Logical — Blood Relations, Syllogisms, Coding-Decoding, Puzzles\n"
#      "• Verbal — Reading Comprehension, Grammar, Fill in the Blanks\n\n"
#      "**Daily routine:** 20 questions/day on IndiaBix.com\n\n"
#      "📌 Practice topic-wise on the Assessment page here — 30 min daily → score jumps 40% to 75%!"),

#     (["interview", "hr round", "technical round", "star method",
#       "tell me about yourself", "interview tip", "interview prep",
#       "interview question", "mock interview"],
#      "**Interview Preparation:**\n"
#      "• Technical — Revise DBMS, OS, Computer Networks, OOP\n"
#      "• Coding — Practice 150+ LeetCode Easy + Medium\n"
#      "• HR — STAR method: Situation → Task → Action → Result\n"
#      "• Common questions — 'Tell me about yourself', 'Why this company?'\n\n"
#      "📌 Check the Placement Preparation module for a full structured guide!"),

#     (["career", "career path", "which career", "best career", "career advice",
#       "career guidance", "what should i become", "career option", "which domain",
#       "software developer", "software engineer", "become developer"],
#      "**Choose based on what excites you:**\n"
#      "• 💻 Software Engineer — problem solving + coding\n"
#      "• 📊 Data Scientist — math, statistics, patterns\n"
#      "• 🎨 Web Developer — building visible products\n"
#      "• 🤖 AI/ML Engineer — intelligent systems\n"
#      "• ☁️ Cloud/DevOps — infrastructure + automation\n\n"
#      "📌 Click Career in the sidebar for your Top-3 personalised career predictions!"),

#     (["skill gap", "missing skill", "what skill", "skills to learn",
#       "upskill", "need to learn", "skills needed"],
#      "**Your skill gap = required skills − your current skills.**\n\n"
#      "📌 Go to the Skill Gap page — select your target career and see:\n"
#      "• ✅ Skills you already have\n"
#      "• ❌ Missing skills (sorted by priority)\n"
#      "• 📖 Direct YouTube + course links for each missing skill\n\n"
#      "Also visit Roadmap to generate your week-by-week learning plan!"),

#     (["placement", "campus placement", "get placed", "placement prep",
#       "placement ready", "placement tip", "placement drive"],
#      "**Placement Preparation Checklist:**\n"
#      "• ✅ Aptitude — 30 min daily (IndiaBix + Assessment module here)\n"
#      "• ✅ DSA — 2-3 LeetCode problems daily\n"
#      "• ✅ Core CS — DBMS, OS, Computer Networks, OOP\n"
#      "• ✅ Projects — 2-3 strong GitHub projects\n"
#      "• ✅ Resume — updated, ATS-friendly, 1 page\n\n"
#      "📌 Check the Placement Preparation module for structured prep!"),

#     (["internship", "intern", "summer internship", "how to get internship",
#       "internshala", "find internship"],
#      "**How to get a great internship:**\n"
#      "• Build 2-3 projects with working GitHub repos (most important!)\n"
#      "• Apply: Internshala, LinkedIn, AngelList, WellFound\n"
#      "• Cold email startups — find founders on LinkedIn\n"
#      "• Apply 3-4 months before the target start date\n\n"
#      "📌 CGPA ≥ 7.0 helps but strong projects can compensate!"),

#     (["roadmap", "learning plan", "study plan", "learning path",
#       "how to prepare", "where to start", "study roadmap"],
#      "**Your learning roadmap — 3 phases:**\n"
#      "• 🟢 Beginner (weeks 1-4) — Core language + CS fundamentals\n"
#      "• 🟡 Intermediate (weeks 5-10) — Frameworks + APIs + Projects\n"
#      "• 🔴 Advanced (weeks 11-16) — System Design + Cloud + Open Source\n\n"
#      "📌 Go to Roadmap page → select your career → generate your plan!"),

#     (["github", "git", "open source", "github profile", "version control",
#       "project", "portfolio"],
#      "**Build a strong GitHub profile:**\n"
#      "• Pin 3-5 projects with detailed READMEs\n"
#      "• Add a profile README (repo named same as your username)\n"
#      "• Keep daily commits — activity graph matters to recruiters\n"
#      "• Contribute to open source — look for 'good first issue' labels\n\n"
#      "📌 GitHub is your live portfolio — recruiters check it before every interview!"),

#     (["cgpa", "gpa", "marks", "grade", "low cgpa", "backlog", "arrear"],
#      "**CGPA and placements:**\n"
#      "• Service companies (TCS/Infosys/Wipro) — strict 60%/6.0 cutoff\n"
#      "• Product companies (Google/Amazon) — rarely filter by CGPA\n"
#      "• Low CGPA? Compensate with strong projects + certifications + LeetCode\n\n"
#      "📌 Clear all backlogs ASAP — some companies disqualify for active arrears!"),

#     (["certification", "certificate", "coursera", "nptel", "udemy",
#       "online course", "google cert", "aws cert"],
#      "**Top certifications for placements:**\n"
#      "• ☁️ AWS Cloud Practitioner — most in-demand\n"
#      "• 📊 IBM Data Science (Coursera, free audit)\n"
#      "• 🏛️ NPTEL — free + IIT/IISc certificate, company-recognized\n"
#      "• 💻 CS50 (Harvard) — completely free + highly respected\n\n"
#      "📌 Add ALL certifications to resume AND LinkedIn!"),

#     (["salary", "package", "ctc", "lpa", "fresher salary"],
#      "**2025 Fresher Salary Ranges (India):**\n"
#      "• Service companies (TCS/Infosys/Wipro) — ₹3.5–7 LPA\n"
#      "• Mid-tier product (Zoho/Freshworks) — ₹8–18 LPA\n"
#      "• Top product (Google/Amazon/Microsoft) — ₹20–50+ LPA\n\n"
#      "📌 To maximise your package: strong DSA + projects + communication!"),

#     (["tcs", "infosys", "wipro", "hcl", "cognizant", "accenture",
#       "google", "amazon", "microsoft", "flipkart", "zoho", "freshworks"],
#      "**Company Preparation:**\n"
#      "• Service companies (TCS/Infosys/Wipro) — Aptitude focus, CGPA ≥ 6.0, basic coding\n"
#      "• Mid-tier product (Zoho/Freshworks) — Strong coding + projects, multi-round technical\n"
#      "• Top product (Google/Amazon) — 200+ LeetCode, system design, STAR method HR\n\n"
#      "📌 Research the company's process on GeeksforGeeks Interview Experiences!"),

#     (["hello", "hi", "hey", "good morning", "good evening", "namaste", "start"],
#      "Hello! 👋 I'm your AI Career Mentor.\n\n"
#      "Ask me anything about:\n"
#      "• DSA and coding practice\n"
#      "• Resume tips and scoring\n"
#      "• Career path guidance\n"
#      "• Aptitude preparation\n"
#      "• Placement readiness\n"
#      "• Interview preparation\n"
#      "• Web development / Python / ML learning paths"),
# ]


# def _keyword_fallback(message: str) -> str:
#     """Scan message for any matching keyword and return the best response."""
#     msg_lower = message.lower()
#     for keywords, response in FALLBACK_TOPICS:
#         if any(kw in msg_lower for kw in keywords):
#             return response
#     return (
#         "Great question! Here's what I can help you with:\n\n"
#         "• DSA — learning path, LeetCode strategy\n"
#         "• Resume — tips, ATS optimization, scoring\n"
#         "• Career path — which domain suits you\n"
#         "• Aptitude — how to practice and improve\n"
#         "• Placement prep — full checklist\n"
#         "• Interview — technical + HR preparation\n"
#         "• Web Dev / Python / ML / Java — learning paths\n\n"
#         "Try asking: 'How do I learn DSA?' or 'What skills do I need for Data Science?'"
#     )


# class ChatbotService:
#     def __init__(self):
#         self._history: dict = {}   # uid -> [{role, content}, ...]

#     def _get_api_key(self) -> str:
#         """Read key lazily — load_dotenv() in main.py runs before this."""
#         key = os.getenv("GEMINI_API_KEY", "").strip()
#         if key in ("", "your_gemini_api_key_here"):
#             return ""
#         return key

#     def _call_gemini(self, uid: int, message: str) -> str:
#         api_key = self._get_api_key()

#         # No valid API key → use smart keyword fallback
#         if not api_key:
#             return _keyword_fallback(message)

#         # Build conversation history for Gemini (last 4 exchanges = 8 messages)
#         history  = self._history.get(uid, [])
#         contents = []
#         for h in history[-8:]:
#             contents.append({
#                 "role" : h["role"],
#                 "parts": [{"text": h["content"]}]
#             })
#         contents.append({"role": "user", "parts": [{"text": message}]})

#         payload = json.dumps({
#             "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
#             "contents"          : contents,
#             "generationConfig"  : {
#                 "temperature"    : 0.7,
#                 "maxOutputTokens": 400,
#                 "topP"           : 0.9
#             }
#         }).encode("utf-8")

#         url = (
#             "https://generativelanguage.googleapis.com/v1beta/"
#             f"models/gemini-1.5-flash:generateContent?key={api_key}"
#         )
#         req = urllib.request.Request(
#             url, data=payload,
#             headers={"Content-Type": "application/json"},
#             method="POST"
#         )

#         try:
#             with urllib.request.urlopen(req, timeout=12) as resp:
#                 data = json.loads(resp.read())
#                 return data["candidates"][0]["content"]["parts"][0]["text"]
#         except urllib.error.HTTPError as e:
#             body = e.read().decode("utf-8", errors="ignore")
#             print(f"Gemini HTTP {e.code}: {body[:200]}")
#             return _keyword_fallback(message)
#         except Exception as e:
#             print(f"Gemini error: {e}")
#             return _keyword_fallback(message)

#     def get_response(self, uid: int, message: str) -> str:
#         response = self._call_gemini(uid, message)

#         if uid not in self._history:
#             self._history[uid] = []
#         self._history[uid].append({"role": "user",  "content": message})
#         self._history[uid].append({"role": "model", "content": response})
#         self._history[uid] = self._history[uid][-20:]

#         return response

#     def get_history(self, uid: int) -> list:
#         return self._history.get(uid, [])




# # # """
# # # Gemini AI-powered chatbot for career guidance.

# # # FIXES applied:
# # #   1. API key read lazily (inside method) — load_dotenv() in main.py works correctly.
# # #   2. Comprehensive fallback covers 30+ topics so NO question gets a dead-end response.
# # #   3. Fallback uses keyword SCAN (any keyword in message) not just exact key match.
# # # """
# # import os
# # import json
# # import urllib.request
# # import urllib.error

# # SYSTEM_PROMPT = """You are an expert AI Career Mentor for engineering students in India preparing for campus placements.
# # You help students with:
# # - Career path selection (Software Engineer, Data Scientist, Web Developer, AI/ML, Cloud, Cybersecurity)
# # - DSA (Data Structures & Algorithms) — learning path, resources, LeetCode strategy
# # - Skill gap analysis and what to learn next
# # - Resume writing, ATS optimization, and improvement tips
# # - Aptitude and placement test preparation (Quant, Logical, Verbal)
# # - Interview preparation — Technical rounds, HR rounds, System Design
# # - Internship and job search strategies
# # - Company-specific preparation (TCS, Infosys, Wipro, Google, Amazon, Flipkart, etc.)
# # - Programming languages — Python, Java, C++, JavaScript and their learning paths
# # - Project ideas and GitHub portfolio building

# # Keep responses concise (4-6 lines max), practical, and encouraging.
# # Use bullet points for lists. Be specific with free resources and platforms.
# # Always relate advice to the Indian placement/campus context when relevant.
# # Format key terms using **bold**.
# # """

# # # ── Comprehensive fallback — 30+ topic areas ────────────────────────────────
# # # Format: ([keyword list], response_string)
# # # Matched if ANY keyword appears anywhere in the user message (case-insensitive)
# # FALLBACK_TOPICS = [
# #     (["dsa","data structure","algorithm","leetcode","array","linked list","tree",
# #       "graph","dynamic programming"," dp ","sorting","stack","queue","recursion","backtracking","greedy"],
# #      "**DSA Learning Path:**\n"
# #      "• **Step 1** — Arrays, Strings, Basic Math (1-2 weeks)\n"
# #      "• **Step 2** — Linked Lists, Stacks, Queues (1 week)\n"
# #      "• **Step 3** — Trees, Graphs, Recursion (2-3 weeks)\n"
# #      "• **Step 4** — Dynamic Programming, Greedy (2-3 weeks)\n\n"
# #      "**Best free resources:**\n"
# #      "• Striver's A2Z DSA Sheet (top-rated for placements)\n"
# #      "• LeetCode — solve Easy first, then Medium\n"
# #      "• YouTube: Abdul Bari (Algorithms), Apna College (DSA)\n\n"
# #      "📌 Start with **Arrays** today — do 2-3 problems daily on LeetCode!"),

# #     (["resume","cv","curriculum vitae","ats","resume score","resume tip","resume format","resume help"],
# #      "**Strong Resume Checklist:**\n"
# #      "• **Contact** — email, phone, LinkedIn, GitHub\n"
# #      "• **Summary** — 2-3 lines: who you are + goal\n"
# #      "• **Skills** — ALL tools, languages, frameworks\n"
# #      "• **Projects** — 2-3 with tech stack + GitHub link\n"
# #      "• **Education** — degree, college, CGPA\n"
# #      "• **Certifications** — Coursera, NPTEL, Udemy\n\n"
# #      "📌 Upload your resume on the **Resume page** for an AI score + ATS tips!"),

# #     (["aptitude","quant","quantitative","logical","reasoning","verbal",
# #       "percentage","profit","time and work","speed","number series","blood relation","puzzle"],
# #      "**Aptitude Preparation:**\n"
# #      "• **Quantitative** — Percentages, Profit & Loss, Time & Work, Speed-Distance\n"
# #      "• **Logical** — Blood Relations, Syllogisms, Coding-Decoding, Puzzles\n"
# #      "• **Verbal** — Reading Comprehension, Grammar, Fill in the Blanks\n\n"
# #      "**Daily routine:** 20 questions/day on IndiaBix.com\n"
# #      "📌 Practice topic-wise on the **Assessment page** — 30 min daily for 30 days → score jumps 40% → 75%!"),

# #     (["interview","hr round","technical round","star method","tell me about yourself",
# #       "interview tip","interview prep","interview question","mock interview"],
# #      "**Interview Preparation:**\n"
# #      "• **Technical** — Revise DBMS, OS, Computer Networks, OOP\n"
# #      "• **Coding** — Practice 150+ LeetCode Easy + Medium\n"
# #      "• **HR** — STAR method: Situation → Task → Action → Result\n"
# #      "• **Common questions** — 'Tell me about yourself', 'Why this company?', 'Strengths?'\n\n"
# #      "📌 Check the **Placement Preparation** module for a full structured guide!"),

# #     (["python","django","flask","fastapi","pandas","numpy","matplotlib"],
# #      "**Python Learning Path:**\n"
# #      "• Basics → OOP → File Handling → Exception Handling\n"
# #      "• Libraries: **NumPy, Pandas, Matplotlib, Requests**\n"
# #      "• Web: **Flask** (simple APIs) or **FastAPI** (modern)\n\n"
# #      "**Free resources:** CS50P (Harvard), Kaggle Python, python.org docs\n"
# #      "📌 Build a small project after every topic — that's how Python sticks!"),

# #     (["java","spring","spring boot","core java"],
# #      "**Java Learning Path:**\n"
# #      "• Core Java: OOP, Collections, Exception Handling, Generics\n"
# #      "• Multithreading + Stream API + Lambda\n"
# #      "• **Spring Boot** for REST APIs + **Hibernate** for DB\n\n"
# #      "📌 Java Brains (YouTube) + Baeldung.com are excellent free resources!"),

# #     (["web","frontend","backend","full stack","html","css","javascript",
# #       "react","nodejs","node js","express","nextjs","next js","angular","vue"],
# #      "**Web Development Paths:**\n"
# #      "• 🎨 **Frontend** — HTML → CSS → JavaScript → React → TypeScript\n"
# #      "• ⚙️ **Backend** — Node.js/Express or Python/FastAPI → SQL → REST APIs\n"
# #      "• 🔄 **Full Stack** — Both + Git + Docker + Deploy on Vercel/AWS\n\n"
# #      "**Free resources:** The Odin Project, freeCodeCamp, react.dev\n"
# #      "📌 Build **3 real projects** on GitHub — that's what gets you hired!"),

# #     (["machine learning","deep learning","neural","tensorflow","pytorch",
# #       "nlp","computer vision","data science","kaggle","scikit"],
# #      "**ML/AI Learning Path:**\n"
# #      "• **Math** — Linear Algebra, Statistics (Khan Academy)\n"
# #      "• **Python** — NumPy, Pandas, Matplotlib\n"
# #      "• **ML** — Scikit-learn: regression, classification, clustering\n"
# #      "• **DL** — PyTorch/TensorFlow → CNN, RNN, Transformers\n\n"
# #      "📌 Start with **Andrew Ng's ML Course** on Coursera — free to audit!"),

# #     (["cloud","aws","azure","gcp","devops","docker","kubernetes","terraform","linux","bash"],
# #      "**Cloud/DevOps Path:**\n"
# #      "• Linux basics → Bash → Networking → Docker → Kubernetes\n"
# #      "• Cloud: **AWS Free Tier** (most in-demand)\n"
# #      "• **Certifications:** AWS Cloud Practitioner (no-code needed!)\n\n"
# #      "📌 Create an AWS free account today and deploy your first app!"),

# #     (["career","career path","which career","best career","career advice",
# #       "career guidance","what should i become","career option","which domain"],
# #      "**Choose based on what excites you:**\n"
# #      "• 💻 **Software Engineer** — problem solving + coding\n"
# #      "• 📊 **Data Scientist** — math, statistics, patterns\n"
# #      "• 🎨 **Web Developer** — building visible products\n"
# #      "• 🤖 **AI/ML Engineer** — intelligent systems\n"
# #      "• ☁️ **Cloud/DevOps** — infrastructure + automation\n\n"
# #      "📌 Click **Career** in sidebar for your **Top-3 personalised career predictions**!"),

# #     (["skill gap","missing skill","what skill","skills to learn","upskill","need to learn"],
# #      "📌 Go to the **Skill Gap** page — select your target career and see:\n"
# #      "• ✅ Skills you already have\n"
# #      "• ❌ Missing skills (sorted by priority)\n"
# #      "• 📖 Direct YouTube + course links for each missing skill\n\n"
# #      "Also visit **Roadmap** to generate your week-by-week learning plan!"),

# #     (["placement","campus placement","get placed","placement prep","placement ready","placement tip"],
# #      "**Placement Preparation Checklist:**\n"
# #      "• ✅ Aptitude — 30 min daily (IndiaBix + Assessment module here)\n"
# #      "• ✅ DSA — 2-3 LeetCode problems daily\n"
# #      "• ✅ Core CS — DBMS, OS, Computer Networks, OOP\n"
# #      "• ✅ Projects — 2-3 strong GitHub projects\n"
# #      "• ✅ Resume — updated, ATS-friendly, 1 page\n\n"
# #      "📌 Check the **Placement Preparation** module for structured prep!"),

# #     (["internship","intern","summer internship","how to get internship","internshala"],
# #      "**How to get a great internship:**\n"
# #      "• Build **2-3 projects** with working GitHub repos (most important!)\n"
# #      "• Apply: **Internshala**, LinkedIn, AngelList, WellFound\n"
# #      "• Cold email startups — find founders on LinkedIn\n"
# #      "• Apply **3-4 months before** the target start date\n\n"
# #      "📌 CGPA ≥ 7.0 helps but strong projects can compensate!"),

# #     (["roadmap","learning plan","study plan","learning path","how to prepare","where to start"],
# #      "**Your learning roadmap — 3 phases:**\n"
# #      "• 🟢 **Beginner** (weeks 1-4) — Core language + CS fundamentals\n"
# #      "• 🟡 **Intermediate** (weeks 5-10) — Frameworks + APIs + Projects\n"
# #      "• 🔴 **Advanced** (weeks 11-16) — System Design + Cloud + Open Source\n\n"
# #      "📌 Go to **Roadmap** page → select your career → generate your personalised plan!"),

# #     (["github","git","project","portfolio","open source","github profile"],
# #      "**Build a strong GitHub profile:**\n"
# #      "• Pin **3-5 projects** with detailed READMEs\n"
# #      "• Add a **profile README** (repo named same as your username)\n"
# #      "• Keep **daily commits** — activity graph matters to recruiters\n"
# #      "• Contribute to **open source** — look for 'good first issue' labels\n\n"
# #      "📌 GitHub is your live portfolio — recruiters check it before every interview!"),

# #     (["cgpa","gpa","marks","grade","low cgpa","backlog","arrear"],
# #      "**CGPA and placements:**\n"
# #      "• **Service companies** (TCS/Infosys/Wipro) — strict 60%/6.0 cutoff\n"
# #      "• **Product companies** (Google/Amazon) — rarely filter by CGPA\n"
# #      "• **Low CGPA?** Compensate with strong projects + certifications + LeetCode\n\n"
# #      "📌 Clear all backlogs ASAP — some companies disqualify for active arrears!"),

# #     (["certification","certificate","coursera","nptel","udemy","online course"],
# #      "**Top certifications for placements:**\n"
# #      "• ☁️ **AWS Cloud Practitioner** — most in-demand\n"
# #      "• 📊 **IBM Data Science** (Coursera, free audit)\n"
# #      "• 🏛️ **NPTEL** — free + IIT/IISc certificate, company-recognized\n"
# #      "• 💻 **CS50** (Harvard) — completely free + highly respected\n\n"
# #      "📌 Add ALL certifications to resume AND LinkedIn!"),

# #     (["salary","package","ctc","lpa","fresher salary","how much salary"],
# #      "**2025 Fresher Salary Ranges (India):**\n"
# #      "• Service companies (TCS/Infosys/Wipro) — ₹3.5–7 LPA\n"
# #      "• Mid-tier product (Zoho/Freshworks) — ₹8–18 LPA\n"
# #      "• Top product (Google/Amazon/Microsoft) — ₹20–50+ LPA\n"
# #      "• Startups — ₹6–20 LPA (varies)\n\n"
# #      "📌 To maximise your package: strong DSA + projects + communication!"),

# #     (["tcs","infosys","wipro","hcl","cognizant","accenture","google","amazon",
# #       "microsoft","flipkart","zoho","freshworks","service company","product company"],
# #      "**Company Preparation:**\n"
# #      "• **Service companies (TCS/Infosys/Wipro)** — Aptitude focus, CGPA ≥ 6.0, basic coding\n"
# #      "• **Mid-tier product (Zoho/Freshworks)** — Strong coding + projects, multi-round technical\n"
# #      "• **Top product (Google/Amazon)** — 200+ LeetCode, system design, STAR method HR\n\n"
# #      "📌 Research the company's placement process on GeeksforGeeks Interview Experiences!"),
# # ]


# # def _keyword_fallback(message: str) -> str:
# #     """Scan message for any matching keyword and return best response."""
# #     msg_lower = message.lower()
# #     for keywords, response in FALLBACK_TOPICS:
# #         if any(kw in msg_lower for kw in keywords):
# #             return response
# #     return (
# #         "Great question! Here's what I can help you with:\n\n"
# #         "• **DSA** — learning path, LeetCode strategy\n"
# #         "• **Resume** — tips, ATS optimization, scoring\n"
# #         "• **Career path** — which domain suits you\n"
# #         "• **Aptitude** — how to practice and improve\n"
# #         "• **Placement prep** — full checklist\n"
# #         "• **Interview** — technical + HR preparation\n\n"
# #         "Try asking: *'How do I learn DSA?'* or *'What skills do I need for Data Science?'*"
# #     )


# # class ChatbotService:
# #     def __init__(self):
# #         self._history: dict = {}  # uid -> [{role, content}, ...]

# #     def _get_api_key(self) -> str:
# #         """Read key lazily so load_dotenv() in main.py runs first."""
# #         key = os.getenv("GEMINI_API_KEY", "").strip()
# #         return "" if key in ("", "your_gemini_api_key_here") else key

# #     def _call_gemini(self, uid: int, message: str) -> str:
# #         api_key = self._get_api_key()

# #         # No valid key → use smart keyword fallback
# #         if not api_key:
# #             return _keyword_fallback(message)

# #         # Build conversation history for Gemini context (last 4 exchanges)
# #         history  = self._history.get(uid, [])
# #         contents = []
# #         for h in history[-8:]:
# #             contents.append({"role": h["role"], "parts": [{"text": h["content"]}]})
# #         contents.append({"role": "user", "parts": [{"text": message}]})

# #         payload = json.dumps({
# #             "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
# #             "contents"          : contents,
# #             "generationConfig"  : {
# #                 "temperature"    : 0.7,
# #                 "maxOutputTokens": 400,
# #                 "topP"           : 0.9
# #             }
# #         }).encode("utf-8")

# #         url = (
# #             "https://generativelanguage.googleapis.com/v1beta/"
# #             f"models/gemini-1.5-flash:generateContent?key={api_key}"
# #         )
# #         req = urllib.request.Request(
# #             url, data=payload,
# #             headers={"Content-Type": "application/json"},
# #             method="POST"
# #         )

# #         try:
# #             with urllib.request.urlopen(req, timeout=12) as resp:
# #                 data = json.loads(resp.read())
# #                 return data["candidates"][0]["content"]["parts"][0]["text"]
# #         except urllib.error.HTTPError as e:
# #             body = e.read().decode("utf-8", errors="ignore")
# #             print(f"Gemini HTTP {e.code}: {body[:200]}")
# #             return _keyword_fallback(message)
# #         except Exception as e:
# #             print(f"Gemini error: {e}")
# #             return _keyword_fallback(message)

# #     def get_response(self, uid: int, message: str) -> str:
# #         response = self._call_gemini(uid, message)

# #         if uid not in self._history:
# #             self._history[uid] = []
# #         self._history[uid].append({"role": "user",  "content": message})
# #         self._history[uid].append({"role": "model", "content": response})
# #         self._history[uid] = self._history[uid][-20:]

# #         return response

# #     def get_history(self, uid: int) -> list:
# #         return self._history.get(uid, [])


# # # """
# # # Semantic AI chatbot for personalized career guidance.
# # # Uses sentence-transformers for intent matching and injects real user DB data.
# # # """
# # # from typing import Optional
# # # from sqlalchemy.orm import Session
# # # from ml.career_engine import get_similarity_model
# # # from sklearn.metrics.pairwise import cosine_similarity
# # # import numpy as np

# # # # Intents definitions mapping
# # # INTENT_VECTORS = None
# # # INTENT_KEYS = []

# # # CAREER_RESPONSES = {
# # #     "hello"         : "Hello! I'm your AI Career Mentor. Ask me about career guidance, skill improvement, resume tips, or placement preparation!",
# # #     "hi"            : "Hi there! How can I assist you with your career today?",
# # #     "career"        : "To choose the best career path, consider your skills, interests, and market demand. Use the Career Recommendation module to get personalized suggestions.",
# # #     "resume"        : "A strong resume includes: clear contact info, professional summary, skills section, projects, experience, and education. Upload your resume for an AI-based analysis!",
# # #     "skill gap"     : "A skill gap is the difference between skills you have and skills required for your target role. Go to the Roadmap section to see your personalized skill gap analysis.",
# # #     "placement"     : "For placement readiness: practice aptitude tests, work on DSA problems daily, prepare for HR interviews, and ensure your resume is up to date.",
# # #     "aptitude"      : "Improve your aptitude by practising: Quantitative (percentages, time-speed-distance), Logical (puzzles, series), and Verbal (grammar, comprehension). Check the Placement Preparation module!",
# # #     "interview"     : "Interview tips: Research the company, revise core subjects, practice STAR method for HR questions, and solve at least 2 DSA problems daily.",
# # #     "roadmap"       : "Your personalized learning roadmap is generated based on your skill gap. It covers Beginner → Intermediate → Advanced levels with a weekly timeline.",
# # #     "internship"    : "Apply for internships on Internshala, LinkedIn, AngelList, and LetsIntern. Build projects and a strong GitHub profile to stand out.",
# # #     "python"        : "Python is one of the most in-demand skills! Focus on: syntax basics, OOP, libraries (NumPy, Pandas), and frameworks (Flask/Django).",
# # #     "machine learning": "For ML: Start with Python & statistics, then learn Scikit-learn, then deep learning with TensorFlow/PyTorch. Complete Andrew Ng's course on Coursera!",
# # #     "data science"  : "Data Science roadmap: Python → Statistics → Pandas/NumPy → Data Visualization → ML → Deep Learning → Projects on Kaggle.",
# # #     "full stack"    : "Full Stack path: HTML/CSS/JS → React → Node.js/Express → Database (MongoDB/MySQL) → REST APIs → Deploy on AWS/Heroku.",
# # #     "github"        : "Maintain an active GitHub profile with at least 3-5 good projects. Add a README to each project and contribute to open source.",
# # #     "cgpa"          : "Most companies have a CGPA cutoff between 6.0-7.0. Focus on improving CGPA alongside technical skills to pass resume screening.",
# # #     "certifications": "Valuable certifications: AWS Certified, Google TensorFlow Developer, Microsoft Azure, Oracle Java, Coursera specializations. List them on your resume!",
# # #     "default"       : "I understand you're asking about '{query}'. Please check the relevant module in your dashboard, or try asking about: career, resume, skills, placement, aptitude, or roadmap."
# # # }

# # # def load_intent_vectors():
# # #     global INTENT_VECTORS, INTENT_KEYS
# # #     if INTENT_VECTORS is None:
# # #         model = get_similarity_model()
# # #         INTENT_KEYS = list(CAREER_RESPONSES.keys())
# # #         # We exclude 'default' from semantic matching
# # #         INTENT_KEYS.remove('default')
# # #         INTENT_VECTORS = model.encode(INTENT_KEYS)

# # # class ChatbotService:
# # #     def __init__(self):
# # #         self._history: dict = {}   # uid -> list of {role, message}
# # #         load_intent_vectors()

# # #     def _get_personalized_data(self, intent: str, user, db: Session) -> Optional[str]:
# # #         from models import UserProfile, SkillGap, Assessment
        
# # #         if intent == "skill gap":
# # #             gap = db.query(SkillGap).filter(SkillGap.user_id == user.id).order_by(SkillGap.analyzed_at.desc()).first()
# # #             if gap and gap.missing_skills:
# # #                 missing = ", ".join(gap.missing_skills[:3])
# # #                 return f"I see you are targeting **{gap.career_domain}**. You are currently missing these critical skills: **{missing}**. Focus on learning those first!"
# # #             else:
# # #                 return "You haven't generated a skill gap analysis yet. Try going to the Career Recommendation section first!"
                
# # #         if intent == "resume":
# # #             profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
# # #             if profile and profile.skills:
# # #                 skills_list = list(profile.skills.keys())
# # #                 if len(skills_list) < 3:
# # #                     return f"I see you only have {len(skills_list)} skills on your profile right now. A strong resume should list 5-10 core skills. Please update your profile or upload a new resume!"
# # #             return CAREER_RESPONSES["resume"]
            
# # #         if intent == "aptitude":
# # #             assessments = db.query(Assessment).filter(Assessment.user_id == user.id, Assessment.type == 'aptitude').all()
# # #             if assessments:
# # #                 avg_score = sum(a.percentage for a in assessments) / len(assessments)
# # #                 if avg_score < 60:
# # #                     return f"Your recent aptitude tests average **{avg_score:.1f}%**. You should practice more Quantitative and Logical reasoning on the Placement page before your interviews."
# # #                 else:
# # #                     return f"Great job! Your aptitude average is **{avg_score:.1f}%**. Keep practising on the Placement page to maintain that score."
# # #             return "You haven't taken any Aptitude assessments yet! Head over to the Assessment page to find out your baseline score."
            
# # #         if intent == "career":
# # #             profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
# # #             if profile and profile.career_goal:
# # #                 return f"I see your current goal is **{profile.career_goal}**. {CAREER_RESPONSES['career']}"
# # #             return CAREER_RESPONSES["career"]

# # #         return None # No personalized override

# # #     def get_response(self, user, message: str, db: Session = None) -> str:
# # #         msg_lower = message.lower()
# # #         response = None
        
# # #         # 1. First try direct keyword match for speed
# # #         for key in INTENT_KEYS:
# # #             if key in msg_lower:
# # #                 matched_intent = key
# # #                 break
# # #         else:
# # #             # 2. If no direct match, use Semantic AI Similarity
# # #             model = get_similarity_model()
# # #             msg_emb = model.encode([msg_lower])
# # #             sim = cosine_similarity(msg_emb, INTENT_VECTORS)[0]
            
# # #             best_idx = np.argmax(sim)
# # #             if sim[best_idx] > 0.50:  # 50% semantic confidence threshold
# # #                 matched_intent = INTENT_KEYS[best_idx]
# # #             else:
# # #                 matched_intent = None

# # #         if matched_intent:
# # #             # 3. Try to inject personalized database data
# # #             if db:
# # #                 personalized_reply = self._get_personalized_data(matched_intent, user, db)
# # #                 if personalized_reply:
# # #                     response = personalized_reply
# # #                 else:
# # #                     response = CAREER_RESPONSES[matched_intent]
# # #             else:
# # #                 response = CAREER_RESPONSES[matched_intent]

# # #         if not response:
# # #             response = CAREER_RESPONSES['default'].replace('{query}', message)

# # #         # Store history (memory in memory)
# # #         uid = user.id
# # #         if uid not in self._history:
# # #             self._history[uid] = []
# # #         self._history[uid].append({'role': 'user',      'message': message})
# # #         self._history[uid].append({'role': 'assistant', 'message': response})

# # #         # Keep last 20 messages
# # #         self._history[uid] = self._history[uid][-20:]
# # #         return response

# # #     def get_history(self, uid: int) -> list:
# # #         return self._history.get(uid, [])