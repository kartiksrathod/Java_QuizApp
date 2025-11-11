# Contributing to Java Quiz App

Thank you for your interest in contributing to the Java Quiz App!

## Development Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB
- Yarn package manager

### Backend Setup
```bash
cd /app/backend
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd /app/frontend
yarn install
```

## Project Structure

```
/app
├── backend/              # FastAPI backend
│   ├── routes/          # API route handlers
│   ├── models.py        # Pydantic models
│   ├── database.py      # MongoDB connection
│   ├── auth.py          # Authentication logic
│   └── server.py        # Main application
├── frontend/            # React frontend (Vite)
├── uploads/             # File uploads storage
├── scripts/             # Utility scripts
└── tests/              # Test files
```

## Coding Standards

### Backend (Python)
- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions
- Keep functions focused and small

### Frontend (React)
- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Keep components reusable

## Git Workflow

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Write/update tests
4. Commit with clear messages: `git commit -m "feat: add new feature"`
5. Push to your branch: `git push origin feature/your-feature-name`
6. Create a Pull Request

## Commit Message Format

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## Testing

### Backend Tests
```bash
cd /app/backend
pytest
```

### Frontend Tests
```bash
cd /app/frontend
yarn test
```

## Questions?

Feel free to open an issue for any questions or concerns!
