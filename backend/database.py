from pymongo import MongoClient
from config import settings

client = MongoClient(settings.mongo_url)
db = client[settings.database_name]

# Collections
users_collection = db['users']
questions_collection = db['questions']
quizzes_collection = db['quizzes']
results_collection = db['results']

# Create indexes
users_collection.create_index('email', unique=True)
questions_collection.create_index('category')
questions_collection.create_index('difficulty')