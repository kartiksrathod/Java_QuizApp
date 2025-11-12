"""
AI-powered routes for quiz application
Handles question generation, difficulty analysis, and document parsing
"""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from pydantic import BaseModel, Field
from typing import List, Optional
import sys
sys.path.append('..')

from auth import get_current_admin_user
from services.ai_service import ai_service
from database import questions_collection
import uuid

router = APIRouter(prefix="/ai", tags=["AI Features"])


# Pydantic Models
class QuestionGenerationRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=200, description="Topic for question generation")
    count: int = Field(5, ge=1, le=20, description="Number of questions to generate")
    difficulty: str = Field("medium", pattern="^(easy|medium|hard)$")
    category: Optional[str] = Field(None, max_length=100)


class DifficultyAnalysisRequest(BaseModel):
    question: str = Field(..., min_length=10)
    options: List[str] = Field(..., min_items=2, max_items=6)


class DocumentParseRequest(BaseModel):
    document_text: str = Field(..., min_length=50, max_length=50000)
    max_questions: int = Field(50, ge=1, le=100)


class QuestionResponse(BaseModel):
    question: str
    options: List[str]
    answer: str
    explanation: str
    category: str
    difficulty: str
    generatedByAI: bool = True
    sourceType: str
    aiProvider: Optional[str] = None
    aiModel: Optional[str] = None


class DifficultyAnalysisResponse(BaseModel):
    difficulty: str
    confidence: float
    reasoning: str
    bloomsLevel: str


# Routes
@router.post("/generate-questions", response_model=List[QuestionResponse])
async def generate_questions(
    request: QuestionGenerationRequest,
    current_user = Depends(get_current_admin_user)
):
    """
    Generate quiz questions using AI
    
    - **topic**: Subject matter for questions
    - **count**: Number of questions (1-20)
    - **difficulty**: easy, medium, or hard
    - **category**: Optional category label
    
    Returns list of generated questions with full metadata
    """
    try:
        questions = await ai_service.generate_questions(
            topic=request.topic,
            count=request.count,
            difficulty=request.difficulty,
            category=request.category
        )
        
        return questions
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {str(e)}")
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.post("/generate-and-save", response_model=dict)
async def generate_and_save_questions(
    request: QuestionGenerationRequest,
    current_user = Depends(get_current_admin_user)
):
    """
    Generate questions using AI and save them to database
    
    Same parameters as /generate-questions but saves to DB automatically
    
    Returns: {
        "success": true,
        "saved_count": number,
        "questions": [...generated questions]
    }
    """
    try:
        # Generate questions
        questions = await ai_service.generate_questions(
            topic=request.topic,
            count=request.count,
            difficulty=request.difficulty,
            category=request.category
        )
        
        # Save to database
        saved_count = 0
        for question_data in questions:
            question_dict = {
                "id": str(uuid.uuid4()),
                "question": question_data["question"],
                "options": question_data["options"],
                "answer": question_data["answer"],
                "explanation": question_data.get("explanation", ""),
                "category": question_data["category"],
                "difficulty": question_data["difficulty"],
                "created_by": current_user["username"],
                "generatedByAI": True,
                "sourceType": question_data.get("sourceType", "ai_generated"),
                "aiMetadata": {
                    "provider": question_data.get("aiProvider"),
                    "model": question_data.get("aiModel"),
                    "topic": request.topic
                }
            }
            
            await questions_collection.insert_one(question_dict)
            saved_count += 1
        
        return {
            "success": True,
            "saved_count": saved_count,
            "questions": questions,
            "message": f"Successfully generated and saved {saved_count} questions"
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {str(e)}")
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.post("/analyze-difficulty", response_model=DifficultyAnalysisResponse)
async def analyze_difficulty(
    request: DifficultyAnalysisRequest,
    current_user = Depends(get_current_admin_user)
):
    """
    Analyze question difficulty using AI
    
    - **question**: Question text to analyze
    - **options**: List of answer options
    
    Returns difficulty level, confidence score, reasoning, and Bloom's taxonomy level
    """
    try:
        analysis = await ai_service.analyze_difficulty(
            question=request.question,
            options=request.options
        )
        
        return analysis
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {str(e)}")
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.post("/parse-document", response_model=List[QuestionResponse])
async def parse_document(
    request: DocumentParseRequest,
    current_user = Depends(get_current_admin_user)
):
    """
    Parse document text and extract quiz questions
    
    - **document_text**: Text content from document
    - **max_questions**: Maximum questions to extract (1-100)
    
    Returns list of extracted questions in standard format
    """
    try:
        questions = await ai_service.parse_document(
            document_text=request.document_text,
            max_questions=request.max_questions
        )
        
        return questions
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {str(e)}")
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.post("/parse-and-save", response_model=dict)
async def parse_document_and_save(
    request: DocumentParseRequest,
    current_user = Depends(get_current_admin_user)
):
    """
    Parse document and save extracted questions to database
    
    Same parameters as /parse-document but saves to DB automatically
    """
    try:
        # Parse document
        questions = await ai_service.parse_document(
            document_text=request.document_text,
            max_questions=request.max_questions
        )
        
        # Save to database
        saved_count = 0
        for question_data in questions:
            question_dict = {
                "id": str(uuid.uuid4()),
                "question": question_data["question"],
                "options": question_data["options"],
                "answer": question_data["answer"],
                "explanation": question_data.get("explanation", ""),
                "category": question_data["category"],
                "difficulty": question_data["difficulty"],
                "created_by": current_user["username"],
                "generatedByAI": True,
                "sourceType": question_data.get("sourceType", "ai_parsed"),
                "aiMetadata": {
                    "provider": question_data.get("aiProvider"),
                    "model": question_data.get("aiModel"),
                    "source": "document_upload"
                }
            }
            
            await questions_collection.insert_one(question_dict)
            saved_count += 1
        
        return {
            "success": True,
            "saved_count": saved_count,
            "questions": questions,
            "message": f"Successfully parsed and saved {saved_count} questions from document"
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid request: {str(e)}")
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.get("/health")
async def ai_health_check():
    """Check if AI service is configured correctly"""
    try:
        import os
        has_key = bool(os.environ.get('EMERGENT_LLM_KEY'))
        
        return {
            "status": "healthy" if has_key else "misconfigured",
            "api_key_configured": has_key,
            "provider": ai_service.provider,
            "model": ai_service.model
        }
    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }
