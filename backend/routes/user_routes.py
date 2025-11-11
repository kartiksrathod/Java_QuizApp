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

@router.post("/bookmarks/add", status_code=status.HTTP_201_CREATED)
async def add_bookmark(
    bookmark_data: BookmarkCreate,
    current_user: UserInDB = Depends(get_current_user)
):
    """Add a question to user's bookmarks"""
    # Check if question exists
    question = questions_collection.find_one({'id': bookmark_data.question_id})
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    # Check if already bookmarked
    existing = bookmarks_collection.find_one({
        'user_id': current_user.id,
        'question_id': bookmark_data.question_id
    })
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question already bookmarked"
        )
    
    # Create bookmark
    bookmark = {
        'id': str(uuid.uuid4()),
        'user_id': current_user.id,
        'question_id': bookmark_data.question_id,
        'created_at': datetime.utcnow()
    }
    
    bookmarks_collection.insert_one(bookmark)
    return {"message": "Bookmark added successfully", "bookmark_id": bookmark['id']}

@router.delete("/bookmarks/remove/{question_id}", status_code=status.HTTP_200_OK)
async def remove_bookmark(
    question_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """Remove a question from user's bookmarks"""
    result = bookmarks_collection.delete_one({
        'user_id': current_user.id,
        'question_id': question_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark not found"
        )
    
    return {"message": "Bookmark removed successfully"}

@router.get("/bookmarks", response_model=List[BookmarkResponse])
async def get_bookmarks(
    current_user: UserInDB = Depends(get_current_user)
):
    """Get all bookmarked questions for the current user"""
    bookmarks = list(bookmarks_collection.find({'user_id': current_user.id}))
    
    # Fetch question details for each bookmark
    result = []
    for bookmark in bookmarks:
        question = questions_collection.find_one({'id': bookmark['question_id']})
        if question:
            result.append({
                'id': bookmark['id'],
                'user_id': bookmark['user_id'],
                'question_id': bookmark['question_id'],
                'question': QuestionResponse(**question),
                'created_at': bookmark['created_at']
            })
    
    return result

@router.get("/bookmarks/check/{question_id}", response_model=dict)
async def check_bookmark_status(
    question_id: str,
    current_user: UserInDB = Depends(get_current_user)
):
    """Check if a question is bookmarked by the current user"""
    bookmark = bookmarks_collection.find_one({
        'user_id': current_user.id,
        'question_id': question_id
    })
    
    return {"is_bookmarked": bookmark is not None}