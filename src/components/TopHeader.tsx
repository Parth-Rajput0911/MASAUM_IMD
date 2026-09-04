import React, { useState } from 'react';
import { MapPin, Sparkles, Languages, ChevronDown, Check, Info, ShieldAlert } from 'lucide-react';
import { UserProfile, WeatherScenarioMode, SavedLocation } from '../types';

interface TopHeaderProps {
  user: UserProfile;
  scenario: WeatherScenarioMode;
  onOpenSimulator: () => void;
  onOpenPersonaModal: () => void;
  onOpenSystemInfoModal: () => void;
  onSelectLocation: (locId: string) => void;
  onToggleLanguage: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  user,
  scenario,
  onOpenSimulator,
  onOpenPersonaModal,
  onOpenSystemInfoModal,
  onSelectLocation,
  onToggleLanguage
}) => {
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const activeLocation = user.savedLocations.find(l => l.id === user.activeLocationId) || user.savedLocations[0];

  const getScenarioBadge = () => {
    switch (scenario) {
      case 'heavy_rain':
        return { label: 'Heavy Rain 🌧️', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
      case 'heatwave':
        return { label: 'Heatwave ☀️', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'severe':
        return { label: 'Severe Squall ⚡', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      default:
        return { label: 'Normal 🌤️', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    }
  };

  const scBadge = getScenarioBadge();

  return (
    <header id="top-app-header" className="px-4 py-2 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
      {/* Upper row: Brand & Tools */}
      <div className="flex items-center justify-between">
        {/* Brand & Live Badge */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-amber-400 p-0.5 shadow-md shadow-sky-500/20">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-amber-300">
                M
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="text-sm font-extrabold tracking-tight text-white flex items-center">
                MAUSAM <span className="text-amber-400 font-black ml-1 text-[10px] px-1.5 py-0.5 bg-amber-400/15 border border-amber-400/30 rounded-md tracking-normal">IMD</span>
              </h1>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-sky-400/20 text-sky-300 border border-sky-400/30">
                Live AI
              </span>
            </div>
            <p className="text-[9px] text-slate-400 tracking-tight">
              {user.language === 'hi' ? 'स्मार्ट व्यक्तिगत मौसम मंच' : 'Context-Aware Weather Intelligence'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5">
          {/* Condition Simulator Quick Trigger */}
          <button
            id="header-condition-simulator-btn"
            onClick={onOpenSimulator}
            className={`px-2 py-1 rounded-full text-[10px] font-bold border flex items-center space-x-1 transition-all cursor-pointer ${scBadge.color}`}
            title="Simulate Weather Scenario"
          >
            <span>{scBadge.label}</span>
          </button>

          {/* Language Switcher */}
          <button
            id="toggle-language-btn"
            onClick={onToggleLanguage}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs font-bold"
            title="Toggle English / Hindi"
          >
            <div className="flex items-center space-x-1">
              <Languages className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[10px]">{user.language === 'hi' ? 'अ' : 'En'}</span>
            </div>
          </button>

          {/* Architecture info modal */}
          <button
            id="open-system-info-btn"
            onClick={onOpenSystemInfoModal}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="System Architecture & ML Specifications"
          >
            <Info className="w-3.5 h-3.5 text-indigo-400" />
          </button>
        </div>
      </div>

      {/* Lower row: Location Pill & Persona Tag */}
      <div className="mt-2 flex items-center justify-between text-xs">
        {/* Location Dropdown Toggle */}
        <div className="relative">
          <button
            id="location-selector-dropdown-btn"
            onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}
            className="flex items-center space-x-1.5 text-white bg-slate-800/80 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span className="font-semibold text-[11px] max-w-[130px] truncate">
              {activeLocation.name}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {locationDropdownOpen && (
            <div 
              id="saved-locations-dropdown"
              className="absolute left-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1 z-50 animate-fade-in"
            >
              <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                {user.language === 'hi' ? 'सहेजे गए स्थान' : 'Saved Locations'}
              </div>
              {user.savedLocations.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => {
                    onSelectLocation(loc.id);
                    setLocationDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                    loc.id === user.activeLocationId 
                      ? 'bg-sky-500/20 text-sky-300 font-semibold' 
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="truncate">
                    <div>{loc.name}</div>
                    <div className="text-[10px] text-slate-400">{loc.city}, {loc.state}</div>
                  </div>
                  {loc.id === user.activeLocationId && <Check className="w-3.5 h-3.5 text-sky-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Persona Pill */}
        <button
          id="active-persona-pill-btn"
          onClick={onOpenPersonaModal}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/50 transition-colors cursor-pointer text-[11px]"
        >
          <span className="text-[10px] text-indigo-400">👤 {user.name.split(' ')[0]}</span>
          <span className="font-bold capitalize">({user.userType.replace('_', ' ')})</span>
        </button>
      </div>
    </header>
  );
};
