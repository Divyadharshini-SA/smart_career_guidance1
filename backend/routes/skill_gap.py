from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import UserProfile, Resume, User
from dependencies import get_current_user

router = APIRouter()

# Same alias map as frontend — keeps matching consistent
SKILL_ALIASES = {
    'oops': 'oop', 'oop concepts': 'oop', 'object oriented': 'oop',
    'object-oriented programming': 'oop', 'oop': 'oop',
    'dsa': 'data structures', 'data structure': 'data structures',
    'c plus plus': 'c++', 'cpp': 'c++',
    'js': 'javascript', 'nodejs': 'node.js', 'node js': 'node.js',
    'reactjs': 'react.js', 'react js': 'react.js',
    'ml': 'machine learning', 'ai': 'machine learning',
    'postgres': 'sql', 'mysql': 'sql', 'postgresql': 'sql',
    'git': 'git/github', 'github': 'git/github',
    'bash': 'linux', 'shell scripting': 'linux',
    'sklearn': 'scikit-learn', 'scikit': 'scikit-learn',
    'pandas': 'pandas & numpy', 'numpy': 'pandas & numpy',
    'pytorch': 'deep learning', 'tensorflow': 'deep learning',
}

DOMAIN_SKILLS = {
    'Software Engineer':       {'core': ['data structures','algorithms','oop','git/github','sql','rest api design','problem solving'], 'important': ['python','system design','os concepts','dbms','docker','networking basics']},
    'Web Developer (Frontend)':{'core': ['html5','css3','javascript','react.js','responsive design','git/github'],                    'important': ['typescript','redux','rest api','tailwind css','next.js']},
    'Web Developer (Backend)': {'core': ['python','rest api design','sql','git/github','authentication','oop'],                      'important': ['fastapi','mongodb','docker','system design','linux']},
    'Data Scientist':          {'core': ['python','statistics','pandas & numpy','data visualization','sql','machine learning'],       'important': ['feature engineering','scikit-learn','power bi','a/b testing']},
    'AI / ML Engineer':        {'core': ['python','machine learning','deep learning','mathematics','pandas & numpy','git/github'],    'important': ['neural networks','nlp','mlops','docker','rest api']},
    'Data Engineer':           {'core': ['python','sql','etl pipelines','apache spark','git/github'],                               'important': ['kafka','aws','docker','linux','schema design']},
    'Cloud / DevOps Engineer': {'core': ['linux','docker','kubernetes','aws','git/github','ci/cd'],                                  'important': ['terraform','networking','python scripting','monitoring']},
    'Cybersecurity Analyst':   {'core': ['networking','linux','python','security fundamentals','owasp top 10'],                      'important': ['penetration testing','incident response','cloud security','cryptography']},
    'Android Developer':       {'core': ['kotlin','java','android sdk','jetpack compose','git/github'],                              'important': ['mvvm','room db','retrofit','firebase']},
    'iOS Developer':           {'core': ['swift','uikit','swiftui','xcode','git/github'],                                            'important': ['mvvm','core data','combine','firebase']},
    'Product Manager':         {'core': ['product thinking','user research','roadmap planning','communication','a/b testing'],        'important': ['figma','agile','market analysis','sql']},
    'UI/UX Designer':          {'core': ['figma','user research','wireframing','design systems','usability testing'],                 'important': ['adobe xd','interaction design','html/css basics','accessibility']},
}

def normalize(skill: str) -> str:
    s = skill.lower().strip()
    return SKILL_ALIASES.get(s, s)

def skill_matches(user_skill: str, required_skill: str) -> bool:
    # Split "Python or Java or C++" into options
    options = [
        o.split('(')[0].split('/')[0].strip().lower()
        for o in required_skill.split(' or ')
    ]
    norm_user = normalize(user_skill)
    for opt in options:
        norm_opt = normalize(opt)
        if norm_user == norm_opt:
            return True
        if norm_user in norm_opt or norm_opt in norm_user:
            return True
        # word-level partial match
        user_words = [w for w in norm_user.split() if len(w) > 2]
        opt_words  = [w for w in norm_opt.split()  if len(w) > 2]
        if any(w in norm_opt  for w in user_words):
            return True
        if any(w in norm_user for w in opt_words):
            return True
    return False

@router.get('/analyze')
def analyze_skill_gap(
    career_domain: str,
    current_user : User    = Depends(get_current_user),
    db           : Session = Depends(get_db)
):
    # 1. Get profile skills
    profile = db.query(UserProfile).filter(
        UserProfile.user_id == current_user.id
    ).first()
    profile_skills = list((profile.skills or {}).keys()) if profile else []

    # 2. Get resume skills (latest resume)
    resume = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).order_by(Resume.uploaded_at.desc()).first()
    resume_skills = resume.extracted_skills or [] if resume else []

    # 3. Merge all user skills (no duplicates)
    all_user_skills = list({s.lower().strip() for s in profile_skills + resume_skills})

    # 4. Get domain requirements
    domain_data = DOMAIN_SKILLS.get(career_domain, DOMAIN_SKILLS['Software Engineer'])
    core_skills      = domain_data['core']
    important_skills = domain_data['important']
    all_required     = core_skills + important_skills

    # 5. Find matches and gaps
    matched  = [r for r in all_required if any(skill_matches(u, r) for u in all_user_skills)]
    missing  = [r for r in all_required if not any(skill_matches(u, r) for u in all_user_skills)]
    core_missing     = [r for r in core_skills      if r in missing]
    important_missing= [r for r in important_skills if r in missing]

    match_pct = round(len(matched) / max(len(all_required), 1) * 100, 1)
    gap_pct   = round(100 - match_pct, 1)

    return {
        'career_domain'      : career_domain,
        'match_percentage'   : match_pct,
        'gap_percentage'     : gap_pct,
        'total_required'     : len(all_required),
        'matched_skills'     : matched,
        'missing_skills'     : missing,
        'core_missing'       : core_missing,
        'important_missing'  : important_missing,
        'profile_skills_used': profile_skills,
        'resume_skills_used' : resume_skills,
        'skill_source'       : 'profile + resume' if resume_skills else 'profile only',
    }