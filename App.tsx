import React, { useState, useEffect } from 'react';
import { AppState, UserProfile, DailyMetrics } from './types';
import { db } from './services/db';
import { geminiService } from './services/geminiService';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Layout } from './components/Layout';
import { MealTracker } from './components/MealTracker';
import { AudioAnalysis } from './components/AudioAnalysis';
import { Diagnostics } from './components/Diagnostics';
import { ChatAgent } from './components/ChatAgent';
import { Settings } from './components/Settings';
import { History } from './components/History';
import { Permissions } from './components/Permissions';
import { SleepTracker } from './components/SleepTracker';
import { StressTracker } from './components/StressTracker';

export default function App() {
  const [state, setState] = useState<AppState>(AppState.PERMISSIONS);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [metrics, setMetrics] = useState<DailyMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check auth on load
    const currentUser = db.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Load today's metrics
      const today = new Date().toISOString().split('T')[0];
      const savedMetrics = db.getMetrics(today);
      if (savedMetrics) {
        setMetrics(savedMetrics);
        setState(AppState.DASHBOARD);
      } else {
        setState(AppState.DASHBOARD);
      }
    } else {
        // Wait for permissions first
       if(state !== AppState.PERMISSIONS) {
           setState(AppState.AUTH_LOGIN);
       }
    }
  }, []);

  const handlePermissionGranted = () => {
      const currentUser = db.getCurrentUser();
      if(currentUser) {
          setState(AppState.DASHBOARD);
      } else {
          setState(AppState.AUTH_LOGIN);
      }
  }

  const handleLogin = (u: UserProfile) => {
    setUser(u);
    const today = new Date().toISOString().split('T')[0];
    const savedMetrics = db.getMetrics(today);
    if(savedMetrics) {
        setMetrics(savedMetrics);
        setState(AppState.DASHBOARD);
    } else {
        if (Object.keys(u).length === 0) {
            setState(AppState.ONBOARDING);
        } else {
            // Existing user, new day. Generate fresh metrics logic handled in Dashboard via "Generate" button mostly, or we can auto-generate blank slate.
            // For now, let's just show dashboard, metrics will be null.
            setState(AppState.DASHBOARD);
        }
    }
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
    setLoading(true);
    db.saveProfile(profile);
    setUser(profile);
    try {
      const newMetrics = await geminiService.analyzeInitialProfile(profile);
      const today = new Date().toISOString().split('T')[0];
      db.saveMetrics(today, newMetrics);
      setMetrics(newMetrics);
      setState(AppState.DASHBOARD);
    } catch (e) {
      alert("AI Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateDailyReport = async () => {
      if(!user) return;
      setLoading(true);
      try {
          const today = new Date().toISOString().split('T')[0];
          const meals = db.getMeals(today);
          const logs = db.getLogs(today);
          
          const newMetrics = await geminiService.calculateDailyVibe(user, meals, logs);
          db.saveMetrics(today, newMetrics);
          setMetrics(newMetrics);
      } catch(e) {
          console.error(e);
          alert("Failed to generate today's report.");
      } finally {
          setLoading(false);
      }
  };

  const renderContent = () => {
    if (loading) return (
        <div className="flex flex-col items-center justify-center h-screen bg-vibe-dark text-cyan-400">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cyan-400 mb-4"></div>
            <h2 className="text-2xl font-bold animate-pulse">VIBE AI IS ANALYZING...</h2>
            <p className="text-gray-400 mt-2">Connecting to Gemini 1.5 Flash</p>
        </div>
    );

    switch (state) {
      case AppState.PERMISSIONS:
        return <Permissions onGranted={handlePermissionGranted} />;
      case AppState.AUTH_LOGIN:
      case AppState.AUTH_REGISTER:
      case AppState.AUTH_VERIFY:
        return <Auth state={state} setState={setState} onLogin={handleLogin} />;
      case AppState.ONBOARDING:
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case AppState.DASHBOARD:
        return <Dashboard metrics={metrics} onNavigate={setState} onGenerate={generateDailyReport} />;
      case AppState.MEAL_ANALYSIS:
        return <MealTracker onBack={() => setState(AppState.DASHBOARD)} />;
      case AppState.AUDIO_ANALYSIS:
        return <AudioAnalysis onBack={() => setState(AppState.DASHBOARD)} />;
      case AppState.SLEEP_ANALYSIS:
        return <SleepTracker onBack={() => setState(AppState.DASHBOARD)} />;
      case AppState.STRESS_ANALYSIS:
        return <StressTracker onBack={() => setState(AppState.DASHBOARD)} />;
      case AppState.CHAT:
        return <ChatAgent onBack={() => setState(AppState.DASHBOARD)} />;
      case AppState.DIAGNOSTICS:
        return <Diagnostics onBack={() => setState(AppState.DASHBOARD)} />;
      case AppState.HISTORY:
        return <History onBack={() => setState(AppState.DASHBOARD)} />;
      case AppState.SETTINGS:
        return <Settings user={user} onBack={() => setState(AppState.DASHBOARD)} onLogout={() => { db.logout(); setState(AppState.AUTH_LOGIN); }} />;
      default:
        return <Dashboard metrics={metrics} onNavigate={setState} onGenerate={generateDailyReport} />;
    }
  };

  return (
    <div className="min-h-screen bg-vibe-dark text-white font-sans selection:bg-cyan-500 selection:text-white">
      {state !== AppState.PERMISSIONS && state !== AppState.AUTH_LOGIN && state !== AppState.AUTH_REGISTER && state !== AppState.AUTH_VERIFY && state !== AppState.ONBOARDING && (
          <Layout user={user} onNavigate={setState} activeState={state}>
              {renderContent()}
          </Layout>
      )}
      {(state === AppState.PERMISSIONS || state === AppState.AUTH_LOGIN || state === AppState.AUTH_REGISTER || state === AppState.AUTH_VERIFY || state === AppState.ONBOARDING) && renderContent()}
    </div>
  );
}