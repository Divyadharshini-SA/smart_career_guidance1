from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from database import get_db
from models import User, UserProfile, Progress
from schemas import RegisterSchema, LoginSchema
from dependencies import create_access_token, get_current_user

router   = APIRouter()
pwd_ctx  = CryptContext(schemes=['bcrypt'], deprecated='auto')

# ── Register ──────────────────────────────────────────────────
@router.post('/register', status_code=201)
def register(data: RegisterSchema, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=409, detail='Email already registered')

    hashed = pwd_ctx.hash(data.password)
    user   = User(
        name          = data.name,
        email         = data.email,
        password_hash = hashed,
        college       = data.college,
        branch        = data.branch,
        year          = data.year
    )
    db.add(user)
    db.flush()   # get user.id before commit

    db.add(UserProfile(user_id=user.id, interests=[], skills={}))
    db.add(Progress(user_id=user.id))
    db.commit()

    token = create_access_token(user.id)
    return {'message': 'Registration successful', 'token': token, 'user_id': user.id}


# ── Login ─────────────────────────────────────────────────────
@router.post('/login')
def login(data: LoginSchema, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not pwd_ctx.verify(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail='Invalid credentials')

    token = create_access_token(user.id)
    return {
        'token'  : token,
        'user_id': user.id,
        'name'   : user.name,
        'role'   : user.role
    }


# ── Me ────────────────────────────────────────────────────────
@router.get('/me')
def me(current_user: User = Depends(get_current_user)):
    return {
        'id'   : current_user.id,
        'name' : current_user.name,
        'email': current_user.email,
        'role' : current_user.role
    }
