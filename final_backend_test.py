#!/usr/bin/env python3
"""
Final Comprehensive Backend API Testing for Java Quiz App
Tests all authentication, admin, and user endpoints with proper access control
"""

import requests
import json
import os
from datetime import datetime

# Backend URL
BASE_URL = "http://localhost:8001"
API_BASE = f"{BASE_URL}/api"

def print_test_header(test_name):
    """Print formatted test header"""
    print(f"\n{'='*60}")
    print(f"TESTING: {test_name}")
    print(f"{'='*60}")

def print_result(endpoint, method, status_code, success, details=""):
    """Print formatted test result"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} | {method} {endpoint} | Status: {status_code} | {details}")

def run_comprehensive_tests():
    """Run all comprehensive tests"""
    print(f"🚀 Starting Java Quiz App Backend API Tests")
    print(f"Backend URL: {BASE_URL}")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test counters
    total_tests = 0
    passed_tests = 0
    
    # 1. HEALTH CHECK
    print_test_header("HEALTH CHECK")
    
    # Root endpoint
    try:
        response = requests.get(BASE_URL)
        total_tests += 1
        if response.status_code == 200:
            passed_tests += 1
            print_result("/", "GET", response.status_code, True, "Root endpoint working")
        else:
            print_result("/", "GET", response.status_code, False, "Root endpoint failed")
    except Exception as e:
        total_tests += 1
        print_result("/", "GET", "N/A", False, f"Root endpoint error: {e}")
    
    # Health endpoint
    try:
        response = requests.get(f"{API_BASE}/health")
        total_tests += 1
        if response.status_code == 200:
            passed_tests += 1
            print_result("/api/health", "GET", response.status_code, True, "Health check working")
        else:
            print_result("/api/health", "GET", response.status_code, False, "Health check failed")
    except Exception as e:
        total_tests += 1
        print_result("/api/health", "GET", "N/A", False, f"Health check error: {e}")
    
    # 2. AUTHENTICATION FLOW
    print_test_header("AUTHENTICATION FLOW")
    
    admin_user = {
        "email": "admin@test.com",
        "username": "admin", 
        "password": "admin123",
        "full_name": "Admin User",
        "role": "admin"
    }
    
    regular_user = {
        "email": "user@test.com",
        "username": "testuser",
        "password": "user123", 
        "full_name": "Test User",
        "role": "user"
    }
    
    # Register admin (or handle existing)
    try:
        response = requests.post(f"{API_BASE}/auth/register", json=admin_user)
        total_tests += 1
        if response.status_code == 201:
            passed_tests += 1
            print_result("/auth/register", "POST", response.status_code, True, "Admin user registered")
        elif response.status_code == 400 and "already" in response.json().get("detail", "").lower():
            passed_tests += 1
            print_result("/auth/register", "POST", response.status_code, True, "Admin user already exists")
        else:
            print_result("/auth/register", "POST", response.status_code, False, f"Admin registration failed: {response.json().get('detail', 'Unknown')}")
    except Exception as e:
        total_tests += 1
        print_result("/auth/register", "POST", "N/A", False, f"Admin registration error: {e}")
    
    # Register user (or handle existing)
    try:
        response = requests.post(f"{API_BASE}/auth/register", json=regular_user)
        total_tests += 1
        if response.status_code == 201:
            passed_tests += 1
            print_result("/auth/register", "POST", response.status_code, True, "Regular user registered")
        elif response.status_code == 400 and "already" in response.json().get("detail", "").lower():
            passed_tests += 1
            print_result("/auth/register", "POST", response.status_code, True, "Regular user already exists")
        else:
            print_result("/auth/register", "POST", response.status_code, False, f"User registration failed: {response.json().get('detail', 'Unknown')}")
    except Exception as e:
        total_tests += 1
        print_result("/auth/register", "POST", "N/A", False, f"User registration error: {e}")
    
    # Login admin
    admin_token = None
    try:
        login_data = {"username": "admin", "password": "admin123"}
        response = requests.post(f"{API_BASE}/auth/login", data=login_data)
        total_tests += 1
        if response.status_code == 200:
            passed_tests += 1
            token_data = response.json()
            admin_token = token_data.get("access_token")
            print_result("/auth/login", "POST", response.status_code, True, f"Admin login successful, role: {token_data.get('role')}")
        else:
            print_result("/auth/login", "POST", response.status_code, False, f"Admin login failed: {response.json().get('detail', 'Unknown')}")
    except Exception as e:
        total_tests += 1
        print_result("/auth/login", "POST", "N/A", False, f"Admin login error: {e}")
    
    # Login user
    user_token = None
    try:
        login_data = {"username": "testuser", "password": "user123"}
        response = requests.post(f"{API_BASE}/auth/login", data=login_data)
        total_tests += 1
        if response.status_code == 200:
            passed_tests += 1
            token_data = response.json()
            user_token = token_data.get("access_token")
            print_result("/auth/login", "POST", response.status_code, True, f"User login successful, role: {token_data.get('role')}")
        else:
            print_result("/auth/login", "POST", response.status_code, False, f"User login failed: {response.json().get('detail', 'Unknown')}")
    except Exception as e:
        total_tests += 1
        print_result("/auth/login", "POST", "N/A", False, f"User login error: {e}")
    
    # Get current user info
    if admin_token:
        try:
            headers = {"Authorization": f"Bearer {admin_token}"}
            response = requests.get(f"{API_BASE}/auth/me", headers=headers)
            total_tests += 1
            if response.status_code == 200:
                passed_tests += 1
                user_data = response.json()
                print_result("/auth/me", "GET", response.status_code, True, f"Got admin user info: {user_data.get('username')}")
            else:
                print_result("/auth/me", "GET", response.status_code, False, "Failed to get admin user info")
        except Exception as e:
            total_tests += 1
            print_result("/auth/me", "GET", "N/A", False, f"Get user info error: {e}")
    
    # 3. ADMIN QUESTION MANAGEMENT
    print_test_header("ADMIN QUESTION MANAGEMENT")
    
    if admin_token:
        headers = {"Authorization": f"Bearer {admin_token}", "Content-Type": "application/json"}
        
        # Add single question
        sample_question = {
            "question": "What is encapsulation in Java?",
            "options": ["Data hiding", "Inheritance", "Polymorphism", "Abstraction"],
            "answer": "Data hiding",
            "category": "OOP Concepts",
            "difficulty": "medium",
            "explanation": "Encapsulation is the bundling of data and methods"
        }
        
        try:
            response = requests.post(f"{API_BASE}/admin/questions/add", headers=headers, json=sample_question)
            total_tests += 1
            if response.status_code == 201:
                passed_tests += 1
                question_data = response.json()
                print_result("/admin/questions/add", "POST", response.status_code, True, f"Question added with ID: {question_data.get('id')}")
            else:
                print_result("/admin/questions/add", "POST", response.status_code, False, f"Failed to add question: {response.json().get('detail', 'Unknown')}")
        except Exception as e:
            total_tests += 1
            print_result("/admin/questions/add", "POST", "N/A", False, f"Add question error: {e}")
        
        # Get all questions
        try:
            response = requests.get(f"{API_BASE}/admin/questions/get_all", headers=headers)
            total_tests += 1
            if response.status_code == 200:
                passed_tests += 1
                questions = response.json()
                print_result("/admin/questions/get_all", "GET", response.status_code, True, f"Retrieved {len(questions)} questions")
            else:
                print_result("/admin/questions/get_all", "GET", response.status_code, False, "Failed to get questions")
        except Exception as e:
            total_tests += 1
            print_result("/admin/questions/get_all", "GET", "N/A", False, f"Get questions error: {e}")
        
        # Get questions by category
        try:
            response = requests.get(f"{API_BASE}/admin/questions/get_all?category=OOP Concepts", headers=headers)
            total_tests += 1
            if response.status_code == 200:
                passed_tests += 1
                questions = response.json()
                print_result("/admin/questions/get_all?category=OOP Concepts", "GET", response.status_code, True, f"Retrieved {len(questions)} OOP questions")
            else:
                print_result("/admin/questions/get_all?category=OOP Concepts", "GET", response.status_code, False, "Failed to filter by category")
        except Exception as e:
            total_tests += 1
            print_result("/admin/questions/get_all?category=OOP Concepts", "GET", "N/A", False, f"Filter questions error: {e}")
        
        # Get categories
        try:
            response = requests.get(f"{API_BASE}/admin/questions/categories", headers=headers)
            total_tests += 1
            if response.status_code == 200:
                passed_tests += 1
                categories = response.json()
                print_result("/admin/questions/categories", "GET", response.status_code, True, f"Retrieved categories: {categories}")
            else:
                print_result("/admin/questions/categories", "GET", response.status_code, False, "Failed to get categories")
        except Exception as e:
            total_tests += 1
            print_result("/admin/questions/categories", "GET", "N/A", False, f"Get categories error: {e}")
        
        # Bulk upload
        if os.path.exists("/app/sample_questions.json"):
            try:
                with open("/app/sample_questions.json", "rb") as f:
                    files = {"file": ("sample_questions.json", f, "application/json")}
                    upload_headers = {"Authorization": f"Bearer {admin_token}"}
                    response = requests.post(f"{API_BASE}/admin/questions/bulk_upload", headers=upload_headers, files=files)
                
                total_tests += 1
                if response.status_code == 200:
                    passed_tests += 1
                    upload_result = response.json()
                    print_result("/admin/questions/bulk_upload", "POST", response.status_code, True, 
                                f"Uploaded {upload_result.get('success')} questions, {upload_result.get('failed')} failed")
                else:
                    print_result("/admin/questions/bulk_upload", "POST", response.status_code, False, f"Bulk upload failed: {response.json().get('detail', 'Unknown')}")
            except Exception as e:
                total_tests += 1
                print_result("/admin/questions/bulk_upload", "POST", "N/A", False, f"Bulk upload error: {e}")
        else:
            total_tests += 1
            print_result("/admin/questions/bulk_upload", "POST", "N/A", False, "Sample questions file not found")
        
        # Export PDF
        try:
            response = requests.get(f"{API_BASE}/admin/questions/export_pdf", headers=headers)
            total_tests += 1
            if response.status_code == 200:
                passed_tests += 1
                content_type = response.headers.get("content-type", "")
                if "pdf" in content_type:
                    print_result("/admin/questions/export_pdf", "GET", response.status_code, True, "PDF generated successfully")
                else:
                    print_result("/admin/questions/export_pdf", "GET", response.status_code, False, f"Wrong content type: {content_type}")
            else:
                print_result("/admin/questions/export_pdf", "GET", response.status_code, False, "PDF generation failed")
        except Exception as e:
            total_tests += 1
            print_result("/admin/questions/export_pdf", "GET", "N/A", False, f"PDF export error: {e}")
        
        # Export PDF by category
        try:
            response = requests.get(f"{API_BASE}/admin/questions/export_pdf?category=OOP Concepts", headers=headers)
            total_tests += 1
            if response.status_code == 200:
                passed_tests += 1
                content_type = response.headers.get("content-type", "")
                if "pdf" in content_type:
                    print_result("/admin/questions/export_pdf?category=OOP Concepts", "GET", response.status_code, True, "Category PDF generated successfully")
                else:
                    print_result("/admin/questions/export_pdf?category=OOP Concepts", "GET", response.status_code, False, f"Wrong content type: {content_type}")
            else:
                print_result("/admin/questions/export_pdf?category=OOP Concepts", "GET", response.status_code, False, "Category PDF generation failed")
        except Exception as e:
            total_tests += 1
            print_result("/admin/questions/export_pdf?category=OOP Concepts", "GET", "N/A", False, f"Category PDF error: {e}")
    
    # 4. USER ENDPOINTS
    print_test_header("USER ENDPOINTS")
    
    if user_token:
        headers = {"Authorization": f"Bearer {user_token}"}
        
        # Get categories
        try:
            response = requests.get(f"{API_BASE}/user/categories", headers=headers)
            total_tests += 1
            if response.status_code == 200:
                passed_tests += 1
                categories = response.json()
                print_result("/user/categories", "GET", response.status_code, True, f"Retrieved categories: {categories}")
            else:
                print_result("/user/categories", "GET", response.status_code, False, "Failed to get user categories")
        except Exception as e:
            total_tests += 1
            print_result("/user/categories", "GET", "N/A", False, f"User categories error: {e}")
        
        # Get random questions
        try:
            response = requests.get(f"{API_BASE}/user/questions?limit=5", headers=headers)
            total_tests += 1
            if response.status_code == 200:
                passed_tests += 1
                questions = response.json()
                print_result("/user/questions?limit=5", "GET", response.status_code, True, f"Retrieved {len(questions)} random questions")
            else:
                print_result("/user/questions?limit=5", "GET", response.status_code, False, "Failed to get random questions")
        except Exception as e:
            total_tests += 1
            print_result("/user/questions?limit=5", "GET", "N/A", False, f"Random questions error: {e}")
        
        # Get questions by category
        try:
            response = requests.get(f"{API_BASE}/user/questions?category=Data Types&limit=3", headers=headers)
            total_tests += 1
            if response.status_code == 200:
                passed_tests += 1
                questions = response.json()
                print_result("/user/questions?category=Data Types&limit=3", "GET", response.status_code, True, f"Retrieved {len(questions)} Data Types questions")
            else:
                print_result("/user/questions?category=Data Types&limit=3", "GET", response.status_code, False, "Failed to get category questions")
        except Exception as e:
            total_tests += 1
            print_result("/user/questions?category=Data Types&limit=3", "GET", "N/A", False, f"Category questions error: {e}")
    
    # 5. ACCESS CONTROL TESTING
    print_test_header("ACCESS CONTROL TESTING")
    
    # Test admin endpoint with user token (should fail with 403)
    if user_token:
        try:
            headers = {"Authorization": f"Bearer {user_token}", "Content-Type": "application/json"}
            test_question = {
                "question": "Test question",
                "options": ["A", "B", "C", "D"],
                "answer": "A",
                "category": "Test",
                "difficulty": "easy"
            }
            response = requests.post(f"{API_BASE}/admin/questions/add", headers=headers, json=test_question)
            total_tests += 1
            if response.status_code == 403:
                passed_tests += 1
                print_result("/admin/questions/add (with user token)", "POST", response.status_code, True, "Correctly blocked user from admin endpoint")
            else:
                print_result("/admin/questions/add (with user token)", "POST", response.status_code, False, f"Access control failed: {response.json().get('detail', 'Unknown')}")
        except Exception as e:
            total_tests += 1
            print_result("/admin/questions/add (with user token)", "POST", "N/A", False, f"Access control test error: {e}")
    
    # Test admin endpoint without token (should fail with 401)
    try:
        response = requests.get(f"{API_BASE}/admin/questions/get_all")
        total_tests += 1
        if response.status_code == 401:
            passed_tests += 1
            print_result("/admin/questions/get_all (no token)", "GET", response.status_code, True, "Correctly requires authentication")
        else:
            print_result("/admin/questions/get_all (no token)", "GET", response.status_code, False, f"Auth requirement failed: {response.json().get('detail', 'Unknown')}")
    except Exception as e:
        total_tests += 1
        print_result("/admin/questions/get_all (no token)", "GET", "N/A", False, f"Auth test error: {e}")
    
    # SUMMARY
    print(f"\n{'='*60}")
    print(f"🏁 TEST SUMMARY")
    print(f"{'='*60}")
    print(f"Total Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {total_tests - passed_tests}")
    print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%" if total_tests > 0 else "No tests run")
    print(f"Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*60}")

if __name__ == "__main__":
    run_comprehensive_tests()