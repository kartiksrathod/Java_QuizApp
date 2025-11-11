#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Java Quiz App
Tests all authentication, admin, and user endpoints with proper access control
"""

import requests
import json
import os
import sys
from datetime import datetime

# Backend URL - Use the same URL as frontend
BASE_URL = "http://localhost:8001"
API_BASE = "http://localhost:8001/api"

# Test data
ADMIN_USER = {
    "email": "admin@test.com",
    "username": "admin",
    "password": "admin123",
    "full_name": "Admin User",
    "role": "admin"
}

REGULAR_USER = {
    "email": "user@test.com", 
    "username": "testuser",
    "password": "user123",
    "full_name": "Test User",
    "role": "user"
}

SAMPLE_QUESTION = {
    "question": "What is encapsulation in Java?",
    "options": ["Data hiding", "Inheritance", "Polymorphism", "Abstraction"],
    "answer": "Data hiding",
    "category": "OOP Concepts",
    "difficulty": "medium",
    "explanation": "Encapsulation is the bundling of data and methods"
}

# Global variables to store tokens
admin_token = None
user_token = None

def print_test_header(test_name):
    """Print formatted test header"""
    print(f"\n{'='*60}")
    print(f"TESTING: {test_name}")
    print(f"{'='*60}")

def print_result(endpoint, method, status_code, success, details=""):
    """Print formatted test result"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} | {method} {endpoint} | Status: {status_code} | {details}")

def make_request(method, endpoint, data=None, files=None, token=None, params=None):
    """Make HTTP request with proper headers"""
    url = f"{API_BASE}{endpoint}"
    headers = {"Content-Type": "application/json"}
    
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    if files:
        # Remove content-type for file uploads
        headers.pop("Content-Type", None)
    
    try:
        if method == "GET":
            response = requests.get(url, headers=headers, params=params)
        elif method == "POST":
            if files:
                response = requests.post(url, headers=headers, files=files, data=data)
            else:
                response = requests.post(url, headers=headers, json=data)
        elif method == "PUT":
            response = requests.put(url, headers=headers, json=data)
        elif method == "DELETE":
            response = requests.delete(url, headers=headers)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        return response
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return None

def test_health_check():
    """Test basic health endpoints"""
    print_test_header("HEALTH CHECK")
    
    # Test root endpoint (direct call to base URL)
    try:
        response = requests.get(BASE_URL)
        if response and response.status_code == 200:
            print_result("/", "GET", response.status_code, True, "Root endpoint working")
        else:
            print_result("/", "GET", response.status_code if response else "N/A", False, "Root endpoint failed")
    except Exception as e:
        print_result("/", "GET", "N/A", False, f"Root endpoint failed: {e}")
    
    # Test health endpoint
    response = make_request("GET", "/health")
    if response and response.status_code == 200:
        print_result("/api/health", "GET", response.status_code, True, "Health check working")
    else:
        print_result("/api/health", "GET", response.status_code if response else "N/A", False, "Health check failed")

def test_authentication():
    """Test authentication endpoints"""
    global admin_token, user_token
    
    print_test_header("AUTHENTICATION FLOW")
    
    # 1. Register admin user (or skip if already exists)
    response = make_request("POST", "/auth/register", ADMIN_USER)
    if response and response.status_code == 201:
        print_result("/auth/register", "POST", response.status_code, True, "Admin user registered successfully")
    elif response and response.status_code == 400 and "already" in response.json().get("detail", "").lower():
        print_result("/auth/register", "POST", response.status_code, True, "Admin user already exists (skipping)")
    else:
        error_detail = response.json().get("detail", "Unknown error") if response else "No response"
        print_result("/auth/register", "POST", response.status_code if response else "N/A", False, f"Admin registration failed: {error_detail}")
    
    # 2. Register regular user (or skip if already exists)
    response = make_request("POST", "/auth/register", REGULAR_USER)
    if response and response.status_code == 201:
        print_result("/auth/register", "POST", response.status_code, True, "Regular user registered successfully")
    elif response and response.status_code == 400 and "already" in response.json().get("detail", "").lower():
        print_result("/auth/register", "POST", response.status_code, True, "Regular user already exists (skipping)")
    else:
        error_detail = response.json().get("detail", "Unknown error") if response else "No response"
        print_result("/auth/register", "POST", response.status_code if response else "N/A", False, f"User registration failed: {error_detail}")
    
    # 3. Login with admin credentials
    login_data = {
        "username": ADMIN_USER["username"],
        "password": ADMIN_USER["password"]
    }
    response = requests.post(f"{API_BASE}/auth/login", data=login_data)
    if response and response.status_code == 200:
        token_data = response.json()
        admin_token = token_data.get("access_token")
        print_result("/auth/login", "POST", response.status_code, True, f"Admin login successful, role: {token_data.get('role')}")
    else:
        error_detail = response.json().get("detail", "Unknown error") if response else "No response"
        print_result("/auth/login", "POST", response.status_code if response else "N/A", False, f"Admin login failed: {error_detail}")
    
    # 4. Login with user credentials
    login_data = {
        "username": REGULAR_USER["username"],
        "password": REGULAR_USER["password"]
    }
    response = requests.post(f"{API_BASE}/auth/login", data=login_data)
    if response and response.status_code == 200:
        token_data = response.json()
        user_token = token_data.get("access_token")
        print_result("/auth/login", "POST", response.status_code, True, f"User login successful, role: {token_data.get('role')}")
    else:
        error_detail = response.json().get("detail", "Unknown error") if response else "No response"
        print_result("/auth/login", "POST", response.status_code if response else "N/A", False, f"User login failed: {error_detail}")
    
    # 5. Get current user info (admin)
    if admin_token:
        response = make_request("GET", "/auth/me", token=admin_token)
        if response and response.status_code == 200:
            user_data = response.json()
            print_result("/auth/me", "GET", response.status_code, True, f"Got admin user info: {user_data.get('username')}")
        else:
            print_result("/auth/me", "GET", response.status_code if response else "N/A", False, "Failed to get admin user info")

def test_admin_question_management():
    """Test admin question management endpoints"""
    global admin_token
    
    print_test_header("ADMIN QUESTION MANAGEMENT")
    
    if not admin_token:
        print("❌ No admin token available, skipping admin tests")
        return
    
    # 1. Add a single question
    response = make_request("POST", "/admin/questions/add", SAMPLE_QUESTION, token=admin_token)
    if response and response.status_code == 201:
        question_data = response.json()
        print_result("/admin/questions/add", "POST", response.status_code, True, f"Question added with ID: {question_data.get('id')}")
    else:
        error_detail = response.json().get("detail", "Unknown error") if response else "No response"
        print_result("/admin/questions/add", "POST", response.status_code if response else "N/A", False, f"Failed to add question: {error_detail}")
    
    # 2. Get all questions
    response = make_request("GET", "/admin/questions/get_all", token=admin_token)
    if response and response.status_code == 200:
        questions = response.json()
        print_result("/admin/questions/get_all", "GET", response.status_code, True, f"Retrieved {len(questions)} questions")
    else:
        print_result("/admin/questions/get_all", "GET", response.status_code if response else "N/A", False, "Failed to get questions")
    
    # 3. Get questions by category
    response = make_request("GET", "/admin/questions/get_all", token=admin_token, params={"category": "OOP Concepts"})
    if response and response.status_code == 200:
        questions = response.json()
        print_result("/admin/questions/get_all?category=OOP Concepts", "GET", response.status_code, True, f"Retrieved {len(questions)} OOP questions")
    else:
        print_result("/admin/questions/get_all?category=OOP Concepts", "GET", response.status_code if response else "N/A", False, "Failed to filter by category")
    
    # 4. Get categories
    response = make_request("GET", "/admin/questions/categories", token=admin_token)
    if response and response.status_code == 200:
        categories = response.json()
        print_result("/admin/questions/categories", "GET", response.status_code, True, f"Retrieved categories: {categories}")
    else:
        print_result("/admin/questions/categories", "GET", response.status_code if response else "N/A", False, "Failed to get categories")
    
    # 5. Bulk upload questions
    if os.path.exists("/app/sample_questions.json"):
        with open("/app/sample_questions.json", "rb") as f:
            files = {"file": ("sample_questions.json", f, "application/json")}
            response = requests.post(
                f"{API_BASE}/admin/questions/bulk_upload",
                headers={"Authorization": f"Bearer {admin_token}"},
                files=files
            )
        
        if response and response.status_code == 200:
            upload_result = response.json()
            print_result("/admin/questions/bulk_upload", "POST", response.status_code, True, 
                        f"Uploaded {upload_result.get('success')} questions, {upload_result.get('failed')} failed")
        else:
            error_detail = response.json().get("detail", "Unknown error") if response else "No response"
            print_result("/admin/questions/bulk_upload", "POST", response.status_code if response else "N/A", False, f"Bulk upload failed: {error_detail}")
    else:
        print_result("/admin/questions/bulk_upload", "POST", "N/A", False, "Sample questions file not found")
    
    # 6. Export PDF (all questions)
    response = make_request("GET", "/admin/questions/export_pdf", token=admin_token)
    if response and response.status_code == 200:
        content_type = response.headers.get("content-type", "")
        if "pdf" in content_type:
            print_result("/admin/questions/export_pdf", "GET", response.status_code, True, "PDF generated successfully")
        else:
            print_result("/admin/questions/export_pdf", "GET", response.status_code, False, f"Wrong content type: {content_type}")
    else:
        print_result("/admin/questions/export_pdf", "GET", response.status_code if response else "N/A", False, "PDF generation failed")
    
    # 7. Export PDF by category
    response = make_request("GET", "/admin/questions/export_pdf", token=admin_token, params={"category": "OOP Concepts"})
    if response and response.status_code == 200:
        content_type = response.headers.get("content-type", "")
        if "pdf" in content_type:
            print_result("/admin/questions/export_pdf?category=OOP Concepts", "GET", response.status_code, True, "Category PDF generated successfully")
        else:
            print_result("/admin/questions/export_pdf?category=OOP Concepts", "GET", response.status_code, False, f"Wrong content type: {content_type}")
    else:
        print_result("/admin/questions/export_pdf?category=OOP Concepts", "GET", response.status_code if response else "N/A", False, "Category PDF generation failed")

def test_user_endpoints():
    """Test user endpoints"""
    global user_token
    
    print_test_header("USER ENDPOINTS")
    
    if not user_token:
        print("❌ No user token available, skipping user tests")
        return
    
    # 1. Get available categories
    response = make_request("GET", "/user/categories", token=user_token)
    if response and response.status_code == 200:
        categories = response.json()
        print_result("/user/categories", "GET", response.status_code, True, f"Retrieved categories: {categories}")
    else:
        print_result("/user/categories", "GET", response.status_code if response else "N/A", False, "Failed to get user categories")
    
    # 2. Get 5 random questions
    response = make_request("GET", "/user/questions", token=user_token, params={"limit": 5})
    if response and response.status_code == 200:
        questions = response.json()
        print_result("/user/questions?limit=5", "GET", response.status_code, True, f"Retrieved {len(questions)} random questions")
    else:
        print_result("/user/questions?limit=5", "GET", response.status_code if response else "N/A", False, "Failed to get random questions")
    
    # 3. Get questions by category
    response = make_request("GET", "/user/questions", token=user_token, params={"category": "Data Types", "limit": 3})
    if response and response.status_code == 200:
        questions = response.json()
        print_result("/user/questions?category=Data Types&limit=3", "GET", response.status_code, True, f"Retrieved {len(questions)} Data Types questions")
    else:
        print_result("/user/questions?category=Data Types&limit=3", "GET", response.status_code if response else "N/A", False, "Failed to get category questions")

def test_access_control():
    """Test access control and security"""
    global admin_token, user_token
    
    print_test_header("ACCESS CONTROL TESTING")
    
    # 1. Try admin endpoint with user token (should fail with 403)
    if user_token:
        url = f"{API_BASE}/admin/questions/add"
        headers = {"Authorization": f"Bearer {user_token}", "Content-Type": "application/json"}
        
        try:
            response = requests.post(url, headers=headers, json=SAMPLE_QUESTION)
            if response and response.status_code == 403:
                print_result("/admin/questions/add (with user token)", "POST", response.status_code, True, "Correctly blocked user from admin endpoint")
            else:
                error_detail = response.json().get("detail", "Unknown error") if response else "No response"
                print_result("/admin/questions/add (with user token)", "POST", response.status_code if response else "N/A", False, f"Access control issue: {error_detail}")
        except Exception as e:
            print_result("/admin/questions/add (with user token)", "POST", "N/A", False, f"Request failed: {e}")
    else:
        print_result("/admin/questions/add (with user token)", "POST", "N/A", False, "No user token available")
    
    # 2. Try admin endpoint without token (should fail with 401)
    try:
        url = f"{API_BASE}/admin/questions/get_all"
        response = requests.get(url)
        if response and response.status_code == 401:
            print_result("/admin/questions/get_all (no token)", "GET", response.status_code, True, "Correctly requires authentication")
        else:
            error_detail = response.json().get("detail", "Unknown error") if response else "No response"
            print_result("/admin/questions/get_all (no token)", "GET", response.status_code if response else "N/A", False, f"Auth issue: {error_detail}")
    except Exception as e:
        print_result("/admin/questions/get_all (no token)", "GET", "N/A", False, f"Request failed: {e}")

def run_all_tests():
    """Run all test suites"""
    print(f"🚀 Starting Java Quiz App Backend API Tests")
    print(f"Backend URL: {BASE_URL}")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Run test suites in order
    test_health_check()
    test_authentication()
    test_admin_question_management()
    test_user_endpoints()
    test_access_control()
    
    print(f"\n{'='*60}")
    print(f"🏁 All tests completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}")

if __name__ == "__main__":
    run_all_tests()