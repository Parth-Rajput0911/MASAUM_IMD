import React, { useState, useEffect } from 'react';
import { StatusBar } from './components/StatusBar';
import { TopHeader } from './components/TopHeader';
import { BottomNav, NavTab } from './components/BottomNav';
import { ConditionSimulatorModal } from './components/ConditionSimulatorModal';
import { PersonaSwitcherModal } from './components/PersonaSwitcherModal';
import { SplashScreen } from './screens/SplashScreen';
import { AuthScreen } from './screens/AuthScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { MapScreen } from './screens/MapScreen';
import { AIAssistantScreen } from './screens/AIAssistantScreen';
import { AlertsScreen } from './screens/AlertsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SystemArchitectureModal } from './screens/SystemArchitectureModal';

import { 
  UserProfile, 
  WeatherCondition, 
  WeatherScenarioMode, 
  HourlyForecastItem, 
  DailyForecastItem, 
  WeatherAlert, 
  SmartCommuteData, 
  WeatherRiskScore, 
  PersonalizedRecommendation, 
  AISummary,
  UserType
} from './types';

import { 
  DEFAULT_USERS, 
  SCENARIO_WEATHER, 
  generateHourlyForecast, 
  generateDailyForecast 
} from './data/mockData';

import { 
  calculateWeatherRiskScore, 
  generatePersonalizedRecommendations, 
  generateAISummary, 
  generateSmartCommute,
  generatePersonalizedAlerts
} from './services/personalizationEngine';

type AppScreenState = 'splash' | 'auth' | 'onboarding' | 'main';

export default function App() {
  // App screen flow
  const [currentScreen, setCurrentScreen] = useState<AppScreenState>('splash');
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('home');

  // User and Scenario
  const [user, setUser] = useState<UserProfile>(DEFAULT_USERS.student);
  const [scenario, setScenario] = useState<WeatherScenarioMode>('heavy_rain');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Modals
  const [simulatorOpen, setSimulatorOpen] = useState<boolean>(false);
  const [personaModalOpen, setPersonaModalOpen] = useState<boolean>(false);
  const [systemInfoModalOpen, setSystemInfoModalOpen] = useState<boolean>(false);

  // Pinned favorite location state (for quick home preview)
  const [pinnedLocationId, setPinnedLocationId] = useState<string>('loc_village');

  // Weather and personalized states
  const [weather, setWeather] = useState<WeatherCondition>(SCENARIO_WEATHER.heavy_rain);
  const [hourly, setHourly] = useState<HourlyForecastItem[]>(generateHourlyForecast('heavy_rain'));
  const [daily, setDaily] = useState<DailyForecastItem[]>(generateDailyForecast('heavy_rain'));
  const [alerts, setAlerts] = useState<WeatherAlert[]>(generatePersonalizedAlerts(DEFAULT_USERS.student, SCENARIO_WEATHER.heavy_rain, 'heavy_rain'));
  const [commute, setCommute] = useState<SmartCommuteData>(generateSmartCommute(DEFAULT_USERS.student, SCENARIO_WEATHER.heavy_rain, 'heavy_rain'));
  const [riskScore, setRiskScore] = useState<WeatherRiskScore>(calculateWeatherRiskScore(DEFAULT_USERS.student, SCENARIO_WEATHER.heavy_rain, 'heavy_rain'));
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>(generatePersonalizedRecommendations(DEFAULT_USERS.student, SCENARIO_WEATHER.heavy_rain, 'heavy_rain'));
  const [summary, setSummary] = useState<AISummary>(generateAISummary(DEFAULT_USERS.student, SCENARIO_WEATHER.heavy_rain, 'heavy_rain'));

  // Re-calculate all personalized data when user or scenario changes
  useEffect(() => {
    const currentW = SCENARIO_WEATHER[scenario] || SCENARIO_WEATHER.normal;
    setWeather(currentW);
    setHourly(generateHourlyForecast(scenario));
    setDaily(generateDailyForecast(scenario));
    setAlerts(generatePersonalizedAlerts(user, currentW, scenario));

    const updatedCommute = generateSmartCommute(user, currentW, scenario);
    setCommute(updatedCommute);

    const updatedRisk = calculateWeatherRiskScore(user, currentW, scenario);
    setRiskScore(updatedRisk);

    const updatedRecs = generatePersonalizedRecommendations(user, currentW, scenario);
    setRecommendations(updatedRecs);

    const updatedSumm = generateAISummary(user, currentW, scenario);
    setSummary(updatedSumm);
  }, [user, scenario]);

  // Handler for persona selection
  const handleSelectPersona = (p: UserType) => {
    if (DEFAULT_USERS[p]) {
      const newUser = { ...DEFAULT_USERS[p], language };
      setUser(newUser);
    }
  };

  // Handler for scenario selection
  const handleSelectScenario = (sc: WeatherScenarioMode) => {
    setScenario(sc);
  };

  // Handler for location selection
  const handleSelectLocation = (locId: string) => {
    setUser(prev => ({
      ...prev,
      activeLocationId: locId
    }));
  };

  // Toggle language
  const handleToggleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
    setUser(prev => ({ ...prev, language: nextLang }));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center text-slate-100 font-sans selection:bg-sky-500 selection:text-white">
      {/* Mobile container frame */}
      <div className="w-full max-w-md min-h-screen bg-slate-950 flex flex-col relative border-x border-slate-900 shadow-2xl overflow-x-hidden">
        {/* Status Bar */}
        <StatusBar />

        {/* Conditional Screen Rendering */}
        {currentScreen === 'splash' && (
          <SplashScreen onComplete={() => setCurrentScreen('main')} />
        )}

        {currentScreen === 'auth' && (
          <AuthScreen 
            onLoginSuccess={(loggedInUser) => {
              setUser(loggedInUser);
              setCurrentScreen('main');
            }}
            onGoToOnboarding={() => setCurrentScreen('onboarding')}
            language={language}
          />
        )}

        {currentScreen === 'onboarding' && (
          <OnboardingScreen
            initialUser={user}
            onComplete={(completedUser) => {
              setUser(completedUser);
              setCurrentScreen('main');
            }}
            language={language}
          />
        )}

        {currentScreen === 'main' && (
          <div className="flex-1 flex flex-col">
            {/* Top Navigation & Context Header */}
            <TopHeader
              user={user}
              scenario={scenario}
              onOpenSimulator={() => setSimulatorOpen(true)}
              onOpenPersonaModal={() => setPersonaModalOpen(true)}
              onOpenSystemInfoModal={() => setSystemInfoModalOpen(true)}
              onSelectLocation={handleSelectLocation}
              onToggleLanguage={handleToggleLanguage}
            />

            {/* Tab Views */}
            <main className="flex-1">
              {activeNavTab === 'home' && (
                <HomeScreen
                  user={user}
                  weather={weather}
                  scenario={scenario}
                  hourly={hourly}
                  daily={daily}
                  alerts={alerts}
                  commute={commute}
                  riskScore={riskScore}
                  recommendations={recommendations}
                  summary={summary}
                  pinnedLocationId={pinnedLocationId}
                  onPinLocation={(locId) => setPinnedLocationId(locId)}
                  onSwitchActiveLocation={handleSelectLocation}
                  onNavigateToMap={() => setActiveNavTab('map')}
                  onNavigateToAlerts={() => setActiveNavTab('alerts')}
                  onNavigateToAI={() => setActiveNavTab('ai')}
                  onOpenSimulator={() => setSimulatorOpen(true)}
                  language={language}
                />
              )}

              {activeNavTab === 'map' && (
                <MapScreen
                  user={user}
                  weather={weather}
                  scenario={scenario}
                  language={language}
                />
              )}

              {activeNavTab === 'ai' && (
                <AIAssistantScreen
                  user={user}
                  weather={weather}
                  scenario={scenario}
                  language={language}
                />
              )}

              {activeNavTab === 'alerts' && (
                <AlertsScreen
                  alerts={alerts}
                  user={user}
                  language={language}
                />
              )}

              {activeNavTab === 'profile' && (
                <ProfileScreen
                  user={user}
                  onUpdateUser={setUser}
                  onOpenPersonaModal={() => setPersonaModalOpen(true)}
                  onOpenSystemInfoModal={() => setSystemInfoModalOpen(true)}
                  onLogout={() => setCurrentScreen('auth')}
                  language={language}
                />
              )}
            </main>

            {/* Bottom Nav */}
            <BottomNav
              activeTab={activeNavTab}
              onTabChange={setActiveNavTab}
              alertCount={alerts.filter(a => a.severity === 'red' || a.severity === 'orange').length}
              language={language}
            />
          </div>
        )}

        {/* Global Modals */}
        <ConditionSimulatorModal
          isOpen={simulatorOpen}
          onClose={() => setSimulatorOpen(false)}
          currentScenario={scenario}
          onSelectScenario={handleSelectScenario}
          language={language}
        />

        <PersonaSwitcherModal
          isOpen={personaModalOpen}
          onClose={() => setPersonaModalOpen(false)}
          currentUserType={user.userType}
          onSelectPersona={handleSelectPersona}
          language={language}
        />

        <SystemArchitectureModal
          isOpen={systemInfoModalOpen}
          onClose={() => setSystemInfoModalOpen(false)}
          language={language}
        />
      </div>
    </div>
  );
}
