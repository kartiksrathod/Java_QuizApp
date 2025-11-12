"""
AI Service for Quiz Application
Uses Emergent LLM Key to power AI features:
- Question generation
- Difficulty analysis
- Document parsing
"""
import os
import json
import re
from typing import List, Dict, Optional, Any
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

load_dotenv()

class AIService:
    """Service for AI-powered quiz features using Emergent LLM"""
    
    def __init__(self):
        self.api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not self.api_key:
            raise ValueError("EMERGENT_LLM_KEY not found in environment variables")
        
        # Default model: GPT-4o-mini for cost efficiency
        self.provider = "openai"
        self.model = "gpt-4o-mini"
    
    def _create_chat(self, system_message: str, session_id: str = "quiz-ai") -> LlmChat:
        """Create a new chat instance with specified system message"""
        chat = LlmChat(
            api_key=self.api_key,
            session_id=session_id,
            system_message=system_message
        ).with_model(self.provider, self.model)
        return chat
    
    async def generate_questions(
        self,
        topic: str,
        count: int = 5,
        difficulty: str = "medium",
        category: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Generate quiz questions on a given topic
        
        Args:
            topic: Subject matter for questions
            count: Number of questions to generate (1-20)
            difficulty: easy, medium, or hard
            category: Optional category label
        
        Returns:
            List of question dictionaries with structure:
            {
                "question": str,
                "options": List[str],
                "answer": str,
                "explanation": str,
                "category": str,
                "difficulty": str
            }
        """
        count = max(1, min(count, 20))  # Limit 1-20 questions
        category = category or topic
        
        system_message = """You are an expert quiz question generator for Java programming. 
Generate high-quality multiple-choice questions that test understanding, not just memorization.
Always respond with valid JSON format ONLY, no additional text or markdown."""
        
        prompt = f"""Generate {count} {difficulty} difficulty multiple-choice questions about: {topic}

Requirements:
- Each question should have exactly 4 options
- Mark the correct answer clearly
- Provide a brief explanation for the correct answer
- Questions should test conceptual understanding
- Use realistic Java code examples where appropriate

Respond with a JSON array of questions in this EXACT format:
[
  {{
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Option A",
    "explanation": "Brief explanation of why this is correct",
    "category": "{category}",
    "difficulty": "{difficulty}"
  }}
]

Generate exactly {count} questions. Return ONLY the JSON array, no other text."""
        
        try:
            chat = self._create_chat(system_message, f"gen-{topic[:20]}")
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            # Parse response - extract JSON from potential markdown
            response_text = response.strip()
            
            # Remove markdown code blocks if present
            if response_text.startswith("```"):
                response_text = re.sub(r'^```(?:json)?\n?', '', response_text)
                response_text = re.sub(r'\n?```$', '', response_text)
            
            questions = json.loads(response_text)
            
            # Validate structure
            if not isinstance(questions, list):
                questions = [questions]
            
            # Add metadata
            for q in questions:
                q['generatedByAI'] = True
                q['sourceType'] = 'ai_generated'
                q['aiProvider'] = self.provider
                q['aiModel'] = self.model
            
            return questions
            
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse AI response as JSON: {str(e)}")
        except Exception as e:
            raise RuntimeError(f"AI question generation failed: {str(e)}")
    
    async def analyze_difficulty(self, question: str, options: List[str]) -> Dict[str, Any]:
        """
        Analyze question difficulty using AI
        
        Args:
            question: The question text
            options: List of answer options
        
        Returns:
            {
                "difficulty": "easy" | "medium" | "hard",
                "confidence": float (0-1),
                "reasoning": str,
                "bloomsLevel": str
            }
        """
        system_message = """You are an expert in educational assessment and Bloom's Taxonomy.
Analyze question difficulty objectively based on:
- Cognitive complexity (Bloom's taxonomy level)
- Required knowledge depth
- Problem-solving steps needed
- Language complexity
Respond with valid JSON only."""
        
        prompt = f"""Analyze the difficulty of this quiz question:

Question: {question}
Options: {', '.join(options)}

Respond with JSON in this EXACT format:
{{
  "difficulty": "easy" or "medium" or "hard",
  "confidence": 0.0 to 1.0,
  "reasoning": "Brief explanation of difficulty assessment",
  "bloomsLevel": "Remember/Understand/Apply/Analyze/Evaluate/Create"
}}

Return ONLY the JSON object, no other text."""
        
        try:
            chat = self._create_chat(system_message, "difficulty-analysis")
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            # Clean response
            response_text = response.strip()
            if response_text.startswith("```"):
                response_text = re.sub(r'^```(?:json)?\n?', '', response_text)
                response_text = re.sub(r'\n?```$', '', response_text)
            
            analysis = json.loads(response_text)
            return analysis
            
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse difficulty analysis: {str(e)}")
        except Exception as e:
            raise RuntimeError(f"Difficulty analysis failed: {str(e)}")
    
    async def parse_document(self, document_text: str, max_questions: int = 50) -> List[Dict[str, Any]]:
        """
        Extract quiz questions from document text
        
        Args:
            document_text: Text content from uploaded document
            max_questions: Maximum questions to extract
        
        Returns:
            List of extracted questions in standard format
        """
        system_message = """You are an expert at extracting and formatting quiz questions from documents.
Extract all quiz questions, maintaining their original format and content.
Respond with valid JSON only."""
        
        prompt = f"""Extract all quiz questions from this document. Detect format (MCQ, True/False, etc.) and convert to MCQ format where needed.

Document text:
{document_text[:5000]}  # Limit input size

Requirements:
- Extract up to {max_questions} questions
- Convert all to multiple-choice format with 4 options when possible
- Identify the correct answer
- Infer category from content
- Assign difficulty based on question complexity

Respond with JSON array in this EXACT format:
[
  {{
    "question": "Original question text",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "answer": "Option 1",
    "explanation": "Brief explanation if available, otherwise infer",
    "category": "Inferred category",
    "difficulty": "easy/medium/hard"
  }}
]

Return ONLY the JSON array, no other text."""
        
        try:
            chat = self._create_chat(system_message, "doc-parser")
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            # Clean and parse
            response_text = response.strip()
            if response_text.startswith("```"):
                response_text = re.sub(r'^```(?:json)?\n?', '', response_text)
                response_text = re.sub(r'\n?```$', '', response_text)
            
            questions = json.loads(response_text)
            
            if not isinstance(questions, list):
                questions = [questions]
            
            # Add metadata
            for q in questions:
                q['generatedByAI'] = True
                q['sourceType'] = 'ai_parsed'
                q['aiProvider'] = self.provider
                q['aiModel'] = self.model
            
            return questions[:max_questions]
            
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse document extraction: {str(e)}")
        except Exception as e:
            raise RuntimeError(f"Document parsing failed: {str(e)}")
    
    async def generate_explanation(self, question: str, answer: str) -> str:
        """
        Generate explanation for why an answer is correct
        
        Args:
            question: The question text
            answer: The correct answer
        
        Returns:
            Explanation string
        """
        system_message = "You are a helpful tutor explaining quiz answers clearly and concisely."
        
        prompt = f"""Explain why this answer is correct in 2-3 sentences:

Question: {question}
Correct Answer: {answer}

Provide a clear, educational explanation suitable for learners."""
        
        try:
            chat = self._create_chat(system_message, "explanation")
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            return response.strip()
            
        except Exception as e:
            raise RuntimeError(f"Explanation generation failed: {str(e)}")


# Singleton instance
ai_service = AIService()
