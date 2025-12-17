import React from 'react';
import { AppState, UserProfile } from '../types';
import { Activity, Heart, Mic, FileText, Settings as SettingsIcon, MessageSquare, LogOut, Menu, X, Moon, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile | null;
  onNavigate: (s: AppState) => void;
  activeState: AppState;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onNavigate, activeState }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const NavItem = ({ state, icon: Icon, label }: { state: AppState; icon: any; label: string }) => (
        <button 
            onClick={() => { onNavigate(state); setMobileMenuOpen(false); }}
            className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all ${activeState === state ? 'bg-gradient-to-r from-cyan-900/50 to-violet-900/50 text-cyan-400 border border-cyan-800' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar Desktop */}
            <div className="hidden md:flex flex-col w-64 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800 p-6">
                <div className="flex items-center space-x-2 mb-10">
                    <Activity className="w-8 h-8 text-cyan-400" />
                    <span className="text-2xl font-black tracking-tighter text-white">VIBE<span className="text-cyan-400">.</span></span>
                </div>
                
                <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
                    <NavItem state={AppState.DASHBOARD} icon={Activity} label="Dashboard" />
                    <NavItem state={AppState.MEAL_ANALYSIS} icon={Heart} label="Meal Analysis" />
                    <NavItem state={AppState.AUDIO_ANALYSIS} icon={Mic} label="Audio Vibe" />
                    <NavItem state={AppState.DIAGNOSTICS} icon={FileText} label="Diagnostics" />
                    <NavItem state={AppState.SLEEP_ANALYSIS} icon={Moon} label="Sleep Analysis" />
                    <NavItem state={AppState.STRESS_ANALYSIS} icon={Zap} label="Stress Analysis" />
                    <NavItem state={AppState.CHAT} icon={MessageSquare} label="Vibe AI" />
                    <NavItem state={AppState.HISTORY} icon={FileText} label="History" />
                </nav>

                <div className="pt-6 border-t border-slate-800 space-y-2">
                    <NavItem state={AppState.SETTINGS} icon={SettingsIcon} label="Settings" />
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 md:hidden flex flex-col p-6">
                    <div className="flex justify-between items-center mb-8">
                        <span className="text-2xl font-bold">Menu</span>
                        <button onClick={() => setMobileMenuOpen(false)}><X /></button>
                    </div>
                     <nav className="flex-1 space-y-4 overflow-y-auto">
                        <NavItem state={AppState.DASHBOARD} icon={Activity} label="Dashboard" />
                        <NavItem state={AppState.MEAL_ANALYSIS} icon={Heart} label="Meal Analysis" />
                        <NavItem state={AppState.AUDIO_ANALYSIS} icon={Mic} label="Audio Vibe" />
                        <NavItem state={AppState.DIAGNOSTICS} icon={FileText} label="Diagnostics" />
                        <NavItem state={AppState.SLEEP_ANALYSIS} icon={Moon} label="Sleep Analysis" />
                        <NavItem state={AppState.STRESS_ANALYSIS} icon={Zap} label="Stress Analysis" />
                        <NavItem state={AppState.CHAT} icon={MessageSquare} label="Vibe AI" />
                        <NavItem state={AppState.HISTORY} icon={FileText} label="History" />
                        <NavItem state={AppState.SETTINGS} icon={SettingsIcon} label="Settings" />
                    </nav>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
                     <div className="flex items-center space-x-2">
                        <Activity className="w-6 h-6 text-cyan-400" />
                        <span className="text-xl font-bold">VIBE</span>
                    </div>
                    <button onClick={() => setMobileMenuOpen(true)}><Menu /></button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                   {children}
                </main>
            </div>
        </div>
    );
};