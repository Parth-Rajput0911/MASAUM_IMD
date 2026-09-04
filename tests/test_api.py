"""
Unit tests for Mausam AI FastAPI Backend
Run with: pytest tests/test_api.py
"""

from fastapi.testclient import TestClient
import pytest
import sys
import os

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend')))
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["project"] == "Mausam AI"

def test_current_weather_endpoint():
    response = client.get("/api/weather/current?city=New Delhi&scenario=heavy_rain")
    assert response.status_code == 200
    data = response.json()
    assert data["city"] == "New Delhi"
    assert data["weather"]["humidity"] == 94
    assert data["weather"]["rainProb"] == 92

def test_risk_score_calculation():
    response = client.post("/api/risk-score?user_type=student&scenario=heavy_rain")
    assert response.status_code == 200
    data = response.json()
    assert "overallScore" in data
    assert data["overallScore"] >= 60  # High or Severe in heavy rain
    assert data["riskLevel"] in ["High", "Severe"]

def test_personalized_alerts_ranking():
    response = client.post("/api/alerts?user_type=student&scenario=heavy_rain")
    assert response.status_code == 200
    data = response.json()
    alerts = data["alerts"]
    assert len(alerts) > 0
    # Verify priority formula
    top_alert = alerts[0]
    expected_sum = top_alert["severityScore"] + top_alert["locationScore"] + top_alert["userRelevanceScore"]
    assert top_alert["totalPriority"] == expected_sum

def test_smart_commute_advisory():
    response = client.post("/api/commute?user_type=student&scenario=heavy_rain")
    assert response.status_code == 200
    data = response.json()
    assert data["routeRainProbability"] >= 80
    assert "-25 mins" in data["recommendedDeparture"]

def test_ai_chat_umbrella_query():
    response = client.post("/api/chat", json={"message": "Do I need an umbrella today?", "weatherScenario": "heavy_rain"})
    assert response.status_code == 200
    data = response.json()
    assert "umbrella" in data["reply"].lower()
    assert "carry" in data["reply"].lower()
