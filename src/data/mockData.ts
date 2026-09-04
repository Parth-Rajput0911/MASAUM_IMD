import { UserProfile, WeatherCondition, WeatherScenarioMode, WeatherAlert, SmartCommuteData, WeatherRiskScore, PersonalizedRecommendation, AISummary, HourlyForecastItem, DailyForecastItem } from '../types';

export const DEFAULT_USERS: Record<string, UserProfile> = {
  student: {
    id: 'usr_student_01',
    name: 'Aarav Sharma',
    email: 'aarav.student@delhi.edu.in',
    userType: 'student',
    interests: ['rain', 'aqi', 'temperature'],
    activeLocationId: 'loc_home',
    savedLocations: [
      { id: 'loc_home', name: 'Home (Mayur Vihar)', type: 'home', city: 'New Delhi', state: 'Delhi', lat: 28.6083, lon: 77.2995, isCurrent: true },
      { id: 'loc_college', name: 'College (North Campus DU)', type: 'college', city: 'New Delhi', state: 'Delhi', lat: 28.6904, lon: 77.2072 },
      { id: 'loc_village', name: 'Ancestral Home (Alwar)', type: 'village', city: 'Alwar', state: 'Rajasthan', lat: 27.5530, lon: 76.6346 }
    ],
    language: 'en',
    notificationsEnabled: true,
    locationPermission: true,
    commuteProfile: {
      originLocationId: 'loc_home',
      destinationLocationId: 'loc_college',
      preferredMode: 'metro',
      morningDeparture: '08:15',
      eveningDeparture: '17:30'
    },
    privacySettings: {
      allowLocationTracking: true,
      saveInteractionHistory: true
    }
  },
  farmer: {
    id: 'usr_farmer_02',
    name: 'Gurpreet Singh',
    email: 'gurpreet.kisan@punjab.gov.in',
    userType: 'farmer',
    interests: ['rain', 'agriculture', 'temperature', 'severe_weather'],
    activeLocationId: 'loc_village',
    savedLocations: [
      { id: 'loc_village', name: 'Village Farm (Ludhiana)', type: 'village', city: 'Ludhiana', state: 'Punjab', lat: 30.9010, lon: 75.8573, isCurrent: true },
      { id: 'loc_home', name: 'City Residence (Model Town)', type: 'home', city: 'Ludhiana', state: 'Punjab', lat: 30.8920, lon: 75.8390 },
      { id: 'loc_market', name: 'Grain Mandi (Khanna)', type: 'office', city: 'Khanna', state: 'Punjab', lat: 30.7073, lon: 76.2166 }
    ],
    language: 'hi',
    notificationsEnabled: true,
    locationPermission: true,
    commuteProfile: {
      originLocationId: 'loc_home',
      destinationLocationId: 'loc_village',
      preferredMode: 'bike',
      morningDeparture: '05:30',
      eveningDeparture: '18:30'
    },
    privacySettings: {
      allowLocationTracking: true,
      saveInteractionHistory: true
    }
  },
  office_worker: {
    id: 'usr_office_03',
    name: 'Priya Narayanan',
    email: 'priya.n@techcorp.com',
    userType: 'office_worker',
    interests: ['rain', 'aqi', 'temperature'],
    activeLocationId: 'loc_home',
    savedLocations: [
      { id: 'loc_home', name: 'Home (Indiranagar)', type: 'home', city: 'Bengaluru', state: 'Karnataka', lat: 12.9784, lon: 77.6408, isCurrent: true },
      { id: 'loc_office', name: 'Tech Park (Electronic City)', type: 'office', city: 'Bengaluru', state: 'Karnataka', lat: 12.8399, lon: 77.6770 },
      { id: 'loc_dest', name: 'Weekend Retreat (Coorg)', type: 'destination', city: 'Madikeri', state: 'Karnataka', lat: 12.4244, lon: 75.7382 }
    ],
    language: 'en',
    notificationsEnabled: true,
    locationPermission: true,
    commuteProfile: {
      originLocationId: 'loc_home',
      destinationLocationId: 'loc_office',
      preferredMode: 'bike',
      morningDeparture: '08:45',
      eveningDeparture: '18:15'
    },
    privacySettings: {
      allowLocationTracking: true,
      saveInteractionHistory: true
    }
  },
  outdoor_worker: {
    id: 'usr_outdoor_04',
    name: 'Ramesh Patel',
    email: 'ramesh.delivery@express.in',
    userType: 'outdoor_worker',
    interests: ['uv', 'temperature', 'rain', 'severe_weather'],
    activeLocationId: 'loc_home',
    savedLocations: [
      { id: 'loc_home', name: 'Home (Andheri East)', type: 'home', city: 'Mumbai', state: 'Maharashtra', lat: 19.1136, lon: 72.8697, isCurrent: true },
      { id: 'loc_office', name: 'Logistics Hub (Bandra-Kurla)', type: 'office', city: 'Mumbai', state: 'Maharashtra', lat: 19.0607, lon: 72.8644 }
    ],
    language: 'hi',
    notificationsEnabled: true,
    locationPermission: true,
    commuteProfile: {
      originLocationId: 'loc_home',
      destinationLocationId: 'loc_office',
      preferredMode: 'bike',
      morningDeparture: '07:00',
      eveningDeparture: '20:00'
    },
    privacySettings: {
      allowLocationTracking: true,
      saveInteractionHistory: true
    }
  },
  traveller: {
    id: 'usr_traveller_05',
    name: 'Sneha Roy',
    email: 'sneha.wander@travel.com',
    userType: 'traveller',
    interests: ['rain', 'temperature', 'severe_weather'],
    activeLocationId: 'loc_dest',
    savedLocations: [
      { id: 'loc_home', name: 'Home (Salt Lake)', type: 'home', city: 'Kolkata', state: 'West Bengal', lat: 22.5868, lon: 88.4178 },
      { id: 'loc_dest', name: 'Holiday (Manali)', type: 'destination', city: 'Manali', state: 'Himachal Pradesh', lat: 32.2396, lon: 77.1887, isCurrent: true }
    ],
    language: 'en',
    notificationsEnabled: true,
    locationPermission: true,
    commuteProfile: {
      originLocationId: 'loc_home',
      destinationLocationId: 'loc_dest',
      preferredMode: 'car',
      morningDeparture: '06:00',
      eveningDeparture: '19:00'
    },
    privacySettings: {
      allowLocationTracking: true,
      saveInteractionHistory: true
    }
  },
  general_user: {
    id: 'usr_general_06',
    name: 'Vikram Joshi',
    email: 'vikram.joshi@gmail.com',
    userType: 'general_user',
    interests: ['aqi', 'temperature', 'rain'],
    activeLocationId: 'loc_home',
    savedLocations: [
      { id: 'loc_home', name: 'Home (Kothrud)', type: 'home', city: 'Pune', state: 'Maharashtra', lat: 18.5074, lon: 73.8077, isCurrent: true },
      { id: 'loc_office', name: 'Office (Hinjewadi)', type: 'office', city: 'Pune', state: 'Maharashtra', lat: 18.5913, lon: 73.7389 }
    ],
    language: 'en',
    notificationsEnabled: true,
    locationPermission: true,
    commuteProfile: {
      originLocationId: 'loc_home',
      destinationLocationId: 'loc_office',
      preferredMode: 'car',
      morningDeparture: '09:00',
      eveningDeparture: '18:00'
    },
    privacySettings: {
      allowLocationTracking: true,
      saveInteractionHistory: true
    }
  }
};

export const SCENARIO_WEATHER: Record<WeatherScenarioMode, WeatherCondition> = {
  normal: {
    temp: 28,
    feelsLike: 29,
    tempMin: 22,
    tempMax: 31,
    humidity: 58,
    windSpeed: 12,
    windDirection: 'NW',
    pressure: 1012,
    rainProb: 15,
    rainfallMm: 0,
    aqi: 88,
    aqiStatus: 'Satisfactory',
    uvIndex: 5,
    uvStatus: 'Moderate',
    visibility: 8,
    condition: 'Partly Cloudy',
    conditionText: 'Pleasant & Partly Cloudy with light breeze',
    conditionTextHi: 'सुहावना मौसम, हल्की हवा के साथ आंशिक रूप से बादल',
    sunrise: '06:12 AM',
    sunset: '06:48 PM',
    timestamp: 'Just now'
  },
  heavy_rain: {
    temp: 23,
    feelsLike: 25,
    tempMin: 21,
    tempMax: 26,
    humidity: 94,
    windSpeed: 38,
    windDirection: 'SW',
    pressure: 998,
    rainProb: 92,
    rainfallMm: 68,
    aqi: 32,
    aqiStatus: 'Good',
    uvIndex: 2,
    uvStatus: 'Low',
    visibility: 2.5,
    condition: 'Heavy Rain',
    conditionText: 'Monsoon Heavy Downpour with localized waterlogging alert',
    conditionTextHi: 'मानसून की भारी बारिश एवं जलभराव की चेतावनी',
    sunrise: '06:14 AM',
    sunset: '06:47 PM',
    timestamp: 'Just now'
  },
  heatwave: {
    temp: 43,
    feelsLike: 47,
    tempMin: 32,
    tempMax: 44,
    humidity: 24,
    windSpeed: 22,
    windDirection: 'W',
    pressure: 1004,
    rainProb: 0,
    rainfallMm: 0,
    aqi: 215,
    aqiStatus: 'Poor',
    uvIndex: 11,
    uvStatus: 'Extreme',
    visibility: 6,
    condition: 'Heatwave',
    conditionText: 'Severe Heatwave Warning (Loo winds active, stay indoors midday)',
    conditionTextHi: 'भीषण लू की चेतावनी (दोपहर में घर के अंदर रहें, लू सक्रिय)',
    sunrise: '05:48 AM',
    sunset: '07:15 PM',
    timestamp: 'Just now'
  },
  severe: {
    temp: 22,
    feelsLike: 21,
    tempMin: 19,
    tempMax: 24,
    humidity: 98,
    windSpeed: 74,
    windDirection: 'NE',
    pressure: 986,
    rainProb: 98,
    rainfallMm: 115,
    aqi: 25,
    aqiStatus: 'Good',
    uvIndex: 1,
    uvStatus: 'Low',
    visibility: 1.0,
    condition: 'Thunderstorm',
    conditionText: 'Severe Thunderstorm & Squall Warning with Cloud-to-Ground Lightning',
    conditionTextHi: 'भीषण आंधी-तूफान, तेज हवाएं (74 किमी/घंटा) एवं आकाशीय बिजली की चेतावनी',
    sunrise: '06:15 AM',
    sunset: '06:45 PM',
    timestamp: 'Just now'
  }
};

export function generateHourlyForecast(mode: WeatherScenarioMode): HourlyForecastItem[] {
  const currentHour = new Date().getHours();
  const items: HourlyForecastItem[] = [];

  for (let i = 0; i < 24; i++) {
    const h = (currentHour + i) % 24;
    const timeStr = `${h.toString().padStart(2, '0')}:00`;
    
    let temp = 28;
    let rainProb = 10;
    let condition = 'Partly Cloudy';
    let icon = 'cloud-sun';

    if (mode === 'heavy_rain') {
      temp = 22 + Math.sin(i / 3) * 2;
      rainProb = Math.min(95, Math.max(60, Math.round(85 + Math.sin(i / 2) * 15)));
      condition = rainProb > 80 ? 'Heavy Rain' : 'Light Rain';
      icon = rainProb > 80 ? 'cloud-rain' : 'cloud-drizzle';
    } else if (mode === 'heatwave') {
      // Peaks from 12:00 to 16:00
      const isDay = h >= 10 && h <= 17;
      temp = isDay ? Math.round(41 + Math.sin((h - 10) / 4) * 3) : Math.round(33 + Math.cos(i) * 2);
      rainProb = 0;
      condition = isDay ? 'Blazing Sun' : 'Warm Hazy Night';
      icon = isDay ? 'sun' : 'moon';
    } else if (mode === 'severe') {
      temp = 21 + (i % 3);
      rainProb = Math.min(99, Math.max(75, Math.round(92 + Math.sin(i) * 8)));
      condition = 'Thunderstorm';
      icon = 'cloud-lightning';
    } else {
      const isNight = h < 6 || h > 19;
      temp = isNight ? Math.round(24 + Math.sin(i) * 2) : Math.round(30 + Math.sin((h - 6) / 4) * 2);
      rainProb = (h >= 14 && h <= 17) ? 25 : 5;
      condition = isNight ? 'Clear Night' : (rainProb > 20 ? 'Passing Cloud' : 'Sunny');
      icon = isNight ? 'moon' : (rainProb > 20 ? 'cloud-sun' : 'sun');
    }

    items.push({
      time: i === 0 ? 'Now' : timeStr,
      temp: Math.round(temp),
      feelsLike: Math.round(temp + (mode === 'heatwave' ? 4 : mode === 'heavy_rain' ? 2 : 1)),
      rainProb,
      condition,
      icon,
      isCurrentHour: i === 0
    });
  }

  return items;
}

export function generateDailyForecast(mode: WeatherScenarioMode): DailyForecastItem[] {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysHi = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
  const todayIndex = new Date().getDay();
  const items: DailyForecastItem[] = [];

  for (let i = 0; i < 7; i++) {
    const dIdx = (todayIndex + i) % 7;
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + i);
    const dateStr = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    let maxTemp = 32;
    let minTemp = 24;
    let rainProb = 15;
    let condition = 'Partly Cloudy';
    let icon = 'cloud-sun';

    if (mode === 'heavy_rain') {
      maxTemp = 26 - (i > 3 ? -3 : 0);
      minTemp = 21;
      rainProb = Math.max(30, 95 - i * 10);
      condition = rainProb > 60 ? 'Heavy Rain' : 'Scattered Showers';
      icon = 'cloud-rain';
    } else if (mode === 'heatwave') {
      maxTemp = 44 - (i > 4 ? 3 : 0);
      minTemp = 32 - (i > 4 ? 2 : 0);
      rainProb = 0;
      condition = 'Severe Heat';
      icon = 'sun';
    } else if (mode === 'severe') {
      maxTemp = 24 + i * 2;
      minTemp = 20;
      rainProb = Math.max(20, 95 - i * 15);
      condition = i < 2 ? 'Thunderstorm' : 'Cloudy with Rain';
      icon = i < 2 ? 'cloud-lightning' : 'cloud-rain';
    } else {
      maxTemp = 31 + (i % 3);
      minTemp = 23 + (i % 2);
      rainProb = 10 + (i * 5) % 25;
      condition = 'Sunny Intervals';
      icon = 'cloud-sun';
    }

    items.push({
      date: dateStr,
      day: i === 0 ? 'Today' : days[dIdx],
      dayHi: i === 0 ? 'आज' : daysHi[dIdx],
      maxTemp,
      minTemp,
      rainProb,
      condition,
      icon
    });
  }

  return items;
}
