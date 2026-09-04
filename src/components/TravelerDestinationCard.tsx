import React, { useState, useMemo } from 'react';
import { 
  Luggage, 
  MapPin, 
  CloudRain, 
  Sun, 
  Cloud, 
  Droplets, 
  Wind, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ArrowRight, 
  Compass, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  SlidersHorizontal,
  Info,
  CheckCircle2,
  Circle,
  ExternalLink
} from 'lucide-react';
import { 
  UserProfile, 
  SavedLocation, 
  WeatherScenarioMode 
} from '../types';
import { 
  getDestinationForecast, 
  POPULAR_TRAVEL_DESTINATIONS, 
  DestinationForecastData, 
  EssentialTravelItem 
} from '../data/travelForecast';

interface TravelerDestinationCardProps {
  user: UserProfile;
  scenario: WeatherScenarioMode;
  onUpdateUser?: (updatedUser: UserProfile) => void;
  onSwitchActiveLocation?: (locationId: string) => void;
  language: 'en' | 'hi';
}

export const TravelerDestinationCard: React.FC<TravelerDestinationCardProps> = ({
  user,
  scenario,
  onUpdateUser,
  onSwitchActiveLocation,
  language
}) => {
  // 1. Locate current travel destination from user profile or fallback
  const savedDestinations = useMemo(() => {
    return user.savedLocations.filter(loc => loc.type === 'destination');
  }, [user.savedLocations]);

  // Selected destination state (default to first destination or first saved location or popular default)
  const [selectedDestId, setSelectedDestId] = useState<string>(() => {
    if (savedDestinations.length > 0) return savedDestinations[0].id;
    const destLike = user.savedLocations.find(l => 
      l.name.toLowerCase().includes('dest') || 
      l.name.toLowerCase().includes('holiday') || 
      l.name.toLowerCase().includes('trip') ||
      l.city.toLowerCase().includes('manali') ||
      l.city.toLowerCase().includes('goa')
    );
    if (destLike) return destLike.id;
    return 'default_manali';
  });

  // Resolve current active destination object
  const currentDestination: SavedLocation = useMemo(() => {
    const fromSaved = user.savedLocations.find(l => l.id === selectedDestId);
    if (fromSaved) return fromSaved;

    // Check if it's one of the popular travel destinations
    const popularMatch = POPULAR_TRAVEL_DESTINATIONS.find(p => p.city.toLowerCase() === selectedDestId.toLowerCase() || `pop_${p.city.toLowerCase()}` === selectedDestId);
    if (popularMatch) {
      return {
        id: `pop_${popularMatch.city.toLowerCase()}`,
        name: popularMatch.name,
        type: 'destination',
        city: popularMatch.city,
        state: popularMatch.state,
        lat: popularMatch.lat,
        lon: popularMatch.lon
      };
    }

    // Default fallback to Manali
    return {
      id: 'loc_dest_default',
      name: 'Holiday Getaway (Manali)',
      type: 'destination',
      city: 'Manali',
      state: 'Himachal Pradesh',
      lat: 32.2396,
      lon: 77.1887
    };
  }, [user.savedLocations, selectedDestId]);

  // Destination specific weather scenario override (optional simulator for what-if travel weather)
  const [destScenarioOverride, setDestScenarioOverride] = useState<WeatherScenarioMode | 'sync'>('sync');
  const activeScenario = destScenarioOverride === 'sync' ? scenario : destScenarioOverride;

  // Compute weather forecast and packing items
  const forecast: DestinationForecastData = useMemo(() => {
    return getDestinationForecast(currentDestination, activeScenario);
  }, [currentDestination, activeScenario]);

  // Interactive packing checklist state (persisted per item id in state)
  const [packedItems, setPackedItems] = useState<Record<string, boolean>>({
    power_bank: true // sensible default
  });

  // UI accordion toggles
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);
  const [showThreeDayForecast, setShowThreeDayForecast] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'critical' | 'unpacked'>('all');
  const [showAddCustom, setShowAddCustom] = useState<boolean>(false);
  const [newCity, setNewCity] = useState<string>('');
  const [newState, setNewState] = useState<string>('');

  const togglePacked = (id: string) => {
    setPackedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter items
  const filteredItems = useMemo(() => {
    if (activeFilter === 'critical') {
      return forecast.essentialItems.filter(item => item.priority === 'must_have');
    }
    if (activeFilter === 'unpacked') {
      return forecast.essentialItems.filter(item => !packedItems[item.id]);
    }
    return forecast.essentialItems;
  }, [forecast.essentialItems, activeFilter, packedItems]);

  // Packing statistics
  const totalItems = forecast.essentialItems.length;
  const packedCount = forecast.essentialItems.filter(item => packedItems[item.id]).length;
  const packingPercent = totalItems > 0 ? Math.round((packedCount / totalItems) * 100) : 0;

  // Handler to add a new custom destination
  const handleAddNewDestination = () => {
    if (!newCity.trim()) return;
    const newLoc: SavedLocation = {
      id: 'loc_dest_' + Date.now(),
      name: `Trip (${newCity.trim()})`,
      type: 'destination',
      city: newCity.trim(),
      state: newState.trim() || 'India',
      lat: 28.6139,
      lon: 77.2090
    };

    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        savedLocations: [...user.savedLocations, newLoc]
      });
    }
    setSelectedDestId(newLoc.id);
    setNewCity('');
    setNewState('');
    setShowAddCustom(false);
    setIsSelectorOpen(false);
  };

  // Handler to save current popular destination to user's saved locations permanently
  const handleSavePopularToProfile = (dest: Omit<SavedLocation, 'id'>) => {
    const existing = user.savedLocations.find(l => l.city.toLowerCase() === dest.city.toLowerCase());
    if (existing) {
      setSelectedDestId(existing.id);
      setIsSelectorOpen(false);
      return;
    }
    const newLoc: SavedLocation = {
      ...dest,
      id: 'loc_dest_' + Date.now()
    };
    if (onUpdateUser) {
      onUpdateUser({
        ...user,
        savedLocations: [...user.savedLocations, newLoc]
      });
    }
    setSelectedDestId(newLoc.id);
    setIsSelectorOpen(false);
  };

  const isSavedInProfile = user.savedLocations.some(l => l.id === currentDestination.id);

  return (
    <div 
      id="traveler-destination-card"
      className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-amber-950/25 border border-amber-500/30 hover:border-amber-500/50 rounded-2xl p-4 shadow-xl transition-all space-y-3.5 relative overflow-hidden"
    >
      {/* Decorative ambient background blur */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* TOP HEADER: Persona Badge & Destination Switcher */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Luggage className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-black text-white tracking-wide uppercase">
                {language === 'hi' ? 'स्मार्ट यात्री कार्ड' : 'Traveler Companion'}
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {language === 'hi' ? 'गंतव्य पूर्वानुमान' : 'Saved Destination'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              {language === 'hi' ? 'मौसम अनुसार आवश्यक पैकिंग सुझाव' : 'Forecast-based packing & essential gear'}
            </p>
          </div>
        </div>

        {/* Change Destination Button */}
        <button
          id="change-travel-destination-btn"
          onClick={() => setIsSelectorOpen(!isSelectorOpen)}
          className="flex items-center space-x-1 text-[11px] font-semibold text-amber-300 hover:text-amber-200 bg-slate-800/90 hover:bg-slate-800 px-2.5 py-1 rounded-xl border border-amber-500/30 cursor-pointer transition-colors shadow-sm"
        >
          <MapPin className="w-3 h-3 text-amber-400" />
          <span>{language === 'hi' ? 'गंतव्य बदलें' : 'Switch Destination'}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isSelectorOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* DESTINATION SELECTOR DROPDOWN / MODAL */}
      {isSelectorOpen && (
        <div className="p-3 bg-slate-950/95 rounded-xl border border-amber-500/40 space-y-2.5 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'hi' ? 'यात्रा गंतव्य चुनें:' : 'Select Travel Destination:'}</span>
            </span>
            <button 
              onClick={() => setShowAddCustom(!showAddCustom)}
              className="text-[10px] text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-medium cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>{language === 'hi' ? 'नया शहर जोड़ें' : 'Add Custom City'}</span>
            </button>
          </div>

          {/* User's Saved Locations */}
          <div>
            <div className="text-[10px] font-semibold text-slate-400 mb-1">
              {language === 'hi' ? 'आपकी सहेजी गई जगहें:' : 'Your Saved Locations:'}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {user.savedLocations.map((loc) => {
                const isSelected = loc.id === currentDestination.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setSelectedDestId(loc.id);
                      setIsSelectorOpen(false);
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors cursor-pointer border ${
                      isSelected 
                        ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 font-semibold' 
                        : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    <div className="truncate flex items-center space-x-1.5">
                      <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="truncate">{loc.name}</span>
                      <span className="text-[10px] text-slate-400">({loc.city})</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Popular Travel Getaways */}
          <div>
            <div className="text-[10px] font-semibold text-slate-400 mb-1">
              {language === 'hi' ? 'लोकप्रिय पर्यटन स्थल (एक क्लिक में देखें):' : 'Popular Travel Getaways:'}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {POPULAR_TRAVEL_DESTINATIONS.map((pop, idx) => {
                const isSelected = currentDestination.city.toLowerCase() === pop.city.toLowerCase();
                return (
                  <button
                    key={idx}
                    onClick={() => handleSavePopularToProfile(pop)}
                    className={`px-2 py-1.5 rounded-lg text-left text-[11px] transition-colors cursor-pointer border truncate ${
                      isSelected 
                        ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 font-semibold' 
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    <div className="font-bold truncate text-white">{pop.city}</div>
                    <div className="text-[9px] text-slate-400 truncate">{pop.state}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add custom city input box */}
          {showAddCustom && (
            <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700 space-y-2">
              <div className="text-[10px] font-bold text-sky-400 uppercase">
                {language === 'hi' ? 'नया यात्रा गंतव्य जोड़ें' : 'Add New Travel Destination'}
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'शहर का नाम (उदा. Ooty)' : 'City (e.g. Ooty, Gangtok)'}
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'राज्य (उदा. Tamil Nadu)' : 'State / Country'}
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowAddCustom(false)}
                  className="text-[10px] text-slate-400 hover:text-white px-2 py-1"
                >
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  onClick={handleAddNewDestination}
                  disabled={!newCity.trim()}
                  className="text-[10px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg cursor-pointer disabled:opacity-50"
                >
                  {language === 'hi' ? 'सहेजें व पूर्वानुमान देखें' : 'Save & View Forecast'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DESTINATION WEATHER SUMMARY CARD */}
      <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <h3 className="text-sm font-extrabold text-white tracking-tight">
                {currentDestination.name || currentDestination.city}
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 ml-5 font-medium">
              {currentDestination.city}, {currentDestination.state}
            </p>
            <div className="flex items-center space-x-2 ml-5 mt-1 text-xs font-semibold text-slate-200">
              <span>{language === 'hi' ? forecast.conditionHi : forecast.condition}</span>
              <span className="text-slate-600">•</span>
              <span className="text-[11px] text-slate-400">
                Feels {forecast.feelsLike}°C
              </span>
            </div>
          </div>

          {/* Temperature & Metric Badge */}
          <div className="text-right shrink-0 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl">
            <div className="flex items-center justify-end space-x-1.5">
              {forecast.rainProb >= 40 ? (
                <CloudRain className="w-5 h-5 text-sky-400 animate-pulse" />
              ) : forecast.uvIndex >= 7 ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Cloud className="w-5 h-5 text-sky-300" />
              )}
              <span className="text-2xl font-black text-white font-mono leading-none">
                {forecast.temp}°C
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              H: {forecast.tempMax}° / L: {forecast.tempMin}°
            </div>
          </div>
        </div>

        {/* Quick Weather Metrics Badges */}
        <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2.5 border-t border-slate-800/80 text-center">
          {/* Rain Probability */}
          <div className={`p-1.5 rounded-lg border ${
            forecast.rainProb >= 40 
              ? 'bg-sky-500/15 border-sky-500/30 text-sky-300' 
              : 'bg-slate-900/60 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center justify-center space-x-0.5 text-[9px] text-slate-400">
              <Droplets className="w-2.5 h-2.5" />
              <span>Rain</span>
            </div>
            <div className="text-xs font-black font-mono mt-0.5">{forecast.rainProb}%</div>
          </div>

          {/* UV Index */}
          <div className={`p-1.5 rounded-lg border ${
            forecast.uvIndex >= 6 
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' 
              : 'bg-slate-900/60 border-slate-800 text-slate-300'
          }`}>
            <div className="flex items-center justify-center space-x-0.5 text-[9px] text-slate-400">
              <Sun className="w-2.5 h-2.5" />
              <span>UV Index</span>
            </div>
            <div className="text-xs font-black font-mono mt-0.5">{forecast.uvIndex.toFixed(1)}</div>
          </div>

          {/* Wind Speed */}
          <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
            <div className="flex items-center justify-center space-x-0.5 text-[9px] text-slate-400">
              <Wind className="w-2.5 h-2.5" />
              <span>Wind</span>
            </div>
            <div className="text-xs font-black font-mono mt-0.5">{forecast.windSpeed} km/h</div>
          </div>

          {/* Humidity */}
          <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
            <div className="text-[9px] text-slate-400">Humidity</div>
            <div className="text-xs font-black font-mono mt-0.5">{forecast.humidity}%</div>
          </div>
        </div>

        {/* 3-Day Trip Outlook Toggle Button */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between">
          <button
            onClick={() => setShowThreeDayForecast(!showThreeDayForecast)}
            className="flex items-center space-x-1 text-[10px] text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
          >
            <Calendar className="w-3 h-3" />
            <span>
              {showThreeDayForecast 
                ? (language === 'hi' ? '3-दिवसीय पूर्वानुमान छुपाएं' : 'Hide 3-Day Trip Outlook') 
                : (language === 'hi' ? '3-दिवसीय यात्रा पूर्वानुमान देखें' : 'View 3-Day Trip Outlook')}
            </span>
            {showThreeDayForecast ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {onSwitchActiveLocation && isSavedInProfile && (
            <button
              onClick={() => onSwitchActiveLocation(currentDestination.id)}
              className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-semibold cursor-pointer"
            >
              <span>{language === 'hi' ? 'स्थान सक्रिय करें' : 'Set as Active City'}</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          )}
        </div>

        {/* 3-Day Forecast Expandable Strip */}
        {showThreeDayForecast && (
          <div className="mt-2.5 grid grid-cols-3 gap-1.5 animate-fade-in pt-1 border-t border-slate-800/80">
            {forecast.threeDayForecast.map((d, i) => (
              <div key={i} className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 text-center space-y-1">
                <div className="text-[10px] font-bold text-slate-300 truncate">
                  {language === 'hi' ? d.dayHi : d.day}
                </div>
                <div className="flex items-center justify-center">
                  {d.iconType === 'rain' ? (
                    <CloudRain className="w-4 h-4 text-sky-400" />
                  ) : d.iconType === 'sun' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Cloud className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div className="text-xs font-black text-white font-mono leading-none">
                  {d.maxTemp}° <span className="text-[10px] font-normal text-slate-400">/ {d.minTemp}°</span>
                </div>
                <div className="text-[9px] text-sky-400 font-medium">
                  {d.rainProb}% rain
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TRIP ADVISORY BANNER */}
      <div className={`p-2.5 rounded-xl border flex items-start space-x-2 text-xs ${
        forecast.rainProb >= 60 
          ? 'bg-sky-950/30 border-sky-500/30 text-sky-200'
          : forecast.uvIndex >= 8 
          ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
          : 'bg-slate-950/60 border-slate-800 text-slate-300'
      }`}>
        <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
          forecast.rainProb >= 60 ? 'text-sky-400' : forecast.uvIndex >= 8 ? 'text-amber-400' : 'text-slate-400'
        }`} />
        <div className="space-y-0.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            {language === 'hi' ? 'यात्रा मौसम परामर्श:' : 'Destination Advisory:'}
          </div>
          <p className="leading-snug text-[11px]">
            {language === 'hi' ? forecast.travelAdvisoryHi : forecast.travelAdvisory}
          </p>
        </div>
      </div>

      {/* CORE FEATURE: DYNAMIC SUGGESTED ESSENTIAL ITEMS BASED ON FORECAST */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <h4 className="text-xs font-black text-white uppercase tracking-wider">
              {language === 'hi' ? 'मौसम अनुसार आवश्यक सामान (Essential Items):' : 'Forecast-Suggested Essentials:'}
            </h4>
          </div>

          {/* Packing completion pill */}
          <div className="flex items-center space-x-1.5 bg-slate-950/90 px-2.5 py-0.5 rounded-full border border-slate-800">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-bold text-emerald-400 font-mono">
              {packedCount}/{totalItems} {language === 'hi' ? 'पैक' : 'Packed'} ({packingPercent}%)
            </span>
          </div>
        </div>

        {/* Packing Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 transition-all duration-500 rounded-full"
            style={{ width: `${packingPercent}%` }}
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 text-[10px]">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
              activeFilter === 'all' 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold' 
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hi' ? `सभी (${totalItems})` : `All Essentials (${totalItems})`}
          </button>
          <button
            onClick={() => setActiveFilter('critical')}
            className={`px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
              activeFilter === 'critical' 
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 font-bold' 
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hi' ? 'अति आवश्यक (Must Have)' : 'Weather Critical'}
          </button>
          <button
            onClick={() => setActiveFilter('unpacked')}
            className={`px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
              activeFilter === 'unpacked' 
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-300 font-bold' 
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hi' ? `बाकी सामान (${totalItems - packedCount})` : `Remaining (${totalItems - packedCount})`}
          </button>
        </div>

        {/* Suggested Items List */}
        <div className="space-y-1.5">
          {filteredItems.map((item) => {
            const isPacked = !!packedItems[item.id];
            const isRainGear = item.category === 'rain_gear';
            const isSunProtection = item.category === 'sun_protection';
            const isColdGear = item.category === 'clothing' && item.triggerKey === 'cold';

            return (
              <div
                key={item.id}
                onClick={() => togglePacked(item.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between space-x-2.5 select-none ${
                  isPacked 
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-75' 
                    : isRainGear
                    ? 'bg-sky-950/20 border-sky-500/30 hover:border-sky-500/50 shadow-sm'
                    : isSunProtection
                    ? 'bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50 shadow-sm'
                    : isColdGear
                    ? 'bg-indigo-950/20 border-indigo-500/30 hover:border-indigo-500/50 shadow-sm'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Checkbox Icon */}
                <div className="shrink-0 mt-0.5">
                  {isPacked ? (
                    <div className="w-4 h-4 rounded-md bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-md border border-slate-600 hover:border-amber-400 flex items-center justify-center transition-colors" />
                  )}
                </div>

                {/* Content info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm">{item.iconEmoji}</span>
                    <span className={`text-xs font-bold truncate ${
                      isPacked ? 'line-through text-slate-400' : 'text-white'
                    }`}>
                      {language === 'hi' ? item.nameHi : item.name}
                    </span>
                    {item.priority === 'must_have' && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
                        {language === 'hi' ? 'अनिवार्य' : 'Must Have'}
                      </span>
                    )}
                  </div>

                  {/* Weather Reason Badge */}
                  <p className={`text-[10px] mt-1 leading-relaxed ${
                    isPacked ? 'text-slate-500' : 'text-slate-300'
                  }`}>
                    {language === 'hi' ? item.reasonHi : item.reason}
                  </p>
                </div>

                {/* Category Pill */}
                <div className="shrink-0 text-right">
                  <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-md ${
                    isRainGear 
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' 
                      : isSunProtection 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {language === 'hi' ? item.categoryLabelHi : item.categoryLabel}
                  </span>
                  <div className="text-[9px] text-slate-400 mt-1">
                    {isPacked ? (language === 'hi' ? 'पैक हो गया' : 'Packed ✓') : (language === 'hi' ? 'पैक करें' : 'Tap to pack')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LUGGAGE WEIGHT / VOLUME GUIDANCE */}
      <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <Luggage className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-[11px] text-slate-300">
            {language === 'hi' ? forecast.packingVolumeTipHi : forecast.packingVolumeTip}
          </span>
        </div>
      </div>

      {/* QUICK FOOTER: SCENARIO SIMULATOR TEST TRIGGER */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center space-x-1">
          <SlidersHorizontal className="w-3 h-3 text-amber-400" />
          <span>{language === 'hi' ? 'गंतव्य मौसम टेस्ट करें:' : 'Simulate weather:'}</span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => setDestScenarioOverride('sync')}
            className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors ${
              destScenarioOverride === 'sync' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {language === 'hi' ? 'सिंक' : 'App Sync'}
          </button>
          <button
            onClick={() => setDestScenarioOverride('heavy_rain')}
            className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors ${
              destScenarioOverride === 'heavy_rain' ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🌧️ {language === 'hi' ? 'बारिश' : 'Rain'}
          </button>
          <button
            onClick={() => setDestScenarioOverride('heatwave')}
            className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-colors ${
              destScenarioOverride === 'heatwave' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ☀️ {language === 'hi' ? 'धूप' : 'Sun'}
          </button>
        </div>
      </div>
    </div>
  );
};
