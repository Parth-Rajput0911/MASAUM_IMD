export type UserType = 
  | 'student' 
  | 'office_worker' 
  | 'farmer' 
  | 'traveller' 
  | 'outdoor_worker' 
  | 'general_user';

export type WeatherInterest = 
  | 'rain' 
  | 'temperature' 
  | 'aqi' 
  | 'uv' 
  | 'severe_weather' 
  | 'agriculture';

export type LocationType = 'home' | 'college' | 'office' | 'village' | 'destination' | 'other';

export interface SavedLocation {
  id: string;
  name: string;
  type: LocationType;
  city: string;
  state: string;
  lat: number;
  lon: number;
  isCurrent?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  userType: UserType;
  interests: WeatherInterest[];
  savedLocations: SavedLocation[];
  activeLocationId: string;
  language: 'en' | 'hi';
  notificationsEnabled: boolean;
  locationPermission: boolean;
  commuteProfile?: {
    originLocationId: string;
    destinationLocationId: string;
    preferredMode: 'metro' | 'bike' | 'car' | 'bus' | 'walk';
    morningDeparture: string; // "08:30"
    eveningDeparture: string; // "17:30"
  };
  privacySettings?: {
    allowLocationTracking: boolean;
    saveInteractionHistory: boolean;
  };
}

export interface WeatherCondition {
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number; // km/h
  windDirection: string;
  pressure: number; // hPa
  rainProb: number; // percentage 0-100
  rainfallMm: number;
  aqi: number;
  aqiStatus: 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  uvIndex: number;
  uvStatus: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme';
  visibility: number; // km
  condition: 'Clear' | 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Light Rain' | 'Heavy Rain' | 'Thunderstorm' | 'Heatwave' | 'Haze';
  conditionText: string;
  conditionTextHi: string;
  sunrise: string;
  sunset: string;
  timestamp: string;
}

export interface HourlyForecastItem {
  time: string;
  temp: number;
  feelsLike: number;
  rainProb: number;
  condition: string;
  icon: string;
  isCurrentHour?: boolean;
}

export interface DailyForecastItem {
  date: string;
  day: string;
  dayHi: string;
  maxTemp: number;
  minTemp: number;
  rainProb: number;
  condition: string;
  icon: string;
}

export interface WeatherAlert {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  severity: 'red' | 'orange' | 'yellow' | 'green';
  category: 'rain' | 'heatwave' | 'thunderstorm' | 'aqi' | 'wind' | 'flood';
  locationName: string;
  severityScore: number; // 1-10
  locationScore: number; // 1-10
  userRelevanceScore: number; // 1-10
  totalPriority: number; // Severity + Location + User Relevance
  issuedAt: string;
  validUntil: string;
  safetyInstructions: string[];
  safetyInstructionsHi: string[];
  safetyActions?: string[];
  userRelevanceReason?: string;
  userRelevanceReasonHi?: string;
  type?: string;
  impactedUserTypes: UserType[];
}

export interface SmartCommuteData {
  origin: string;
  destination: string;
  morningTime: string;
  eveningTime: string;
  distanceKm: number;
  estDurationMin: number;
  routeRainProbability: number;
  travelRisk: 'Low' | 'Moderate' | 'High' | 'Severe';
  recommendedDepartureTime: string;
  timeShiftReason: string;
  recommendationText: string;
  recommendationTextHi: string;
  routeHazards: string[];
}

export interface WeatherRiskScore {
  overallScore: number; // 0-100
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  color: string;
  heatRisk: number;
  commuteRisk: number;
  stormRisk: number;
  aqiRisk: number;
  uvRisk: number;
  agriRisk: number;
  summary: string;
  summaryHi: string;
}

export interface PersonalizedRecommendation {
  id: string;
  icon: string;
  title: string;
  titleHi: string;
  action: string;
  actionHi: string;
  priority: 'urgent' | 'important' | 'info';
  category: 'commute' | 'health' | 'farming' | 'outdoor' | 'attire';
  badgeText?: string;
}

export interface AISummary {
  headline: string;
  headlineHi: string;
  explanation: string;
  explanationHi: string;
  meaningForUser: string;
  meaningForUserHi: string;
  recommendedAction: string;
  recommendedActionHi: string;
  contextTag: string;
}

export type WeatherScenarioMode = 'normal' | 'heavy_rain' | 'heatwave' | 'severe';

export type LifeDomain = 
  | 'overview'
  | 'health' 
  | 'fitness' 
  | 'marine' 
  | 'travel' 
  | 'family' 
  | 'agri' 
  | 'commute' 
  | 'events';

export interface HealthWeatherMetrics {
  aqi: number;
  aqiStatus: string;
  pm25: number;
  pm10: number;
  pollenGrass: 'Low' | 'Moderate' | 'High' | 'Very High';
  pollenTree: 'Low' | 'Moderate' | 'High' | 'Very High';
  pollenWeed: 'Low' | 'Moderate' | 'High';
  uvIndex: number;
  uvStatus: string;
  humidity: number;
  asthmaRisk: 'Low' | 'Moderate' | 'High';
  skinSensitivityIndex: 'Safe' | 'Moderate UV Alert' | 'Extreme Sunburn Risk';
  guidance: string;
  guidanceHi: string;
}

export interface FitnessWeatherMetrics {
  sunrise: string;
  sunset: string;
  bestRunningHours: { time: string; score: number; note: string; status: 'optimal' | 'moderate' | 'avoid' }[];
  windSpeed: number;
  windGusts: number;
  heatStressAlert: 'None' | 'Caution' | 'Extreme Danger';
  hydrationRequirement: string; // e.g. "500ml per 45 min"
  workoutWindowText: string;
  workoutWindowTextHi: string;
}

export interface MarineSurfingMetrics {
  seaCondition: 'Calm' | 'Moderate' | 'Rough' | 'Very Rough';
  tideHigh: string;
  tideHighHeight: string;
  tideLow: string;
  tideLowHeight: string;
  waveHeightM: number;
  swellPeriodSec: number;
  waterTempC: number;
  portWarning: string;
  fishermenAdvisory: string;
  fishermenAdvisoryHi: string;
  surfQuality: 'Poor' | 'Fair' | 'Good' | 'Epic' | 'Dangerous';
}

export interface TravelWeatherMetrics {
  savedDestinations: {
    city: string;
    country: string;
    temp: number;
    condition: string;
    flightAlert: 'Normal' | 'Minor Delays' | 'Turbulence / Delay Risk';
    packingTip: string;
    packingTipHi: string;
  }[];
  flightAdvisory: string;
  flightAdvisoryHi: string;
  packingChecklist: string[];
}

export interface FamilyWeatherMetrics {
  schoolCommuteSafety: 'Safe' | 'Caution - Wet Roads' | 'Hazardous';
  morningBusStopRainProb: number; // %
  morningBusTime: string;
  afternoonPickupRainProb: number;
  playgroundSafetyIndex: 'Great for Outdoor Play' | 'Wet / Muddy' | 'Stay Indoors';
  childHydrationAdvisory: string;
  childHydrationAdvisoryHi: string;
  severeWarningSummary?: string;
}

export interface GardeningTask {
  id: string;
  task: string;
  taskHi: string;
  description: string;
  descriptionHi: string;
  urgency: 'critical' | 'high' | 'moderate' | 'routine';
  category: 'watering' | 'frost_protection' | 'indoor_care' | 'sowing' | 'soil';
  completed?: boolean;
}

export interface AgriGardeningMetrics {
  soilMoisturePct: number;
  fiveDayRainfallMm: number;
  frostRisk: 'None' | 'Low' | 'Moderate' | 'Frost Warning' | 'Critical Freeze';
  heatStressCrop: 'Normal' | 'Moderate' | 'Severe Wilting Risk';
  spraySuitability: 'Safe to Spray' | 'Delay Spraying (Rain Wash-off)' | 'High Wind Drift';
  plantingGuidance: string;
  plantingGuidanceHi: string;
  agrometBulletin: string;
  // Soil moisture depth estimates
  topsoilMoisturePct?: number;
  rootZoneMoisturePct?: number;
  evapotranspirationMm?: number;
  // Frost alerts
  predictedMinTemp?: number;
  frostWarningActive?: boolean;
  frostAdvisory?: string;
  frostAdvisoryHi?: string;
  // Dynamic seasonal tasks
  suggestedTasks?: GardeningTask[];
}

export interface CommuterHighwayMetrics {
  highwayVisibilityKm: number;
  visibilityStatus: 'Clear' | 'Moderate Fog/Haze' | 'Dense Rain Spray' | 'Zero Visibility';
  nhaiNowcastWarning: string;
  trafficDelayMultiplier: string; // e.g. "+35% Transit Delay"
  underpassFloodRisk: 'Safe' | 'Moderate Ponding' | 'High Waterlogging Risk';
  corridorAlert: string;
  corridorAlertHi: string;
}

export interface EventPlannerMetrics {
  rainProbabilityCurve: { time: string; prob: number }[];
  comfortIndex: number; // 0-100 (Humidex / WBGT / Tri-Factor)
  comfortLevel: 'Ideal Outdoor Weather' | 'Pleasant' | 'Humid & Sticky' | 'High Heat Discomfort';
  tempFactorScore?: number;
  windFactorScore?: number;
  humidityFactorScore?: number;
  apparentTemp?: number;
  factorsSummary?: string;
  factorsSummaryHi?: string;
  backupIndoorAdvisory: string;
  backupIndoorAdvisoryHi: string;
  goldenHourPhotoTime: string;
  tentWindRequirement: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  language: 'en' | 'hi';
  timestamp: string;
  suggestedFollowUps?: string[];
  weatherWidget?: {
    location: string;
    temp: number;
    condition: string;
    rainProb: number;
  };
}
