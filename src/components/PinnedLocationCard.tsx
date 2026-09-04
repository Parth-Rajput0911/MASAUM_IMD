import React, { useState } from 'react';
import { 
  Pin, 
  MapPin, 
  CloudRain, 
  Sun, 
  Cloud, 
  Wind, 
  Droplets, 
  ArrowRight, 
  Check, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { UserProfile, SavedLocation } from '../types';

interface PinnedLocationCardProps {
  user: UserProfile;
  pinnedLocationId?: string;
  onPinLocation: (locationId: string) => void;
  onSwitchActiveLocation: (locationId: string) => void;
  language: 'en' | 'hi';
}

// Sample realistic weather generator for pinned locations based on city
function getCityWeatherPreview(location: SavedLocation) {
  const city = location.city.toLowerCase();
  if (city.includes('alwar') || city.includes('rajasthan')) {
    return {
      temp: 33,
      condition: 'Sunny & Dry',
      conditionHi: 'धूप व शुष्क मौसम',
      rainProb: 5,
      humidity: 38,
      windSpeed: 14,
      icon: Sun,
      color: 'text-amber-400'
    };
  } else if (city.includes('manali') || city.includes('himachal')) {
    return {
      temp: 17,
      condition: 'Misty & Cool',
      conditionHi: 'ठंडा व धुंधला मौसम',
      rainProb: 35,
      humidity: 78,
      windSpeed: 8,
      icon: Cloud,
      color: 'text-sky-300'
    };
  } else if (city.includes('ludhiana') || city.includes('punjab')) {
    return {
      temp: 29,
      condition: 'Clear Sky',
      conditionHi: 'साफ़ आसमान',
      rainProb: 10,
      humidity: 52,
      windSpeed: 11,
      icon: Sun,
      color: 'text-amber-300'
    };
  } else if (city.includes('mumbai')) {
    return {
      temp: 30,
      condition: 'Humid Breeze',
      conditionHi: 'नमीयुक्त समुद्री हवा',
      rainProb: 40,
      humidity: 82,
      windSpeed: 20,
      icon: CloudRain,
      color: 'text-blue-400'
    };
  } else if (city.includes('bengaluru')) {
    return {
      temp: 25,
      condition: 'Pleasant Breeze',
      conditionHi: 'सुहानी ठंडी हवा',
      rainProb: 20,
      humidity: 65,
      windSpeed: 16,
      icon: Cloud,
      color: 'text-teal-300'
    };
  } else {
    return {
      temp: 28,
      condition: 'Passing Clouds',
      conditionHi: 'हल्के बादल',
      rainProb: 15,
      humidity: 55,
      windSpeed: 12,
      icon: Cloud,
      color: 'text-sky-400'
    };
  }
}

export const PinnedLocationCard: React.FC<PinnedLocationCardProps> = ({
  user,
  pinnedLocationId,
  onPinLocation,
  onSwitchActiveLocation,
  language
}) => {
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // Find currently pinned location; if none, default to first location that is not the active one
  const pinnedLocation = user.savedLocations.find(l => l.id === pinnedLocationId) 
    || user.savedLocations.find(l => l.id !== user.activeLocationId)
    || user.savedLocations[0];

  const weather = getCityWeatherPreview(pinnedLocation);
  const WeatherIcon = weather.icon;
  const isCurrentlyActive = user.activeLocationId === pinnedLocation.id;

  return (
    <div 
      id="pinned-location-preview-card"
      className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-3.5 shadow-lg transition-all"
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <div className="flex items-center space-x-1.5">
          <div className="p-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Pin className="w-3.5 h-3.5 fill-amber-400/40" />
          </div>
          <span className="text-[11px] font-bold text-slate-200 tracking-wide">
            {language === 'hi' ? 'पिन की गई पसंदीदा जगह' : 'Pinned Favorite Location'}
          </span>
        </div>

        {/* Change Pin Trigger */}
        <button
          id="change-pinned-location-btn"
          onClick={() => setIsSelectorOpen(!isSelectorOpen)}
          className="flex items-center space-x-1 text-[10px] font-semibold text-sky-400 hover:text-sky-300 bg-slate-800/80 hover:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 cursor-pointer transition-colors"
        >
          <span>{language === 'hi' ? 'बदलें' : 'Change'}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Selector Dropdown / Chips when open */}
      {isSelectorOpen && (
        <div className="my-2 p-2 bg-slate-950/90 rounded-xl border border-slate-700 space-y-1.5 animate-fade-in">
          <div className="text-[10px] text-slate-400 font-medium px-1 flex items-center justify-between">
            <span>{language === 'hi' ? 'पिन करने के लिए स्थान चुनें:' : 'Select location to pin:'}</span>
            <span className="text-[9px] text-slate-500">{user.savedLocations.length} saved</span>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {user.savedLocations.map((loc) => {
              const isSelected = loc.id === pinnedLocation.id;
              return (
                <button
                  key={loc.id}
                  onClick={() => {
                    onPinLocation(loc.id);
                    setIsSelectorOpen(false);
                  }}
                  className={`flex items-center justify-between px-2 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                    isSelected 
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium' 
                      : 'hover:bg-slate-800/70 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{loc.name}</span>
                    <span className="text-[10px] text-slate-500 shrink-0">({loc.city})</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Preview Content */}
      <div className="mt-2.5 flex items-center justify-between">
        {/* Location & Condition info */}
        <div>
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <h4 className="text-xs font-bold text-white tracking-tight">
              {pinnedLocation.name}
            </h4>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 ml-5">
            {pinnedLocation.city}, {pinnedLocation.state}
          </p>
          <div className="flex items-center space-x-2 mt-1.5 ml-5 text-[11px] text-slate-300 font-medium">
            <span>{language === 'hi' ? weather.conditionHi : weather.condition}</span>
            <span className="text-slate-600">•</span>
            <span className="text-sky-400 flex items-center space-x-0.5">
              <Droplets className="w-2.5 h-2.5" />
              <span>{weather.rainProb}% rain</span>
            </span>
          </div>
        </div>

        {/* Temperature Badge & Icon */}
        <div className="flex items-center space-x-2.5 bg-slate-950/60 border border-slate-800/90 px-2.5 py-1.5 rounded-xl shrink-0">
          <WeatherIcon className={`w-6 h-6 ${weather.color}`} />
          <div className="text-right">
            <div className="text-lg font-black text-white font-mono leading-none">
              {weather.temp}°C
            </div>
            <div className="text-[9px] text-slate-400 font-mono mt-0.5">
              {weather.windSpeed} km/h
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Footer */}
      <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
        {isCurrentlyActive ? (
          <span className="text-[10px] text-emerald-400 flex items-center space-x-1 font-medium">
            <Check className="w-3 h-3" />
            <span>{language === 'hi' ? 'वर्तमान में सक्रिय स्थान' : 'Currently active location'}</span>
          </span>
        ) : (
          <button
            onClick={() => onSwitchActiveLocation(pinnedLocation.id)}
            className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-semibold cursor-pointer transition-colors"
          >
            <span>{language === 'hi' ? 'इस स्थान का पूरा मौसम देखें' : 'View full weather for this city'}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}

        <span className="text-[9px] text-slate-500 font-mono">
          {language === 'hi' ? 'त्वरित दृश्य' : 'Quick Glance'}
        </span>
      </div>
    </div>
  );
};
