from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False, unique=True)
    title = Column(String, nullable=False)
    pass_score = Column(Integer, default=70)   # keçmək üçün tələb olunan faiz
    xp_bonus = Column(Integer, default=20)     # quiz keçildi ödülü
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    lesson = relationship("Lesson")
    questions = relationship("Question", back_populates="quiz", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    question_text = Column(String, nullable=False)
    option_a = Column(String, nullable=False)
    option_b = Column(String, nullable=False)
    option_c = Column(String, nullable=False)
    option_d = Column(String, nullable=False)
    correct_answer = Column(String(1), nullable=False)  # "a" | "b" | "c" | "d"

    quiz = relationship("Quiz", back_populates="questions")
