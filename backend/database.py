from pymongo import MongoClient
from config import settings

client = MongoClient(settings.mongo_url)
db = client[settings.database_name]

# Collections
users_collection = db['users']
questions_collection = db['questions']
quizzes_collection = db['quizzes']
results_collection = db['results']
bookmarks_collection = db['bookmarks']

# Create indexes
users_collection.create_index('email', unique=True)
questions_collection.create_index('category')
questions_collection.create_index('difficulty')
bookmarks_collection.create_index([('user_id', 1), ('question_id', 1)], unique=True)
bookmarks_collection.create_index('user_id')