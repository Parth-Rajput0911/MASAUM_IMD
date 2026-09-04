import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { DEFAULT_USERS, SCENARIO_WEATHER, generateHourlyForecast, generateDailyForecast } from './src/data/mockData.ts';
import { 
  calculateWeatherRiskScore, 
  generatePersonalizedAlerts, 
  generateSmartCommute, 
  generatePersonalizedRecommendations, 
  generateAISummary 
} from './src/services/personalizationEngine.ts';
import { WeatherScenarioMode, UserProfile } from './src/types.ts';
import {
  getHealthMetrics,
  getFitnessMetrics,
  getMarineMetrics,
  getTravelMetrics,
  getFamilyMetrics,
  getAgriMetrics,
  getCommuterMetrics,
  getEventMetrics
} from './src/data/domainData.ts';

dotenv.config();

const PORT = 3000;
let currentScenario: WeatherScenarioMode = 'heavy_rain'; // default to heavy_rain to showcase weather intelligence & commute alerts
let currentUserType = 'student';

// Server-side lazy Gemini initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (e) {
      console.warn('Could not initialize GoogleGenAI client:', e);
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // In-memory runtime state for demo user
  let activeUser: UserProfile = JSON.parse(JSON.stringify(DEFAULT_USERS.student));

  // ================= REST API ROUTES =================

  // 1. Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Mausam AI Engine',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      scenario: currentScenario,
      userType: activeUser.userType,
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // 2. Authentication APIs
  app.post('/api/auth/login', (req, res) => {
    const { email, userType } = req.body;
    if (userType && DEFAULT_USERS[userType]) {
      activeUser = JSON.parse(JSON.stringify(DEFAULT_USERS[userType]));
    }
    if (email) {
      activeUser.email = email;
    }
    res.json({
      success: true,
      token: 'jwt_firebase_simulated_token_' + Date.now(),
      user: activeUser
    });
  });

  app.post('/api/auth/signup', (req, res) => {
    const { name, email, userType, interests, savedLocations } = req.body;
    if (userType && DEFAULT_USERS[userType]) {
      activeUser = JSON.parse(JSON.stringify(DEFAULT_USERS[userType]));
    }
    if (name) activeUser.name = name;
    if (email) activeUser.email = email;
    if (userType) activeUser.userType = userType;
    if (interests && Array.isArray(interests)) activeUser.interests = interests;
    if (savedLocations && Array.isArray(savedLocations)) activeUser.savedLocations = savedLocations;

    res.json({
      success: true,
      token: 'jwt_firebase_simulated_token_' + Date.now(),
      user: activeUser
    });
  });

  // 3. User & Preferences APIs
  app.get('/api/users/profile', (req, res) => {
    res.json({ success: true, user: activeUser });
  });

  app.put('/api/users/profile', (req, res) => {
    const updates = req.body;
    activeUser = { ...activeUser, ...updates };
    res.json({ success: true, user: activeUser });
  });

  app.put('/api/users/preferences', (req, res) => {
    const { interests, language, notificationsEnabled, locationPermission } = req.body;
    if (interests) activeUser.interests = interests;
    if (language) activeUser.language = language;
    if (notificationsEnabled !== undefined) activeUser.notificationsEnabled = notificationsEnabled;
    if (locationPermission !== undefined) activeUser.locationPermission = locationPermission;
    res.json({ success: true, user: activeUser });
  });

  app.get('/api/users/locations', (req, res) => {
    res.json({ success: true, locations: activeUser.savedLocations });
  });

  app.post('/api/users/locations', (req, res) => {
    const newLoc = req.body;
    if (!newLoc.id) newLoc.id = 'loc_' + Date.now();
    activeUser.savedLocations.push(newLoc);
    res.json({ success: true, locations: activeUser.savedLocations, added: newLoc });
  });

  app.put('/api/users/active-location', (req, res) => {
    const { locationId } = req.body;
    if (locationId) {
      activeUser.activeLocationId = locationId;
      activeUser.savedLocations.forEach(l => {
        l.isCurrent = (l.id === locationId);
      });
    }
    res.json({ success: true, activeLocationId: activeUser.activeLocationId });
  });

  // Switch persona helper for Demo
  app.post('/api/users/switch-persona', (req, res) => {
    const { persona } = req.body;
    if (persona && DEFAULT_USERS[persona]) {
      activeUser = JSON.parse(JSON.stringify(DEFAULT_USERS[persona]));
      currentUserType = persona;
    }
    res.json({ success: true, user: activeUser });
  });

  // 4. Scenario Simulation Controller (for condition testing)
  app.get('/api/simulation/scenario', (req, res) => {
    res.json({ scenario: currentScenario });
  });

  app.post('/api/simulation/scenario', (req, res) => {
    const { scenario } = req.body;
    if (['normal', 'heavy_rain', 'heatwave', 'severe'].includes(scenario)) {
      currentScenario = scenario;
    }
    res.json({ success: true, scenario: currentScenario });
  });

  // 5. Weather APIs (Mausam / IMD compatible)
  app.get('/api/weather/current', (req, res) => {
    const weather = SCENARIO_WEATHER[currentScenario];
    const activeLoc = activeUser.savedLocations.find(l => l.id === activeUser.activeLocationId) || activeUser.savedLocations[0];
    res.json({
      success: true,
      location: activeLoc,
      scenario: currentScenario,
      data: weather
    });
  });

  app.get('/api/weather/forecast', (req, res) => {
    const hourly = generateHourlyForecast(currentScenario);
    const daily = generateDailyForecast(currentScenario);
    res.json({
      success: true,
      scenario: currentScenario,
      hourly,
      daily
    });
  });

  app.get('/api/weather/smart-commute', (req, res) => {
    const weather = SCENARIO_WEATHER[currentScenario];
    const commute = generateSmartCommute(activeUser, weather, currentScenario);
    res.json({ success: true, commute });
  });

  // 6. Alerts API (Severity + Location + User Relevance = Alert Priority)
  app.get('/api/alerts', (req, res) => {
    const weather = SCENARIO_WEATHER[currentScenario];
    const alerts = generatePersonalizedAlerts(activeUser, weather, currentScenario);
    res.json({
      success: true,
      principle: 'Severity + Location + User Relevance = Alert Priority',
      alerts
    });
  });

  // 7. Recommendations API (AI-personalized per user persona)
  app.get('/api/recommendations', (req, res) => {
    const weather = SCENARIO_WEATHER[currentScenario];
    const recommendations = generatePersonalizedRecommendations(activeUser, weather, currentScenario);
    res.json({ success: true, recommendations });
  });

  // 8. Weather Risk Score API
  app.get('/api/risk-score', (req, res) => {
    const weather = SCENARIO_WEATHER[currentScenario];
    const riskScore = calculateWeatherRiskScore(activeUser, weather, currentScenario);
    res.json({ success: true, riskScore });
  });

  // 9. AI Summary ("What the weather means for you")
  app.get('/api/summary', (req, res) => {
    const weather = SCENARIO_WEATHER[currentScenario];
    const summary = generateAISummary(activeUser, weather, currentScenario);
    res.json({ success: true, summary });
  });

  // 9.5 Life Domain Intelligence API (8 Specific Profiles: Health, Fitness, Marine, Travel, Family, Agri, Commuter, Events)
  app.get('/api/domain-intelligence', (req, res) => {
    const domain = (req.query.domain as string) || 'health';
    const data = {
      health: getHealthMetrics(currentScenario),
      fitness: getFitnessMetrics(currentScenario),
      marine: getMarineMetrics(currentScenario),
      travel: getTravelMetrics(currentScenario),
      family: getFamilyMetrics(currentScenario),
      agri: getAgriMetrics(currentScenario),
      commute: getCommuterMetrics(currentScenario),
      events: getEventMetrics(currentScenario)
    };
    res.json({
      success: true,
      domain,
      scenario: currentScenario,
      timestamp: new Date().toISOString(),
      payload: (data as any)[domain] || data.health,
      allDomains: data
    });
  });

  // 10. AI Assistant Chat Endpoint (Gemini 3.8 Flash with full weather grounding & fallback)
  app.post('/api/ai-chat', async (req, res) => {
    const { query, language = 'en' } = req.body;
    const weather = SCENARIO_WEATHER[currentScenario];
    const activeLoc = activeUser.savedLocations.find(l => l.id === activeUser.activeLocationId) || activeUser.savedLocations[0];
    
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query string is required' });
      return;
    }

    const lowerQuery = query.toLowerCase();
    const isHindi = language === 'hi' || lowerQuery.includes('kya') || lowerQuery.includes('barish') || lowerQuery.includes('mausam');

    // Check Gemini API
    const ai = getGeminiClient();
    if (ai && process.env.GEMINI_API_KEY) {
      try {
        const prompt = `You are Mausam AI, the intelligent personalized meteorological assistant for the Mausam mobile application.
The user profile is:
- Name: ${activeUser.name}
- Persona/Role: ${activeUser.userType}
- Location: ${activeLoc.name} (${activeLoc.city}, ${activeLoc.state})
- Weather Interests: ${activeUser.interests.join(', ')}
- Current Condition: ${weather.condition} (${weather.temp}°C, feels like ${weather.feelsLike}°C, humidity ${weather.humidity}%, rain probability ${weather.rainProb}%, AQI ${weather.aqi} - ${weather.aqiStatus}, UV ${weather.uvIndex} - ${weather.uvStatus}, wind ${weather.windSpeed} km/h)
- Scenario Mode: ${currentScenario}
- Commute: ${activeUser.commuteProfile?.originLocationId} to ${activeUser.commuteProfile?.destinationLocationId} via ${activeUser.commuteProfile?.preferredMode || 'metro'}

USER QUERY: "${query}"
LANGUAGE: ${isHindi ? 'Hindi (हिंदी)' : 'English'}

CORE INSTRUCTION:
Explain what the weather means specifically for this user (${activeUser.userType}), their routine, their health/commute, and actionable advice.
Respond in a friendly, crisp, expert tone in 2 to 4 concise sentences. If Hindi, use natural Devanagari Hindi.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        const replyText = response.text || '';
        res.json({
          success: true,
          source: 'gemini-3.8-flash',
          reply: replyText.trim(),
          language: isHindi ? 'hi' : 'en',
          suggestedFollowUps: isHindi ? [
            'क्या शाम को छाता ले जाना चाहिए?',
            'कॉलेज जाने का सबसे अच्छा समय?',
            'कल का मौसम कैसा रहेगा?'
          ] : [
            'Should I carry an umbrella today?',
            'What is the best commute time?',
            'What is the AQI health advice?'
          ]
        });
        return;
      } catch (err) {
        console.error('Gemini call failed, falling back to local Mausam AI rule engine:', err);
      }
    }

    // High-fidelity fallback rule engine
    let reply = '';
    const followUps = isHindi ? [
      'क्या मुझे छाता ले जाना चाहिए?',
      'मेरे कॉलेज का मौसम कैसा है?',
      'कल का तापमान कैसा रहेगा?'
    ] : [
      'Will it rain during my evening commute?',
      'Should I carry an umbrella?',
      'What is the weather at my college?'
    ];

    if (lowerQuery.includes('rain') || lowerQuery.includes('barish') || lowerQuery.includes('baaris')) {
      if (weather.rainProb >= 60) {
        reply = isHindi 
          ? `हां, आज ${activeLoc.city} में बारिश की संभावना ${weather.rainProb}% है। विशेषकर शाम के समय तेज बारिश हो सकती है, इसलिए छाता या रेनकोट अवश्य साथ रखें।`
          : `Yes, rain is very likely today in ${activeLoc.city} with a ${weather.rainProb}% probability. High precipitation is expected during evening transit hours; make sure to carry an umbrella or rainwear.`;
      } else {
        reply = isHindi
          ? `आज ${activeLoc.city} में बारिश की संभावना केवल ${weather.rainProb}% है। गंभीर बारिश की कोई संभावना नहीं है, दिन मुख्यतः साफ रहेगा।`
          : `Rain probability in ${activeLoc.city} is currently low at ${weather.rainProb}%. Severe rainfall is not expected today.`;
      }
    } else if (lowerQuery.includes('umbrella') || lowerQuery.includes('chata') || lowerQuery.includes('chaata')) {
      if (weather.rainProb >= 50 || weather.uvIndex >= 9) {
        reply = isHindi
          ? (weather.rainProb >= 50 
              ? `निश्चित रूप से! आज ${weather.rainProb}% बारिश का अनुमान है। शाम के समय भीगने से बचने के लिए छाता साथ रखना अनिवार्य है।` 
              : `हां! भले ही बारिश न हो, लेकिन यूवी इंडेक्स ${weather.uvIndex} (अत्यधिक) है। तेज धूप और लू से सिर को बचाने के लिए छाता मददगार रहेगा।`)
          : `Definitely! With a ${weather.rainProb}% chance of rain and evening shower clusters, carrying a compact umbrella is strongly advised for your ${activeUser.userType} commute.`;
      } else {
        reply = isHindi
          ? `आज छाता ले जाने की विशेष आवश्यकता नहीं है। मौसम सुहावना है और बारिश की संभावना केवल ${weather.rainProb}% है।`
          : `You likely won't need an umbrella today. Rain probability is only ${weather.rainProb}% with partly cloudy skies.`;
      }
    } else if (lowerQuery.includes('college') || lowerQuery.includes('university') || lowerQuery.includes('campus')) {
      const collegeLoc = activeUser.savedLocations.find(l => l.type === 'college') || activeLoc;
      reply = isHindi
        ? `आपके कॉलेज (${collegeLoc.name}) में तापमान ${weather.temp}°C है और बारिश की संभावना ${weather.rainProb}% है। शाम को घर लौटते समय 20 मिनट का अतिरिक्त समय लेकर निकलें।`
        : `At your college (${collegeLoc.name}), the temperature is ${weather.temp}°C with ${weather.rainProb}% rain probability. Road and metro transit to campus is currently operating with moderate congestion.`;
    } else if (lowerQuery.includes('farm') || lowerQuery.includes('kisan') || lowerQuery.includes('crop') || lowerQuery.includes('fasal')) {
      reply = isHindi
        ? `किसान भाई: आज बारिश की संभावना ${weather.rainProb}% और आर्द्रता ${weather.humidity}% है। किसी भी कीटनाशक या यूरिया का छिड़काव न करें, दवा बह जाएगी। खेतों की जल निकासी नालियां खुली रखें।`
        : `Agricultural Advisory: Rain probability is ${weather.rainProb}% with ${weather.humidity}% humidity. Do not spray chemical fertilizers or pesticides today as surface runoff will wash away active ingredients. Clear drainage channels.`;
    } else if (lowerQuery.includes('aqi') || lowerQuery.includes('pollution') || lowerQuery.includes('hawa')) {
      reply = isHindi
        ? `${activeLoc.city} में वर्तमान AQI ${weather.aqi} (${weather.aqiStatus}) है। संवेदनशील व्यक्तियों और बच्चों को बाहर व्यायाम करते समय मास्क का उपयोग करना चाहिए।`
        : `Current AQI in ${activeLoc.city} is ${weather.aqi} (${weather.aqiStatus}). PM2.5 levels indicate ${weather.aqi > 200 ? 'poor ventilation; wear an N95 mask outdoors.' : 'acceptable atmospheric ventilation.'}`;
    } else {
      reply = isHindi
        ? `${activeUser.name} जी, वर्तमान में ${activeLoc.city} में तापमान ${weather.temp}°C (महसूस ${weather.feelsLike}°C) है। मौसम की स्थिति "${weather.conditionTextHi}" है। आपके लिए जोखिम स्कोर ${calculateWeatherRiskScore(activeUser, weather, currentScenario).overallScore}/100 है।`
        : `Hello ${activeUser.name}, currently in ${activeLoc.city} it is ${weather.temp}°C (feels like ${weather.feelsLike}°C) with ${weather.conditionText}. Your personalized weather risk score is ${calculateWeatherRiskScore(activeUser, weather, currentScenario).overallScore}/100.`;
    }

    res.json({
      success: true,
      source: 'mausam-rule-engine',
      reply,
      language: isHindi ? 'hi' : 'en',
      suggestedFollowUps: followUps
    });
  });

  // ================= VITE / STATIC MIDDLEWARE =================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mausam AI Server running on port ${PORT}`);
  });
}

startServer();
