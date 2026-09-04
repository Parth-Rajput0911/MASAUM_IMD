import React, { useEffect } from 'react';
import { CloudRain, Sparkles, Compass, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2400);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      id="splash-screen"
      onClick={onComplete}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 p-8 text-white cursor-pointer select-none"
    >
      {/* Top Tag */}
      <div className="pt-8 text-center">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-sky-500/10 text-sky-400 border border-sky-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Gen Meteorological Platform</span>
        </span>
        <p className="text-[11px] text-slate-400 mt-2">
          Personalized Homepage & Weather Intelligence
        </p>
      </div>

      {/* Center Radar Logo & Animation */}
      <div className="flex flex-col items-center my-auto">
        <div className="relative flex items-center justify-center">
          {/* Animated radar sonar pulse rings */}
          <div className="absolute w-36 h-36 rounded-full border border-sky-500/20 animate-ping opacity-75" />
          <div className="absolute w-48 h-48 rounded-full border border-indigo-500/20 animate-pulse" />
          
          <div className="relative z-10 w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-500 via-indigo-600 to-amber-400 p-0.5 shadow-2xl shadow-sky-500/30">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
              <CloudRain className="w-12 h-12 text-sky-400 animate-bounce" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tight mt-6 text-white flex items-center">
          MAUSAM<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-sky-400 ml-2">IMD</span>
        </h1>
        <p className="text-xs text-slate-300 font-medium mt-1.5 text-center max-w-xs">
          “Mausam doesn’t just tell the weather — it tells you what the weather means for you.”
        </p>
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-xs pb-6 text-center">
        <div className="flex justify-center space-x-2 text-[10px] text-slate-400 mb-2">
          <span>FastAPI</span>
          <span>•</span>
          <span>Scikit-Learn</span>
          <span>•</span>
          <span>IMD Mausam Data</span>
          <span>•</span>
          <span>Gemini AI</span>
        </div>
        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-amber-400 animate-[pulse_1.5s_infinite] w-full" />
        </div>
        <span className="text-[10px] text-slate-500 mt-2 block">Tap anywhere to enter</span>
      </div>
    </div>
  );
};
