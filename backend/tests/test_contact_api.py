"""Tests for Kedbyte backend Contact API endpoints."""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL") or open("/app/frontend/.env").read().split("REACT_APP_BACKEND_URL=")[1].split("\n")[0].strip()
API = f"{BASE_URL.rstrip('/')}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---- Health ----
def test_root_alive(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200
    assert "Kedbyte" in r.json().get("message", "")


# ---- POST /api/contact - valid ----
def test_contact_create_valid_and_persist(client):
    unique = f"TEST_{uuid.uuid4().hex[:8]}"
    payload = {
        "name": f"TEST User {unique}",
        "email": f"test_{unique}@example.com",
        "company": "TEST Acme",
        "budget": "$10k – $50k",
        "message": f"Hello from automated test {unique}",
    }
    r = client.post(f"{API}/contact", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["status"] == "success"
    assert "message" in data
    # Expected: email_sent False because Resend not configured
    assert data["email_sent"] is False

    # Verify persisted via GET /api/contacts
    rl = client.get(f"{API}/contacts")
    assert rl.status_code == 200
    items = rl.json()
    assert isinstance(items, list)
    matches = [i for i in items if i.get("email") == payload["email"]]
    assert len(matches) >= 1
    item = matches[0]
    assert item["name"] == payload["name"]
    assert item["company"] == "TEST Acme"
    assert item["budget"] == "$10k – $50k"
    assert item["message"] == payload["message"]
    assert "created_at" in item
    assert "id" in item  # id mapped from _id
    # ObjectId not leaking
    assert "_id" not in item


# ---- POST /api/contact - invalid email ----
def test_contact_invalid_email_422(client):
    payload = {
        "name": "TEST Bad",
        "email": "not-an-email",
        "message": "Should fail validation",
    }
    r = client.post(f"{API}/contact", json=payload)
    assert r.status_code == 422


# ---- POST /api/contact - missing required fields ----
def test_contact_missing_required_fields_422(client):
    r = client.post(f"{API}/contact", json={"email": "x@y.com"})
    assert r.status_code == 422


# ---- POST /api/contact - minimal required fields ----
def test_contact_minimal_payload(client):
    unique = f"TEST_{uuid.uuid4().hex[:8]}"
    payload = {
        "name": f"TEST Min {unique}",
        "email": f"min_{unique}@example.com",
        "message": "minimal",
    }
    r = client.post(f"{API}/contact", json=payload)
    assert r.status_code == 200
    assert r.json()["status"] == "success"


# ---- GET /api/contacts ordering: most recent first ----
def test_contacts_list_sorted_desc(client):
    unique = f"TEST_{uuid.uuid4().hex[:8]}"
    email = f"order_{unique}@example.com"
    payload = {"name": "TEST Order", "email": email, "message": "order check"}
    r = client.post(f"{API}/contact", json=payload)
    assert r.status_code == 200

    rl = client.get(f"{API}/contacts")
    assert rl.status_code == 200
    items = rl.json()
    assert len(items) >= 1
    # Most recent should appear in early entries
    top_emails = [i["email"] for i in items[:5]]
    assert email in top_emails
