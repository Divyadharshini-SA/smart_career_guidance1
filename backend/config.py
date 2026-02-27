import os
from datetime import timedelta

class Config:
    # Flask
    SECRET_KEY = os.environ.get('SECRET_KEY', 'smart-career-secret-key-2024')
    DEBUG = True

    # Database - MySQL
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        'mysql+pymysql://root:root@localhost/smart_career_db'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'smart-career-jwt-secret-key-minimum-32-chars-2024')
    # JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-super-long-key-2024-smart-career')
    # JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-2024')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)

    # File Uploads
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

    # Ensure upload folder exists
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)