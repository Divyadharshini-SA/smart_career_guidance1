CAREER_DOMAINS = {
    "Software Engineer": {
        "required_skills": ["python","java","data structures","algorithms","git","sql","rest api","oop"],
        "interests"      : ["coding","programming","web development","software","technology","backend","frontend"],
    },
    "Data Scientist": {
        "required_skills": ["python","machine learning","statistics","pandas","numpy","data analysis","sql","visualization"],
        "interests"      : ["data","analytics","ai","machine learning","research","statistics","data science"],
    },
    "Web Developer": {
        "required_skills": ["html","css","javascript","react","node","git","responsive design"],
        "interests"      : ["web development","design","frontend","ui/ux","javascript","react"],
    },
    "AI/ML Engineer": {
        "required_skills": ["python","machine learning","deep learning","tensorflow","pytorch","nlp","computer vision"],
        "interests"      : ["artificial intelligence","machine learning","research","deep learning","robotics"],
    },
    "Cloud Engineer": {
        "required_skills": ["aws","azure","gcp","docker","kubernetes","linux","networking","terraform"],
        "interests"      : ["cloud","devops","infrastructure","automation","networking"],
    },
    "Cybersecurity Analyst": {
        "required_skills": ["networking","linux","security","ethical hacking","python","cryptography"],
        "interests"      : ["security","hacking","networking","privacy","forensics"],
    },
    "Embedded Systems Engineer": {
        "required_skills": ["c","c++","microcontrollers","iot","rtos","hardware","embedded","python"],
        "interests"      : ["hardware","robotics","iot","electronics","embedded"],
    },
    "Data Engineer": {
        "required_skills": ["python","sql","spark","hadoop","kafka","airflow","data pipelines","etl"],
        "interests"      : ["data","big data","pipelines","analytics","databases"],
    },
}


class CareerEngine:

    def predict(self, skills: dict, interests: list, aptitude_score: float,
                resume_skills: list = None, tech_score: float = 0) -> dict:

        all_user_skills = set(k.lower() for k in skills.keys())
        if resume_skills:
            all_user_skills.update(s.lower() for s in resume_skills)

        aptitude_norm = aptitude_score / 100.0
        scores = {}

        for domain, data in CAREER_DOMAINS.items():
            req     = [s.lower() for s in data['required_skills']]
            dom_int = [i.lower() for i in data['interests']]

            matched_skills     = all_user_skills.intersection(req)
            skill_match        = len(matched_skills) / max(len(req), 1)
            rated_bonus        = sum((skills.get(s, 5) if isinstance(skills, dict) else 5) / 10.0 for s in matched_skills)
            if matched_skills:
                rated_bonus /= len(matched_skills)
            skill_match_final  = (skill_match * 0.7 + rated_bonus * 0.3)

            user_interests = [i.lower() for i in interests]
            int_match      = sum(1 for i in user_interests if any(d in i or i in d for d in dom_int))
            int_score      = min(int_match / max(len(dom_int), 1), 1.0)

            scores[domain] = round((skill_match_final * 50) + (aptitude_norm * 30) + (int_score * 20), 2)

        sorted_domains = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        top3 = [{"domain": d, "suitability_percentage": round(s, 2)} for d, s in sorted_domains[:3]]

        if len(sorted_domains) >= 2:
            gap        = sorted_domains[0][1] - sorted_domains[1][1]
            confidence = round(min(50 + gap * 2, 99), 2)
        else:
            confidence = round(sorted_domains[0][1], 2) if sorted_domains else 0

        best_domain     = sorted_domains[0][0] if sorted_domains else ""
        best_req        = [s.lower() for s in CAREER_DOMAINS.get(best_domain, {}).get('required_skills', [])]
        matched         = all_user_skills.intersection(best_req)
        skill_match_pct = round(len(matched) / max(len(best_req), 1) * 100, 2)

        dom_int         = [i.lower() for i in CAREER_DOMAINS.get(best_domain, {}).get('interests', [])]
        user_interests  = [i.lower() for i in interests]
        int_cnt         = sum(1 for i in user_interests if any(d in i or i in d for d in dom_int))
        int_match_pct   = round(min(int_cnt / max(len(dom_int), 1), 1.0) * 100, 2)

        return {
            "top_careers"         : top3,
            "skill_match_score"   : skill_match_pct,
            "interest_match_score": int_match_pct,
            "aptitude_score"      : aptitude_score,
            "confidence_score"    : confidence,
        }
