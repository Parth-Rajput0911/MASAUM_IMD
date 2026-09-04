import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  ShieldAlert, 
  MapPin, 
  UserCheck, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Send,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { WeatherAlert, UserProfile } from '../types';

interface AlertsScreenProps {
  alerts: WeatherAlert[];
  user: UserProfile;
  language: 'en' | 'hi';
}

export const AlertsScreen: React.FC<AlertsScreenProps> = ({
  alerts,
  user,
  language
}) => {
  const [filter, setFilter] = useState<'all' | 'urgent' | 'hazards'>('all');
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(alerts[0]?.id || null);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'red':
        return { label: language === 'hi' ? 'रेड अलर्ट (अत्यधिक)' : 'RED ALERT', bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', icon: ShieldAlert };
      case 'orange':
        return { label: language === 'hi' ? 'ऑरेंज अलर्ट' : 'ORANGE ALERT', bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: AlertTriangle };
      case 'yellow':
        return { label: language === 'hi' ? 'येलो चेतावनी' : 'YELLOW WATCH', bg: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', icon: AlertTriangle };
      default:
        return { label: language === 'hi' ? 'ग्रीन / सामान्य' : 'GREEN ADVISORY', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: CheckCircle2 };
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'urgent') return a.severity === 'red' || a.severity === 'orange';
    if (filter === 'hazards') return a.category === 'rain' || a.category === 'heatwave' || a.category === 'thunderstorm' || a.category === 'flood';
    return true;
  });

  const handleSendTestPushNotification = () => {
    setTestNotificationSent(true);
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('MAUSAM IMD Alert', {
        body: alerts[0]?.title || 'Weather update for your commute route',
        icon: '/favicon.ico'
      });
    }
    setTimeout(() => setTestNotificationSent(false), 3000);
  };

  return (
    <div id="alerts-screen" className="space-y-4 pb-24 px-4 pt-2 max-w-md mx-auto animate-fade-in">
      {/* Screen Title & Formula Explainer */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/80 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">
                {language === 'hi' ? 'प्राथमिकता-आधारित मौसम अलर्ट्स' : 'Smart Priority Weather Alerts'}
              </h1>
              <p className="text-[10px] text-slate-400">
                Priority: Severity + Location Match + User Relevance
              </p>
            </div>
          </div>

          <button
            id="test-push-notification-btn"
            onClick={handleSendTestPushNotification}
            className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-sky-500 hover:bg-sky-400 text-white transition-all cursor-pointer flex items-center space-x-1"
          >
            <Send className="w-3 h-3" />
            <span>{testNotificationSent ? 'Sent! ✓' : 'Test Push'}</span>
          </button>
        </div>

        {/* Formula Matrix Visualizer */}
        <div className="mt-3.5 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[10px]">
          <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block mb-0.5">1. Severity</span>
            <span className="font-bold text-rose-400 font-mono">Max 10 pts</span>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block mb-0.5">2. Location</span>
            <span className="font-bold text-sky-400 font-mono">Max 10 pts</span>
          </div>
          <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
            <span className="text-slate-400 block mb-0.5">3. Relevance</span>
            <span className="font-bold text-indigo-400 font-mono">Max 10 pts</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'all' 
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25' 
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {language === 'hi' ? 'सभी अलर्ट्स' : 'All Alerts'} ({alerts.length})
        </button>
        <button
          onClick={() => setFilter('urgent')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'urgent' 
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/25' 
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {language === 'hi' ? 'अति महत्वपूर्ण' : 'Urgent Only'}
        </button>
        <button
          onClick={() => setFilter('hazards')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'hazards' 
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25' 
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {language === 'hi' ? 'मौसम खतरे' : 'Hazards'}
        </button>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const badge = getSeverityBadge(alert.severity);
          const Icon = badge.icon;
          const isExpanded = expandedAlertId === alert.id;

          return (
            <div
              key={alert.id}
              id={`alert-card-${alert.id}`}
              className={`rounded-3xl border p-4 backdrop-blur-md transition-all shadow-md ${
                alert.severity === 'red'
                  ? 'bg-rose-950/20 border-rose-500/40'
                  : alert.severity === 'orange'
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-slate-900/80 border-slate-800'
              }`}
            >
              {/* Alert Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center space-x-1 ${badge.bg}`}>
                    <Icon className="w-3 h-3" />
                    <span>{badge.label}</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {alert.issuedAt}
                  </span>
                </div>

                {/* Priority Badge */}
                <div className="flex items-center space-x-1 bg-slate-800/90 px-2 py-0.5 rounded-full border border-slate-700 text-[10px] font-mono">
                  <span className="text-slate-400">Priority:</span>
                  <span className="font-bold text-white">{alert.totalPriority}/30</span>
                </div>
              </div>

              {/* Title & Description */}
              <h2 className="text-sm font-bold text-white mt-2.5">
                {language === 'hi' ? alert.titleHi : alert.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {language === 'hi' ? alert.descriptionHi : alert.description}
              </p>

              {/* Personal Relevance Explainer */}
              <div className="mt-3 bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-2.5 text-[11px] text-indigo-200">
                <div className="font-bold flex items-center space-x-1 text-indigo-400 mb-0.5">
                  <Sparkles className="w-3 h-3" />
                  <span>{language === 'hi' ? `आपकी प्रोफ़ाइल के लिए प्रासंगिकता (${user.userType}):` : `Relevance for you (${user.userType.replace('_', ' ')}):`}</span>
                </div>
                <p className="leading-relaxed">
                  {language === 'hi' ? (alert.userRelevanceReasonHi || alert.descriptionHi) : (alert.userRelevanceReason || alert.description)}
                </p>
              </div>

              {/* Formula Breakdown Details Toggle */}
              <button
                onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                className="mt-3 w-full pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-sky-400 hover:text-sky-300 cursor-pointer"
              >
                <span>{language === 'hi' ? 'स्कोर व सुरक्षा प्रोटोकॉल चेकलिस्ट' : 'Formula Score & Safety Checklist'}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {isExpanded && (
                <div className="mt-3 space-y-3 animate-fade-in pt-1">
                  {/* Priority Scores */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[10px]">
                    <div>
                      <div className="text-slate-400">Severity</div>
                      <div className="font-bold text-rose-400 font-mono text-xs mt-0.5">{alert.severityScore} / 10</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Location Match</div>
                      <div className="font-bold text-sky-400 font-mono text-xs mt-0.5">{alert.locationScore} / 10</div>
                    </div>
                    <div>
                      <div className="text-slate-400">User Relevance</div>
                      <div className="font-bold text-indigo-400 font-mono text-xs mt-0.5">{alert.userRelevanceScore} / 10</div>
                    </div>
                  </div>

                  {/* Safety Checklist */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-300">
                      🛡️ {language === 'hi' ? 'अनुशंसित सुरक्षा कदम:' : 'Actionable Safety Checklist:'}
                    </div>
                    {(alert.safetyInstructions || alert.safetyActions || []).map((act, i) => (
                      <div key={i} className="flex items-start space-x-2 text-[11px] text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
