from fastapi import APIRouter, HTTPException, status, Depends, UploadFile, File
from fastapi.responses import FileResponse
from typing import List
from datetime import datetime
import uuid
import json
import csv
import io
import os
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import pandas as pd

from auth import get_current_admin_user
from models import (
    QuestionCreate,
    QuestionResponse,
    QuestionUpdate,
    BulkUploadResponse,
    UserInDB
)
from database import questions_collection

router = APIRouter(prefix="/admin/questions", tags=["Admin - Questions"])

@router.post("/add", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
async def add_question(
    question: QuestionCreate,
    current_user: UserInDB = Depends(get_current_admin_user)
):
    """Add a single question manually"""
    question_dict = question.model_dump()
    question_dict['id'] = str(uuid.uuid4())
    question_dict['created_by'] = current_user.username
    question_dict['created_at'] = datetime.utcnow()
    
    questions_collection.insert_one(question_dict)
    
    return QuestionResponse(**question_dict)

@router.get("/get_all", response_model=List[QuestionResponse])
async def get_all_questions(
    category: str = None,
    difficulty: str = None,
    current_user: UserInDB = Depends(get_current_admin_user)
):
    """Get all questions with optional filters"""
    query = {}
    if category:
        query['category'] = category
    if difficulty:
        query['difficulty'] = difficulty
    
    questions = list(questions_collection.find(query))
    return [QuestionResponse(**q) for q in questions]

@router.put("/update/{question_id}", response_model=QuestionResponse)
async def update_question(
    question_id: str,
    question_update: QuestionUpdate,
    current_user: UserInDB = Depends(get_current_admin_user)
):
    """Update a question"""
    existing_question = questions_collection.find_one({"id": question_id})
    if not existing_question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    
    update_data = question_update.model_dump(exclude_unset=True)
    if update_data:
        questions_collection.update_one(
            {"id": question_id},
            {"$set": update_data}
        )
    
    updated_question = questions_collection.find_one({"id": question_id})
    return QuestionResponse(**updated_question)

@router.delete("/delete/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_question(
    question_id: str,
    current_user: UserInDB = Depends(get_current_admin_user)
):
    """Delete a question"""
    result = questions_collection.delete_one({"id": question_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Question not found"
        )
    return None

@router.post("/bulk_upload", response_model=BulkUploadResponse)
async def bulk_upload_questions(
    file: UploadFile = File(...),
    current_user: UserInDB = Depends(get_current_admin_user)
):
    """Bulk upload questions from JSON or CSV file"""
    success_count = 0
    failed_count = 0
    errors = []
    
    try:
        content = await file.read()
        
        # Determine file type and parse
        if file.filename.endswith('.json'):
            questions_data = json.loads(content.decode('utf-8'))
            if not isinstance(questions_data, list):
                questions_data = [questions_data]
        
        elif file.filename.endswith('.csv'):
            df = pd.read_csv(io.BytesIO(content))
            questions_data = df.to_dict('records')
        
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be JSON or CSV format"
            )
        
        # Process each question
        for idx, q_data in enumerate(questions_data):
            try:
                # Validate and create question
                question = QuestionCreate(**q_data)
                
                question_dict = question.model_dump()
                question_dict['id'] = str(uuid.uuid4())
                question_dict['created_by'] = current_user.username
                question_dict['created_at'] = datetime.utcnow()
                
                questions_collection.insert_one(question_dict)
                success_count += 1
                
            except Exception as e:
                failed_count += 1
                errors.append(f"Row {idx + 1}: {str(e)}")
        
        return BulkUploadResponse(
            success=success_count,
            failed=failed_count,
            total=len(questions_data),
            errors=errors
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error processing file: {str(e)}"
        )

@router.get("/export_pdf")
async def export_questions_pdf(
    category: str = None,
    current_user: UserInDB = Depends(get_current_admin_user)
):
    """Generate topic-wise question paper PDF (without answers)"""
    
    # Query questions
    query = {}
    if category:
        query['category'] = category
    
    questions = list(questions_collection.find(query).sort('category', 1))
    
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No questions found"
        )
    
    # Create PDF
    pdf_filename = f"question_paper_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.pdf"
    pdf_path = f"/app/uploads/{pdf_filename}"
    
    # Ensure uploads directory exists
    os.makedirs("/app/uploads", exist_ok=True)
    
    doc = SimpleDocTemplate(pdf_path, pagesize=A4,
                           topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    story = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        textColor=colors.HexColor('#1a365d'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    header_style = ParagraphStyle(
        'HeaderStyle',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=20,
        alignment=TA_LEFT
    )
    
    category_style = ParagraphStyle(
        'CategoryStyle',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=colors.HexColor('#2d3748'),
        spaceAfter=12,
        spaceBefore=20,
        fontName='Helvetica-Bold'
    )
    
    question_style = ParagraphStyle(
        'QuestionStyle',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=10,
        leftIndent=20
    )
    
    # Title
    story.append(Paragraph("<b>Java Quiz - Question Paper</b>", title_style))
    story.append(Spacer(1, 0.2*inch))
    
    # Header information
    header_data = [
        ['Name:', '_' * 40, 'Roll No:', '_' * 20],
        ['Date:', '_' * 40, 'Time:', '_' * 20]
    ]
    
    header_table = Table(header_data, colWidths=[0.8*inch, 2.5*inch, 1*inch, 1.5*inch])
    header_table.setStyle(TableStyle([
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ]))
    
    story.append(header_table)
    story.append(Spacer(1, 0.3*inch))
    
    # Group questions by category
    questions_by_category = {}
    for q in questions:
        cat = q['category']
        if cat not in questions_by_category:
            questions_by_category[cat] = []
        questions_by_category[cat].append(q)
    
    # Add questions by category
    for category_name, category_questions in questions_by_category.items():
        # Category header
        story.append(Paragraph(f"<b>Topic: {category_name}</b>", category_style))
        story.append(Spacer(1, 0.1*inch))
        
        # Questions in this category
        for idx, q in enumerate(category_questions, 1):
            # Question text
            question_text = f"<b>Q{idx}.</b> {q['question']}"
            story.append(Paragraph(question_text, question_style))
            story.append(Spacer(1, 0.05*inch))
            
            # Options
            for opt_idx, option in enumerate(q['options'], 1):
                option_text = f"&nbsp;&nbsp;&nbsp;&nbsp;<b>{chr(64+opt_idx)}.</b> {option}"
                story.append(Paragraph(option_text, question_style))
            
            story.append(Spacer(1, 0.15*inch))
        
        story.append(Spacer(1, 0.2*inch))
    
    # Build PDF
    doc.build(story)
    
    return FileResponse(
        path=pdf_path,
        media_type='application/pdf',
        filename=pdf_filename
    )

@router.get("/categories", response_model=List[str])
async def get_categories(
    current_user: UserInDB = Depends(get_current_admin_user)
):
    """Get all unique categories"""
    categories = questions_collection.distinct('category')
    return categories