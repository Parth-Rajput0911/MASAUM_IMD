import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { WeatherRiskScore, UserProfile } from '../types';

interface WeatherRiskGaugeProps {
  riskScore: WeatherRiskScore;
  user: UserProfile;
  language: 'en' | 'hi';
}

export const WeatherRiskGauge: React.FC<WeatherRiskGaugeProps> = ({
  riskScore,
  user,
  language
}) => {
  const [expanded, setExpanded] = useState(false);

  const getRiskBadge = () => {
    switch (riskScore.riskLevel) {
      case 'Severe':
        return {
          bg: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
          label: language === 'hi' ? 'गंभीर जोखिम' : 'Severe Risk',
          icon: ShieldAlert
        };
      case 'High':
        return {
          bg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
          label: language === 'hi' ? 'उच्च जोखिम' : 'High Risk',
          icon: AlertTriangle
        };
      case 'Moderate':
        return {
          bg: 'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
          label: language === 'hi' ? 'मध्यम जोखिम' : 'Moderate Risk',
          icon: AlertTriangle
        };
      default:
        return {
          bg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
          label: language === 'hi' ? 'कम जोखिम' : 'Low Risk',
          icon: CheckCircle
        };
    }
  };

  const badge = getRiskBadge();
  const Icon = badge.icon;

  const factors = [
    { name: language === 'hi' ? 'यात्रा जोखिम' : 'Commute Transit', value: riskScore.commuteRisk, color: 'bg-sky-500' },
    { name: language === 'hi' ? 'तूफान/बारिश' : 'Storm & Rain', value: riskScore.stormRisk, color: 'bg-indigo-500' },
    { name: language === 'hi' ? 'गर्मी/लू' : 'Heat & Thermal', value: riskScore.heatRisk, color: 'bg-amber-500' },
    { name: language === 'hi' ? 'वायु गुणवत्ता' : 'Air Quality (AQI)', value: riskScore.aqiRisk, color: 'bg-teal-500' },
    { name: language === 'hi' ? 'यूवी विकिरण' : 'UV Radiation', value: riskScore.uvRisk, color: 'bg-purple-500' },
    { name: language === 'hi' ? 'कृषि प्रभाव' : 'Agricultural Impact', value: riskScore.agriRisk, color: 'bg-emerald-500' },
  ];

  return (
    <div id="weather-risk-score-card" className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4.5 backdrop-blur-sm shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
          <h2 className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            {language === 'hi' ? 'व्यक्तिगत मौसम जोखिम सूचकांक' : 'Personalized Weather Risk Index'}
          </h2>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center space-x-1.5 ${badge.bg}`}>
          <Icon className="w-3.5 h-3.5" />
          <span>{badge.label}</span>
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between">
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {riskScore.overallScore}
          </span>
          <span className="text-sm font-semibold text-slate-400">/ 100</span>
        </div>
        <div className="flex-1 mx-4">
          <div className="w-full bg-slate-700/60 h-2.5 rounded-full overflow-hidden flex">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out" 
              style={{ 
                width: `${riskScore.overallScore}%`, 
                backgroundColor: riskScore.color 
              }} 
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>0 Safe</span>
            <span>50 Moderate</span>
            <span>100 Critical</span>
          </div>
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-300 leading-relaxed">
        {language === 'hi' ? riskScore.summaryHi : riskScore.summary}
      </p>

      {/* Expandable factor explainability breakdown */}
      <button
        id="toggle-risk-factors-btn"
        onClick={() => setExpanded(!expanded)}
        className="mt-3 w-full pt-2 border-t border-slate-700/40 flex items-center justify-between text-[11px] text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
      >
        <span className="flex items-center space-x-1">
          <Info className="w-3 h-3" />
          <span>{language === 'hi' ? 'जोखिम गणना का विवरण देखें' : 'View Risk Factor Breakdown'}</span>
        </span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {expanded && (
        <div id="risk-factors-breakdown" className="mt-3 pt-2 grid grid-cols-2 gap-2 text-[11px]">
          {factors.map((f, idx) => (
            <div key={idx} className="bg-slate-900/60 p-2 rounded-xl border border-slate-700/40">
              <div className="flex justify-between text-slate-400 text-[10px] mb-1">
                <span>{f.name}</span>
                <span className="font-mono text-white font-bold">{f.value}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${f.color}`} 
                  style={{ width: `${f.value}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
