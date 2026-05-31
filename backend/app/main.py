from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.models import user, course, progress
from app.api import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AzLearn API",
    description="Azerbaijani Programming Learning Platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "AzLearn API işləyir! 🚀"}

@app.get("/health")
def health():
    return {"status": "ok"}