from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from pydantic import BaseModel
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.course import Lesson
from app.models.progress import UserProgress
from app.schemas.user import UserResponse

router = APIRouter(prefix="/progress", tags=["progress"])


class LessonCompleteResponse(BaseModel):
    message: str
    xp_earned: int
    total_xp: int
    level: int
    streak_days: int


class MyProgressResponse(BaseModel):
    completed_lessons: int
    total_xp: int
    level: int
    streak_days: int


class LessonProgressResponse(BaseModel):
    lesson_id: int
    is_completed: bool
    quiz_passed: bool
    xp_earned: int
    completed_at: datetime | None

    class Config:
        from_attributes = True


@router.post("/lesson/{lesson_id}/complete", response_model=LessonCompleteResponse)
def complete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Dərs tapılmadı")

    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.lesson_id == lesson_id,
    ).first()

    if progress and progress.is_completed:
        return LessonCompleteResponse(
            message="Bu dərs artıq tamamlanıb",
            xp_earned=0,
            total_xp=current_user.xp_points,
            level=current_user.level,
            streak_days=current_user.streak_days,
        )

    if not progress:
        progress = UserProgress(user_id=current_user.id, lesson_id=lesson_id)
        db.add(progress)

    progress.is_completed = True
    progress.xp_earned = lesson.xp_reward
    progress.completed_at = datetime.utcnow()

    current_user.xp_points += lesson.xp_reward
    current_user.level = current_user.xp_points // 500 + 1
    current_user.streak_days += 1

    db.commit()

    return LessonCompleteResponse(
        message="Dərs tamamlandı! Təbriklər! 🎉",
        xp_earned=lesson.xp_reward,
        total_xp=current_user.xp_points,
        level=current_user.level,
        streak_days=current_user.streak_days,
    )


@router.get("/me", response_model=MyProgressResponse)
def get_my_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    completed_count = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.is_completed == True,
    ).count()

    return MyProgressResponse(
        completed_lessons=completed_count,
        total_xp=current_user.xp_points,
        level=current_user.level,
        streak_days=current_user.streak_days,
    )


@router.get("/me/lessons", response_model=List[LessonProgressResponse])
def get_my_lesson_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    records = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id
    ).all()
    return records


@router.get("/leaderboard", response_model=List[UserResponse])
def get_leaderboard(db: Session = Depends(get_db)):
    return (
        db.query(User)
        .filter(User.is_active == True)
        .order_by(User.xp_points.desc())
        .limit(10)
        .all()
    )
