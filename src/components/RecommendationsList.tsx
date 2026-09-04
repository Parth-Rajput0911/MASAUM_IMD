import React from 'react';
import { Umbrella, Droplet, Sun, Wheat, Car, Bus, AlertTriangle, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { PersonalizedRecommendation, UserProfile } from '../types';

interface RecommendationsListProps {
  recommendations: PersonalizedRecommendation[];
  user: UserProfile;
  language: 'en' | 'hi';
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({
  recommendations,
  user,
  language
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'umbrella': return Umbrella;
      case 'wheat': return Wheat;
      case 'droplets':
      case 'droplet': return Droplet;
      case 'sun': return Sun;
      case 'car': return Car;
      case 'bus': return Bus;
      case 'alert-triangle': return AlertTriangle;
      case 'shield-alert': return ShieldAlert;
      default: return Sparkles;
    }
  };

  return (
    <div id="personalized-recommendations-section" className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{language === 'hi' ? 'व्यक्तिगत सिफारिशें' : 'Personalized Recommendations'}</span>
        </h2>
        <span className="text-[10px] text-slate-500 font-mono">
          {recommendations.length} {language === 'hi' ? 'सुझाव' : 'tips'}
        </span>
      </div>

      <div className="space-y-2.5">
        {recommendations.map((rec) => {
          const Icon = getIcon(rec.icon);
          const isUrgent = rec.priority === 'urgent';
          const isImportant = rec.priority === 'important';

          return (
            <div
              key={rec.id}
              id={`rec-item-${rec.id}`}
              className={`p-3.5 rounded-2xl border backdrop-blur-sm transition-all ${
                isUrgent
                  ? 'bg-rose-950/20 border-rose-500/30'
                  : isImportant
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-slate-850 bg-slate-800/60 border-slate-700/60'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                  isUrgent
                    ? 'bg-rose-500/20 text-rose-400'
                    : isImportant
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-sky-500/20 text-sky-400'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-bold text-white truncate">
                      {language === 'hi' ? rec.titleHi : rec.title}
                    </h3>
                    {rec.badgeText && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                        isUrgent ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {rec.badgeText}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[11px] text-slate-300 leading-relaxed">
                    {language === 'hi' ? rec.actionHi : rec.action}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
