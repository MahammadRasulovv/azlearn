from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.course import Course, Lesson
from app.schemas.course import CourseCreate, CourseResponse, LessonCreate, LessonResponse

course_router = APIRouter(prefix="/courses", tags=["courses"])
lesson_router = APIRouter(prefix="/lessons", tags=["lessons"])


# ── Courses ──────────────────────────────────────────────────────────────────

@course_router.get("", response_model=List[CourseResponse])
def list_courses(db: Session = Depends(get_db)):
    return db.query(Course).filter(Course.is_published == True).all()


@course_router.get("/all", response_model=List[CourseResponse])
def list_all_courses(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return db.query(Course).all()


@course_router.post("", response_model=CourseResponse, status_code=201)
def create_course(
    course_data: CourseCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    course = Course(**course_data.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


@course_router.get("/{course_id}", response_model=CourseResponse)
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs tapılmadı")
    return course


@course_router.put("/{course_id}", response_model=CourseResponse)
def update_course(
    course_id: int,
    course_data: CourseCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs tapılmadı")
    for field, value in course_data.model_dump().items():
        setattr(course, field, value)
    db.commit()
    db.refresh(course)
    return course


@course_router.patch("/{course_id}/publish", response_model=CourseResponse)
def publish_course(
    course_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs tapılmadı")
    course.is_published = not course.is_published
    db.commit()
    db.refresh(course)
    return course


@course_router.delete("/{course_id}")
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Kurs tapılmadı")
    db.delete(course)
    db.commit()
    return {"message": "Kurs silindi"}


# ── Lessons (nested under courses) ───────────────────────────────────────────

@course_router.post("/{course_id}/lessons", response_model=LessonResponse, status_code=201)
def create_lesson(
    course_id: int,
    lesson_data: LessonCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    if not db.query(Course).filter(Course.id == course_id).first():
        raise HTTPException(status_code=404, detail="Kurs tapılmadı")
    lesson = Lesson(course_id=course_id, **lesson_data.model_dump())
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson


@course_router.get("/{course_id}/lessons", response_model=List[LessonResponse])
def list_lessons(course_id: int, db: Session = Depends(get_db)):
    if not db.query(Course).filter(Course.id == course_id).first():
        raise HTTPException(status_code=404, detail="Kurs tapılmadı")
    return (
        db.query(Lesson)
        .filter(Lesson.course_id == course_id)
        .order_by(Lesson.order_index)
        .all()
    )


# ── Lessons (standalone) ─────────────────────────────────────────────────────

@lesson_router.get("/{lesson_id}", response_model=LessonResponse)
def get_lesson(lesson_id: int, db: Session = Depends(get_db)):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Dərs tapılmadı")
    return lesson


@lesson_router.put("/{lesson_id}", response_model=LessonResponse)
def update_lesson(
    lesson_id: int,
    lesson_data: LessonCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Dərs tapılmadı")
    for field, value in lesson_data.model_dump().items():
        setattr(lesson, field, value)
    db.commit()
    db.refresh(lesson)
    return lesson


@lesson_router.delete("/{lesson_id}")
def delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Dərs tapılmadı")
    db.delete(lesson)
    db.commit()
    return {"message": "Dərs silindi"}
