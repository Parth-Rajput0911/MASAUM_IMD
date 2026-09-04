import React from 'react';
import { Cloud, Sun, CloudRain, CloudLightning } from 'lucide-react';
import { DailyForecastItem } from '../types';

interface DailyForecastListProps {
  items: DailyForecastItem[];
  language: 'en' | 'hi';
}

export const DailyForecastList: React.FC<DailyForecastListProps> = ({ items, language }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun': return Sun;
      case 'cloud-rain': return CloudRain;
      case 'cloud-lightning': return CloudLightning;
      default: return Cloud;
    }
  };

  return (
    <div id="daily-forecast-container" className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-sm shadow-md">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {language === 'hi' ? '7 दिन का मौसम पूर्वानुमान' : '7-Day Outlook'}
        </h2>
        <span className="text-[10px] text-slate-500 font-mono">
          IMD Model Ensemble
        </span>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => {
          const Icon = getIcon(item.icon);

          return (
            <div
              key={idx}
              className="flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-slate-700/30 transition-colors text-xs"
            >
              {/* Day name */}
              <div className="w-20 font-medium text-slate-200">
                {language === 'hi' ? item.dayHi : item.day}
              </div>

              {/* Icon & Rain prob */}
              <div className="flex items-center space-x-2 w-24">
                <Icon className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-[11px] font-mono text-sky-400/90 font-semibold">
                  {item.rainProb > 20 ? `${item.rainProb}%` : ''}
                </span>
              </div>

              {/* Condition text */}
              <div className="flex-1 text-slate-400 text-[11px] truncate px-2 hidden sm:block">
                {item.condition}
              </div>

              {/* Min - Max bar */}
              <div className="flex items-center space-x-2 font-mono">
                <span className="text-slate-400 font-medium">{item.minTemp}°</span>
                <div className="w-14 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-sky-400 to-amber-400 h-full rounded-full" 
                    style={{ width: `${Math.min(100, Math.max(20, (item.maxTemp - item.minTemp) * 8))}%` }} 
                  />
                </div>
                <span className="text-white font-bold">{item.maxTemp}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
