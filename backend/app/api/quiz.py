from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.quiz import Quiz, Question
from app.models.progress import QuizAttempt, UserProgress
from app.schemas.quiz import (
    QuizCreate, QuizResponse,
    QuestionCreate, QuestionResponse,
    QuizSubmit, QuizResult,
)

router = APIRouter(prefix="/quizzes", tags=["quizzes"])


@router.post("", response_model=QuizResponse, status_code=201)
def create_quiz(
    quiz_data: QuizCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    if db.query(Quiz).filter(Quiz.lesson_id == quiz_data.lesson_id).first():
        raise HTTPException(status_code=400, detail="Bu dərs üçün quiz artıq mövcuddur")
    quiz = Quiz(**quiz_data.model_dump())
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz


@router.get("/lesson/{lesson_id}", response_model=QuizResponse)
def get_quiz_by_lesson(
    lesson_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    quiz = db.query(Quiz).filter(Quiz.lesson_id == lesson_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Bu dərs üçün quiz tapılmadı")
    return quiz


@router.post("/{quiz_id}/questions", response_model=QuestionResponse, status_code=201)
def add_question(
    quiz_id: int,
    question_data: QuestionCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    if not db.query(Quiz).filter(Quiz.id == quiz_id).first():
        raise HTTPException(status_code=404, detail="Quiz tapılmadı")
    question = Question(quiz_id=quiz_id, **question_data.model_dump())
    db.add(question)
    db.commit()
    db.refresh(question)
    return question


@router.delete("/{quiz_id}/questions/{question_id}")
def delete_question(
    quiz_id: int,
    question_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    question = db.query(Question).filter(
        Question.id == question_id, Question.quiz_id == quiz_id
    ).first()
    if not question:
        raise HTTPException(status_code=404, detail="Sual tapılmadı")
    db.delete(question)
    db.commit()
    return {"message": "Sual silindi"}


@router.post("/{quiz_id}/submit", response_model=QuizResult)
def submit_quiz(
    quiz_id: int,
    submission: QuizSubmit,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz tapılmadı")
    if not quiz.questions:
        raise HTTPException(status_code=400, detail="Quizin sualları yoxdur")

    question_map = {q.id: q for q in quiz.questions}
    correct_count = sum(
        1
        for ans in submission.answers
        if (q := question_map.get(ans.question_id))
        and q.correct_answer == ans.selected_answer
    )

    total = len(quiz.questions)
    score = round(correct_count / total * 100) if total else 0
    passed = score >= quiz.pass_score
    xp_earned = quiz.xp_bonus if passed else 0

    attempt = QuizAttempt(
        user_id=current_user.id,
        lesson_id=quiz.lesson_id,
        score=score,
        passed=passed,
    )
    db.add(attempt)

    if passed:
        # UserProgress-ı quiz_passed kimi işarələ
        progress = db.query(UserProgress).filter(
            UserProgress.user_id == current_user.id,
            UserProgress.lesson_id == quiz.lesson_id,
        ).first()
        if progress:
            progress.quiz_passed = True

        current_user.xp_points += xp_earned
        current_user.level = current_user.xp_points // 500 + 1

    db.commit()

    return QuizResult(
        quiz_id=quiz_id,
        score=score,
        passed=passed,
        xp_earned=xp_earned,
        correct_count=correct_count,
        total_questions=total,
    )
