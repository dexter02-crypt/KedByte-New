#!/usr/bin/env python3
"""
KedByte Backend API Test Suite
Tests all backend endpoints using the external preview URL
"""

import requests
import json
from datetime import datetime

# Backend URL from frontend/.env
BASE_URL = "https://3e0386ec-2479-44c2-9e6e-4e834575d186.preview.emergentagent.com/api"

def print_test_header(test_name):
    """Print formatted test header"""
    print("\n" + "="*80)
    print(f"TEST: {test_name}")
    print("="*80)

def print_result(success, message):
    """Print test result"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status}: {message}")

def test_api_health_check():
    """Test 1: API Health Check - GET /api/"""
    print_test_header("API Health Check")
    
    try:
        response = requests.get(f"{BASE_URL}/", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Kedbyte API is live":
                print_result(True, "API health check successful")
                return True
            else:
                print_result(False, f"Unexpected response: {data}")
                return False
        else:
            print_result(False, f"Expected 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_contact_form_submission():
    """Test 2: Contact Form Submission - POST /api/contact"""
    print_test_header("Contact Form Submission")
    
    # Test data with realistic information
    contact_data = {
        "name": "Sarah Johnson",
        "email": "sarah.johnson@techcorp.com",
        "company": "TechCorp Solutions",
        "budget": "$50k-$100k",
        "message": "We're interested in developing a custom web application for our enterprise. Looking for a team with expertise in modern tech stack."
    }
    
    try:
        print(f"Sending POST request with data: {json.dumps(contact_data, indent=2)}")
        response = requests.post(
            f"{BASE_URL}/contact",
            json=contact_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Check response structure
            if data.get("status") == "success":
                print_result(True, "Contact form submission successful")
                
                # Verify email_sent is false (no RESEND_API_KEY configured)
                if data.get("email_sent") == False:
                    print_result(True, "Email sending correctly disabled (no API key)")
                else:
                    print(f"⚠️  WARNING: email_sent={data.get('email_sent')}, expected False")
                
                return True
            else:
                print_result(False, f"Unexpected status: {data.get('status')}")
                return False
        else:
            print_result(False, f"Expected 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_list_contacts():
    """Test 3: List Contacts - GET /api/contacts"""
    print_test_header("List Contacts")
    
    try:
        response = requests.get(f"{BASE_URL}/contacts", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            contacts = response.json()
            print(f"Number of contacts: {len(contacts)}")
            
            if len(contacts) > 0:
                print(f"\nSample contact (first entry):")
                print(json.dumps(contacts[0], indent=2))
                
                # Verify data structure
                required_fields = ["name", "email", "message", "created_at"]
                first_contact = contacts[0]
                
                missing_fields = [field for field in required_fields if field not in first_contact]
                
                if not missing_fields:
                    print_result(True, "Contact list retrieved with correct structure")
                    
                    # Verify the contact we just submitted is in the list
                    sarah_contact = next((c for c in contacts if c.get("email") == "sarah.johnson@techcorp.com"), None)
                    if sarah_contact:
                        print_result(True, "Previously submitted contact found in list")
                    else:
                        print("⚠️  WARNING: Previously submitted contact not found (may be timing issue)")
                    
                    return True
                else:
                    print_result(False, f"Missing required fields: {missing_fields}")
                    return False
            else:
                print_result(True, "Contact list retrieved (empty)")
                return True
        else:
            print_result(False, f"Expected 200, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_invalid_email():
    """Test 4: Error Handling - Invalid Email Format"""
    print_test_header("Error Handling - Invalid Email")
    
    invalid_data = {
        "name": "Test User",
        "email": "invalid-email-format",  # Invalid email
        "company": "Test Co",
        "budget": "$10k-$50k",
        "message": "Test message"
    }
    
    try:
        print(f"Sending POST request with invalid email: {invalid_data['email']}")
        response = requests.post(
            f"{BASE_URL}/contact",
            json=invalid_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Should return 422 Unprocessable Entity for validation error
        if response.status_code == 422:
            print_result(True, "Invalid email correctly rejected with 422")
            return True
        else:
            print_result(False, f"Expected 422 for invalid email, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def test_missing_required_fields():
    """Test 5: Error Handling - Missing Required Fields"""
    print_test_header("Error Handling - Missing Required Fields")
    
    incomplete_data = {
        "name": "Test User",
        # Missing email (required)
        # Missing message (required)
    }
    
    try:
        print(f"Sending POST request with missing fields: {json.dumps(incomplete_data)}")
        response = requests.post(
            f"{BASE_URL}/contact",
            json=incomplete_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        # Should return 422 Unprocessable Entity for missing fields
        if response.status_code == 422:
            print_result(True, "Missing required fields correctly rejected with 422")
            return True
        else:
            print_result(False, f"Expected 422 for missing fields, got {response.status_code}")
            return False
    except Exception as e:
        print_result(False, f"Exception occurred: {str(e)}")
        return False

def main():
    """Run all backend tests"""
    print("\n" + "="*80)
    print("KEDBYTE BACKEND API TEST SUITE")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"Test Time: {datetime.now().isoformat()}")
    
    results = {
        "API Health Check": test_api_health_check(),
        "Contact Form Submission": test_contact_form_submission(),
        "List Contacts": test_list_contacts(),
        "Invalid Email Handling": test_invalid_email(),
        "Missing Fields Handling": test_missing_required_fields(),
    }
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for result in results.values() if result)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed!")
        return 0
    else:
        print(f"\n⚠️  {total - passed} test(s) failed")
        return 1

if __name__ == "__main__":
    exit(main())
