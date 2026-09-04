"""
Unit tests for Mausam AI Machine Learning & Personalization Engine
Run with: pytest tests/test_ai_ml.py
"""

import pytest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ai_ml')))
from risk_classifier import WeatherRiskClassifier
from relevance_ranker import AlertRelevanceRanker

def test_risk_classifier_severe_squall():
    clf = WeatherRiskClassifier()
    # Severe conditions: 74 km/h wind, 98% rain, squall
    res = clf.predict(
        temp=22.0,
        humidity=98.0,
        wind_speed=74.0,
        rain_prob=98.0,
        aqi=30.0,
        uv_index=1.0,
        user_type='student',
        commute_mode='bike',
        hour=17
    )
    assert res['risk_level'] in ['High', 'Severe']
    assert res['confidence'] > 0.4

def test_risk_classifier_benign_normal():
    clf = WeatherRiskClassifier()
    # Normal benign conditions: 28C, gentle breeze, 10% rain
    res = clf.predict(
        temp=28.0,
        humidity=50.0,
        wind_speed=10.0,
        rain_prob=10.0,
        aqi=65.0,
        uv_index=4.0,
        user_type='office_worker',
        commute_mode='metro',
        hour=9
    )
    assert res['risk_level'] in ['Low', 'Moderate']

def test_alert_relevance_formula():
    ranker = AlertRelevanceRanker()
    # Test formula: Severity (8) + Location (9) + User Relevance = Priority
    result = ranker.calculate_priority(
        severity_score=8.0,
        location_score=9.0,
        category='rain',
        user_type='student'
    )
    # 8 + 9 + 9.5 = 26.5
    assert result['total_priority'] == 26.5
    assert result['priority_tier'] == "P1 - Critical Urgent"
    assert result['max_possible'] == 30.0
