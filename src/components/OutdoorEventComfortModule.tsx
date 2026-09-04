import React, { useState } from 'react';
import { 
  PartyPopper, 
  Wind, 
  Thermometer, 
  Droplets, 
  Sparkles, 
  Shirt, 
  Tent, 
  Coffee, 
  Clock, 
  Sliders, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { WeatherCondition } from '../types';
import { calculateOutdoorEventComfort, OutdoorEventComfortResult } from '../utils/comfortIndex';

interface OutdoorEventComfortModuleProps {
  weather: WeatherCondition;
  language: 'en' | 'hi';
}

type EventTimePreset = 'live' | 'afternoon' | 'sunset' | 'evening';

export const OutdoorEventComfortModule: React.FC<OutdoorEventComfortModuleProps> = ({
  weather,
  language
}) => {
  // Preset or custom slider controls
  const [activePreset, setActivePreset] = useState<EventTimePreset>('live');
  const [customTemp, setCustomTemp] = useState<number>(weather.temp);
  const [customHumidity, setCustomHumidity] = useState<number>(weather.humidity);
  const [customWind, setCustomWind] = useState<number>(weather.windSpeed);
  const [showSliders, setShowSliders] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'planner'>('overview');

  // Compute values based on chosen preset or custom
  let evalTemp = customTemp;
  let evalHumidity = customHumidity;
  let evalWind = customWind;

  if (activePreset === 'live') {
    evalTemp = weather.temp;
    evalHumidity = weather.humidity;
    evalWind = weather.windSpeed;
  } else if (activePreset === 'afternoon') {
    evalTemp = Math.round(weather.tempMax);
    evalHumidity = Math.max(25, Math.round(weather.humidity * 0.75));
    evalWind = Math.round(weather.windSpeed * 1.2);
  } else if (activePreset === 'sunset') {
    evalTemp = Math.round((weather.temp + weather.tempMin) / 2 + 2);
    evalHumidity = weather.humidity;
    evalWind = Math.max(5, Math.round(weather.windSpeed * 0.85));
  } else if (activePreset === 'evening') {
    evalTemp = Math.round(weather.tempMin + 1);
    evalHumidity = Math.min(95, Math.round(weather.humidity * 1.2));
    evalWind = Math.max(4, Math.round(weather.windSpeed * 0.7));
  }

  const comfortResult: OutdoorEventComfortResult = calculateOutdoorEventComfort(
    evalTemp,
    evalHumidity,
    evalWind,
    weather.rainProb
  );

  const resetToLive = () => {
    setActivePreset('live');
    setCustomTemp(weather.temp);
    setCustomHumidity(weather.humidity);
    setCustomWind(weather.windSpeed);
    setShowSliders(false);
  };

  return (
    <div id="outdoor-event-comfort-module" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-4">
      {/* 1. Header with Title and Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800/80">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white font-bold shadow-md shadow-pink-500/20">
            <PartyPopper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-extrabold text-white tracking-tight">
                {language === 'hi' ? 'आउटडोर इवेंट कम्फर्ट इंडेक्स' : 'Outdoor Event Comfort Index'}
              </h2>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                Social Planner
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'hi' 
                ? 'तापमान, हवा व नमी का संयुक्त विश्लेषण — शादियों व पार्टियों के लिए' 
                : 'Combined temperature, wind speed & humidity analysis for social gatherings'}
            </p>
          </div>
        </div>

        {/* Preset Selector / Simulator Tabs */}
        <div className="flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 overflow-x-auto scrollbar-none">
          <button
            id="preset-live-btn"
            onClick={() => { setActivePreset('live'); setShowSliders(false); }}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activePreset === 'live' && !showSliders
                ? 'bg-pink-500 text-white shadow-md shadow-pink-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'hi' ? '🔴 वर्तमान लाइव' : '🔴 Current Live'}
          </button>
          <button
            id="preset-sunset-btn"
            onClick={() => { setActivePreset('sunset'); setShowSliders(false); }}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activePreset === 'sunset' && !showSliders
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'hi' ? '🌅 सूर्यास्त पार्टी' : '🌅 Sunset Cocktail'}
          </button>
          <button
            id="preset-evening-btn"
            onClick={() => { setActivePreset('evening'); setShowSliders(false); }}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              activePreset === 'evening' && !showSliders
                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'hi' ? '🌙 रात्रि रिसेप्शन' : '🌙 Evening Dinner'}
          </button>
          <button
            id="preset-custom-slider-btn"
            onClick={() => setShowSliders(!showSliders)}
            title="Custom simulator sliders"
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center space-x-1 ${
              showSliders
                ? 'bg-slate-700 text-pink-300 border border-pink-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>{language === 'hi' ? 'कस्टम' : 'Custom'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Custom Sliders (When Custom is toggled) */}
      {showSliders && (
        <div className="bg-slate-950/90 border border-pink-500/30 rounded-2xl p-3 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-pink-300 flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'कस्टम मौसम सिम्युलेटर (इवेंट प्लानिंग):' : 'Custom Event Weather Simulator:'}</span>
            </span>
            <button
              onClick={resetToLive}
              className="text-[10px] text-slate-400 hover:text-pink-300 flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Temp Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Thermometer className="w-3 h-3 text-amber-400" />
                  <span>Temperature</span>
                </span>
                <span className="font-bold font-mono text-white">{evalTemp}°C</span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                step="1"
                value={evalTemp}
                onChange={(e) => {
                  setCustomTemp(Number(e.target.value));
                  setActivePreset('live');
                }}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>10°C (Cold)</span>
                <span>23°C (Sweet Spot)</span>
                <span>45°C (Extreme)</span>
              </div>
            </div>

            {/* Wind Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Wind className="w-3 h-3 text-teal-400" />
                  <span>Wind Speed</span>
                </span>
                <span className="font-bold font-mono text-white">{evalWind} km/h</span>
              </div>
              <input
                type="range"
                min="0"
                max="45"
                step="1"
                value={evalWind}
                onChange={(e) => {
                  setCustomWind(Number(e.target.value));
                  setActivePreset('live');
                }}
                className="w-full accent-teal-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>0 km/h (Calm)</span>
                <span>10 km/h (Breeze)</span>
                <span>45 km/h (Gale)</span>
              </div>
            </div>

            {/* Humidity Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 flex items-center space-x-1">
                  <Droplets className="w-3 h-3 text-sky-400" />
                  <span>Relative Humidity</span>
                </span>
                <span className="font-bold font-mono text-white">{evalHumidity}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="95"
                step="1"
                value={evalHumidity}
                onChange={(e) => {
                  setCustomHumidity(Number(e.target.value));
                  setActivePreset('live');
                }}
                className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>15% (Dry)</span>
                <span>45% (Optimal)</span>
                <span>95% (Muggy)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Comfort Index Display & Gauges */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Score Badge & Classification */}
          <div className="flex items-center space-x-4">
            <div className="relative flex items-center justify-center">
              {/* Circular Graphic or High-Impact Score Circle */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-950 border border-slate-700/80 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                <div 
                  className={`absolute inset-0 opacity-15 bg-gradient-to-t ${comfortResult.barGradient}`} 
                />
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Index</span>
                <span className="text-2xl font-black font-mono text-white leading-none my-0.5">
                  {comfortResult.score}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">/ 100</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${comfortResult.badgeClass}`}>
                  {language === 'hi' ? comfortResult.titleHi : comfortResult.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {activePreset === 'live' ? '(Live Weather)' : `(${activePreset.toUpperCase()} Preset)`}
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                {language === 'hi' ? comfortResult.advice.verdict.hi : comfortResult.advice.verdict.en}
              </p>
              <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-0.5">
                <span className="flex items-center space-x-1">
                  <span className="text-slate-500">Feels like:</span>
                  <span className="font-mono font-semibold text-slate-200">{comfortResult.apparentTemp}°C</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <span className="text-slate-500">Discomfort Index:</span>
                  <span className="font-mono font-semibold text-slate-200">{comfortResult.breakdown.discomfortIndex}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Best Recommended Time Window */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 min-w-[220px] shrink-0">
            <div className="text-[10px] font-bold text-pink-400 uppercase tracking-wider flex items-center space-x-1 mb-1">
              <Clock className="w-3 h-3" />
              <span>{language === 'hi' ? 'सर्वश्रेष्ठ आयोजन समय:' : 'Recommended Event Window:'}</span>
            </div>
            <div className="text-xs font-semibold text-slate-200">
              {language === 'hi' ? comfortResult.advice.recommendedTimeSlot.hi : comfortResult.advice.recommendedTimeSlot.en}
            </div>
          </div>
        </div>

        {/* Visual Progress Bar for Comfort Index */}
        <div className="mt-3.5 space-y-1">
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${comfortResult.barGradient} transition-all duration-500`}
              style={{ width: `${comfortResult.score}%` }}
            />
          </div>
          <div className="flex justify-between text-[9px] text-slate-500 font-mono">
            <span>0 (Poor / Severe)</span>
            <span>35 (Uncomfortable)</span>
            <span>50 (Moderate)</span>
            <span>70 (Pleasant)</span>
            <span>85-100 (Ideal Gathering)</span>
          </div>
        </div>
      </div>

      {/* 3. The 3 Tri-Factor Breakdown Cards (Temp, Wind, Humidity) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {/* Factor 1: Temperature */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
              <div className="p-1 rounded-lg bg-amber-500/10 text-amber-400">
                <Thermometer className="w-3.5 h-3.5" />
              </div>
              <span>{language === 'hi' ? 'तापमान कारक' : 'Temperature'}</span>
            </div>
            <span className="text-xs font-mono font-bold text-amber-400">{evalTemp}°C</span>
          </div>

          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-400 rounded-full transition-all"
              style={{ width: `${comfortResult.breakdown.tempScore}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Sub-Score: <b className="text-slate-200">{comfortResult.breakdown.tempScore}</b>/100</span>
            <span className="text-slate-500">Optimum: 21–25°C</span>
          </div>

          <p className="text-[10px] text-slate-300 leading-tight">
            {language === 'hi' 
              ? comfortResult.breakdown.tempImpactDescription.hi 
              : comfortResult.breakdown.tempImpactDescription.en}
          </p>
        </div>

        {/* Factor 2: Wind Speed */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
              <div className="p-1 rounded-lg bg-teal-500/10 text-teal-400">
                <Wind className="w-3.5 h-3.5" />
              </div>
              <span>{language === 'hi' ? 'पवन गति कारक' : 'Wind Speed'}</span>
            </div>
            <span className="text-xs font-mono font-bold text-teal-400">{evalWind} km/h</span>
          </div>

          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-400 rounded-full transition-all"
              style={{ width: `${comfortResult.breakdown.windScore}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Sub-Score: <b className="text-slate-200">{comfortResult.breakdown.windScore}</b>/100</span>
            <span className="text-slate-500">Optimum: 6–14 km/h</span>
          </div>

          <p className="text-[10px] text-slate-300 leading-tight">
            {language === 'hi' 
              ? comfortResult.breakdown.windImpactDescription.hi 
              : comfortResult.breakdown.windImpactDescription.en}
          </p>
        </div>

        {/* Factor 3: Humidity */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-200">
              <div className="p-1 rounded-lg bg-sky-500/10 text-sky-400">
                <Droplets className="w-3.5 h-3.5" />
              </div>
              <span>{language === 'hi' ? 'आर्द्रता / उमस' : 'Relative Humidity'}</span>
            </div>
            <span className="text-xs font-mono font-bold text-sky-400">{evalHumidity}%</span>
          </div>

          <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-sky-400 rounded-full transition-all"
              style={{ width: `${comfortResult.breakdown.humidityScore}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Sub-Score: <b className="text-slate-200">{comfortResult.breakdown.humidityScore}</b>/100</span>
            <span className="text-slate-500">Optimum: 40–55%</span>
          </div>

          <p className="text-[10px] text-slate-300 leading-tight">
            {language === 'hi' 
              ? comfortResult.breakdown.humidityImpactDescription.hi 
              : comfortResult.breakdown.humidityImpactDescription.en}
          </p>
        </div>
      </div>

      {/* 4. Actionable Social Gathering Advisory: Catering, Decor, Dress Code */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-pink-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {language === 'hi' ? 'समारोह योजना व व्यवस्था गाइड' : 'Social Gathering Planning Guide'}
            </h3>
          </div>
          {comfortResult.advice.backupIndoorRecommended && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>{language === 'hi' ? 'इनडोर बैकअप अनिवार्य' : 'Indoor Backup Advised'}</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Catering & Food */}
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>{language === 'hi' ? 'खानपान व बेवरेज' : 'Catering & Beverages'}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {language === 'hi' ? comfortResult.advice.catering.hi : comfortResult.advice.catering.en}
            </p>
          </div>

          {/* Venue & Decor */}
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-teal-300">
              <Tent className="w-4 h-4 text-teal-400" />
              <span>{language === 'hi' ? 'टेंट, मंडप व सजावट' : 'Marquee, Tent & Decor'}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {language === 'hi' ? comfortResult.advice.venueDecor.hi : comfortResult.advice.venueDecor.en}
            </p>
          </div>

          {/* Guest Dress Code */}
          <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-300">
              <Shirt className="w-4 h-4 text-sky-400" />
              <span>{language === 'hi' ? 'मेहमानों के लिए वस्त्र सलाह' : 'Guest Dress Code'}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {language === 'hi' ? comfortResult.advice.guestDress.hi : comfortResult.advice.guestDress.en}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
