import React, { useState } from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  Wheat, 
  Compass, 
  HardHat, 
  UserCheck, 
  CloudRain, 
  Thermometer, 
  Wind, 
  Sun, 
  AlertTriangle, 
  Sprout, 
  MapPin, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles,
  Home,
  Building,
  School,
  Trees
} from 'lucide-react';
import { UserType, WeatherInterest, SavedLocation, UserProfile } from '../types';
import { DEFAULT_USERS } from '../data/mockData';

interface OnboardingScreenProps {
  initialUser?: UserProfile;
  onComplete: (user: UserProfile) => void;
  language: 'en' | 'hi';
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  initialUser,
  onComplete,
  language
}) => {
  const [step, setStep] = useState<number>(1);
  const [userType, setUserType] = useState<UserType>(initialUser?.userType || 'student');
  const [selectedInterests, setSelectedInterests] = useState<WeatherInterest[]>(
    initialUser?.interests || ['rain', 'aqi', 'temperature']
  );
  const [homeCity, setHomeCity] = useState('New Delhi');
  const [secondaryName, setSecondaryName] = useState('North Campus DU');
  const [secondaryType, setSecondaryType] = useState<'college' | 'office' | 'village' | 'destination'>('college');

  const userRoles = [
    {
      id: 'student' as UserType,
      title: language === 'hi' ? 'छात्र (Student)' : 'Student',
      desc: language === 'hi' ? 'कॉलेज आवागमन, बारिश में छाता अलर्ट व परीक्षा समय' : 'Class transit, rain umbrella alerts & campus forecast',
      icon: GraduationCap,
      defaultSec: 'college' as const
    },
    {
      id: 'office_worker' as UserType,
      title: language === 'hi' ? 'ऑफिस कर्मचारी (Office Worker)' : 'Office Worker',
      desc: language === 'hi' ? 'दफ्तर का सफर, ट्रैफिक जलभराव व शाम का मौसम' : 'Peak traffic, waterlogged transit routes & cab surge',
      icon: Briefcase,
      defaultSec: 'office' as const
    },
    {
      id: 'farmer' as UserType,
      title: language === 'hi' ? 'किसान (Farmer)' : 'Farmer',
      desc: language === 'hi' ? 'फसल छिड़काव, वर्षा समय, सिंचाई व तेज हवा चेतावनी' : 'Pesticide spray timing, rainfall probability & soil advisory',
      icon: Wheat,
      defaultSec: 'village' as const
    },
    {
      id: 'outdoor_worker' as UserType,
      title: language === 'hi' ? 'आउटडोर / डिलीवरी वर्कर' : 'Outdoor / Field Worker',
      desc: language === 'hi' ? 'भीषण गर्मी, अनिवार्य पानी ब्रेक व बिजली सुरक्षा' : 'Extreme heat & UV index, hydration safety & slippery roads',
      icon: HardHat,
      defaultSec: 'office' as const
    },
    {
      id: 'traveller' as UserType,
      title: language === 'hi' ? 'यात्री (Traveller)' : 'Traveller',
      desc: language === 'hi' ? 'गंतव्य मौसम, उड़ान/सड़क यात्रा व भूस्खलन चेतावनी' : 'Destination conditions, mountain road risk & trip pack guide',
      icon: Compass,
      defaultSec: 'destination' as const
    },
    {
      id: 'general_user' as UserType,
      title: language === 'hi' ? 'सामान्य उपयोगकर्ता' : 'General Citizen',
      desc: language === 'hi' ? 'दैनिक मौसम, वायु गुणवत्ता व सप्ताहांत योजना' : 'Daily air quality (AQI), clothing advice & leisure plans',
      icon: UserCheck,
      defaultSec: 'office' as const
    }
  ];

  const interestOptions: { id: WeatherInterest; title: string; desc: string; icon: any }[] = [
    {
      id: 'rain',
      title: language === 'hi' ? 'बारिश व मानसून' : 'Rain & Monsoon',
      desc: language === 'hi' ? 'वर्षा की संभावना, छाता अलर्ट व जलभराव' : 'Precipitation % & route wetness',
      icon: CloudRain
    },
    {
      id: 'temperature',
      title: language === 'hi' ? 'तापमान व लू' : 'Temperature & Loo',
      desc: language === 'hi' ? 'अधिकतम तापमान, फील्स लाइक व गर्म हवाएं' : 'Feels-like heat index & cold spells',
      icon: Thermometer
    },
    {
      id: 'aqi',
      title: language === 'hi' ? 'वायु गुणवत्ता (AQI)' : 'Air Quality (AQI)',
      desc: language === 'hi' ? 'PM2.5, प्रदूषण स्तर व मास्क सलाह' : 'Pollution levels & health guidance',
      icon: Wind
    },
    {
      id: 'uv',
      title: language === 'hi' ? 'यूवी इंडेक्स (UV Index)' : 'UV Radiation',
      desc: language === 'hi' ? 'धूप से बचाव व त्वचा सुरक्षा' : 'Solar intensity & sun protection',
      icon: Sun
    },
    {
      id: 'severe_weather',
      title: language === 'hi' ? 'भीषण मौसम अलर्ट' : 'Severe Storms',
      desc: language === 'hi' ? 'आंधी, बिजली चमकना व रेड चेतावनी' : 'Squalls, lightning & emergency advisories',
      icon: AlertTriangle
    },
    {
      id: 'agriculture',
      title: language === 'hi' ? 'कृषि व मौसम' : 'Agro-Meteorology',
      desc: language === 'hi' ? 'सिंचाई, बुवाई व दवा छिड़काव सलाह' : 'Sowing, soil moisture & spraying advisory',
      icon: Sprout
    }
  ];

  const toggleInterest = (interestId: WeatherInterest) => {
    if (selectedInterests.includes(interestId)) {
      if (selectedInterests.length > 1) {
        setSelectedInterests(selectedInterests.filter(i => i !== interestId));
      }
    } else {
      setSelectedInterests([...selectedInterests, interestId]);
    }
  };

  const handleRoleSelect = (role: UserType) => {
    setUserType(role);
    const r = userRoles.find(ur => ur.id === role);
    if (r) {
      setSecondaryType(r.defaultSec);
    }
  };

  const handleFinish = () => {
    const baseUser = DEFAULT_USERS[userType] || DEFAULT_USERS.student;
    const finalLocations: SavedLocation[] = [
      {
        id: 'loc_home',
        name: `Home (${homeCity})`,
        type: 'home',
        city: homeCity,
        state: 'NCR / State',
        lat: 28.6139,
        lon: 77.2090,
        isCurrent: true
      },
      {
        id: 'loc_secondary',
        name: `${secondaryName}`,
        type: secondaryType,
        city: homeCity,
        state: 'NCR / State',
        lat: 28.6904,
        lon: 77.2072
      }
    ];

    const updatedUser: UserProfile = {
      ...baseUser,
      id: 'usr_' + Date.now(),
      userType,
      interests: selectedInterests,
      savedLocations: finalLocations,
      activeLocationId: 'loc_home',
      commuteProfile: {
        originLocationId: 'loc_home',
        destinationLocationId: 'loc_secondary',
        preferredMode: userType === 'student' ? 'metro' : userType === 'farmer' ? 'bike' : 'car',
        morningDeparture: '08:30',
        eveningDeparture: '17:30'
      },
      privacySettings: baseUser.privacySettings || {
        allowLocationTracking: true,
        saveInteractionHistory: true
      }
    };

    onComplete(updatedUser);
  };

  return (
    <div id="onboarding-screen" className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-5 max-w-md mx-auto">
      {/* Top Header & Progress */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>{language === 'hi' ? 'व्यक्तिगत सेटअप' : 'Personalization Setup'}</span>
          </span>
          <span className="text-xs font-mono text-slate-400">Step {step} of 3</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
          <div 
            className="bg-gradient-to-r from-sky-400 to-indigo-500 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="my-auto py-4">
        {step === 1 && (
          <div className="space-y-3.5 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">
                {language === 'hi' ? 'आपकी भूमिका क्या है?' : 'Select your primary role'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'hi' 
                  ? 'मौसम हर किसी के लिए अलग मायने रखता है। चुनें कि आप मौसम का उपयोग कैसे करेंगे।' 
                  : 'Mausam will tailor all alerts and recommendations to your daily life.'}
              </p>
            </div>

            <div className="space-y-2 max-h-[58vh] overflow-y-auto pr-1">
              {userRoles.map((role) => {
                const Icon = role.icon;
                const isSelected = userType === role.id;

                return (
                  <button
                    key={role.id}
                    id={`onboard-role-${role.id}`}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'bg-sky-500/15 border-sky-400 ring-2 ring-sky-400/40' 
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-sky-500 text-white' : 'bg-slate-800 text-sky-400'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{role.title}</div>
                        <div className="text-[11px] text-slate-400 leading-tight mt-0.5">{role.desc}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-sky-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3.5 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">
                {language === 'hi' ? 'आपकी मौसम रुचियां' : 'What weather matters to you?'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'hi' 
                  ? 'उन कारकों को चुनें जिन्हें आप होमपेज पर प्राथमिकता देना चाहते हैं।' 
                  : 'Select priority factors for your personalized homepage feed.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {interestOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedInterests.includes(opt.id);

                return (
                  <button
                    key={opt.id}
                    id={`interest-opt-${opt.id}`}
                    onClick={() => toggleInterest(opt.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected 
                        ? 'bg-sky-500/15 border-sky-400 ring-2 ring-sky-400/30' 
                        : 'bg-slate-900 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-xl ${isSelected ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{opt.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">{opt.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">
                {language === 'hi' ? 'महत्वपूर्ण स्थान सहेजें' : 'Save your key locations'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {language === 'hi' 
                  ? 'स्मार्ट कम्यूट और विशिष्ट स्थान चेतावनियों के लिए अपने प्राथमिक स्थान दर्ज करें।' 
                  : 'Mausam will calculate route rain risk and commute alerts between these points.'}
              </p>
            </div>

            <div className="space-y-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
              {/* Home Location */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center space-x-1.5">
                  <Home className="w-3.5 h-3.5 text-sky-400" />
                  <span>{language === 'hi' ? 'प्राथमिक निवास / होम सिटी' : 'Home / Residence City'}</span>
                </label>
                <input
                  type="text"
                  value={homeCity}
                  onChange={(e) => setHomeCity(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  placeholder="e.g. New Delhi, Bengaluru, Pune"
                />
              </div>

              {/* Secondary Location */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center space-x-1.5">
                  {secondaryType === 'college' ? <School className="w-3.5 h-3.5 text-indigo-400" /> :
                   secondaryType === 'village' ? <Trees className="w-3.5 h-3.5 text-emerald-400" /> :
                   secondaryType === 'office' ? <Building className="w-3.5 h-3.5 text-amber-400" /> :
                   <Compass className="w-3.5 h-3.5 text-purple-400" />}
                  <span>
                    {secondaryType === 'college' ? (language === 'hi' ? 'कॉलेज / विश्वविद्यालय' : 'College / University') :
                     secondaryType === 'village' ? (language === 'hi' ? 'गांव / खेत स्थान' : 'Village / Farm Field') :
                     secondaryType === 'office' ? (language === 'hi' ? 'कार्यालय / टेक पार्क' : 'Office / Workplace') :
                     (language === 'hi' ? 'यात्रा गंतव्य' : 'Travel Destination')}
                  </span>
                </label>
                <input
                  type="text"
                  value={secondaryName}
                  onChange={(e) => setSecondaryName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                  placeholder="e.g. DU North Campus, Electronic City, Ludhiana Farm"
                />
              </div>

              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-800/80 leading-relaxed">
                🔒 <strong>Privacy First:</strong> Only necessary geo-coordinates are used locally for meteorological spatial indexing.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="pt-3 pb-2 flex items-center justify-between border-t border-slate-800">
        {step > 1 ? (
          <button
            id="onboard-back-btn"
            onClick={() => setStep(step - 1)}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'पीछे' : 'Back'}</span>
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            id="onboard-next-btn"
            onClick={() => setStep(step + 1)}
            className="flex items-center space-x-1.5 text-xs font-bold text-white px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 shadow-lg shadow-sky-500/25 cursor-pointer ml-auto"
          >
            <span>{language === 'hi' ? 'आगे बढ़ें' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            id="onboard-complete-btn"
            onClick={handleFinish}
            className="flex items-center space-x-1.5 text-xs font-bold text-white px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/25 cursor-pointer ml-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>{language === 'hi' ? 'डैशबोर्ड शुरू करें' : 'Launch Dashboard'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
