from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, List, Any

# ── Auth ──────────────────────────────────────────────────────
class RegisterSchema(BaseModel):
    name    : str
    email   : EmailStr
    password: str
    college : Optional[str] = None
    branch  : Optional[str] = None
    year    : Optional[int] = None
    cgpa    : Optional[float] = None

class LoginSchema(BaseModel):
    email   : EmailStr
    password: str

# ── Profile ───────────────────────────────────────────────────
class ProfileUpdateSchema(BaseModel):
    interests  : Optional[List[str]]       = None
    skills     : Optional[Dict[str, Any]]  = None
    personality: Optional[str]             = None
    career_goal: Optional[str]             = None
    # Big Five personality scores (IEEE paper core inputs)
    personality_openness         : Optional[float] = None   # 0–10
    personality_conscientiousness: Optional[float] = None
    personality_extraversion     : Optional[float] = None
    personality_agreeableness    : Optional[float] = None
    personality_neuroticism      : Optional[float] = None

# ── Assessment ────────────────────────────────────────────────
class SubmitSchema(BaseModel):
    type      : str
    answers   : Dict[str, str]
    test_index: Optional[int]  = None
    topic     : Optional[str]  = None

class AddQuestionSchema(BaseModel):
    test_type: str
    topic    : str
    level    : str
    question : str
    option_a : str
    option_b : str
    option_c : str
    option_d : str
    answer   : str
    source   : Optional[str] = 'manual'

# ── Career & Resume ───────────────────────────────────────────
class CareerSchema(BaseModel):
    career_domain: Optional[str] = 'Software Engineer'

class MatchJDSchema(BaseModel):
    job_description: str

# ── Roadmap ───────────────────────────────────────────────────
class RoadmapSchema(BaseModel):
    career_domain: Optional[str] = 'Software Engineer'

class CompleteStepSchema(BaseModel):
    step: str

# ── Chatbot ───────────────────────────────────────────────────
class ChatSchema(BaseModel):
    message: str

# ── Admin ─────────────────────────────────────────────────────
class CreateAdminSchema(BaseModel):
    name    : str
    email   : EmailStr
    password: str

# from pydantic import BaseModel, EmailStr
# from typing import Optional, Dict, List, Any

# # ── Auth ──────────────────────────────────────────────────────
# class RegisterSchema(BaseModel):
#     name    : str
#     email   : EmailStr
#     password: str
#     college : Optional[str] = None
#     branch  : Optional[str] = None
#     year    : Optional[int] = None

# class LoginSchema(BaseModel):
#     email   : EmailStr
#     password: str

# # ── Profile ───────────────────────────────────────────────────
# class ProfileUpdateSchema(BaseModel):
#     interests  : Optional[List[str]]       = None
#     skills     : Optional[Dict[str, Any]]  = None
#     personality: Optional[str]             = None
#     career_goal: Optional[str]             = None

# # ── Assessment ────────────────────────────────────────────────
# class SubmitSchema(BaseModel):
#     type      : str
#     answers   : Dict[str, str]   # {question_id: chosen_option}
#     test_index: Optional[int]    = None
#     topic     : Optional[str]    = None

# class AddQuestionSchema(BaseModel):
#     test_type: str
#     topic    : str
#     level    : str
#     question : str
#     option_a : str
#     option_b : str
#     option_c : str
#     option_d : str
#     answer   : str
#     source   : Optional[str] = 'manual'

# # ── Career ────────────────────────────────────────────────────
# class CareerSchema(BaseModel):
#     career_domain: Optional[str] = 'Software Engineer'

# # ── Roadmap ───────────────────────────────────────────────────
# class RoadmapSchema(BaseModel):
#     career_domain: Optional[str] = 'Software Engineer'

# class CompleteStepSchema(BaseModel):
#     step: str

# # ── Chatbot ───────────────────────────────────────────────────
# class ChatSchema(BaseModel):
#     message: str
