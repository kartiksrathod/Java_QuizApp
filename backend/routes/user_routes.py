from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from datetime import datetime
import uuid
import random

from auth import get_current_user
from models import QuestionResponse, UserInDB, BookmarkCreate, BookmarkResponse
from database import questions_collection, quizzes_collection, results_collection, bookmarks_collection

router = APIRouter(prefix="/user", tags=["User"])

@router.get("/questions", response_model=List[QuestionResponse])
async def get_questions_for_quiz(
    category: str = None,
    difficulty: str = None,
    limit: int = 10,
    current_user: UserInDB = Depends(get_current_user)
):
    """Get questions for quiz (without showing correct answers)"""
    query = {}
    if category:
        query['category'] = category
    if difficulty:
        query['difficulty'] = difficulty
    
    questions = list(questions_collection.find(query))
    
    # Shuffle and limit
    random.shuffle(questions)
    questions = questions[:limit]
    
    # Return questions (frontend should not display answers until submission)
    return [QuestionResponse(**q) for q in questions]

@router.get("/categories", response_model=List[str])
async def get_available_categories(
    current_user: UserInDB = Depends(get_current_user)
):
    """Get all available quiz categories"""
    categories = questions_collection.distinct('category')
    return categories