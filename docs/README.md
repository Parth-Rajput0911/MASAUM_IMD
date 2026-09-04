# 🌦️ Mausam AI — Personalized Weather Intelligence Mobile Application

> **Core Philosophy:**
> *“Mausam doesn’t just tell users the weather — it tells them what the weather means for them.”*

---

## 🌟 Executive Summary & Core Innovation
Traditional weather apps show raw numerical figures: *“31°C, 88% humidity, 15 km/h wind”*. For everyday citizens, this creates cognitive friction. A college student riding a motorcycle needs to know if their books will get wet; a wheat farmer needs to know if today is safe for urea pesticide spraying; a logistics delivery courier needs thermal heat alerts during afternoon loo winds.

**Mausam AI** transforms the homepage of meteorological mobile applications into a context-aware, user-centric **Weather Intelligence Dashboard**.

---

## 🏗️ 3-Tier Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ 1. FRONTEND: React Native / React + Tailwind CSS            │
│    - Dynamic Weather Hero (Adapts styling to condition)     │
│    - Smart Commute Route Intelligence Card                  │
│    - Interactive Animated Doppler Radar & Flood Map         │
│    - Personalized Explainable Risk Gauge (0-100)            │
│    - AI Assistant with Voice Speech-to-Text & Hindi/English │
├─────────────────────────────────────────────────────────────┤
│ 2. BACKEND & INTEGRATION: Python FastAPI / Express REST API  │
│    - /api/weather/current (IMD Live Stations & Simulator)   │
│    - /api/alerts (Prioritized geofenced meteorological tags)│
│    - /api/risk-score (Persona-weighted vulnerability engine)│
│    - /api/commute (Route precipitation & time shift advice) │
│    - /api/chat (Grounding with Gemini 3.8 Flash)            │
├─────────────────────────────────────────────────────────────┤
│ 3. AI / ML & DATA LAYER: Scikit-learn + Pandas + MySQL      │
│    - Multi-Hazard Random Forest Risk Classifier             │
│    - Relevance Ranker: Severity + Location + User Relevance │
│    - MySQL 8.0 Normalized Relational Database               │
│    - Firebase Auth & Cloud Messaging Notification Dispatch  │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 The Core AI/ML Formulas

### 1. Alert Prioritization Formula (0 - 30 Points)
Every incoming alert is ranked specifically for the authenticated user using:
$$\text{Alert Priority} = \text{Severity} (0\text{–}10) + \text{Location Match} (0\text{–}10) + \text{User Relevance} (0\text{–}10)$$
- **Severity**: Meteorological threshold (Red = 10, Orange = 7-8, Yellow = 4-6, Green = 1-3).
- **Location Match**: Proximity to current GPS or saved route points (Within 5km = 10, 15km = 8, 30km = 5).
- **User Relevance**: Correlation to user profile (e.g. *Rain* for bike commuter = 9.5; *Rain* for work-from-home = 5.0).

### 2. Composite Weather Risk Metric (0 - 100 Gauge)
Calculated via persona-weighted linear combinations:
$$\text{Risk Score} = \sum w_i \cdot R_i$$
- **Student**: $0.45 \times \text{Commute} + 0.25 \times \text{Storm} + 0.20 \times \text{AQI} + 0.10 \times \text{UV}$
- **Farmer**: $0.45 \times \text{Agri/Hail} + 0.25 \times \text{Storm} + 0.15 \times \text{Heat} + 0.15 \times \text{Commute}$
- **Outdoor Worker**: $0.35 \times \text{Heat/Loo} + 0.30 \times \text{UV} + 0.20 \times \text{Storm} + 0.15 \times \text{Commute}$

---

## 📱 Supported Personas
1. **Student** (*Aarav Sharma*): Daily metro/bike commute between home and university, backpack protection, campus rain alerts.
2. **Farmer** (*Gurpreet Singh*): Crop-specific advisories (pesticide wash-off warnings, hailstorm shelter, soil moisture).
3. **Office Worker** (*Priya Narayanan*): Transit delays, cab surge warnings, waterlogged underpasses, evening return advice.
4. **Outdoor Worker** (*Ramesh Patel*): Severe heat exhaustion protection, dehydration reminders, hydration break schedules.
5. **Traveller** (*Sneha Roy*): Destination hill-station weather (Manali landslides, heavy downpour, route clearance).
6. **General User** (*Vikram Joshi*): Family health, morning jogging AQI, laundry drying weather.

---

## ⚡ Quick Start & Run Commands

### 1. Web Interactive Prototype (Live in AI Studio)
```bash
npm install
npm run build
npm run dev
# Open http://localhost:3000 in your browser
```

### 2. Python FastAPI Backend Service
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Run AI/ML Scikit-Learn Tests
```bash
cd ai_ml
python risk_classifier.py
python relevance_ranker.py
```

### 4. Run Unit Test Suite
```bash
pytest tests/
```

---

## 📋 Feature & Architecture Checklist
- [x] Context-aware dynamic homepage layout
- [x] Pinned favorite location quick weather preview card
- [x] 8 Specialized Life Domain Modules:
  - 🩺 **Health-conscious users**: AQI, PM2.5/PM10, Pollen counts (Grass/Tree/Weed), UV Index, Asthma & Skin sensitivity index
  - 🏃 **Outdoor fitness enthusiasts**: Sunrise/sunset times, 'Best running hours' scoring timeline, wind speed & heat strain alerts
  - 🌊 **Beachgoers & surfers**: Sea conditions, tide timings (High/Low tides), wave height, water temp, port & fishermen warnings
  - ✈️ **Travelers**: Saved destination quick glance, flight delay/turbulence weather alerts, smart packing recommendations & checklist
  - 🎒 **Parents & families**: School commute road conditions, morning bus stop rain alerts, playground safety index, pediatric advice
  - 🌾 **Agriculture & gardeners**: Soil moisture %, 5-day rainfall predictions, frost/heat warnings, foliar spray suitability & Agromet guidance
  - 🚗 **Commuters**: Weather integrated with traffic updates, visibility conditions (fog/smog km), underpass flooding alerts & NHAI nowcast
  - 🎪 **Event planners**: Extended rainfall probability curve, outdoor Comfort Index (WBGT), marquee wind limits & photography golden hour
- [x] Multi-persona personalization engine
- [x] Bilingual English & Hindi support across all components
- [x] Voice query with speech-to-text and audio readout
- [x] Integrated 28 IMD & NHAI API feeds (Forecast, Nowcast, Warnings, Marine, Cyclone, RADAR, Agromet)
- [x] Leaflet interactive Doppler Radar & precipitation map
- [x] Normalized MySQL DDL schema and seed files
- [x] RESTful API endpoints for seamless mobile integration
