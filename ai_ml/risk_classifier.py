"""
Mausam AI - Machine Learning Risk Classifier
Problem: SIH 2026 - Personalized Homepage for Mausam Mobile App
Engine: Scikit-learn Random Forest Classifier & Feature Pipeline
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib

class WeatherRiskClassifier:
    """
    Classifies multi-hazard risk (0: Low, 1: Moderate, 2: High, 3: Severe)
    Input Features:
    [temp, humidity, wind_speed, rain_prob, aqi, uv_index, user_type_encoded, commute_mode_encoded, hour_of_day]
    """
    
    LABEL_MAP = {
        0: 'Low',
        1: 'Moderate',
        2: 'High',
        3: 'Severe'
    }

    USER_TYPE_MAP = {
        'student': 0,
        'office_worker': 1,
        'farmer': 2,
        'outdoor_worker': 3,
        'traveller': 4,
        'general_user': 5
    }

    COMMUTE_MODE_MAP = {
        'walk': 0,
        'bike': 1,
        'bus': 2,
        'metro': 3,
        'car': 4
    }

    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
        self.scaler = StandardScaler()
        self._train_baseline_model()

    def _train_baseline_model(self):
        """
        Synthesizes a representative IMD meteorological & persona dataset
        to train the initial weights.
        """
        np.random.seed(42)
        n_samples = 1500

        # Features
        temp = np.random.uniform(15, 48, n_samples)
        humidity = np.random.uniform(20, 100, n_samples)
        wind_speed = np.random.uniform(5, 85, n_samples)
        rain_prob = np.random.uniform(0, 100, n_samples)
        aqi = np.random.uniform(30, 450, n_samples)
        uv_index = np.random.uniform(1, 12, n_samples)
        user_type = np.random.randint(0, 6, n_samples)
        commute_mode = np.random.randint(0, 5, n_samples)
        hour = np.random.randint(0, 24, n_samples)

        X = np.column_stack([temp, humidity, wind_speed, rain_prob, aqi, uv_index, user_type, commute_mode, hour])

        # Ground truth generation logic
        y = np.zeros(n_samples, dtype=int)
        for i in range(n_samples):
            score = 0
            # Wind / Squall
            if wind_speed[i] > 60: score += 40
            elif wind_speed[i] > 35: score += 20

            # Rain / Commute
            if rain_prob[i] > 80:
                score += 35 if commute_mode[i] in [0, 1] else 20
            
            # Heatwave / Loo
            if temp[i] > 40:
                score += 35 if user_type[i] == 3 else 20 # outdoor worker higher risk
            
            # AQI
            if aqi[i] > 250: score += 25

            # Class determination
            if score >= 70: y[i] = 3 # Severe
            elif score >= 45: y[i] = 2 # High
            elif score >= 20: y[i] = 1 # Moderate
            else: y[i] = 0 # Low

        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)

    def predict(self, temp: float, humidity: float, wind_speed: float, rain_prob: float, 
                aqi: float, uv_index: float, user_type: str, commute_mode: str = 'metro', hour: int = 12):
        u_code = self.USER_TYPE_MAP.get(user_type, 5)
        c_code = self.COMMUTE_MODE_MAP.get(commute_mode, 3)

        features = np.array([[temp, humidity, wind_speed, rain_prob, aqi, uv_index, u_code, c_code, hour]])
        scaled = self.scaler.transform(features)
        
        pred_class = int(self.model.predict(scaled)[0])
        probabilities = self.model.predict_proba(scaled)[0]

        return {
            'risk_level': self.LABEL_MAP[pred_class],
            'risk_code': pred_class,
            'confidence': float(np.max(probabilities)),
            'class_probabilities': {
                self.LABEL_MAP[i]: float(probabilities[i]) for i in range(len(probabilities))
            }
        }

if __name__ == '__main__':
    clf = WeatherRiskClassifier()
    # Test case 1: Delhi monsoon heavy downpour for a two-wheeler student
    res = clf.predict(temp=23.0, humidity=94.0, wind_speed=38.0, rain_prob=92.0, aqi=32.0, uv_index=2.0, user_type='student', commute_mode='bike', hour=17)
    print("Delhi Monsoon Bike Commute Risk:", res)
