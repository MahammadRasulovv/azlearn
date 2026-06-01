from pydantic import BaseModel, field_validator
from typing import List
from datetime import datetime


class QuestionCreate(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str  # "a" | "b" | "c" | "d"

    @field_validator("correct_answer")
    @classmethod
    def validate_answer(cls, v: str) -> str:
        v = v.lower()
        if v not in {"a", "b", "c", "d"}:
            raise ValueError("correct_answer yalnız a, b, c və ya d ola bilər")
        return v


class QuestionResponse(BaseModel):
    id: int
    quiz_id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    # correct_answer cavabı təhlükəsizlik üçün buraya daxil edilmir

    class Config:
        from_attributes = True


class QuizCreate(BaseModel):
    lesson_id: int
    title: str
    pass_score: int = 70
    xp_bonus: int = 20


class QuizResponse(BaseModel):
    id: int
    lesson_id: int
    title: str
    pass_score: int
    xp_bonus: int
    created_at: datetime
    questions: List[QuestionResponse] = []

    class Config:
        from_attributes = True


class AnswerSubmit(BaseModel):
    question_id: int
    selected_answer: str

    @field_validator("selected_answer")
    @classmethod
    def validate_answer(cls, v: str) -> str:
        v = v.lower()
        if v not in {"a", "b", "c", "d"}:
            raise ValueError("selected_answer yalnız a, b, c və ya d ola bilər")
        return v


class QuizSubmit(BaseModel):
    answers: List[AnswerSubmit]


class QuizResult(BaseModel):
    quiz_id: int
    score: int        # faiz (0–100)
    passed: bool
    xp_earned: int
    correct_count: int
    total_questions: int
