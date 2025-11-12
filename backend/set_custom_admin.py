"""
Script to create/update custom admin user with specific credentials
"""
import uuid
from datetime import datetime
from database import users_collection
from auth import get_password_hash

def set_custom_admin():
    """Create or update custom admin user"""
    admin_email = "kartiksrathod07@gmail.com"
    admin_password = "Sheshi@1234"
    
    # Check if user already exists
    existing_user = users_collection.find_one({"email": admin_email})
    
    if existing_user:
        # Update existing user
        print(f"Updating existing user: {admin_email}")
        users_collection.update_one(
            {"email": admin_email},
            {"$set": {
                "hashed_password": get_password_hash(admin_password),
                "role": "admin",
                "username": "kartiksrathod07",
                "full_name": "Kartik Rathod"
            }}
        )
        print(f"✅ User updated to admin successfully!")
    else:
        # Create new admin user
        print(f"Creating new admin user: {admin_email}")
        
        admin_data = {
            "id": str(uuid.uuid4()),
            "username": "kartiksrathod07",
            "email": admin_email,
            "full_name": "Kartik Rathod",
            "hashed_password": get_password_hash(admin_password),
            "role": "admin",
            "created_at": datetime.utcnow()
        }
        
        users_collection.insert_one(admin_data)
        print(f"✅ Admin user created successfully!")
    
    print(f"   Email: {admin_email}")
    print(f"   Password: {admin_password}")
    print(f"   Role: admin")

if __name__ == "__main__":
    set_custom_admin()
