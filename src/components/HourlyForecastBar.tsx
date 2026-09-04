import React from 'react';
import { Cloud, Sun, CloudRain, CloudLightning, CloudDrizzle, Moon } from 'lucide-react';
import { HourlyForecastItem } from '../types';

interface HourlyForecastBarProps {
  items: HourlyForecastItem[];
  language: 'en' | 'hi';
}

export const HourlyForecastBar: React.FC<HourlyForecastBarProps> = ({ items, language }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun': return Sun;
      case 'moon': return Moon;
      case 'cloud-rain': return CloudRain;
      case 'cloud-lightning': return CloudLightning;
      case 'cloud-drizzle': return CloudDrizzle;
      default: return Cloud;
    }
  };

  return (
    <div id="hourly-forecast-container" className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-4 backdrop-blur-sm shadow-md">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {language === 'hi' ? '24 घंटे का पूर्वानुमान' : 'Hourly Forecast (24h)'}
        </h2>
        <span className="text-[10px] text-slate-500 font-mono">
          {language === 'hi' ? 'प्रति घंटा अपडेट' : 'Hourly Updates'}
        </span>
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-2 pt-1 scrollbar-none">
        {items.slice(0, 12).map((item, idx) => {
          const Icon = getIcon(item.icon);
          const isHighRain = item.rainProb >= 50;

          return (
            <div
              key={idx}
              className={`flex flex-col items-center justify-between min-w-[62px] p-2.5 rounded-xl border transition-all ${
                item.isCurrentHour 
                  ? 'bg-sky-500/15 border-sky-500/40 text-white shadow-sm' 
                  : 'bg-slate-900/50 border-slate-800 text-slate-300'
              }`}
            >
              <span className="text-[11px] font-semibold tracking-tight">
                {item.time}
              </span>

              <div className="my-2 p-1 text-sky-400">
                <Icon className="w-5 h-5" />
              </div>

              <span className="text-xs font-bold font-mono">
                {item.temp}°
              </span>

              <div className="mt-1 flex items-center space-x-0.5">
                <span className={`text-[10px] font-bold font-mono ${
                  isHighRain ? 'text-sky-400' : 'text-slate-500'
                }`}>
                  {item.rainProb}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
