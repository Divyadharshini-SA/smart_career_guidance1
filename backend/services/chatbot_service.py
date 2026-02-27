"""
Rule-based AI chatbot for career guidance.
Can be upgraded to use a language model API later.
"""

CAREER_RESPONSES = {
    "hello"         : "Hello! I'm your AI Career Mentor. Ask me about career guidance, skill improvement, resume tips, or placement preparation!",
    "hi"            : "Hi there! How can I assist you with your career today?",
    "career"        : "To choose the best career path, consider your skills, interests, and market demand. Use the Career Recommendation module to get personalized suggestions.",
    "resume"        : "A strong resume includes: clear contact info, professional summary, skills section, projects, experience, and education. Upload your resume for an AI-based analysis!",
    "skill gap"     : "A skill gap is the difference between skills you have and skills required for your target role. Go to the Roadmap section to see your personalized skill gap analysis.",
    "placement"     : "For placement readiness: practice aptitude tests, work on DSA problems daily, prepare for HR interviews, and ensure your resume is up to date.",
    "aptitude"      : "Improve your aptitude by practising: Quantitative (percentages, time-speed-distance), Logical (puzzles, series), and Verbal (grammar, comprehension). Check the Placement Preparation module!",
    "interview"     : "Interview tips: Research the company, revise core subjects, practice STAR method for HR questions, and solve at least 2 DSA problems daily.",
    "roadmap"       : "Your personalized learning roadmap is generated based on your skill gap. It covers Beginner → Intermediate → Advanced levels with a weekly timeline.",
    "internship"    : "Apply for internships on Internshala, LinkedIn, AngelList, and LetsIntern. Build projects and a strong GitHub profile to stand out.",
    "python"        : "Python is one of the most in-demand skills! Focus on: syntax basics, OOP, libraries (NumPy, Pandas), and frameworks (Flask/Django).",
    "machine learning": "For ML: Start with Python & statistics, then learn Scikit-learn, then deep learning with TensorFlow/PyTorch. Complete Andrew Ng's course on Coursera!",
    "data science"  : "Data Science roadmap: Python → Statistics → Pandas/NumPy → Data Visualization → ML → Deep Learning → Projects on Kaggle.",
    "full stack"    : "Full Stack path: HTML/CSS/JS → React → Node.js/Express → Database (MongoDB/MySQL) → REST APIs → Deploy on AWS/Heroku.",
    "github"        : "Maintain an active GitHub profile with at least 3-5 good projects. Add a README to each project and contribute to open source.",
    "cgpa"          : "Most companies have a CGPA cutoff between 6.0-7.0. Focus on improving CGPA alongside technical skills to pass resume screening.",
    "certifications": "Valuable certifications: AWS Certified, Google TensorFlow Developer, Microsoft Azure, Oracle Java, Coursera specializations. List them on your resume!",
    "default"       : "I understand you're asking about '{query}'. Please check the relevant module in your dashboard, or try asking about: career, resume, skills, placement, aptitude, or roadmap."
}


class ChatbotService:
    def __init__(self):
        self._history: dict = {}   # uid -> list of {role, message}

    def get_response(self, uid: int, message: str) -> str:
        msg_lower = message.lower()

        response = None
        for key, reply in CAREER_RESPONSES.items():
            if key in msg_lower:
                response = reply
                break

        if not response:
            response = CAREER_RESPONSES['default'].replace('{query}', message)

        # Store history
        if uid not in self._history:
            self._history[uid] = []
        self._history[uid].append({'role': 'user',      'message': message})
        self._history[uid].append({'role': 'assistant', 'message': response})

        # Keep last 20 messages
        self._history[uid] = self._history[uid][-20:]
        return response

    def get_history(self, uid: int) -> list:
        return self._history.get(uid, [])