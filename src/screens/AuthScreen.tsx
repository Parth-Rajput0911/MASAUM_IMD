import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Sparkles, GraduationCap, Briefcase, Wheat, HardHat } from 'lucide-react';
import { UserType, UserProfile } from '../types';
import { DEFAULT_USERS } from '../data/mockData';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onGoToOnboarding: () => void;
  language: 'en' | 'hi';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onGoToOnboarding,
  language
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('aarav.student@delhi.edu.in');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Aarav Sharma');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Use default student profile
    const user = JSON.parse(JSON.stringify(DEFAULT_USERS.student));
    if (name) user.name = name;
    if (email) user.email = email;
    onLoginSuccess(user);
  };

  const handleQuickLogin = (persona: UserType) => {
    if (DEFAULT_USERS[persona]) {
      onLoginSuccess(JSON.parse(JSON.stringify(DEFAULT_USERS[persona])));
    }
  };

  return (
    <div id="auth-screen" className="min-h-screen flex flex-col justify-center px-6 py-10 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-white">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/30 mb-3">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black tracking-tight">
          MAUSAM <span className="text-amber-400">IMD</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          {language === 'hi' 
            ? 'व्यक्तिगत मौसम बुद्धिमत्ता मंच' 
            : 'Context-Aware Weather Intelligence'}
        </p>
      </div>

      {/* Auth Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
        <div className="flex border-b border-slate-800 pb-3 mb-5">
          <button
            id="tab-login-btn"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 text-center font-bold text-xs pb-2 cursor-pointer transition-colors ${
              !isSignUp ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400'
            }`}
          >
            {language === 'hi' ? 'लॉग इन' : 'Sign In'}
          </button>
          <button
            id="tab-signup-btn"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 text-center font-bold text-xs pb-2 cursor-pointer transition-colors ${
              isSignUp ? 'text-sky-400 border-b-2 border-sky-400' : 'text-slate-400'
            }`}
          >
            {language === 'hi' ? 'नया खाता (ऑनबोर्डिंग)' : 'Sign Up (Onboard)'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isSignUp && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                  placeholder="e.g. Aarav Sharma"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              {language === 'hi' ? 'ईमेल पता' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              {language === 'hi' ? 'पासवर्ड' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full mt-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-sky-500/25 transition-all cursor-pointer"
          >
            <span>{isSignUp ? (language === 'hi' ? 'आगे बढ़ें और प्रोफ़ाइल बनाएं' : 'Continue to Onboarding') : (language === 'hi' ? 'लॉग इन करें' : 'Sign In with Firebase')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
            {language === 'hi' ? '⚡ 1-क्लिक त्वरित खाते (डेमो):' : '⚡ 1-Click Fast Demo Personas:'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('student')}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-left text-[11px] transition-colors cursor-pointer flex items-center space-x-2"
            >
              <GraduationCap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <div className="truncate">
                <div className="font-bold text-white">Student</div>
                <div className="text-[9px] text-slate-400">Delhi Campus</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickLogin('farmer')}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-left text-[11px] transition-colors cursor-pointer flex items-center space-x-2"
            >
              <Wheat className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="truncate">
                <div className="font-bold text-white">Farmer</div>
                <div className="text-[9px] text-slate-400">Punjab Fields</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickLogin('office_worker')}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-left text-[11px] transition-colors cursor-pointer flex items-center space-x-2"
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <div className="truncate">
                <div className="font-bold text-white">Office Pro</div>
                <div className="text-[9px] text-slate-400">Bengaluru Commute</div>
              </div>
            </button>

            <button
              onClick={() => handleQuickLogin('outdoor_worker')}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-left text-[11px] transition-colors cursor-pointer flex items-center space-x-2"
            >
              <HardHat className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="truncate">
                <div className="font-bold text-white">Outdoor / Logistics</div>
                <div className="text-[9px] text-slate-400">Mumbai Heat/Rain</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
