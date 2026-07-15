import json
import pytest
from django.urls import reverse
from django.test import Client
from database.models import User
from django.contrib.auth.hashers import check_password

@pytest.fixture
def client():
    return Client()

@pytest.mark.django_db
def test_signup_success(client):
    payload = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "Password123."
    }
    response = client.post(
        "/api/auth/signup/", 
        data=json.dumps(payload),
        content_type="application/json"
    )
    assert response.status_code == 201
    data = response.json()
    assert "token" in data
    assert "user" in data
    assert data["user"]["email"] == "test@example.com"
    assert User.objects.count() == 1

@pytest.mark.django_db
def test_signup_missing_fields(client):
    payload = {
        "email": "test@example.com"
        # missing password and name
    }
    response = client.post(
        "/api/auth/signup/", 
        data=json.dumps(payload),
        content_type="application/json"
    )
    assert response.status_code == 400
    data = response.json()
    assert "errors" in data
    assert "password" in data["errors"]
    assert "name" in data["errors"]

@pytest.mark.django_db
def test_login_success(client):
    # Setup user
    User.objects.create_user(username="testuser", email="test@example.com", password="Password123.")
    
    payload = {
        "email": "test@example.com",
        "password": "Password123."
    }
    response = client.post(
        "/api/auth/login/", 
        data=json.dumps(payload),
        content_type="application/json"
    )
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert "user" in data
    assert data["user"]["email"] == "test@example.com"

@pytest.mark.django_db
def test_login_invalid_password(client):
    User.objects.create_user(username="testuser", email="test@example.com", password="Password123.")
    
    payload = {
        "email": "test@example.com",
        "password": "WrongPassword!"
    }
    response = client.post(
        "/api/auth/login/", 
        data=json.dumps(payload),
        content_type="application/json"
    )
    assert response.status_code == 401
    assert "error" in response.json()
