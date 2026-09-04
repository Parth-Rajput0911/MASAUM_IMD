import React from 'react';
import { CloudRain, Sun, CloudLightning, ShieldCheck, X, Sparkles } from 'lucide-react';
import { WeatherScenarioMode } from '../types';

interface ConditionSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScenario: WeatherScenarioMode;
  onSelectScenario: (scenario: WeatherScenarioMode) => void;
  language: 'en' | 'hi';
}

export const ConditionSimulatorModal: React.FC<ConditionSimulatorModalProps> = ({
  isOpen,
  onClose,
  currentScenario,
  onSelectScenario,
  language
}) => {
  if (!isOpen) return null;

  const scenarios = [
    {
      id: 'heavy_rain' as WeatherScenarioMode,
      title: language === 'hi' ? 'भारी मानसूनी बारिश' : 'Heavy Monsoon Rain',
      subtitle: language === 'hi' ? '68mm बारिश, जलभराव व कम्यूट रिस्क' : '68mm rain, commute delays & umbrella alert',
      icon: CloudRain,
      color: 'from-blue-600/30 to-indigo-600/30 border-blue-500/50 text-blue-300',
      badge: language === 'hi' ? 'ऑरेंज अलर्ट' : 'Orange Alert'
    },
    {
      id: 'heatwave' as WeatherScenarioMode,
      title: language === 'hi' ? 'भीषण लू व अत्यधिक गर्मी' : 'Severe Heatwave (Loo)',
      subtitle: language === 'hi' ? '43°C (महसूस 47°C), UV 11, लू चेतावनी' : '43°C (Feels 47°C), UV 11 Extreme & hydration',
      icon: Sun,
      color: 'from-amber-600/30 to-orange-600/30 border-amber-500/50 text-amber-300',
      badge: language === 'hi' ? 'रेड लू अलर्ट' : 'Red Loo Alert'
    },
    {
      id: 'severe' as WeatherScenarioMode,
      title: language === 'hi' ? 'भीषण आंधी व आकाशीय बिजली' : 'Severe Thunderstorm & Squall',
      subtitle: language === 'hi' ? '74 किमी/घंटे की रफ्तार, इमरजेंसी प्रोटोकॉल' : '74 km/h squalls, lightning & stay indoors',
      icon: CloudLightning,
      color: 'from-purple-600/30 to-rose-600/30 border-purple-500/50 text-purple-300',
      badge: language === 'hi' ? 'इमरजेंसी रेड' : 'Emergency Red'
    },
    {
      id: 'normal' as WeatherScenarioMode,
      title: language === 'hi' ? 'सामान्य व सुहावना मौसम' : 'Normal / Pleasant Weather',
      subtitle: language === 'hi' ? '28°C, संतुलित AQI, आउटडोर के लिए अनुकूल' : '28°C, balanced AQI & standard routines',
      icon: ShieldCheck,
      color: 'from-emerald-600/30 to-teal-600/30 border-emerald-500/50 text-emerald-300',
      badge: language === 'hi' ? 'ग्रीन कोड' : 'Green Code'
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        id="scenario-simulator-modal"
        className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {language === 'hi' ? 'मौसम स्थिति सिम्युलेटर' : 'Weather Condition Simulator'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {language === 'hi' ? 'होमपेज के अनुकूलन का तुरंत परीक्षण करें' : 'Test dynamic context-aware homepage adaptation'}
              </p>
            </div>
          </div>
          <button 
            id="close-simulator-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2.5">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isSelected = currentScenario === sc.id;

            return (
              <button
                key={sc.id}
                id={`simulate-${sc.id}-btn`}
                onClick={() => {
                  onSelectScenario(sc.id);
                  onClose();
                }}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected 
                    ? `bg-gradient-to-r ${sc.color} ring-2 ring-sky-400 scale-[1.01]` 
                    : 'bg-slate-800/60 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl bg-slate-900/60 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-white">{sc.title}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-300 font-mono font-bold">
                        {sc.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
                      {sc.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/60 text-[10px] text-slate-400 leading-relaxed">
          💡 <strong>Core Principle:</strong> {language === 'hi' 
            ? 'मौसम बदलने पर अलर्ट, कम्यूट रिस्क, यूवी व एडवाइजरी स्वचालित रूप से प्राथमिकता बदलती हैं।' 
            : 'Observe how alerts, risk scores, commute recommendations, and AI summaries dynamically re-order in real time.'}
        </div>
      </div>
    </div>
  );
};
