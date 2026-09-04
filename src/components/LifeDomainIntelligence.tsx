import React, { useState } from 'react';
import {
  HeartPulse,
  Activity,
  Waves,
  Plane,
  Baby,
  Sprout,
  Car,
  PartyPopper,
  AlertTriangle,
  Clock,
  Sun,
  Sunrise,
  Sunset,
  Wind,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  Compass,
  Sparkles,
  Luggage,
  Calendar,
  Eye,
  Check,
  MapPin,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  UserProfile, 
  WeatherScenarioMode,
  LifeDomain 
} from '../types';
import {
  getHealthMetrics,
  getFitnessMetrics,
  getMarineMetrics,
  getTravelMetrics,
  getFamilyMetrics,
  getAgriMetrics,
  getCommuterMetrics,
  getEventMetrics
} from '../data/domainData';

interface LifeDomainIntelligenceProps {
  user: UserProfile;
  scenario: WeatherScenarioMode;
  language: 'en' | 'hi';
}

export const LifeDomainIntelligence: React.FC<LifeDomainIntelligenceProps> = ({
  user,
  scenario,
  language
}) => {
  // Determine default active domain based on user type
  const getDefaultDomain = (): LifeDomain => {
    switch (user.userType) {
      case 'farmer':
        return 'agri';
      case 'traveller':
        return 'travel';
      case 'outdoor_worker':
        return 'health';
      case 'office_worker':
        return 'commute';
      case 'student':
        return 'fitness';
      default:
        return 'health';
    }
  };

  const [activeDomain, setActiveDomain] = useState<LifeDomain>(getDefaultDomain());
  const [checkedPacking, setCheckedPacking] = useState<Record<string, boolean>>({});

  const healthData = getHealthMetrics(scenario);
  const fitnessData = getFitnessMetrics(scenario);
  const marineData = getMarineMetrics(scenario);
  const travelData = getTravelMetrics(scenario);
  const familyData = getFamilyMetrics(scenario);
  const agriData = getAgriMetrics(scenario);
  const commuterData = getCommuterMetrics(scenario);
  const eventData = getEventMetrics(scenario);

  const togglePackingItem = (item: string) => {
    setCheckedPacking(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const domainTabs = [
    { id: 'health' as LifeDomain, label: language === 'hi' ? 'स्वास्थ्य व एलर्जी' : 'Health & Allergies', icon: HeartPulse, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { id: 'fitness' as LifeDomain, label: language === 'hi' ? 'आउटडोर फिटनेस' : 'Outdoor Fitness', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'marine' as LifeDomain, label: language === 'hi' ? 'तटीय व सर्फिंग' : 'Beach & Surfing', icon: Waves, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { id: 'travel' as LifeDomain, label: language === 'hi' ? 'यात्री व उड़ान' : 'Travel & Flights', icon: Plane, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { id: 'family' as LifeDomain, label: language === 'hi' ? 'अभिभावक व परिवार' : 'Parents & Families', icon: Baby, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'agri' as LifeDomain, label: language === 'hi' ? 'कृषि व बागवानी' : 'Agriculture & Gardeners', icon: Sprout, color: 'text-lime-400', bg: 'bg-lime-500/10' },
    { id: 'commute' as LifeDomain, label: language === 'hi' ? 'यातायात व हाईवे' : 'Commuters & Traffic', icon: Car, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'events' as LifeDomain, label: language === 'hi' ? 'इवेंट व शादियां' : 'Event Planners', icon: PartyPopper, color: 'text-pink-400', bg: 'bg-pink-500/10' }
  ];

  return (
    <div id="life-domain-intelligence-container" className="space-y-3">
      {/* Header with Title & Context indicator */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-xs font-bold text-white tracking-wide">
            {language === 'hi' ? 'विशिष्ट मौसम बुद्धिमत्ता (8 श्रेणियां)' : 'Specialized Weather Intelligence'}
          </h3>
        </div>
        <span className="text-[10px] text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-800/80 font-mono">
          IMD & Nowcast Ready
        </span>
      </div>

      {/* Horizontal Scrollable Tabs */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
        {domainTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeDomain === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveDomain(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                isActive 
                  ? 'bg-slate-800 text-white border-sky-400/60 shadow-md shadow-sky-500/10' 
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Domain Specific Render Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        
        {/* ================= 1. HEALTH-CONSCIOUS USERS ================= */}
        {activeDomain === 'health' && (
          <div id="health-intelligence-view" className="space-y-3.5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'hi' ? 'स्वास्थ्य, एलर्जी व त्वचा सुरक्षा' : 'Health, Allergy & Skin Advisory'}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {language === 'hi' ? 'अस्थमा, परागकण व यूवी इंडेक्स निगरानी' : 'Targeted for allergy, asthma & sensitive skin'}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                healthData.aqi <= 50 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                healthData.aqi <= 100 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}>
                AQI {healthData.aqi} • {healthData.aqiStatus}
              </span>
            </div>

            {/* 4 Health Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Particulates</span>
                  <Activity className="w-3 h-3 text-sky-400" />
                </div>
                <div className="text-sm font-bold text-white font-mono mt-1">
                  PM2.5: {healthData.pm25}
                </div>
                <div className="text-[9px] text-slate-400">PM10: {healthData.pm10} µg/m³</div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>UV Index</span>
                  <Sun className="w-3 h-3 text-amber-400" />
                </div>
                <div className="text-sm font-bold text-white font-mono mt-1">
                  {healthData.uvIndex} • {healthData.uvStatus}
                </div>
                <div className="text-[9px] text-slate-400">
                  {healthData.uvIndex >= 6 ? 'SPF 30+ needed' : 'Safe exposure'}
                </div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Humidity</span>
                  <Droplets className="w-3 h-3 text-blue-400" />
                </div>
                <div className="text-sm font-bold text-white font-mono mt-1">
                  {healthData.humidity}%
                </div>
                <div className="text-[9px] text-slate-400">
                  {healthData.humidity > 80 ? 'High dampness' : 'Comfortable'}
                </div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Asthma Trigger</span>
                  <AlertTriangle className="w-3 h-3 text-rose-400" />
                </div>
                <div className={`text-sm font-bold font-mono mt-1 ${
                  healthData.asthmaRisk === 'High' ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {healthData.asthmaRisk} Risk
                </div>
                <div className="text-[9px] text-slate-400">{healthData.skinSensitivityIndex}</div>
              </div>
            </div>

            {/* Pollen Breakdown Bar */}
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>{language === 'hi' ? 'परागकण विश्लेषण (Pollen Count):' : 'Allergenic Pollen Breakdown:'}</span>
                <span className="text-[9px] text-slate-400">Botanical Sensors</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Grass Pollen</div>
                  <div className={`font-bold mt-0.5 ${healthData.pollenGrass === 'Very High' || healthData.pollenGrass === 'High' ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {healthData.pollenGrass}
                  </div>
                </div>
                <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Tree Pollen</div>
                  <div className="font-bold text-amber-400 mt-0.5">
                    {healthData.pollenTree}
                  </div>
                </div>
                <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Weed Pollen</div>
                  <div className="font-bold text-emerald-400 mt-0.5">
                    {healthData.pollenWeed}
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Guidance Box */}
            <div className="bg-rose-950/20 border border-rose-500/20 p-2.5 rounded-xl text-xs text-slate-300 flex items-start space-x-2">
              <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {language === 'hi' ? healthData.guidanceHi : healthData.guidance}
              </p>
            </div>
          </div>
        )}

        {/* ================= 2. OUTDOOR FITNESS ENTHUSIASTS ================= */}
        {activeDomain === 'fitness' && (
          <div id="fitness-intelligence-view" className="space-y-3.5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'hi' ? 'आउटडोर रनिंग व फिटनेस योजना' : 'Outdoor Fitness & Running Intelligence'}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {language === 'hi' ? 'सर्वोत्तम रनिंग घंटे, सूर्योदय व हवा गति' : 'Best running hours, wind speed & heat strain'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-[10px] text-slate-300 font-mono bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                <Sunrise className="w-3 h-3 text-amber-400" />
                <span>{fitnessData.sunrise}</span>
                <span className="text-slate-600">|</span>
                <Sunset className="w-3 h-3 text-indigo-400" />
                <span>{fitnessData.sunset}</span>
              </div>
            </div>

            {/* Best Running Hours Recommendation */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>{language === 'hi' ? 'सर्वश्रेष्ठ रनिंग घंटे (Best Running Hours):' : 'Optimal Running Time Windows:'}</span>
                <span className="text-[9px] text-emerald-400 font-mono">Aerobic Comfort Index</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {fitnessData.bestRunningHours.map((slot, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      slot.status === 'optimal' 
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-200' 
                        : slot.status === 'moderate'
                        ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                        : 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{slot.time}</span>
                      </div>
                      <div className="text-[10px] opacity-80 mt-0.5">{slot.note}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                        slot.status === 'optimal' ? 'bg-emerald-500/30 text-emerald-300' :
                        slot.status === 'moderate' ? 'bg-amber-500/30 text-amber-300' : 'bg-rose-500/30 text-rose-300'
                      }`}>
                        {slot.score}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Metrics (Wind & Hydration) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Wind & Resistance</span>
                  <Wind className="w-3 h-3 text-sky-400" />
                </div>
                <div className="text-sm font-bold text-white font-mono mt-1">
                  {fitnessData.windSpeed} km/h
                </div>
                <div className="text-[9px] text-slate-400">Gusts: {fitnessData.windGusts} km/h</div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Hydration Target</span>
                  <Droplets className="w-3 h-3 text-cyan-400" />
                </div>
                <div className="text-xs font-bold text-white mt-1">
                  {fitnessData.hydrationRequirement}
                </div>
                <div className="text-[9px] text-amber-400">Heat Alert: {fitnessData.heatStressAlert}</div>
              </div>
            </div>

            {/* Workout Advisory */}
            <div className="bg-emerald-950/20 border border-emerald-500/20 p-2.5 rounded-xl text-xs text-slate-200">
              {language === 'hi' ? fitnessData.workoutWindowTextHi : fitnessData.workoutWindowText}
            </div>
          </div>
        )}

        {/* ================= 3. BEACHGOERS & SURFERS ================= */}
        {activeDomain === 'marine' && (
          <div id="marine-intelligence-view" className="space-y-3.5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Waves className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'hi' ? 'तटीय मौसम, लहरें व ज्वार-भाटा' : 'Marine, Beach & Surfing Conditions'}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {language === 'hi' ? 'ज्वार समय, लहर ऊंचाई, जल तापमान व चेतावनी' : 'Tide times, swell height & coastal bulletin'}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                marineData.seaCondition === 'Calm' || marineData.seaCondition === 'Moderate'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                Sea: {marineData.seaCondition}
              </span>
            </div>

            {/* Marine Primary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Next High Tide</div>
                <div className="text-sm font-bold text-cyan-400 font-mono mt-1">
                  {marineData.tideHigh}
                </div>
                <div className="text-[9px] text-slate-400">Height: {marineData.tideHighHeight}</div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Next Low Tide</div>
                <div className="text-sm font-bold text-slate-200 font-mono mt-1">
                  {marineData.tideLow}
                </div>
                <div className="text-[9px] text-slate-400">Height: {marineData.tideLowHeight}</div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Wave & Swell</div>
                <div className="text-sm font-bold text-white font-mono mt-1">
                  {marineData.waveHeightM} m
                </div>
                <div className="text-[9px] text-slate-400">Period: {marineData.swellPeriodSec}s</div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Water Temp</div>
                <div className="text-sm font-bold text-white font-mono mt-1">
                  {marineData.waterTempC}°C
                </div>
                <div className="text-[9px] text-emerald-400 font-semibold">Surf: {marineData.surfQuality}</div>
              </div>
            </div>

            {/* Port & Fishermen Warning Bulletin */}
            <div className="bg-cyan-950/20 border border-cyan-500/20 p-2.5 rounded-xl space-y-1.5">
              <div className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center space-x-1">
                <AlertTriangle className="w-3 h-3 text-cyan-400" />
                <span>{language === 'hi' ? 'बंदरगाह चेतावनी व मछुआरा बुलेटिन:' : 'Port Warning & Coastal Marine Bulletin:'}</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {language === 'hi' ? marineData.fishermenAdvisoryHi : marineData.fishermenAdvisory}
              </p>
              <div className="text-[10px] text-slate-400 font-mono pt-1 border-t border-cyan-500/10">
                Signal: {marineData.portWarning}
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. TRAVELERS & FLIGHTS ================= */}
        {activeDomain === 'travel' && (
          <div id="travel-intelligence-view" className="space-y-3.5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'hi' ? 'यात्रा, उड़ान व पैकिंग सहायता' : 'Travel, Flights & Luggage Advisor'}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {language === 'hi' ? 'उड़ान मौसम, गंतव्य अलर्ट व पैकिंग सुझाव' : 'Destination weather, turbulence alerts & smart packing'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800">
                Aviation Met
              </span>
            </div>

            {/* Flight Weather Notice */}
            <div className="bg-amber-950/20 border border-amber-500/20 p-2.5 rounded-xl text-xs text-amber-200 flex items-start space-x-2">
              <Plane className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {language === 'hi' ? travelData.flightAdvisoryHi : travelData.flightAdvisory}
              </p>
            </div>

            {/* Saved Destinations Cards */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {language === 'hi' ? 'सहेजे गए गंतव्यों का मौसम:' : 'Saved Destination Weather & Packing Insights:'}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {travelData.savedDestinations.map((dest, i) => (
                  <div key={i} className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 font-bold text-white text-xs">
                        <MapPin className="w-3 h-3 text-amber-400" />
                        <span>{dest.city}, {dest.country}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-white">{dest.temp}°C</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{dest.condition}</span>
                      <span className={`px-1.5 py-0.2 rounded font-semibold ${
                        dest.flightAlert === 'Normal' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                      }`}>
                        {dest.flightAlert}
                      </span>
                    </div>
                    <div className="text-[10px] text-sky-300 bg-slate-900/90 p-1 rounded-md border border-slate-800 flex items-center space-x-1">
                      <Luggage className="w-3 h-3 text-sky-400 shrink-0" />
                      <span className="truncate">{language === 'hi' ? dest.packingTipHi : dest.packingTip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Packing Checklist */}
            <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>{language === 'hi' ? 'स्मार्ट यात्रा पैकिंग चेकलिस्ट:' : 'Smart Travel Packing Checklist:'}</span>
                <span className="text-[9px] text-slate-500">Tap to cross off</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {travelData.packingChecklist.map((item, idx) => {
                  const isDone = !!checkedPacking[item];
                  return (
                    <button
                      key={idx}
                      onClick={() => togglePackingItem(item)}
                      className={`flex items-center space-x-2 p-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer border ${
                        isDone 
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-500 line-through' 
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                        isDone ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-slate-600'
                      }`}>
                        {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="truncate">{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. PARENTS & FAMILIES ================= */}
        {activeDomain === 'family' && (
          <div id="family-intelligence-view" className="space-y-3.5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Baby className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'hi' ? 'अभिभावक व स्कूल सुरक्षा' : 'Parents, School Commute & Families'}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {language === 'hi' ? 'स्कूल बस स्टॉप, बारिश अलर्ट व खेल सुरक्षा' : 'Bus stop rain chances, school safety & child care'}
                  </p>
                </div>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                familyData.schoolCommuteSafety === 'Safe' 
                  ? 'bg-emerald-500/20 text-emerald-300' 
                  : 'bg-amber-500/20 text-amber-300'
              }`}>
                {familyData.schoolCommuteSafety}
              </span>
            </div>

            {/* School Bus Stop Window Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Morning Bus Stop</div>
                <div className="text-xs font-bold text-white mt-1">
                  {familyData.morningBusTime}
                </div>
                <div className={`text-[10px] font-mono font-bold mt-0.5 ${familyData.morningBusStopRainProb > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {familyData.morningBusStopRainProb}% Rain Chance
                </div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Afternoon Pickup</div>
                <div className="text-xs font-bold text-white mt-1">
                  02:00 PM - 03:15 PM
                </div>
                <div className="text-[10px] font-mono text-sky-400 font-bold mt-0.5">
                  {familyData.afternoonPickupRainProb}% Rain Chance
                </div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Playground Safety</div>
                <div className="text-xs font-bold text-purple-300 mt-1">
                  {familyData.playgroundSafetyIndex}
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5">Recess window check</div>
              </div>
            </div>

            {/* Child Care & Hydration Advisory */}
            <div className="bg-purple-950/20 border border-purple-500/20 p-2.5 rounded-xl text-xs text-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">
                {language === 'hi' ? 'बाल देखभाल व पोशाक सुझाव:' : 'Pediatric Weather Guidance:'}
              </div>
              <p className="leading-relaxed">
                {language === 'hi' ? familyData.childHydrationAdvisoryHi : familyData.childHydrationAdvisory}
              </p>
            </div>

            {familyData.severeWarningSummary && (
              <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-[10px] text-slate-400 flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{familyData.severeWarningSummary}</span>
              </div>
            )}
          </div>
        )}

        {/* ================= 6. AGRICULTURE & GARDENERS ================= */}
        {activeDomain === 'agri' && (
          <div id="agri-intelligence-view" className="space-y-3.5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-500/20">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'hi' ? 'कृषि, बागवानी व फसल सुरक्षा' : 'Agriculture, Gardening & Agromet Advisory'}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {language === 'hi' ? 'मिट्टी की नमी, 5-दिवसीय वर्षा व छिड़काव गाइड' : 'Soil moisture, 5-day rainfall & spraying guidance'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-lime-500/20 text-lime-300 border border-lime-500/30">
                IMD Agromet
              </span>
            </div>

            {/* Farm Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Soil Moisture (0-10cm)</div>
                <div className="text-sm font-bold text-lime-400 font-mono mt-1">
                  {agriData.topsoilMoisturePct ?? agriData.soilMoisturePct}%
                </div>
                <div className="text-[9px] text-slate-400">Root zone: {agriData.rootZoneMoisturePct ?? agriData.soilMoisturePct}%</div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">5-Day Rain Forecast</div>
                <div className="text-sm font-bold text-sky-400 font-mono mt-1">
                  {agriData.fiveDayRainfallMm} mm
                </div>
                <div className="text-[9px] text-slate-400">ET₀: {agriData.evapotranspirationMm ?? 3.4} mm/d</div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Frost Freeze Risk</div>
                <div className={`text-sm font-bold font-mono mt-1 ${
                  agriData.frostRisk !== 'None' ? 'text-sky-300' : 'text-slate-200'
                }`}>
                  {agriData.frostRisk}
                </div>
                <div className="text-[9px] text-slate-400">Min: {agriData.predictedMinTemp ?? 18}°C</div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Foliar Spray Suitability</div>
                <div className={`text-xs font-bold mt-1 ${
                  agriData.spraySuitability.includes('Safe') ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {agriData.spraySuitability}
                </div>
              </div>
            </div>

            {/* Suggested Seasonal Tasks */}
            {agriData.suggestedTasks && agriData.suggestedTasks.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {language === 'hi' ? 'तापमान अनुसार अनुशंसित कार्य:' : 'Recommended Tasks for Current Conditions:'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {agriData.suggestedTasks.slice(0, 2).map((t) => (
                    <div key={t.id} className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 flex items-start space-x-2 text-[11px]">
                      <span className="text-lime-400 mt-0.5">•</span>
                      <div>
                        <span className="font-semibold text-slate-200">{language === 'hi' ? t.taskHi : t.task}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{language === 'hi' ? t.descriptionHi : t.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seasonal Planting Guidance */}
            <div className="bg-lime-950/20 border border-lime-500/20 p-2.5 rounded-xl text-xs text-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-lime-300 uppercase tracking-wider flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3 text-lime-400" />
                <span>{language === 'hi' ? 'फसल बुवाई व छिड़काव दिशा-निर्देश:' : 'Seasonal Crop & Planting Guidance:'}</span>
              </div>
              <p className="leading-relaxed">
                {language === 'hi' ? agriData.plantingGuidanceHi : agriData.plantingGuidance}
              </p>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-lime-500/10">
                Bulletin: {agriData.agrometBulletin}
              </div>
            </div>
          </div>
        )}

        {/* ================= 7. COMMUTERS & TRAFFIC ================= */}
        {activeDomain === 'commute' && (
          <div id="commute-intelligence-view" className="space-y-3.5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'hi' ? 'कम्यूटर, हाईवे व ट्रैफिक मौसम' : 'Commuter, Highway & Traffic Weather'}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {language === 'hi' ? 'NHAI हाईवे अलर्ट, दृश्यता, कोहरा व जलभराव' : 'NHAI nowcast, road visibility & underpass flood risk'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30">
                NHAI Connected
              </span>
            </div>

            {/* Commute Key Factors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Highway Visibility</div>
                <div className="text-sm font-bold text-white font-mono mt-1">
                  {commuterData.highwayVisibilityKm} km
                </div>
                <div className="text-[9px] text-amber-400">{commuterData.visibilityStatus}</div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Transit Congestion</div>
                <div className="text-sm font-bold text-rose-400 font-mono mt-1">
                  {commuterData.trafficDelayMultiplier}
                </div>
                <div className="text-[9px] text-slate-400">Weather delay impact</div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Underpass Ponding</div>
                <div className={`text-sm font-bold mt-1 ${
                  commuterData.underpassFloodRisk.includes('High') ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {commuterData.underpassFloodRisk}
                </div>
                <div className="text-[9px] text-slate-400">Submersion safety</div>
              </div>
            </div>

            {/* NHAI Highway Warning Box */}
            <div className="bg-blue-950/20 border border-blue-500/20 p-2.5 rounded-xl text-xs text-slate-200 space-y-1.5">
              <div className="text-[10px] font-bold text-blue-300 uppercase tracking-wider flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 text-blue-400" />
                <span>{language === 'hi' ? 'NHAI हाईवे नाउकास्ट व अलर्ट:' : 'NHAI Highway Nowcast Warning:'}</span>
              </div>
              <p className="leading-relaxed">
                {commuterData.nhaiNowcastWarning}
              </p>
              <div className="text-[10px] text-sky-300 font-medium pt-1 border-t border-blue-500/10">
                {language === 'hi' ? commuterData.corridorAlertHi : commuterData.corridorAlert}
              </div>
            </div>
          </div>
        )}

        {/* ================= 8. EVENT PLANNERS ================= */}
        {activeDomain === 'events' && (
          <div id="events-intelligence-view" className="space-y-3.5 animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  <PartyPopper className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {language === 'hi' ? 'इवेंट, शादियां व समारोह योजना' : 'Event, Wedding & Outdoor Gathering Planner'}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {language === 'hi' ? 'बारिश प्रायिकता वक्र, कम्फर्ट इंडेक्स व टेंट सुरक्षा' : 'Rain probability curve, Comfort Index & marquee rating'}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-300 border border-pink-500/30">
                Index: {eventData.comfortIndex}/100
              </span>
            </div>

            {/* Rain Probability Trajectory Curve */}
            <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 space-y-2">
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>{language === 'hi' ? 'समारोह समय में वर्षा प्रायिकता:' : 'Precipitation Probability Timeline (Event Window):'}</span>
                <span className="text-[9px] text-sky-400">Hourly Radar Nowcast</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5 text-center">
                {eventData.rainProbabilityCurve.map((slot, idx) => (
                  <div key={idx} className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                    <div className="text-[9px] text-slate-400">{slot.time}</div>
                    <div className="h-10 flex items-end justify-center my-1">
                      <div 
                        className={`w-3 rounded-t transition-all ${
                          slot.prob > 60 ? 'bg-rose-500' : slot.prob > 25 ? 'bg-amber-400' : 'bg-sky-400'
                        }`}
                        style={{ height: `${Math.max(12, slot.prob)}%` }}
                      />
                    </div>
                    <div className="text-[10px] font-mono font-bold text-white">{slot.prob}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outdoor Comfort Index & Photography Golden Hour */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Outdoor Comfort Level</span>
                  <span className="font-mono font-bold text-pink-400">{eventData.comfortIndex}/100</span>
                </div>
                <div className="text-xs font-bold text-white mt-1">
                  {eventData.comfortLevel}
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5">
                  Feels like {eventData.apparentTemp ?? 24}°C (Tri-Factor Index)
                </div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Golden Hour (Photography)</div>
                <div className="text-xs font-bold text-amber-300 mt-1">
                  {eventData.goldenHourPhotoTime}
                </div>
                <div className="text-[9px] text-slate-400 mt-0.5">{eventData.tentWindRequirement}</div>
              </div>
            </div>

            {/* Tri-Factor Component Scores: Temp, Wind, Humidity */}
            {eventData.tempFactorScore !== undefined && (
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>{language === 'hi' ? 'कम्फर्ट इंडेक्स कारक विश्लेषण:' : 'Comfort Index Factor Weights (Temp + Wind + Humidity):'}</span>
                  <span className="text-[9px] text-pink-400">Social Gathering Model</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                  <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">🌡️ Temperature</span>
                    <span className="font-mono font-bold text-amber-400">{eventData.tempFactorScore}/100</span>
                  </div>
                  <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">💨 Wind Speed</span>
                    <span className="font-mono font-bold text-teal-400">{eventData.windFactorScore}/100</span>
                  </div>
                  <div className="bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[9px]">💧 Humidity</span>
                    <span className="font-mono font-bold text-sky-400">{eventData.humidityFactorScore}/100</span>
                  </div>
                </div>
                {eventData.factorsSummary && (
                  <p className="text-[10px] text-slate-300 pt-0.5">
                    {language === 'hi' ? eventData.factorsSummaryHi : eventData.factorsSummary}
                  </p>
                )}
              </div>
            )}

            {/* Indoor Backup Plan Advisory */}
            <div className="bg-pink-950/20 border border-pink-500/20 p-2.5 rounded-xl text-xs text-slate-200 space-y-1">
              <div className="text-[10px] font-bold text-pink-300 uppercase tracking-wider">
                {language === 'hi' ? 'बैकअप इनडोर योजना व शामियाना सलाह:' : 'Contingency & Venue Setup Recommendation:'}
              </div>
              <p className="leading-relaxed">
                {language === 'hi' ? eventData.backupIndoorAdvisoryHi : eventData.backupIndoorAdvisory}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
