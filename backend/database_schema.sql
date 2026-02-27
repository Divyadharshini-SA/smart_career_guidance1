-- =============================================================
--  SMART AI CAREER GUIDANCE AND PLACEMENT READINESS SYSTEM
--  Database Schema — MySQL
-- =============================================================

CREATE DATABASE IF NOT EXISTS smart_career_db;
USE smart_career_db;

-- ---------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    college       VARCHAR(150),
    branch        VARCHAR(100),
    year          INT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------
-- User Profiles
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL,
    interests    JSON,
    skills       JSON,
    personality  VARCHAR(50),
    career_goal  VARCHAR(200),
    updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------
-- Assessments
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS assessments (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    type        VARCHAR(50),
    scores      JSON,
    total_score FLOAT,
    max_score   FLOAT,
    percentage  FLOAT,
    taken_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------
-- Resumes
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resumes (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    filename         VARCHAR(255),
    extracted_text   LONGTEXT,
    extracted_skills JSON,
    resume_score     FLOAT,
    uploaded_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------
-- Career Recommendations
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS career_recommendations (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    user_id              INT NOT NULL,
    top_careers          JSON,
    skill_match_score    FLOAT,
    aptitude_score       FLOAT,
    interest_match_score FLOAT,
    confidence_score     FLOAT,
    generated_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------
-- Skill Gaps
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skill_gaps (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT NOT NULL,
    career_domain   VARCHAR(100),
    required_skills JSON,
    current_skills  JSON,
    missing_skills  JSON,
    gap_percentage  FLOAT,
    analyzed_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------
-- Roadmaps
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roadmaps (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NOT NULL,
    career_domain VARCHAR(100),
    steps         JSON,
    timeline      JSON,
    generated_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------
-- Progress Tracking
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS progress (
    id                      INT AUTO_INCREMENT PRIMARY KEY,
    user_id                 INT NOT NULL UNIQUE,
    skill_score             FLOAT DEFAULT 0,
    aptitude_score          FLOAT DEFAULT 0,
    resume_score            FLOAT DEFAULT 0,
    roadmap_completion      FLOAT DEFAULT 0,
    placement_readiness     FLOAT DEFAULT 0,
    completed_roadmap_steps JSON,
    updated_at              DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);