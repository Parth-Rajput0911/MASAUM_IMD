-- =========================================================================
-- Mausam AI: Mobile Application Database Schema
-- Architecture: Personalized Homepage for 'Mausam' Mobile Application
-- RDBMS: MySQL 8.0+
-- =========================================================================

CREATE DATABASE IF NOT EXISTS mausam_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mausam_ai;

-- 1. Users Table (Core Auth & Profile)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL UNIQUE,
    firebase_uid VARCHAR(128) UNIQUE,
    user_type ENUM('student', 'office_worker', 'farmer', 'outdoor_worker', 'traveller', 'general_user') NOT NULL DEFAULT 'general_user',
    language VARCHAR(8) DEFAULT 'en',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    location_permission BOOLEAN DEFAULT TRUE,
    save_interaction_history BOOLEAN DEFAULT TRUE,
    active_location_id VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. User Weather Interests (Normalized Many-to-One)
CREATE TABLE IF NOT EXISTS user_interests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    interest VARCHAR(32) NOT NULL,
    priority_weight DECIMAL(3, 2) DEFAULT 1.00,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_interest (user_id, interest)
);

-- 3. Saved Locations Table (Home, College, Office, Village, Travel Destination)
CREATE TABLE IF NOT EXISTS saved_locations (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    name VARCHAR(128) NOT NULL,
    location_type ENUM('home', 'college', 'office', 'village', 'destination') NOT NULL,
    city VARCHAR(64) NOT NULL,
    state VARCHAR(64) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. User Commute Profile (Origin, Destination, Times, Mode)
CREATE TABLE IF NOT EXISTS user_commute_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL UNIQUE,
    origin_location_id VARCHAR(64) NOT NULL,
    destination_location_id VARCHAR(64) NOT NULL,
    preferred_mode ENUM('metro', 'bus', 'bike', 'car', 'walk') DEFAULT 'metro',
    morning_departure TIME NOT NULL DEFAULT '08:30:00',
    evening_departure TIME NOT NULL DEFAULT '17:30:00',
    distance_km DECIMAL(5, 2) DEFAULT 12.5,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (origin_location_id) REFERENCES saved_locations(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_location_id) REFERENCES saved_locations(id) ON DELETE CASCADE
);

-- 5. Weather Cache Table (Current conditions cached from IMD APIs)
CREATE TABLE IF NOT EXISTS weather_cache (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(64) NOT NULL,
    latitude DECIMAL(10, 7) NOT NULL,
    longitude DECIMAL(10, 7) NOT NULL,
    temp DECIMAL(4, 1) NOT NULL,
    feels_like DECIMAL(4, 1) NOT NULL,
    temp_min DECIMAL(4, 1),
    temp_max DECIMAL(4, 1),
    humidity INT NOT NULL,
    wind_speed DECIMAL(4, 1) NOT NULL,
    wind_direction VARCHAR(8),
    pressure INT NOT NULL,
    rain_prob INT NOT NULL,
    rainfall_mm DECIMAL(5, 1) DEFAULT 0.0,
    aqi INT NOT NULL,
    aqi_status VARCHAR(32) NOT NULL,
    uv_index INT NOT NULL,
    uv_status VARCHAR(32) NOT NULL,
    condition_text VARCHAR(128) NOT NULL,
    condition_text_hi VARCHAR(256),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_city_time (city, recorded_at)
);

-- 6. Meteorological Alerts Table
CREATE TABLE IF NOT EXISTS weather_alerts (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    title_hi VARCHAR(256),
    description TEXT NOT NULL,
    description_hi TEXT,
    severity ENUM('red', 'orange', 'yellow', 'green') NOT NULL,
    category ENUM('rain', 'heatwave', 'thunderstorm', 'aqi', 'wind', 'flood') NOT NULL,
    location_name VARCHAR(128) NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    severity_score INT NOT NULL, -- 1-10
    location_score INT NOT NULL, -- 1-10
    base_relevance_score INT NOT NULL, -- 1-10
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP NOT NULL,
    safety_instructions JSON NOT NULL,
    safety_instructions_hi JSON
);

-- 7. User Interactions & Telemetry (For AI Model Reinforcement)
CREATE TABLE IF NOT EXISTS interaction_telemetry (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    event_type VARCHAR(64) NOT NULL, -- 'view_alert', 'query_ai', 'check_commute', 'click_radar'
    payload JSON,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_event (user_id, event_type)
);
