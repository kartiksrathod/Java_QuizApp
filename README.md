# Java Quiz App - Question Management System

A comprehensive quiz application with admin question management, bulk upload, and PDF generation features.

## 🚀 Features

### Authentication
- JWT-based authentication
- Role-based access control (Admin/User)
- Secure password hashing

### Admin Features
- ✅ Add questions manually
- ✅ Bulk upload questions (JSON/CSV)
- ✅ Edit/Delete questions
- ✅ Generate topic-wise question papers (PDF)
- ✅ View all questions with filters
- ✅ Manage question categories

### User Features
- Take quizzes by category/difficulty
- View available categories
- Get randomized questions

## 🛠️ Tech Stack

**Backend:**
- FastAPI (Python)
- MongoDB
- JWT Authentication
- ReportLab (PDF Generation)

**Frontend:**
- React (Vite)
- Tailwind CSS

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Admin Routes (Protected)
- `POST /api/admin/questions/add` - Add single question
- `POST /api/admin/questions/bulk_upload` - Bulk upload (JSON/CSV)
- `GET /api/admin/questions/get_all` - Get all questions
- `PUT /api/admin/questions/update/{id}` - Update question
- `DELETE /api/admin/questions/delete/{id}` - Delete question
- `GET /api/admin/questions/export_pdf` - Generate PDF
- `GET /api/admin/questions/categories` - Get all categories

### User Routes (Protected)
- `GET /api/user/questions` - Get quiz questions
- `GET /api/user/categories` - Get available categories

## 📦 Bulk Upload Format

### JSON Format
```json
[
  {
    "question": "What is polymorphism in Java?",
    "options": ["Method overloading", "Method overriding", "Both A and B", "None"],
    "answer": "Both A and B",
    "category": "OOP Concepts",
    "difficulty": "medium",
    "explanation": "Polymorphism includes both compile-time and runtime polymorphism"
  }
]
```

### CSV Format
```csv
question,options,answer,category,difficulty,explanation
"What is polymorphism?","['A','B','C','D']","C","OOP","medium","Explanation here"
```

## 🔐 Environment Variables

```env
MONG O_URL=mongodb://localhost:27017/
DATABASE_NAME=java_quiz_db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 🚦 Getting Started

1. Install dependencies:
```bash
cd /app/backend
pip install -r requirements.txt

cd /app/frontend
yarn install
```

2. Start services:
```bash
sudo supervisorctl restart all
```

## 👤 Default Admin Account

Create an admin user by registering with role='admin' or update existing user:

```python
# Set user as admin in MongoDB
db.users.updateOne({"email": "admin@example.com"}, {$set: {"role": "admin"}})
```

## 📄 PDF Generation

Generated PDFs include:
- Header with Name, Roll No, Date fields
- Questions grouped by topic/category
- Auto-numbered questions per category
- No answers included (for exam papers)

## 🎯 Phase Implementation Status

- ✅ Phase 1: Backend Complete
- ⏳ Phase 2: Frontend (Next)
- ⏳ Phase 3: AI Integration (Future)