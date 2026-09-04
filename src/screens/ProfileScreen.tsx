import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Languages, 
  Trash2, 
  Plus, 
  Check, 
  Info,
  LogOut,
  Settings,
  Car,
  Bus,
  Bike,
  Navigation
} from 'lucide-react';
import { UserProfile, UserType, WeatherInterest, SavedLocation } from '../types';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onOpenPersonaModal: () => void;
  onOpenSystemInfoModal: () => void;
  onLogout: () => void;
  language: 'en' | 'hi';
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  onOpenPersonaModal,
  onOpenSystemInfoModal,
  onLogout,
  language
}) => {
  const [allowLocation, setAllowLocation] = useState(user.privacySettings?.allowLocationTracking ?? true);
  const [saveHistory, setSaveHistory] = useState(user.privacySettings?.saveInteractionHistory ?? true);
  const [newLocName, setNewLocName] = useState('');
  const [newLocCity, setNewLocCity] = useState('');
  const [showAddLoc, setShowAddLoc] = useState(false);

  const allInterests: { id: WeatherInterest; label: string; icon: string }[] = [
    { id: 'rain', label: language === 'hi' ? 'बारिश' : 'Rain & Monsoon', icon: '🌧️' },
    { id: 'temperature', label: language === 'hi' ? 'तापमान/लू' : 'Temperature/Loo', icon: '☀️' },
    { id: 'aqi', label: language === 'hi' ? 'वायु गुणवत्ता' : 'Air Quality (AQI)', icon: '💨' },
    { id: 'uv', label: language === 'hi' ? 'यूवी इंडेक्स' : 'UV Radiation', icon: '🕶️' },
    { id: 'severe_weather', label: language === 'hi' ? 'भीषण मौसम' : 'Severe Weather', icon: '⚡' },
    { id: 'agriculture', label: language === 'hi' ? 'कृषि मौसम' : 'Agriculture/Farming', icon: '🌾' },
  ];

  const toggleInterest = (intId: WeatherInterest) => {
    let updated: WeatherInterest[];
    if (user.interests.includes(intId)) {
      if (user.interests.length <= 1) return;
      updated = user.interests.filter(i => i !== intId);
    } else {
      updated = [...user.interests, intId];
    }
    onUpdateUser({ ...user, interests: updated });
  };

  const handleAddLocation = () => {
    if (!newLocName || !newLocCity) return;
    const newLoc: SavedLocation = {
      id: 'loc_' + Date.now(),
      name: newLocName,
      type: 'office',
      city: newLocCity,
      state: 'India',
      lat: 28.6139 + (Math.random() - 0.5) * 0.1,
      lon: 77.2090 + (Math.random() - 0.5) * 0.1
    };
    onUpdateUser({
      ...user,
      savedLocations: [...user.savedLocations, newLoc]
    });
    setNewLocName('');
    setNewLocCity('');
    setShowAddLoc(false);
  };

  const handleRemoveLocation = (locId: string) => {
    if (user.savedLocations.length <= 1) return;
    const filtered = user.savedLocations.filter(l => l.id !== locId);
    onUpdateUser({
      ...user,
      savedLocations: filtered,
      activeLocationId: user.activeLocationId === locId ? filtered[0].id : user.activeLocationId
    });
  };

  return (
    <div id="profile-screen" className="space-y-4 pb-24 px-4 pt-2 max-w-md mx-auto animate-fade-in text-white">
      {/* User Header Profile Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/80 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-sky-500/25">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-white truncate">{user.name}</h1>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
            <div className="mt-1.5 flex items-center space-x-2">
              <button
                onClick={onOpenPersonaModal}
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30 cursor-pointer capitalize"
              >
                Role: {user.userType.replace('_', ' ')} ⇄
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Interests Manager */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-md">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          <span>{language === 'hi' ? 'मौसम प्राथमिकताएं' : 'Weather Preferences & Weights'}</span>
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {allInterests.map((interest) => {
            const isSelected = user.interests.includes(interest.id);

            return (
              <button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                  isSelected 
                    ? 'bg-sky-500/15 border-sky-400 text-white font-semibold' 
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{interest.icon}</span>
                  <span className="text-[11px] truncate">{interest.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Saved Locations Manager */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span>{language === 'hi' ? 'सहेजे गए स्थान' : 'Saved Locations'}</span>
          </h2>
          <button
            onClick={() => setShowAddLoc(!showAddLoc)}
            className="text-[11px] text-sky-400 hover:text-sky-300 font-bold flex items-center space-x-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'स्थान जोड़ें' : 'Add New'}</span>
          </button>
        </div>

        {showAddLoc && (
          <div className="mb-3 p-3 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2 animate-fade-in">
            <input
              type="text"
              placeholder="Location Label (e.g. DU North Campus, Office)"
              value={newLocName}
              onChange={(e) => setNewLocName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
            />
            <input
              type="text"
              placeholder="City (e.g. Delhi, Bengaluru)"
              value={newLocCity}
              onChange={(e) => setNewLocCity(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
            />
            <div className="flex justify-end space-x-2 pt-1">
              <button
                onClick={() => setShowAddLoc(false)}
                className="text-xs text-slate-400 px-2.5 py-1 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLocation}
                className="text-xs font-bold bg-sky-500 text-white px-3 py-1 rounded-lg cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {user.savedLocations.map((loc) => (
            <div
              key={loc.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                loc.id === user.activeLocationId 
                  ? 'bg-sky-500/10 border-sky-500/30 text-white' 
                  : 'bg-slate-800/50 border-slate-800 text-slate-300'
              }`}
            >
              <div className="flex items-center space-x-2.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <div className="truncate">
                  <div className="font-bold">{loc.name}</div>
                  <div className="text-[10px] text-slate-400">{loc.city}, {loc.state}</div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {loc.id !== user.activeLocationId && (
                  <button
                    onClick={() => onUpdateUser({ ...user, activeLocationId: loc.id })}
                    className="text-[10px] font-bold text-sky-400 hover:underline cursor-pointer"
                  >
                    Set Active
                  </button>
                )}
                {user.savedLocations.length > 1 && (
                  <button
                    onClick={() => handleRemoveLocation(loc.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Commute Route Info */}
      {user.commuteProfile && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-md">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'hi' ? 'दैनिक कम्यूट प्रोफ़ाइल' : 'Daily Commute Route'}</span>
          </h2>
          <div className="text-xs text-slate-300 space-y-1 bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/60">
            <div className="flex justify-between">
              <span className="text-slate-400">Mode:</span>
              <span className="font-bold capitalize">{user.commuteProfile.preferredMode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Morning Shift:</span>
              <span className="font-mono">{user.commuteProfile.morningDeparture} AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Evening Shift:</span>
              <span className="font-mono">{user.commuteProfile.eveningDeparture} PM</span>
            </div>
          </div>
        </div>
      )}

      {/* Privacy & Diagnostics */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-md space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>{language === 'hi' ? 'गोपनीयता व डेटा नियंत्रण' : 'Privacy & Architecture Specs'}</span>
        </h2>

        <div className="space-y-2 text-xs">
          <label className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 cursor-pointer">
            <span className="text-slate-300">Geo-Location Precise Tracking</span>
            <input
              type="checkbox"
              checked={allowLocation}
              onChange={(e) => {
                const checked = e.target.checked;
                setAllowLocation(checked);
                onUpdateUser({
                  ...user,
                  privacySettings: {
                    saveInteractionHistory: saveHistory,
                    ...(user.privacySettings || {}),
                    allowLocationTracking: checked
                  }
                });
              }}
              className="accent-sky-500 w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 cursor-pointer">
            <span className="text-slate-300">Interaction History for AI Personalization</span>
            <input
              type="checkbox"
              checked={saveHistory}
              onChange={(e) => {
                const checked = e.target.checked;
                setSaveHistory(checked);
                onUpdateUser({
                  ...user,
                  privacySettings: {
                    allowLocationTracking: allowLocation,
                    ...(user.privacySettings || {}),
                    saveInteractionHistory: checked
                  }
                });
              }}
              className="accent-sky-500 w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        <button
          onClick={onOpenSystemInfoModal}
          className="w-full py-2.5 px-3 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-900/60 text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <Info className="w-4 h-4" />
          <span>View System Architecture & ML Pipeline</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Sign Out / Switch Account</span>
        </button>
      </div>
    </div>
  );
};
