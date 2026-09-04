import React from 'react';
import { Home, Map, Sparkles, Bell, User } from 'lucide-react';

export type NavTab = 'home' | 'map' | 'ai' | 'alerts' | 'profile';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  alertCount: number;
  language: 'en' | 'hi';
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  alertCount,
  language
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: language === 'hi' ? 'होम' : 'Home', icon: Home },
    { id: 'map' as NavTab, label: language === 'hi' ? 'नक्शा' : 'Map', icon: Map },
    { id: 'ai' as NavTab, label: language === 'hi' ? 'एआई' : 'AI Assistant', icon: Sparkles, isAI: true },
    { id: 'alerts' as NavTab, label: language === 'hi' ? 'अलर्ट्स' : 'Alerts', icon: Bell, badge: alertCount },
    { id: 'profile' as NavTab, label: language === 'hi' ? 'प्रोफ़ाइल' : 'Profile', icon: User }
  ];

  return (
    <nav 
      id="bottom-navigation-bar" 
      className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 px-4 py-2 z-40 flex justify-around items-center"
      aria-label="Main Navigation"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        if (tab.isAI) {
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className="relative -top-3 flex flex-col items-center group cursor-pointer focus:outline-none"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-tr from-sky-500 to-indigo-500 text-white shadow-sky-500/40 ring-4 ring-slate-900 scale-105' 
                  : 'bg-gradient-to-tr from-slate-800 to-slate-700 text-sky-400 shadow-slate-950/50 hover:scale-105'
              }`}>
                <Icon className="w-6 h-6 animate-pulse" />
              </div>
              <span className={`text-[11px] font-medium mt-1 tracking-tight ${
                isActive ? 'text-sky-400 font-semibold' : 'text-slate-400'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex flex-col items-center py-1 px-2.5 rounded-xl transition-all cursor-pointer focus:outline-none ${
              isActive ? 'text-sky-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-slate-900 animate-bounce">
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span className={`text-[11px] mt-1 tracking-tight ${
              isActive ? 'font-semibold text-sky-400' : 'font-normal'
            }`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
