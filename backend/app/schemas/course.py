from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class LessonCreate(BaseModel):
    title: str
    description: Optional[str] = None
    youtube_url: str
    notes: Optional[str] = None
    order_index: int
    xp_reward: int = 50

class LessonResponse(BaseModel):
    id: int
    course_id: int
    title: str
    description: Optional[str]
    youtube_url: str
    notes: Optional[str]
    order_index: int
    xp_reward: int
    created_at: datetime

    class Config:
        from_attributes = True

class CourseCreate(BaseModel):
    title: str
    description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    category: Optional[str] = None
    difficulty: str = "beginner"

class CourseResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    thumbnail_url: Optional[str]
    category: Optional[str]
    difficulty: str
    is_published: bool
    created_at: datetime
    lessons: List[LessonResponse] = []

    class Config:
        from_attributes = True