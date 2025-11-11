"""
Script to create default admin user on first startup
"""
import uuid
from datetime import datetime
from database import users_collection
from auth import get_password_hash

def create_default_admin():
    """Create default admin user if not exists"""
    admin_email = "admin@quizapp.com"
    
    # Check if admin already exists
    existing_admin = users_collection.find_one({"email": admin_email})
    
    if not existing_admin:
        print(f"Creating default admin user: {admin_email}")
        
        admin_data = {
            "id": str(uuid.uuid4()),
            "username": "admin",
            "email": admin_email,
            "full_name": "System Administrator",
            "hashed_password": get_password_hash("Admin@123"),
            "role": "admin",
            "created_at": datetime.utcnow()
        }
        
        users_collection.insert_one(admin_data)
        print(f"✅ Default admin created successfully!")
        print(f"   Email: {admin_email}")
        print(f"   Password: Admin@123")
        print(f"   ⚠️  Please change the password after first login!")
    else:
        print(f"ℹ️  Admin user already exists: {admin_email}")

if __name__ == "__main__":
    create_default_admin()
