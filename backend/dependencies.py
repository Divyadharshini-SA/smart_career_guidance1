from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from jose import JWTError, jwt
from datetime import datetime, timedelta
from database import get_db
from models import User
import os

# ── Config ────────────────────────────────────────────────────
SECRET_KEY  = os.environ.get('JWT_SECRET_KEY', 'smart-career-jwt-secret-key-minimum-32-chars-2024')
ALGORITHM   = 'HS256'
EXPIRE_HOURS = 24

bearer_scheme = HTTPBearer()

# ── Create Token ──────────────────────────────────────────────
def create_access_token(user_id: int) -> str:
    payload = {
        'sub': str(user_id),
        'exp': datetime.utcnow() + timedelta(hours=EXPIRE_HOURS)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

# ── Decode Token ──────────────────────────────────────────────
def decode_token(token: str) -> int:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload['sub'])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Invalid or expired token'
        )

# ── Get Current User ─────────────────────────────────────────
def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db)
) -> User:
    user_id = decode_token(credentials.credentials)
    user    = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail='User not found')
    return user

# ── Admin Only ────────────────────────────────────────────────
def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != 'admin':
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Admin access required. Students cannot access this.'
        )
    return current_user
