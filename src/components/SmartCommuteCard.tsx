import React from 'react';
import { Navigation, Clock, CloudRain, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { SmartCommuteData, UserProfile } from '../types';

interface SmartCommuteCardProps {
  commute: SmartCommuteData;
  user: UserProfile;
  language: 'en' | 'hi';
}

export const SmartCommuteCard: React.FC<SmartCommuteCardProps> = ({
  commute,
  user,
  language
}) => {
  const isHighRisk = commute.travelRisk === 'High' || commute.travelRisk === 'Severe';

  return (
    <div id="smart-commute-card" className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/70 rounded-2xl p-4.5 backdrop-blur-sm shadow-md">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
            <Navigation className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            {language === 'hi' ? 'स्मार्ट कम्यूट इंटेलिजेंस' : 'Smart Commute Intelligence'}
          </h2>
        </div>
        <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
          isHighRisk 
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        }`}>
          {commute.travelRisk} {language === 'hi' ? 'जोखिम' : 'Risk'}
        </div>
      </div>

      {/* Route & Times */}
      <div className="mt-3.5 flex items-center justify-between bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex-1">
          <div className="flex items-center space-x-1.5 text-xs font-medium text-slate-400">
            <span>{commute.origin}</span>
            <ArrowRight className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-white font-semibold">{commute.destination}</span>
          </div>
          <div className="flex items-center space-x-3 mt-1 text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{commute.eveningTime}</span>
            </span>
            <span>•</span>
            <span>{commute.distanceKm} km</span>
            <span>•</span>
            <span>~{commute.estDurationMin} min</span>
          </div>
        </div>

        {/* Rain on route */}
        <div className="flex flex-col items-end pl-2 border-l border-slate-800">
          <div className="flex items-center space-x-1 text-sky-400 font-bold text-xs">
            <CloudRain className="w-3.5 h-3.5" />
            <span>{commute.routeRainProbability}%</span>
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {language === 'hi' ? 'मार्ग पर बारिश' : 'Rain on route'}
          </span>
        </div>
      </div>

      {/* Recommended Departure Time Pill */}
      <div className={`mt-3 p-3 rounded-xl border flex items-start space-x-2.5 ${
        isHighRisk 
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' 
          : 'bg-sky-500/10 border-sky-500/30 text-sky-200'
      }`}>
        {isHighRisk ? (
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        ) : (
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        )}
        <div className="text-xs">
          <div className="font-bold flex items-center space-x-2">
            <span>{language === 'hi' ? 'सुझाया गया प्रस्थान समय:' : 'Recommended Departure:'}</span>
            <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 font-mono text-[11px]">
              {commute.recommendedDepartureTime}
            </span>
          </div>
          <p className="mt-1 text-slate-300 leading-relaxed text-[11px]">
            {language === 'hi' ? commute.recommendationTextHi : commute.recommendationText}
          </p>
        </div>
      </div>

      {/* Hazards tags */}
      {commute.routeHazards.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {commute.routeHazards.map((h, i) => (
            <span key={i} className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 border border-slate-700/50">
              ⚠️ {h}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
