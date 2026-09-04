import React, { useState } from 'react';
import { Sparkles, Volume2, VolumeX, Share2, Check, BrainCircuit } from 'lucide-react';
import { AISummary, UserProfile } from '../types';

interface AISummaryCardProps {
  summary: AISummary;
  user: UserProfile;
  language: 'en' | 'hi';
}

export const AISummaryCard: React.FC<AISummaryCardProps> = ({
  summary,
  user,
  language
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const headline = language === 'hi' ? summary.headlineHi : summary.headline;
  const meaning = language === 'hi' ? summary.meaningForUserHi : summary.meaningForUser;
  const action = language === 'hi' ? summary.recommendedActionHi : summary.recommendedAction;

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech not supported in this browser.');
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const textToRead = `${headline}. ${meaning}. ${action}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleShare = async () => {
    const shareText = `[MAUSAM IMD Weather Brief]\n${headline}\n${meaning}\nAction: ${action}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MAUSAM IMD Summary',
          text: shareText
        });
      } catch (e) {
        // Fallback to copy
      }
    } else {
      navigator.clipboard?.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div id="ai-weather-summary-card" className="relative overflow-hidden bg-gradient-to-br from-indigo-950/60 via-slate-900/80 to-slate-900 border border-indigo-500/30 rounded-2xl p-4.5 backdrop-blur-md shadow-lg shadow-indigo-950/30">
      {/* Subtle glowing ambient orb */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center space-x-1.5">
              <span>{language === 'hi' ? 'एआई मौसम विश्लेषण' : 'AI Context Intelligence'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-normal">
                {summary.contextTag}
              </span>
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            id="speak-ai-summary-btn"
            onClick={handleSpeak}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isPlaying 
                ? 'bg-indigo-500 text-white border-indigo-400 ring-2 ring-indigo-400/50' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title={isPlaying ? 'Stop Audio' : 'Listen via Voice'}
          >
            {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            id="share-ai-summary-btn"
            onClick={handleShare}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Share Brief"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Core USP Banner */}
      <div className="mt-3.5 relative z-10">
        <h3 className="text-sm font-bold text-white tracking-tight">
          {headline}
        </h3>
        
        {/* "What this means for you" callout */}
        <div className="mt-2.5 bg-indigo-950/40 border border-indigo-500/20 rounded-xl p-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 mb-1 flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>{language === 'hi' ? `आपके लिए इसका क्या अर्थ है (${user.userType}):` : `What this means for you (${user.userType.replace('_', ' ')}):`}</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {meaning}
          </p>
        </div>

        {/* Action item */}
        <div className="mt-2.5 flex items-start space-x-2 text-xs text-slate-300 bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
          <span className="text-amber-400 font-bold shrink-0">🎯 {language === 'hi' ? 'सलाह:' : 'Action:'}</span>
          <span className="text-[11px] leading-relaxed">{action}</span>
        </div>
      </div>
    </div>
  );
};
