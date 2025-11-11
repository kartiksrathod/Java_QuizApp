from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
import uuid

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    role: str = 'user'  # 'admin' or 'user'

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: datetime

class UserInDB(UserBase):
    id: str
    hashed_password: str
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    username: str

class TokenData(BaseModel):
    email: Optional[str] = None

class QuestionBase(BaseModel):
    question: str
    options: List[str]
    answer: str
    category: str
    difficulty: str = 'medium'  # easy, medium, hard
    explanation: Optional[str] = None

class QuestionCreate(QuestionBase):
    pass

class QuestionUpdate(BaseModel):
    question: Optional[str] = None
    options: Optional[List[str]] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    difficulty: Optional[str] = None
    explanation: Optional[str] = None

class QuestionResponse(QuestionBase):
    id: str
    created_by: str
    created_at: datetime

class QuestionInDB(QuestionBase):
    id: str
    created_by: str
    created_at: datetime

class BulkUploadResponse(BaseModel):
    success: int
    failed: int
    total: int
    errors: List[str] = []

class BookmarkCreate(BaseModel):
    question_id: str

class BookmarkResponse(BaseModel):
    id: str
    user_id: str
    question_id: str
    question: QuestionResponse
    created_at: datetime