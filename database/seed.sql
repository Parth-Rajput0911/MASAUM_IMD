-- =========================================================================
-- Mausam AI: Mobile Application Database Seed Data
-- =========================================================================

USE mausam_ai;

-- 1. Insert Initial Personas
INSERT INTO users (id, name, email, firebase_uid, user_type, language, active_location_id)
VALUES
('usr_student_01', 'Aarav Sharma', 'aarav.student@delhi.edu.in', 'fb_uid_student_01', 'student', 'en', 'loc_delhi_home'),
('usr_farmer_02', 'Gurpreet Singh', 'gurpreet.kisan@punjab.gov.in', 'fb_uid_farmer_02', 'farmer', 'hi', 'loc_punjab_farm'),
('usr_office_03', 'Priya Narayanan', 'priya.n@techcorp.com', 'fb_uid_office_03', 'office_worker', 'en', 'loc_bengaluru_home'),
('usr_outdoor_04', 'Ramesh Patel', 'ramesh.delivery@express.in', 'fb_uid_outdoor_04', 'outdoor_worker', 'hi', 'loc_mumbai_home'),
('usr_traveller_05', 'Sneha Roy', 'sneha.wander@travel.com', 'fb_uid_traveller_05', 'traveller', 'en', 'loc_manali_dest');

-- 2. Insert Saved Locations
INSERT INTO saved_locations (id, user_id, name, location_type, city, state, latitude, longitude, is_current)
VALUES
('loc_delhi_home', 'usr_student_01', 'Home (Mayur Vihar)', 'home', 'New Delhi', 'Delhi', 28.6083000, 77.2995000, TRUE),
('loc_delhi_college', 'usr_student_01', 'North Campus DU', 'college', 'New Delhi', 'Delhi', 28.6904000, 77.2072000, FALSE),
('loc_punjab_farm', 'usr_farmer_02', 'Village Farm (Ludhiana)', 'village', 'Ludhiana', 'Punjab', 30.9010000, 75.8573000, TRUE),
('loc_punjab_home', 'usr_farmer_02', 'City Residence (Model Town)', 'home', 'Ludhiana', 'Punjab', 30.8920000, 75.8390000, FALSE),
('loc_bengaluru_home', 'usr_office_03', 'Home (Indiranagar)', 'home', 'Bengaluru', 'Karnataka', 12.9784000, 77.6408000, TRUE),
('loc_bengaluru_office', 'usr_office_03', 'Tech Park (Electronic City)', 'office', 'Bengaluru', 'Karnataka', 12.8399000, 77.6770000, FALSE),
('loc_mumbai_home', 'usr_outdoor_04', 'Home (Andheri East)', 'home', 'Mumbai', 'Maharashtra', 19.1136000, 72.8697000, TRUE),
('loc_manali_dest', 'usr_traveller_05', 'Solang Valley Retreat', 'destination', 'Manali', 'Himachal Pradesh', 32.2396000, 77.1887000, TRUE);

-- 3. Insert Commute Profiles
INSERT INTO user_commute_profiles (user_id, origin_location_id, destination_location_id, preferred_mode, morning_departure, evening_departure, distance_km)
VALUES
('usr_student_01', 'loc_delhi_home', 'loc_delhi_college', 'metro', '08:15:00', '17:30:00', 16.5),
('usr_farmer_02', 'loc_punjab_home', 'loc_punjab_farm', 'bike', '05:30:00', '18:30:00', 8.2),
('usr_office_03', 'loc_bengaluru_home', 'loc_bengaluru_office', 'bike', '08:45:00', '18:15:00', 18.0);

-- 4. Insert Weather Alerts
INSERT INTO weather_alerts (id, title, titleHi, description, descriptionHi, severity, category, location_name, severity_score, location_score, base_relevance_score, valid_until, safety_instructions)
VALUES
('alt_rain_delhi', 'IMD Orange Alert: Heavy Rain & Severe Commute Disruption', 'मौसम विभाग ऑरेंज अलर्ट: भारी बारिश एवं जलभराव चेतावनी', 'Intense rainfall 65-95mm expected. Submerged underpasses and significant transit slowdown.', '65-95 मिमी भारी बारिश की आशंका। अंडरपासों में जलभराव और भारी ट्रैफिक जाम।', 'orange', 'rain', 'New Delhi NCR', 8, 9, 9, DATE_ADD(NOW(), INTERVAL 6 HOUR), '["Carry umbrella and waterproof pouch", "Avoid Minto Bridge underpass", "Check metro line status"]');
