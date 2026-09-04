import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="mobile-status-bar" className="w-full flex items-center justify-between px-6 pt-3 pb-2 text-xs font-semibold select-none text-slate-200 z-30">
      <span className="tracking-tight">{time || '09:41'}</span>
      <div className="flex items-center space-x-2">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center space-x-0.5">
          <span className="text-[10px] font-mono">92%</span>
          <Battery className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
