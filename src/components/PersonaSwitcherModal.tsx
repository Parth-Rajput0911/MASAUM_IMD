import React from 'react';
import { GraduationCap, Briefcase, Wheat, Compass, HardHat, UserCheck, X } from 'lucide-react';
import { UserType, UserProfile } from '../types';
import { DEFAULT_USERS } from '../data/mockData';

interface PersonaSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserType: UserType;
  onSelectPersona: (persona: UserType) => void;
  language: 'en' | 'hi';
}

export const PersonaSwitcherModal: React.FC<PersonaSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentUserType,
  onSelectPersona,
  language
}) => {
  if (!isOpen) return null;

  const personas = [
    {
      id: 'student' as UserType,
      name: 'Aarav Sharma',
      role: language === 'hi' ? 'कॉलेज छात्र (दिल्ली)' : 'College Student (Delhi)',
      usp: language === 'hi' ? 'छाता अलर्ट, मेट्रो/बस कम्यूट व परीक्षा समय' : 'Umbrella alerts, campus commute & exam timings',
      icon: GraduationCap,
      color: 'text-sky-400 bg-sky-500/20'
    },
    {
      id: 'farmer' as UserType,
      name: 'Gurpreet Singh',
      role: language === 'hi' ? 'किसान (लुधियाना, पंजाब)' : 'Farmer (Ludhiana, Punjab)',
      usp: language === 'hi' ? 'कीटनाशक छिड़काव, फसल कटाई व वर्षा समय' : 'Spraying advisory, crop drainage & soil moisture',
      icon: Wheat,
      color: 'text-emerald-400 bg-emerald-500/20'
    },
    {
      id: 'office_worker' as UserType,
      name: 'Priya Narayanan',
      role: language === 'hi' ? 'ऑफिस कर्मचारी (बेंगलुरु)' : 'IT Professional (Bengaluru)',
      usp: language === 'hi' ? 'शाम के सफर में बारिश, कैब सर्ज व ट्रैफिक' : 'Evening commute rain, cab surge & AC transitions',
      icon: Briefcase,
      color: 'text-indigo-400 bg-indigo-500/20'
    },
    {
      id: 'outdoor_worker' as UserType,
      name: 'Ramesh Patel',
      role: language === 'hi' ? 'डिलीवरी / आउटडोर वर्कर (मुंबई)' : 'Delivery / Field Worker (Mumbai)',
      usp: language === 'hi' ? 'भीषण लू, अनिवार्य हाइड्रेशन व फिसलन सुरक्षा' : 'Severe heat, hydration breaks & road hazards',
      icon: HardHat,
      color: 'text-amber-400 bg-amber-500/20'
    },
    {
      id: 'traveller' as UserType,
      name: 'Sneha Roy',
      role: language === 'hi' ? 'यात्री / टूरिस्ट (मनाली)' : 'Traveller (Manali)',
      usp: language === 'hi' ? 'पहाड़ी मार्ग, भूस्खलन व सामान सुरक्षा' : 'Mountain roads, landslide warnings & packing advice',
      icon: Compass,
      color: 'text-purple-400 bg-purple-500/20'
    },
    {
      id: 'general_user' as UserType,
      name: 'Vikram Joshi',
      role: language === 'hi' ? 'सामान्य नागरिक (पुणे)' : 'General Citizen (Pune)',
      usp: language === 'hi' ? 'दैनिक कपड़े, वायु गुणवत्ता व सप्ताहांत योजना' : 'Air quality (AQI), lifestyle & weekend plans',
      icon: UserCheck,
      color: 'text-teal-400 bg-teal-500/20'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        id="persona-switcher-modal"
        className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">
              {language === 'hi' ? 'उपयोगकर्ता प्रोफ़ाइल बदलें' : 'Switch User Persona'}
            </h2>
            <p className="text-[11px] text-slate-400">
              {language === 'hi' ? 'व्यक्तिगत अनुभव को विभिन्न दृष्टिकोणों से देखें' : 'Experience personalized intelligence for each role'}
            </p>
          </div>
          <button 
            id="close-persona-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {personas.map((p) => {
            const Icon = p.icon;
            const isSelected = currentUserType === p.id;

            return (
              <button
                key={p.id}
                id={`select-persona-${p.id}-btn`}
                onClick={() => {
                  onSelectPersona(p.id);
                  onClose();
                }}
                className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected 
                    ? 'bg-slate-800 border-sky-400 ring-2 ring-sky-400/40' 
                    : 'bg-slate-850 bg-slate-800/40 border-slate-700/80 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl ${p.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs font-bold text-white">{p.name}</span>
                      <span className="text-[10px] text-slate-400">• {p.role}</span>
                    </div>
                    <p className="text-[10px] text-slate-300 mt-0.5 leading-tight">
                      🎯 {p.usp}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
