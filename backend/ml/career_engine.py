from typing import Optional, Dict, List, TypedDict, Any
import os
# Lazy load model to speed up fast API reload, but we keep it global
similarity_model = None

def get_similarity_model():
    global similarity_model
    if similarity_model is None:
        from sentence_transformers import SentenceTransformer
        # Use a very fast, lightweight model
        similarity_model = SentenceTransformer('all-MiniLM-L6-v2')
    return similarity_model

from sklearn.metrics.pairwise import cosine_similarity

# ──────────────────────────────────────────────────────────────
# DOMAIN KNOWLEDGE BASE
# Expanded from IEEE paper's structured dataset concept
# Each domain has: required_skills (with weights), interests,
# difficulty_level (for aptitude modifier), critical_skills
# ──────────────────────────────────────────────────────────────
class DomainConfig(TypedDict):
    required_skills: Dict[str, int]
    interests: List[str]
    difficulty: float
    critical: List[str]
    salary_band: str
    growth: str

CAREER_DOMAINS: Dict[str, DomainConfig] = {
    "Software Engineer": {
        "required_skills": {
            "python": 9, "java": 8, "c++": 7, "data structures": 10,
            "algorithms": 10, "git": 8, "sql": 7, "rest api": 8,
            "oop": 9, "linux": 6, "problem solving": 9, "system design": 7
        },
        "interests": ["coding","programming","web development","software","technology","backend","frontend","open source"],
        "difficulty":  0.70,   # aptitude modifier — higher = needs stronger aptitude
        "critical"  : ["data structures","algorithms","oop"],  # absence penalizes score
        "salary_band": "₹6–25 LPA",
        "growth"     : "High",
    },
    "Data Scientist": {
        "required_skills": {
            "python": 10, "machine learning": 10, "statistics": 9,
            "pandas": 8, "numpy": 8, "data analysis": 9,
            "sql": 8, "data visualization": 7, "scikit-learn": 7,
            "jupyter": 5, "mathematics": 8
        },
        "interests": ["data","analytics","ai","machine learning","research","statistics","data science","visualization"],
        "difficulty":  0.75,
        "critical"  : ["python","machine learning","statistics"],
        "salary_band": "₹7–30 LPA",
        "growth"     : "Very High",
    },
    "Web Developer (Frontend)": {
        "required_skills": {
            "html": 9, "css": 9, "javascript": 10, "react": 9,
            "typescript": 7, "git": 8, "responsive design": 8,
            "ui/ux": 6, "figma": 5, "rest api": 7
        },
        "interests": ["web development","design","frontend","ui/ux","javascript","react","css","animation"],
        "difficulty":  0.55,
        "critical"  : ["html","css","javascript"],
        "salary_band": "₹4–18 LPA",
        "growth"     : "High",
    },
    "Web Developer (Backend)": {
        "required_skills": {
            "python": 8, "node": 8, "java": 7, "sql": 9,
            "rest api": 10, "docker": 7, "git": 8, "linux": 7,
            "mongodb": 6, "authentication": 7, "system design": 7
        },
        "interests": ["backend","apis","databases","servers","microservices","node","python","java"],
        "difficulty":  0.70,
        "critical"  : ["rest api","sql","git"],
        "salary_band": "₹5–20 LPA",
        "growth"     : "High",
    },
    "AI/ML Engineer": {
        "required_skills": {
            "python": 10, "machine learning": 10, "deep learning": 10,
            "tensorflow": 8, "pytorch": 9, "nlp": 8,
            "computer vision": 7, "mlops": 7, "docker": 7,
            "mathematics": 9, "statistics": 8
        },
        "interests": ["artificial intelligence","machine learning","research","deep learning","robotics","nlp","computer vision"],
        "difficulty":  0.85,
        "critical"  : ["python","machine learning","deep learning"],
        "salary_band": "₹10–50 LPA",
        "growth"     : "Extremely High",
    },
    "Cloud / DevOps Engineer": {
        "required_skills": {
            "aws": 9, "docker": 10, "kubernetes": 9, "linux": 9,
            "ci/cd": 9, "terraform": 8, "networking": 8,
            "bash": 7, "python": 7, "monitoring": 7
        },
        "interests": ["cloud","devops","infrastructure","automation","networking","reliability","scalability"],
        "difficulty":  0.70,
        "critical"  : ["docker","linux","ci/cd"],
        "salary_band": "₹8–30 LPA",
        "growth"     : "Very High",
    },
    "Data Engineer": {
        "required_skills": {
            "python": 9, "sql": 10, "spark": 8, "kafka": 7,
            "airflow": 7, "etl": 9, "data pipelines": 9,
            "aws": 7, "scala": 6, "hadoop": 6, "dbt": 6
        },
        "interests": ["data","big data","pipelines","analytics","databases","etl","warehousing"],
        "difficulty":  0.72,
        "critical"  : ["sql","python","etl"],
        "salary_band": "₹8–28 LPA",
        "growth"     : "Very High",
    },
    "Cybersecurity Analyst": {
        "required_skills": {
            "networking": 10, "linux": 9, "python": 7, "security": 10,
            "ethical hacking": 8, "cryptography": 7, "siem": 7,
            "firewalls": 7, "owasp": 8, "penetration testing": 8
        },
        "interests": ["security","hacking","networking","privacy","forensics","cyber","defense"],
        "difficulty":  0.75,
        "critical"  : ["networking","security","linux"],
        "salary_band": "₹6–22 LPA",
        "growth"     : "High",
    },
    "Embedded Systems Engineer": {
        "required_skills": {
            "c": 10, "c++": 9, "microcontrollers": 9, "iot": 8,
            "rtos": 8, "hardware": 8, "embedded": 10, "python": 6, "pcb design": 6
        },
        "interests": ["hardware","robotics","iot","electronics","embedded","microcontrollers","firmware"],
        "difficulty":  0.75,
        "critical"  : ["c","c++","embedded"],
        "salary_band": "₹5–18 LPA",
        "growth"     : "Medium",
    },
    "Android Developer": {
        "required_skills": {
            "kotlin": 10, "java": 8, "android sdk": 9, "jetpack compose": 8,
            "rest api": 8, "git": 8, "room db": 6, "firebase": 7, "mvvm": 7
        },
        "interests": ["android","mobile","app development","kotlin","java","ui design"],
        "difficulty":  0.60,
        "critical"  : ["kotlin","android sdk","rest api"],
        "salary_band": "₹5–20 LPA",
        "growth"     : "High",
    },
    "Product Manager": {
        "required_skills": {
            "product thinking": 10, "communication": 10, "data analysis": 8,
            "sql": 6, "user research": 9, "agile": 9, "roadmap planning": 9,
            "figma": 6, "a/b testing": 7, "metrics": 8
        },
        "interests": ["product","business","strategy","user experience","growth","analytics","management"],
        "difficulty":  0.60,
        "critical"  : ["communication","product thinking","user research"],
        "salary_band": "₹12–40 LPA",
        "growth"     : "Very High",
    },
}

# Transferable / cross-domain skills that boost any score
TRANSFERABLE_SKILLS: Dict[str, float] = {
    "python"        : 1.15,   # boosts every domain by 15%
    "git"           : 1.10,
    "sql"           : 1.10,
    "communication" : 1.12,
    "problem solving": 1.15,
    "leadership"    : 1.10,
    "agile"         : 1.08,
    "linux"         : 1.08,
    "docker"        : 1.10,
    "mathematics"   : 1.12,
}

# Soft skills that act as a multiplier on final score
SOFT_SKILL_BONUS: Dict[str, float] = {
    "communication": 0.04,    # +4% on final score
    "leadership"   : 0.03,
    "teamwork"     : 0.02,
    "problem solving": 0.04,
    "critical thinking": 0.03,
    "time management": 0.02,
}

# Map university branches to base domain boosts when no other data is present
BRANCH_DOMAIN_BOOST: Dict[str, List[str]] = {
    "cse":  ["Software Engineer", "Web Developer (Backend)", "Cloud / DevOps Engineer"],
    "it":   ["Software Engineer", "Web Developer (Frontend)", "Data Engineer"],
    "eee":  ["Embedded Systems Engineer", "Cloud / DevOps Engineer"],
    "ece":  ["Embedded Systems Engineer", "Cybersecurity Analyst", "Software Engineer"],
    "aids": ["Data Scientist", "AI/ML Engineer", "Data Engineer"],
    "aiml": ["AI/ML Engineer", "Data Scientist", "Software Engineer"],
}


class CareerEngineV2:
    """
    LightGBM-inspired gradient boosting career prediction engine.

    The IEEE paper uses LightGBM for its speed with structured data
    and ability to handle categorical features (career fields, skill sets).

    We implement the SAME CORE CONCEPTS without requiring the library:
      - Weak learners (each scoring component = one weak learner)
      - Weighted ensemble (each learner has a learning rate / weight)
      - Feature importance (each feature's contribution is tracked)
      - Residual correction (poor aptitude penalizes high-difficulty domains)
    """

    # ── LightGBM-style LEARNER WEIGHTS (learning rates) ─────────
    # These mirror how LightGBM assigns importance to features.
    # Derived from the IEEE paper's feature importance analysis:
    # Skills > Aptitude > Interests (paper's stated ranking)
    WEIGHTS = {
        "skill_coverage"  : 0.35,   # Learner 1: % of required skills matched
        "skill_proficiency": 0.15,  # Learner 2: average proficiency of matched skills
        "aptitude"        : 0.25,   # Learner 3: aptitude score × domain difficulty
        "interest_match"  : 0.15,   # Learner 4: interest keyword overlap
        "tech_score"      : 0.05,   # Learner 5: technical test performance
        "profile_bonus"   : 0.02,   # Learner 6: resume richness, soft skills
        "branch_bonus"    : 0.03,   # Learner 7: academic background alignment
    }

    def predict(
        self,
        skills        : dict,            # {skill_name: proficiency 1-10}
        interests     : list,            # ["data science", "coding", ...]
        aptitude_score: float,           # 0-100
        resume_skills : Optional[list] = None,  # from resume parser
        tech_score    : float = 0,       # technical test score 0-100
        cgpa          : Optional[float] = None,  # 0-10 scale
        assessment_trend: Optional[str] = None,  # "improving"|"declining"|"stable"
        branch        : Optional[str] = None,    # academic branch
    ) -> dict:

        # ── 0. Dynamic Weight Redistribution (Cold Start) ───────
        # If user hasn't taken assessments, redistribute those weights
        # to Skill Coverage and Interest Match
        current_weights = self.WEIGHTS.copy()
        
        missing_aptitude = (aptitude_score == 0)
        missing_tech = (tech_score == 0)
        
        realloc = 0.0
        if missing_aptitude:
            realloc += current_weights["aptitude"]
            current_weights["aptitude"] = 0.0
        if missing_tech:
            realloc += current_weights["tech_score"]
            current_weights["tech_score"] = 0.0
            
        if realloc > 0:
            # Distribute missing weight proportionally to skills and interests
            base_sum = current_weights["skill_coverage"] + current_weights["skill_proficiency"] + current_weights["interest_match"]
            current_weights["skill_coverage"] += realloc * (current_weights["skill_coverage"] / base_sum)
            current_weights["skill_proficiency"] += realloc * (current_weights["skill_proficiency"] / base_sum)
            current_weights["interest_match"] += realloc * (current_weights["interest_match"] / base_sum)

        # ── 1. Build unified skill set ───────────────────────────
        all_skills: dict = {}
        if isinstance(skills, dict):
            for sk, val in skills.items():
                all_skills[sk.lower()] = float(val) if val else 5.0
        if resume_skills:
            for sk in resume_skills:
                if sk.lower() not in all_skills:
                    all_skills[sk.lower()] = 5.0   # resume skill, unknown proficiency

        # ── 2. Soft skill multiplier ─────────────────────────────
        soft_bonus = sum(
            SOFT_SKILL_BONUS.get(sk, 0)
            for sk in all_skills
            if sk in SOFT_SKILL_BONUS
        )
        soft_multiplier = 1.0 + min(soft_bonus, 0.15)  # cap at +15%

        # ── 3. CGPA bonus (weak learner) ─────────────────────────
        cgpa_bonus = 0.0
        if cgpa:
            if cgpa >= 8.5:   cgpa_bonus = 3.0
            elif cgpa >= 7.5: cgpa_bonus = 1.5
            elif cgpa >= 6.5: cgpa_bonus = 0.5

        # ── 4. Assessment trend modifier ────────────────────────
        trend_mod = {"improving": 1.05, "stable": 1.0, "declining": 0.95}.get(
            assessment_trend or "stable", 1.0
        )

        branch_normalized = branch.lower() if branch else ""
        branch_boosts = BRANCH_DOMAIN_BOOST.get(branch_normalized, [])

        domain_scores: Dict[str, float] = {}
        feature_explain: Dict[str, Any] = {}  # evidence for each domain

        # Pre-compute embedings for semantic matching
        user_skills_list = list(all_skills.keys())
        user_embeddings = None
        if user_skills_list:
            model = get_similarity_model()
            user_embeddings = model.encode(user_skills_list)

        for domain, cfg in CAREER_DOMAINS.items():
            req    = cfg["required_skills"]   # {skill: weight 1-10}
            dom_int = [i.lower() for i in cfg["interests"]]
            diff   = cfg["difficulty"]
            critical = [c.lower() for c in cfg["critical"]]

            # ── LEARNER 1: Skill Coverage Score (Semantic) ──────
            matched = {}
            if user_embeddings is not None and len(req) > 0:
                req_skills_list = list(req.keys())
                model = get_similarity_model()
                req_embeddings = model.encode(req_skills_list)
                
                sim_matrix = cosine_similarity(req_embeddings, user_embeddings)
                
                for i, req_sk in enumerate(req_skills_list):
                    # Find best matching user skill
                    best_match_idx = sim_matrix[i].argmax()
                    best_sim = sim_matrix[i, best_match_idx]
                    
                    if best_sim >= 0.70: # 70% semantic similarity threshold
                        matched_user_sk = user_skills_list[best_match_idx]
                        matched[req_sk] = req[req_sk] # store with required weight
                        # You could also blend in best_sim if you wanted partial credit
            
            coverage = len(matched) / max(len(req), 1)

            # ── LEARNER 2: Skill Proficiency Score ──────────────
            if matched:
                # Weighted average: (user_proficiency / 10) × skill_importance
                prof_scores = []
                for req_sk, importance in matched.items():
                    # For proficiency, find the best semantic match again or just assume 5.0 
                    # for simplicity let's rely on finding it in the matrix
                    if req_sk in all_skills:
                        user_prof = all_skills[req_sk] / 10.0
                    else:
                        # Find which user skill matched it
                        req_idx = list(req.keys()).index(req_sk)
                        best_match_idx = sim_matrix[req_idx].argmax()
                        matched_user_sk = user_skills_list[best_match_idx]
                        user_prof = all_skills.get(matched_user_sk, 5.0) / 10.0
                    
                    prof_scores.append(user_prof * (importance / 10.0))
                proficiency = sum(prof_scores) / len(prof_scores)
            else:
                proficiency = 0.0

            # ── LEARNER 3: Aptitude × Domain Difficulty ──────────
            # KEY INSIGHT FROM IEEE PAPER: high difficulty domains
            # require stronger aptitude. This is the LightGBM "residual"
            # correction — aptitude corrects for overconfident skill matching.
            if missing_aptitude:
                apt_contribution = 0.0
            else:
                apt_norm       = aptitude_score / 100.0
                apt_contribution = apt_norm * diff  # harder domain → aptitude matters more

            # ── LEARNER 4: Interest Alignment ────────────────────
            user_int = [i.lower() for i in interests]
            int_hits = sum(
                1 for ui in user_int
                for di in dom_int
                if ui in di or di in ui or ui == di
            )
            int_score = min(int_hits / max(len(dom_int), 1), 1.0)

            # ── LEARNER 5: Tech Test Score ────────────────────────
            tech_norm = 0.0 if missing_tech else (tech_score / 100.0) * 0.8  # cap contribution

            # ── LEARNER 6: Transferable Skill Bonus ──────────────
            transfer_boost = 1.0
            for sk, multiplier in TRANSFERABLE_SKILLS.items():
                if sk in all_skills:
                    transfer_boost = max(transfer_boost, multiplier)
            profile_bonus_val = (transfer_boost - 1.0)  # 0 to 0.15

            # ── PENALTY: Critical skill absence ──────────────────
            # Paper's insight: some skills are non-negotiable for a domain.
            # Missing ALL critical skills → heavy penalty (like LightGBM
            # giving high importance to decision-tree split features)
            critical_matched = sum(1 for c in critical if c in all_skills)
            if critical_matched == 0:
                critical_penalty = 0.50   # 50% penalty — domain unlikely
            elif critical_matched == 1:
                critical_penalty = 0.80   # 20% penalty
            else:
                critical_penalty = 1.00   # no penalty

            # ── ENSEMBLE: Weighted sum (gradient boosting aggregation) ──
            branch_match = 1.0 if domain in branch_boosts else 0.0

            raw_score = (
                coverage        * current_weights["skill_coverage"]   * 100 +
                proficiency     * current_weights["skill_proficiency"] * 100 +
                apt_contribution* current_weights["aptitude"]          * 100 +
                int_score       * current_weights["interest_match"]    * 100 +
                tech_norm       * current_weights["tech_score"]        * 100 +
                profile_bonus_val * current_weights["profile_bonus"]   * 100 +
                branch_match    * current_weights["branch_bonus"]      * 100
            )

            # Apply critical penalty, soft skill boost, CGPA, trend
            final_score = raw_score * critical_penalty * soft_multiplier * trend_mod + cgpa_bonus

            # Clamp to 0-100
            final_score = round(min(max(final_score, 0), 99.5), 2)

            domain_scores[domain] = final_score

            # ── Evidence building (WHY this career was recommended) ──
            feature_explain[domain] = {
                "skill_coverage_pct"   : round(float(coverage * 100), 1),
                "matched_skills"       : list(matched.keys()),
                "missing_critical"     : [c for c in critical if c not in all_skills],
                "proficiency_score"    : round(float(proficiency * 100), 1),
                "aptitude_contribution": round(float(apt_contribution * 100), 1),
                "interest_match_pct"   : round(float(int_score * 100), 1),
                "branch_match"         : branch_match,
                "critical_penalty"     : critical_penalty,
                "raw_score"            : round(float(raw_score), 2),
                "final_score"          : final_score,
                "learner_contributions": {
                    "skill_coverage"   : round(float(coverage * current_weights["skill_coverage"] * 100), 2),
                    "skill_proficiency": round(float(proficiency * current_weights["skill_proficiency"] * 100), 2),
                    "aptitude"         : round(float(apt_contribution * current_weights["aptitude"] * 100), 2),
                    "interest_match"   : round(float(int_score * current_weights["interest_match"] * 100), 2),
                    "tech_score"       : round(float(tech_norm * current_weights["tech_score"] * 100), 2),
                },
            }

        # ── Sort and pick top 3 ──────────────────────────────────
        sorted_domains = sorted(domain_scores.items(), key=lambda x: x[1], reverse=True)
        top3 = []
        for rank, (domain, score) in enumerate(sorted_domains[:3], 1):
            ex     = feature_explain[domain]
            cfg    = CAREER_DOMAINS[domain]
            medals = {1: "🥇", 2: "🥈", 3: "🥉"}

            # Build human-readable evidence sentences
            evidence = []
            if ex["skill_coverage_pct"] >= 70:
                evidence.append(f"Strong skill match — you have {ex['skill_coverage_pct']}% of required skills")
            elif ex["skill_coverage_pct"] >= 40:
                evidence.append(f"Partial skill match — {ex['skill_coverage_pct']}% of skills present, {len(ex['missing_critical'])} critical skills missing")
            else:
                evidence.append(f"Low skill overlap ({ex['skill_coverage_pct']}%) — significant upskilling needed")

            if ex["interest_match_pct"] >= 60:
                evidence.append(f"Your interests align well ({ex['interest_match_pct']}% match)")
            if aptitude_score >= 70:
                evidence.append(f"Your aptitude score ({aptitude_score:.0f}%) supports this domain")
            if ex.get("branch_match", 0) > 0:
                evidence.append(f"Strongly aligns with your academic branch ({branch.upper() if branch else ''})")
            if ex["missing_critical"]:
                evidence.append(f"⚠️ Missing critical skills: {', '.join(ex['missing_critical'])}")

            top3.append({
                "rank"                  : rank,
                "medal"                 : medals[rank],
                "domain"                : domain,
                "suitability_percentage": score,
                "salary_band"           : cfg["salary_band"],
                "growth"                : cfg["growth"],
                "evidence"              : evidence,
                "skill_coverage_pct"    : ex["skill_coverage_pct"],
                "matched_skills"        : ex["matched_skills"],
                "missing_critical"      : ex["missing_critical"],
                "interest_match_pct"    : ex["interest_match_pct"],
                "aptitude_contribution" : ex["aptitude_contribution"],
                "learner_contributions" : ex["learner_contributions"],
            })

        # ── Confidence interval (IEEE paper insight) ─────────────
        # High gap between top-1 and top-2 = high confidence in prediction
        if len(sorted_domains) >= 2:
            gap        = sorted_domains[0][1] - sorted_domains[1][1]
            # LightGBM confidence: margin of victory normalized
            confidence = round(float(min(40 + (gap * 3) + (sorted_domains[0][1] * 0.3), 99)), 1)
        else:
            confidence = round(float(sorted_domains[0][1] * 0.9), 1) if sorted_domains else 0

        # Confidence label
        if confidence >= 75:   conf_label = "High Confidence ✅"
        elif confidence >= 55: conf_label = "Moderate Confidence 🟡"
        else:                  conf_label = "Low Confidence ⚠️ (more data needed)"

        # ── Best domain stats for dashboard ─────────────────────
        best_domain    = sorted_domains[0][0] if sorted_domains else ""
        best_ex        = feature_explain.get(best_domain, {})
        skill_match_pct = best_ex.get("skill_coverage_pct", 0)
        int_match_pct   = best_ex.get("interest_match_pct", 0)

        return {
            # Core prediction (Top 3 — matches IEEE paper output)
            "top_careers"          : top3,

            # Summary metrics
            "skill_match_score"    : skill_match_pct,
            "interest_match_score" : int_match_pct,
            "aptitude_score"       : aptitude_score,
            "confidence_score"     : confidence,
            "confidence_label"     : conf_label,

            # Algorithm transparency (extra beyond IEEE paper)
            "algorithm"            : "LightGBM-inspired Gradient Boosting Ensemble",
            "learner_weights"      : self.WEIGHTS,
            "total_skills_provided": len(all_skills),
            "soft_multiplier"      : round(float(soft_multiplier), 3),
            "cgpa_bonus"           : cgpa_bonus,

            # Reliability flags
            "prediction_reliable"  : len(all_skills) >= 3 and aptitude_score > 0,
            "data_quality_warnings": self._data_warnings(all_skills, aptitude_score, interests),
        }

    def _data_warnings(self, skills: dict, aptitude: float, interests: list) -> list:
        """Surface data quality issues that reduce prediction accuracy."""
        warnings = []
        if len(skills) < 3:
            warnings.append("Add more skills to your profile for accurate predictions (minimum 5 recommended)")
        if aptitude == 0:
            warnings.append("No aptitude test taken — take at least 3 tests to improve accuracy")
        if not interests:
            warnings.append("No interests specified — add career interests in your profile")
        if len(skills) < 8:
            warnings.append(f"Only {len(skills)} skills detected — more skills = better accuracy")
        return warnings




# CAREER_DOMAINS = {
#     "Software Engineer": {
#         "required_skills": ["python","java","data structures","algorithms","git","sql","rest api","oop"],
#         "interests"      : ["coding","programming","web development","software","technology","backend","frontend"],
#     },
#     "Data Scientist": {
#         "required_skills": ["python","machine learning","statistics","pandas","numpy","data analysis","sql","visualization"],
#         "interests"      : ["data","analytics","ai","machine learning","research","statistics","data science"],
#     },
#     "Web Developer": {
#         "required_skills": ["html","css","javascript","react","node","git","responsive design"],
#         "interests"      : ["web development","design","frontend","ui/ux","javascript","react"],
#     },
#     "AI/ML Engineer": {
#         "required_skills": ["python","machine learning","deep learning","tensorflow","pytorch","nlp","computer vision"],
#         "interests"      : ["artificial intelligence","machine learning","research","deep learning","robotics"],
#     },
#     "Cloud Engineer": {
#         "required_skills": ["aws","azure","gcp","docker","kubernetes","linux","networking","terraform"],
#         "interests"      : ["cloud","devops","infrastructure","automation","networking"],
#     },
#     "Cybersecurity Analyst": {
#         "required_skills": ["networking","linux","security","ethical hacking","python","cryptography"],
#         "interests"      : ["security","hacking","networking","privacy","forensics"],
#     },
#     "Embedded Systems Engineer": {
#         "required_skills": ["c","c++","microcontrollers","iot","rtos","hardware","embedded","python"],
#         "interests"      : ["hardware","robotics","iot","electronics","embedded"],
#     },
#     "Data Engineer": {
#         "required_skills": ["python","sql","spark","hadoop","kafka","airflow","data pipelines","etl"],
#         "interests"      : ["data","big data","pipelines","analytics","databases"],
#     },
# }


# class CareerEngine:

#     def predict(self, skills: dict, interests: list, aptitude_score: float,
#                 resume_skills: list = None, tech_score: float = 0) -> dict:

#         all_user_skills = set(k.lower() for k in skills.keys())
#         if resume_skills:
#             all_user_skills.update(s.lower() for s in resume_skills)

#         aptitude_norm = aptitude_score / 100.0
#         scores = {}

#         for domain, data in CAREER_DOMAINS.items():
#             req     = [s.lower() for s in data['required_skills']]
#             dom_int = [i.lower() for i in data['interests']]

#             matched_skills     = all_user_skills.intersection(req)
#             skill_match        = len(matched_skills) / max(len(req), 1)
#             rated_bonus        = sum((skills.get(s, 5) if isinstance(skills, dict) else 5) / 10.0 for s in matched_skills)
#             if matched_skills:
#                 rated_bonus /= len(matched_skills)
#             skill_match_final  = (skill_match * 0.7 + rated_bonus * 0.3)

#             user_interests = [i.lower() for i in interests]
#             int_match      = sum(1 for i in user_interests if any(d in i or i in d for d in dom_int))
#             int_score      = min(int_match / max(len(dom_int), 1), 1.0)

#             scores[domain] = round((skill_match_final * 50) + (aptitude_norm * 30) + (int_score * 20), 2)

#         sorted_domains = sorted(scores.items(), key=lambda x: x[1], reverse=True)
#         top3 = [{"domain": d, "suitability_percentage": round(s, 2)} for d, s in sorted_domains[:3]]

#         if len(sorted_domains) >= 2:
#             gap        = sorted_domains[0][1] - sorted_domains[1][1]
#             confidence = round(min(50 + gap * 2, 99), 2)
#         else:
#             confidence = round(sorted_domains[0][1], 2) if sorted_domains else 0

#         best_domain     = sorted_domains[0][0] if sorted_domains else ""
#         best_req        = [s.lower() for s in CAREER_DOMAINS.get(best_domain, {}).get('required_skills', [])]
#         matched         = all_user_skills.intersection(best_req)
#         skill_match_pct = round(len(matched) / max(len(best_req), 1) * 100, 2)

#         dom_int         = [i.lower() for i in CAREER_DOMAINS.get(best_domain, {}).get('interests', [])]
#         user_interests  = [i.lower() for i in interests]
#         int_cnt         = sum(1 for i in user_interests if any(d in i or i in d for d in dom_int))
#         int_match_pct   = round(min(int_cnt / max(len(dom_int), 1), 1.0) * 100, 2)

#         return {
#             "top_careers"         : top3,
#             "skill_match_score"   : skill_match_pct,
#             "interest_match_score": int_match_pct,
#             "aptitude_score"      : aptitude_score,
#             "confidence_score"    : confidence,
#         }
