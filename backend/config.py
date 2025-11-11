import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    mongo_url: str = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
    database_name: str = os.environ.get('DATABASE_NAME', 'java_quiz_db')
    secret_key: str = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production-2024')
    algorithm: str = os.environ.get('ALGORITHM', 'HS256')
    access_token_expire_minutes: int = int(os.environ.get('ACCESS_TOKEN_EXPIRE_MINUTES', '30'))

settings = Settings()