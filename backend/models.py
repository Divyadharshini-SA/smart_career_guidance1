from sqlalchemy import Column, Integer, String, Float, Text, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = 'users'
    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String(100), nullable=False)
    email         = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    college       = Column(String(150))
    branch        = Column(String(100))
    year          = Column(Integer)
    role          = Column(String(20), default='student')
    created_at    = Column(DateTime, default=datetime.utcnow)

    profile     = relationship('UserProfile', back_populates='user', uselist=False)
    assessments = relationship('Assessment',  back_populates='user')
    resumes     = relationship('Resume',      back_populates='user')
    progress    = relationship('Progress',    back_populates='user', uselist=False)


class UserProfile(Base):
    __tablename__ = 'user_profiles'
    id          = Column(Integer, primary_key=True)
    user_id     = Column(Integer, ForeignKey('users.id'), nullable=False)
    interests   = Column(JSON)
    skills      = Column(JSON)
    personality = Column(String(50))
    career_goal = Column(String(200))
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship('User', back_populates='profile')


class Assessment(Base):
    __tablename__ = 'assessments'
    id          = Column(Integer, primary_key=True)
    user_id     = Column(Integer, ForeignKey('users.id'), nullable=False)
    type        = Column(String(50))
    scores      = Column(JSON)
    total_score = Column(Float)
    max_score   = Column(Float)
    percentage  = Column(Float)
    taken_at    = Column(DateTime, default=datetime.utcnow)

    user = relationship('User', back_populates='assessments')


class Resume(Base):
    __tablename__ = 'resumes'
    id               = Column(Integer, primary_key=True)
    user_id          = Column(Integer, ForeignKey('users.id'), nullable=False)
    filename         = Column(String(255))
    extracted_text   = Column(Text)
    extracted_skills = Column(JSON)
    resume_score     = Column(Float)
    uploaded_at      = Column(DateTime, default=datetime.utcnow)

    user = relationship('User', back_populates='resumes')


class CareerRecommendation(Base):
    __tablename__        = 'career_recommendations'
    id                   = Column(Integer, primary_key=True)
    user_id              = Column(Integer, ForeignKey('users.id'), nullable=False)
    top_careers          = Column(JSON)
    skill_match_score    = Column(Float)
    aptitude_score       = Column(Float)
    interest_match_score = Column(Float)
    confidence_score     = Column(Float)
    generated_at         = Column(DateTime, default=datetime.utcnow)


class SkillGap(Base):
    __tablename__   = 'skill_gaps'
    id              = Column(Integer, primary_key=True)
    user_id         = Column(Integer, ForeignKey('users.id'), nullable=False)
    career_domain   = Column(String(100))
    required_skills = Column(JSON)
    current_skills  = Column(JSON)
    missing_skills  = Column(JSON)
    gap_percentage  = Column(Float)
    analyzed_at     = Column(DateTime, default=datetime.utcnow)


class Roadmap(Base):
    __tablename__ = 'roadmaps'
    id            = Column(Integer, primary_key=True)
    user_id       = Column(Integer, ForeignKey('users.id'), nullable=False)
    career_domain = Column(String(100))
    steps         = Column(JSON)
    timeline      = Column(JSON)
    generated_at  = Column(DateTime, default=datetime.utcnow)


class Progress(Base):
    __tablename__           = 'progress'
    id                      = Column(Integer, primary_key=True)
    user_id                 = Column(Integer, ForeignKey('users.id'), nullable=False, unique=True)
    skill_score             = Column(Float, default=0)
    aptitude_score          = Column(Float, default=0)
    resume_score            = Column(Float, default=0)
    roadmap_completion      = Column(Float, default=0)
    placement_readiness     = Column(Float, default=0)
    completed_roadmap_steps = Column(JSON, default=list)
    updated_at              = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship('User', back_populates='progress')


class Question(Base):
    __tablename__ = 'questions'
    id         = Column(Integer, primary_key=True)
    test_type  = Column(String(50),  nullable=False)
    topic      = Column(String(100), nullable=False)
    level      = Column(String(20),  nullable=False)
    question   = Column(Text,        nullable=False)
    option_a   = Column(String(255), nullable=False)
    option_b   = Column(String(255), nullable=False)
    option_c   = Column(String(255), nullable=False)
    option_d   = Column(String(255), nullable=False)
    answer     = Column(String(255), nullable=False)
    source     = Column(String(100), default='manual')
    created_at = Column(DateTime,    default=datetime.utcnow)
