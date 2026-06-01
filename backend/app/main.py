from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.models import user, course, progress
from app.models import quiz as quiz_models
from app.api import auth
from app.api.courses import course_router, lesson_router
from app.api import quiz, progress as progress_api

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AzLearn API",
    description="Azərbaycanlılar üçün proqramlaşdırma öyrənmə platforması",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(course_router)
app.include_router(lesson_router)
app.include_router(quiz.router)
app.include_router(progress_api.router)


@app.get("/")
def root():
    return {"message": "AzLearn API işləyir! 🚀"}


@app.get("/health")
def health():
    return {"status": "ok"}
