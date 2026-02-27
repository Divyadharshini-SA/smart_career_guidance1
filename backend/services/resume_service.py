import re
import os

# Try importing NLP libs gracefully
try:
    import pdfplumber
    PDF_SUPPORT = True
except ImportError:
    PDF_SUPPORT = False

try:
    from docx import Document
    DOCX_SUPPORT = True
except ImportError:
    DOCX_SUPPORT = False

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.metrics.pairwise import cosine_similarity
    SKLEARN_SUPPORT = True
except ImportError:
    SKLEARN_SUPPORT = False

try:
    import nltk
    from nltk.corpus import stopwords
    from nltk.tokenize import word_tokenize
    nltk.download('punkt',     quiet=True)
    nltk.download('stopwords', quiet=True)
    NLTK_SUPPORT = True
except ImportError:
    NLTK_SUPPORT = False


SKILL_KEYWORDS = [
    # Programming
    "python", "java", "c++", "c", "javascript", "typescript", "golang", "rust", "kotlin", "swift",
    # Web
    "html", "css", "react", "angular", "vue", "node", "express", "django", "flask", "fastapi",
    # Data / ML
    "machine learning", "deep learning", "tensorflow", "pytorch", "keras", "scikit-learn",
    "pandas", "numpy", "matplotlib", "data science", "nlp", "computer vision",
    # Cloud / DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "ci/cd", "terraform",
    # DB
    "mysql", "postgresql", "mongodb", "redis", "sqlite", "firebase", "elasticsearch",
    # Tools
    "git", "linux", "bash", "rest api", "graphql", "microservices", "agile", "scrum",
    # Soft skills
    "communication", "leadership", "teamwork", "problem solving", "critical thinking",
]

INDUSTRY_REQUIRED = {
    "software_engineer": ["python","java","data structures","algorithms","git","sql","rest api","agile"],
    "data_scientist"   : ["python","machine learning","pandas","numpy","statistics","sql","data visualization"],
    "web_developer"    : ["html","css","javascript","react","node","git","rest api"],
    "ml_engineer"      : ["python","machine learning","deep learning","tensorflow","pytorch","mlops","docker"],
}


class ResumeService:

    def extract_text(self, filepath: str) -> str:
        ext = os.path.splitext(filepath)[1].lower()
        text = ""
        try:
            if ext == '.pdf' and PDF_SUPPORT:
                with pdfplumber.open(filepath) as pdf:
                    for page in pdf.pages:
                        text += (page.extract_text() or "") + "\n"
            elif ext in ('.doc', '.docx') and DOCX_SUPPORT:
                doc = Document(filepath)
                text = "\n".join([p.text for p in doc.paragraphs])
            else:
                # Fallback: read as plain text
                with open(filepath, 'r', errors='ignore') as f:
                    text = f.read()
        except Exception as e:
            text = f"[Error extracting text: {e}]"
        return text.lower()

    def extract_skills(self, text: str) -> list:
        found = []
        for skill in SKILL_KEYWORDS:
            if skill in text:
                found.append(skill)
        return found

    def calculate_resume_score(self, text: str, extracted_skills: list) -> float:
        """
        Score based on:
          - Skill coverage      (50%)
          - Resume sections     (30%)
          - Text quality length (20%)
        """
        # Skill coverage score
        skill_score = min(len(extracted_skills) / 15, 1.0) * 50

        # Section detection
        sections = ['experience', 'education', 'skills', 'projects', 'achievements', 'certifications']
        found_sections = sum(1 for s in sections if s in text)
        section_score = (found_sections / len(sections)) * 30

        # Length score
        words = len(text.split())
        length_score = min(words / 400, 1.0) * 20

        total = round(skill_score + section_score + length_score, 2)
        return total

    def tfidf_match(self, resume_text: str, job_description: str) -> float:
        """Cosine similarity between resume and job description using TF-IDF."""
        if not SKLEARN_SUPPORT:
            return 0.0
        try:
            vectorizer = TfidfVectorizer(stop_words='english')
            tfidf = vectorizer.fit_transform([resume_text, job_description])
            sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
            return round(float(sim) * 100, 2)
        except Exception:
            return 0.0