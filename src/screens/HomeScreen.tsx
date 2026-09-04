import React, { useState } from 'react';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  Eye, 
  Gauge, 
  ShieldAlert, 
  Clock, 
  Compass, 
  AlertTriangle, 
  Sparkles, 
  MapPin, 
  CheckCircle, 
  Navigation,
  Layers,
  Thermometer
} from 'lucide-react';
import { 
  UserProfile, 
  WeatherCondition, 
  WeatherScenarioMode, 
  HourlyForecastItem, 
  DailyForecastItem, 
  WeatherAlert, 
  SmartCommuteData, 
  WeatherRiskScore, 
  PersonalizedRecommendation, 
  AISummary 
} from '../types';
import { WeatherRiskGauge } from '../components/WeatherRiskGauge';
import { SmartCommuteCard } from '../components/SmartCommuteCard';
import { AISummaryCard } from '../components/AISummaryCard';
import { RecommendationsList } from '../components/RecommendationsList';
import { HourlyForecastBar } from '../components/HourlyForecastBar';
import { DailyForecastList } from '../components/DailyForecastList';
import { PinnedLocationCard } from '../components/PinnedLocationCard';
import { LifeDomainIntelligence } from '../components/LifeDomainIntelligence';
import { AgriGardeningModule } from '../components/AgriGardeningModule';
import { OutdoorEventComfortModule } from '../components/OutdoorEventComfortModule';

interface HomeScreenProps {
  user: UserProfile;
  weather: WeatherCondition;
  scenario: WeatherScenarioMode;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  alerts: WeatherAlert[];
  commute: SmartCommuteData;
  riskScore: WeatherRiskScore;
  recommendations: PersonalizedRecommendation[];
  summary: AISummary;
  pinnedLocationId?: string;
  onPinLocation?: (locationId: string) => void;
  onSwitchActiveLocation?: (locationId: string) => void;
  onNavigateToMap: () => void;
  onNavigateToAlerts: () => void;
  onNavigateToAI: () => void;
  onOpenSimulator: () => void;
  language: 'en' | 'hi';
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  weather,
  scenario,
  hourly,
  daily,
  alerts,
  commute,
  riskScore,
  recommendations,
  summary,
  pinnedLocationId,
  onPinLocation,
  onSwitchActiveLocation,
  onNavigateToMap,
  onNavigateToAlerts,
  onNavigateToAI,
  onOpenSimulator,
  language
}) => {
  const activeLocation = user.savedLocations.find(l => l.id === user.activeLocationId) || user.savedLocations[0];
  const primaryAlert = alerts.length > 0 ? alerts[0] : null;

  // Dynamic hero weather theme based on condition
  const getHeroTheme = () => {
    switch (scenario) {
      case 'heavy_rain':
        return {
          gradient: 'from-blue-900/80 via-indigo-950/90 to-slate-900',
          border: 'border-blue-500/40',
          badgeText: language === 'hi' ? 'मानसून ऑरेंज अलर्ट' : 'Monsoon Rain Mode',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
          icon: CloudRain,
          iconColor: 'text-blue-400'
        };
      case 'heatwave':
        return {
          gradient: 'from-amber-900/80 via-orange-950/90 to-slate-900',
          border: 'border-amber-500/40',
          badgeText: language === 'hi' ? 'भीषण लू चेतावनी' : 'Severe Loo Heatwave',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: Sun,
          iconColor: 'text-amber-400'
        };
      case 'severe':
        return {
          gradient: 'from-rose-950/90 via-purple-950/90 to-slate-900',
          border: 'border-rose-500/50 ring-1 ring-rose-500/30',
          badgeText: language === 'hi' ? 'रेड अलर्ट: भीषण आंधी' : 'Emergency Red Squall Alert',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/50',
          icon: ShieldAlert,
          iconColor: 'text-rose-400'
        };
      default:
        return {
          gradient: 'from-sky-900/70 via-slate-900/80 to-slate-900',
          border: 'border-sky-500/30',
          badgeText: language === 'hi' ? 'सामान्य व अनुकूल' : 'Normal / Fair Weather',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: Sun,
          iconColor: 'text-amber-300'
        };
    }
  };

  const theme = getHeroTheme();
  const HeroIcon = theme.icon;

  const getAqiColor = (status: string) => {
    switch (status) {
      case 'Good': return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
      case 'Satisfactory': return 'text-teal-400 bg-teal-500/15 border-teal-500/30';
      case 'Moderate': return 'text-yellow-400 bg-yellow-500/15 border-yellow-500/30';
      case 'Poor': return 'text-orange-400 bg-orange-500/15 border-orange-500/30';
      case 'Very Poor': return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
      default: return 'text-red-500 bg-red-500/20 border-red-500/40';
    }
  };

  // Adaptive content ordering based on scenario
  // - Heavy Rain: Alert -> Smart Commute -> Risk Score -> AI Summary -> Recommendations -> Forecasts
  // - Heatwave: Alert -> Risk Score (Heat) -> AI Summary -> Recommendations (Hydration) -> UV/AQI -> Forecasts
  // - Severe: Red Emergency Alert -> Safety Actions -> Commute Risk -> AI Summary -> Radar
  // - Normal: Hero -> AI Summary -> Hourly Forecast -> Daily Forecast -> Recommendations -> AQI/UV

  return (
    <div id="home-dashboard-screen" className="space-y-4 pb-24 px-4 pt-2 max-w-md mx-auto animate-fade-in">
      {/* 1. SEVERE OR HIGH RISK ALERT BANNER (If Active) */}
      {primaryAlert && primaryAlert.severity !== 'green' && (
        <div 
          id="active-severity-alert-banner"
          onClick={onNavigateToAlerts}
          className={`p-3.5 rounded-2xl border flex items-start space-x-3 cursor-pointer transition-all shadow-md ${
            primaryAlert.severity === 'red'
              ? 'bg-rose-950/40 border-rose-500/50 text-rose-200 ring-1 ring-rose-500/30'
              : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
          }`}
        >
          <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
            primaryAlert.severity === 'red' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
          }`}>
            <AlertTriangle className="w-4 h-4 animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-900/60 font-mono">
                {language === 'hi' ? 'प्राथमिकता स्कोर' : 'Priority'}: {primaryAlert.totalPriority}/30
              </span>
              <span className="text-[10px] text-slate-400">
                {primaryAlert.issuedAt}
              </span>
            </div>
            <h2 className="text-xs font-bold text-white mt-1 leading-snug truncate">
              {language === 'hi' ? primaryAlert.titleHi : primaryAlert.title}
            </h2>
            <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
              {language === 'hi' ? primaryAlert.descriptionHi : primaryAlert.description}
            </p>
          </div>
        </div>
      )}

      {/* 2. DYNAMIC CURRENT WEATHER HERO CARD */}
      <div 
        id="current-weather-hero"
        className={`relative overflow-hidden bg-gradient-to-b ${theme.gradient} border ${theme.border} rounded-3xl p-5 shadow-xl backdrop-blur-md`}
      >
        {/* Top bar of hero */}
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${theme.badgeColor}`}>
            {theme.badgeText}
          </span>
          <span className="text-[11px] text-slate-400 flex items-center space-x-1 font-mono">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{weather.timestamp}</span>
          </span>
        </div>

        {/* Big Temperature Display */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-black tracking-tighter text-white font-mono">
                {weather.temp}°
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {language === 'hi' ? 'महसूस' : 'Feels like'} {weather.feelsLike}°C
              </span>
            </div>
            <p className="text-xs font-bold text-sky-200 mt-1">
              {language === 'hi' ? weather.conditionTextHi : weather.conditionText}
            </p>
            <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-400 font-mono">
              <span>H: {weather.tempMax}°</span>
              <span>•</span>
              <span>L: {weather.tempMin}°</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/40 rounded-2xl border border-slate-700/50 shadow-inner">
            <HeroIcon className={`w-14 h-14 ${theme.iconColor} animate-pulse`} />
          </div>
        </div>

        {/* Metric Pills Grid */}
        <div className="mt-4 grid grid-cols-4 gap-2 pt-3 border-t border-slate-700/50 text-[11px]">
          {/* Rain Probability */}
          <div className="bg-slate-900/60 p-2 rounded-xl text-center border border-slate-800">
            <div className="flex items-center justify-center space-x-1 text-sky-400 mb-0.5">
              <Droplets className="w-3 h-3" />
              <span className="text-[10px] font-bold">{weather.rainProb}%</span>
            </div>
            <span className="text-[9px] text-slate-400 block">{language === 'hi' ? 'बारिश' : 'Rain'}</span>
          </div>

          {/* Wind Speed */}
          <div className="bg-slate-900/60 p-2 rounded-xl text-center border border-slate-800">
            <div className="flex items-center justify-center space-x-1 text-slate-300 mb-0.5">
              <Wind className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-bold font-mono">{weather.windSpeed}</span>
            </div>
            <span className="text-[9px] text-slate-400 block">{language === 'hi' ? 'किमी/घं' : 'km/h'}</span>
          </div>

          {/* AQI */}
          <div className={`p-2 rounded-xl text-center border ${getAqiColor(weather.aqiStatus)}`}>
            <span className="text-[10px] font-bold font-mono block mb-0.5">{weather.aqi}</span>
            <span className="text-[9px] truncate block">{weather.aqiStatus}</span>
          </div>

          {/* UV Index */}
          <div className="bg-slate-900/60 p-2 rounded-xl text-center border border-slate-800">
            <span className={`text-[10px] font-bold font-mono block mb-0.5 ${
              weather.uvIndex >= 8 ? 'text-amber-400' : 'text-slate-300'
            }`}>
              {weather.uvIndex} UV
            </span>
            <span className="text-[9px] text-slate-400 truncate block">{weather.uvStatus}</span>
          </div>
        </div>
      </div>

      {/* 2.5 PINNED FAVORITE LOCATION PREVIEW CARD */}
      <PinnedLocationCard 
        user={user}
        pinnedLocationId={pinnedLocationId}
        onPinLocation={onPinLocation || (() => {})}
        onSwitchActiveLocation={onSwitchActiveLocation || (() => {})}
        language={language}
      />

      {/* 3. AI GENERATED WEATHER SUMMARY ("WHAT IT MEANS FOR YOU") */}
      <AISummaryCard summary={summary} user={user} language={language} />

      {/* 3.5 SPECIALIZED DOMAIN WEATHER INTELLIGENCE (Health, Fitness, Marine, Travel, Family, Agri, Commute, Events) */}
      <LifeDomainIntelligence 
        user={user}
        scenario={scenario}
        language={language}
      />

      {/* 3.8 AGRI-GARDENING MODULE (Soil Moisture, Frost Alerts, Seasonal Planting Helper) */}
      <AgriGardeningModule
        user={user}
        weather={weather}
        scenario={scenario}
        language={language}
      />

      {/* 3.9 OUTDOOR EVENT COMFORT INDEX (Temp + Wind + Humidity Social Gathering Planner) */}
      <OutdoorEventComfortModule
        weather={weather}
        language={language}
      />

      {/* 4. SMART COMMUTE CARD (High priority during rain, heatwave or office/student persona) */}
      <SmartCommuteCard commute={commute} user={user} language={language} />

      {/* 5. WEATHER RISK SCORE (Composite Explainable Score) */}
      <WeatherRiskGauge riskScore={riskScore} user={user} language={language} />

      {/* 6. CONTEXT-AWARE PERSONALIZED RECOMMENDATIONS */}
      <RecommendationsList recommendations={recommendations} user={user} language={language} />

      {/* 7. RADAR QUICK ACCESS TEASER */}
      <div 
        id="home-radar-teaser-card"
        onClick={onNavigateToMap}
        className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500/20 to-indigo-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Layers className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center space-x-1.5">
              <span>{language === 'hi' ? 'लाइव मौसम डॉपलर रडार' : 'Live Doppler Weather Radar'}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {scenario === 'heavy_rain' 
                ? (language === 'hi' ? 'वर्षा क्लाउड ट्रैकिंग सक्रिय • 68mm संचय' : 'Active rain cloud tracking • 68mm accumulated') 
                : (language === 'hi' ? 'तापमान, हवा और उपग्रह लेयर्स देखें' : 'View temperature, wind streamlines & satellite layers')}
            </p>
          </div>
        </div>
        <span className="text-xs text-sky-400 font-bold shrink-0 ml-2">
          {language === 'hi' ? 'देखें →' : 'Explore →'}
        </span>
      </div>

      {/* 8. HOURLY FORECAST (24 HOURS) */}
      <HourlyForecastBar items={hourly} language={language} />

      {/* 9. 7-DAY FORECAST */}
      <DailyForecastList items={daily} language={language} />

      {/* 10. ASK MAUSAM AI PROMPT BANNER */}
      <div 
        id="home-ask-ai-banner"
        onClick={onNavigateToAI}
        className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 to-indigo-950/60 border border-sky-500/30 flex items-center justify-between cursor-pointer hover:border-sky-400/50 transition-all"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 text-white shadow-md shadow-sky-500/30">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white">
              {language === 'hi' ? 'MAUSAM IMD सहायक से पूछें' : 'Ask MAUSAM IMD Assistant'}
            </h2>
            <p className="text-[11px] text-slate-300 mt-0.5">
              {language === 'hi' 
                ? '“क्या आज छाता ले जाना चाहिए?” या “कॉलेज का मौसम?”' 
                : '“Should I carry an umbrella?” or “What is the weather at my college?”'}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-sky-400 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700">
          Chat 💬
        </span>
      </div>
    </div>
  );
};
