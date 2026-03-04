from dotenv import load_dotenv
load_dotenv()   # ← MUST be first — loads .env before any other import reads os.getenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base

# Import all models so tables get created
import models  # noqa: F401

# Import routers
from routes.auth       import router as auth_router
from routes.profile    import router as profile_router
from routes.assessment import router as assessment_router
from routes.resume     import router as resume_router
from routes.career     import router as career_router
from routes.roadmap    import router as roadmap_router
from routes.placement  import router as placement_router
from routes.chatbot    import router as chatbot_router
from routes.progress   import router as progress_router
from routes.skill_gap  import router as skill_gap_router
# ── Create FastAPI app ────────────────────────────────────────
app = FastAPI(
    title       = "Smart Career Guidance API",
    description = "AI-powered Career Guidance and Placement Readiness System",
    version     = "2.0.0",
    docs_url    = "/docs",    # Swagger UI  → http://localhost:5000/docs
    redoc_url   = "/redoc",   # ReDoc UI    → http://localhost:5000/redoc
)

# ── CORS ──────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# ── Create DB tables on startup ───────────────────────────────
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")
    print("📚 Swagger UI → http://localhost:5000/docs")
    print("📖 ReDoc UI   → http://localhost:5000/redoc")

# ── Register all routers ──────────────────────────────────────
app.include_router(auth_router,       prefix="/api/auth",       tags=["Auth"])
app.include_router(profile_router,    prefix="/api/profile",    tags=["Profile"])
app.include_router(assessment_router, prefix="/api/assessment", tags=["Assessment"])
app.include_router(resume_router,     prefix="/api/resume",     tags=["Resume"])
app.include_router(career_router,     prefix="/api/career",     tags=["Career"])
app.include_router(roadmap_router,    prefix="/api/roadmap",    tags=["Roadmap"])
app.include_router(placement_router,  prefix="/api/placement",  tags=["Placement"])
app.include_router(chatbot_router,    prefix="/api/chatbot",    tags=["Chatbot"])
app.include_router(progress_router,   prefix="/api/progress",   tags=["Progress"])
# app.include_router(skill_gap_router,  prefix='/skill-gap',      tags=['Skill Gap'])
# Change this line in main.py:
app.include_router(skill_gap_router,  prefix='/api/skill-gap', tags=['Skill Gap'])

# ── Health check ──────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {
        "status" : "running",
        "app"    : "Smart Career Guidance API",
        "version": "2.0.0",
        "docs"   : "http://localhost:5000/docs"
    }

# ── Run ───────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)

# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from database import engine, Base

# import models  # noqa: F401

# from routes.auth       import router as auth_router
# from routes.profile    import router as profile_router
# from routes.assessment import router as assessment_router
# from routes.resume     import router as resume_router
# from routes.career     import router as career_router
# from routes.roadmap    import router as roadmap_router
# from routes.placement  import router as placement_router
# from routes.chatbot    import router as chatbot_router
# from routes.progress   import router as progress_router
# from routes.admin      import router as admin_router   # NEW

# app = FastAPI(
#     title       = "Smart Career Guidance API",
#     description = "AI-powered Career Guidance and Placement Readiness System",
#     version     = "2.0.0",
#     docs_url    = "/docs",
#     redoc_url   = "/redoc",
# )

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins     = ["http://localhost:3000", "*"],
#     allow_credentials = True,
#     allow_methods     = ["*"],
#     allow_headers     = ["*"],
# )

# @app.on_event("startup")
# def startup():
#     Base.metadata.create_all(bind=engine)
#     print("✅ Database tables created")
#     print("📚 Swagger UI → http://localhost:5000/docs")
#     print("📖 ReDoc UI   → http://localhost:5000/redoc")

# app.include_router(auth_router,       prefix="/api/auth",       tags=["Auth"])
# app.include_router(profile_router,    prefix="/api/profile",    tags=["Profile"])
# app.include_router(assessment_router, prefix="/api/assessment", tags=["Assessment"])
# app.include_router(resume_router,     prefix="/api/resume",     tags=["Resume"])
# app.include_router(career_router,     prefix="/api/career",     tags=["Career"])
# app.include_router(roadmap_router,    prefix="/api/roadmap",    tags=["Roadmap"])
# app.include_router(placement_router,  prefix="/api/placement",  tags=["Placement"])
# app.include_router(chatbot_router,    prefix="/api/chatbot",    tags=["Chatbot"])
# app.include_router(progress_router,   prefix="/api/progress",   tags=["Progress"])
# app.include_router(admin_router,      prefix="/api/admin",      tags=["Admin"])  # NEW

# @app.get("/", tags=["Health"])
# def root():
#     return {
#         "status" : "running",
#         "app"    : "Smart Career Guidance API",
#         "version": "2.0.0",
#         "docs"   : "http://localhost:5000/docs"
#     }

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)


# # from fastapi import FastAPI
# # from fastapi.middleware.cors import CORSMiddleware
# # from database import engine, Base

# # # Import all models so tables get created
# # import models  # noqa: F401

# # # Import routers
# # from routes.auth       import router as auth_router
# # from routes.profile    import router as profile_router
# # from routes.assessment import router as assessment_router
# # from routes.resume     import router as resume_router
# # from routes.career     import router as career_router
# # from routes.roadmap    import router as roadmap_router
# # from routes.placement  import router as placement_router
# # from routes.chatbot    import router as chatbot_router
# # from routes.progress   import router as progress_router

# # # ── Create FastAPI app ────────────────────────────────────────
# # app = FastAPI(
# #     title       = "Smart Career Guidance API",
# #     description = "AI-powered Career Guidance and Placement Readiness System",
# #     version     = "2.0.0",
# #     docs_url    = "/docs",    # Swagger UI  → http://localhost:5000/docs
# #     redoc_url   = "/redoc",   # ReDoc UI    → http://localhost:5000/redoc
# # )

# # # ── CORS ──────────────────────────────────────────────────────
# # app.add_middleware(
# #     CORSMiddleware,
# #     allow_origins     = ["http://localhost:3000", "*"],
# #     allow_credentials = True,
# #     allow_methods     = ["*"],
# #     allow_headers     = ["*"],
# # )

# # # ── Create DB tables on startup ───────────────────────────────
# # @app.on_event("startup")
# # def startup():
# #     Base.metadata.create_all(bind=engine)
# #     print("✅ Database tables created")
# #     print("📚 Swagger UI → http://localhost:5000/docs")
# #     print("📖 ReDoc UI   → http://localhost:5000/redoc")

# # # ── Register all routers ──────────────────────────────────────
# # app.include_router(auth_router,       prefix="/api/auth",       tags=["Auth"])
# # app.include_router(profile_router,    prefix="/api/profile",    tags=["Profile"])
# # app.include_router(assessment_router, prefix="/api/assessment", tags=["Assessment"])
# # app.include_router(resume_router,     prefix="/api/resume",     tags=["Resume"])
# # app.include_router(career_router,     prefix="/api/career",     tags=["Career"])
# # app.include_router(roadmap_router,    prefix="/api/roadmap",    tags=["Roadmap"])
# # app.include_router(placement_router,  prefix="/api/placement",  tags=["Placement"])
# # app.include_router(chatbot_router,    prefix="/api/chatbot",    tags=["Chatbot"])
# # app.include_router(progress_router,   prefix="/api/progress",   tags=["Progress"])

# # # ── Health check ──────────────────────────────────────────────
# # @app.get("/", tags=["Health"])
# # def root():
# #     return {
# #         "status" : "running",
# #         "app"    : "Smart Career Guidance API",
# #         "version": "2.0.0",
# #         "docs"   : "http://localhost:5000/docs"
# #     }

# # # ── Run ───────────────────────────────────────────────────────
# # if __name__ == "__main__":
# #     import uvicorn
# #     uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)
