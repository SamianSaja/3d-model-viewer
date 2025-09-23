from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import IndexModel
import os
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'mixamo_clone')]

# Collections
users_collection = db.users
characters_collection = db.characters  
animations_collection = db.animations
processing_jobs_collection = db.processing_jobs
files_collection = db.files

async def init_database():
    """Initialize database with indexes"""
    try:
        # Users indexes
        await users_collection.create_indexes([
            IndexModel([("email", 1)], unique=True),
            IndexModel([("created_at", -1)])
        ])
        
        # Characters indexes
        await characters_collection.create_indexes([
            IndexModel([("name", "text"), ("description", "text"), ("tags", "text")]),
            IndexModel([("type", 1)]),
            IndexModel([("uploaded_by", 1)]),
            IndexModel([("is_public", 1)]),
            IndexModel([("created_at", -1)])
        ])
        
        # Animations indexes
        await animations_collection.create_indexes([
            IndexModel([("name", "text"), ("description", "text"), ("tags", "text")]),
            IndexModel([("category", 1)]),
            IndexModel([("uploaded_by", 1)]),
            IndexModel([("is_public", 1)]),
            IndexModel([("created_at", -1)])
        ])
        
        # Processing jobs indexes
        await processing_jobs_collection.create_indexes([
            IndexModel([("user_id", 1)]),
            IndexModel([("status", 1)]),
            IndexModel([("created_at", -1)])
        ])
        
        print("Database indexes created successfully")
        
    except Exception as e:
        print(f"Error creating database indexes: {e}")

async def close_database():
    """Close database connection"""
    client.close()