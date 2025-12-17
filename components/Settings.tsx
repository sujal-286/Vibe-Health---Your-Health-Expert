import React from 'react';
import { ArrowLeft, LogOut, Info, HelpCircle, Mail, Shield, ChevronDown, ChevronUp, User, Activity, Utensils, Moon } from 'lucide-react';
import { UserProfile } from '../types';

export const Settings: React.FC<{ user: UserProfile | null, onBack: () => void, onLogout: () => void }> = ({ user, onBack, onLogout }) => {
    const [openSection, setOpenSection] = React.useState<string | null>(null);

    const toggleSection = (section: string) => {
        setOpenSection(openSection === section ? null : section);
    };

    return (
        <div className="max-w-3xl mx-auto pb-10">
            <div className="flex items-center space-x-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full"><ArrowLeft /></button>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
            </div>
            
            <div className="space-y-6">
                {/* User Profile Card */}
                {user && (
                    <div className="bg-vibe-card rounded-2xl border border-slate-700 overflow-hidden relative">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-full -mr-4 -mt-4"></div>
                        <div className="p-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-violet-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                    {user.name ? user.name.charAt(0) : <User />}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">{user.name}</h2>
                                    <div className="text-sm text-cyan-400 font-mono">{user.email || 'User Account'}</div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                    <div className="text-slate-500 text-xs uppercase mb-1">Age</div>
                                    <div className="font-semibold">{user.age} years</div>
                                </div>
                                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                    <div className="text-slate-500 text-xs uppercase mb-1">Height</div>
                                    <div className="font-semibold">{user.height}</div>
                                </div>
                                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                    <div className="text-slate-500 text-xs uppercase mb-1">Weight</div>
                                    <div className="font-semibold">{user.weight}</div>
                                </div>
                                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                                    <div className="text-slate-500 text-xs uppercase mb-1">Goal</div>
                                    <div className="font-semibold truncate">{user.goals || 'Wellness'}</div>
                                </div>
                            </div>

                             <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-500 mr-2">Diet:</span>
                                    <span className="text-slate-300">{user.dietaryPref}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 mr-2">Activity:</span>
                                    <span className="text-slate-300">{user.activityLevel}</span>
                                </div>
                            </div>

                            <button onClick={onLogout} className="mt-6 flex items-center text-red-400 hover:text-red-300 text-sm font-semibold transition-colors">
                                <LogOut size={16} className="mr-2" /> Sign Out of Account
                            </button>
                        </div>
                    </div>
                )}

                {/* About Section */}
                <div className="bg-vibe-card rounded-2xl border border-slate-700 overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <Info className="text-cyan-400 mr-2" />
                            <h3 className="font-bold text-xl text-white">About Vibe Health</h3>
                        </div>
                        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
                            <p>
                                <strong className="text-white">Vibe Health</strong> is a cutting-edge, AI-powered health monitoring ecosystem designed to provide a 360-degree view of your well-being. Unlike traditional apps that track metrics in isolation, Vibe Health uses <strong className="text-cyan-400">Google Gemini 1.5</strong> to synthesize complex data points into actionable insights.
                            </p>
                            
                            <h4 className="text-white font-semibold mt-4">Core Philosophy: Contextual Health</h4>
                            <p>
                                Your health isn't just about calories in vs. calories out. It's about how your nutrition affects your energy, how your stress levels impact your sleep quality, and how your emotional state correlates with your physical recovery. Vibe Health connects these dots to calculate your unique <strong>Vibe Score</strong>.
                            </p>

                            <h4 className="text-white font-semibold mt-4">Key Technologies</h4>
                            <ul className="list-disc pl-5 space-y-1 marker:text-cyan-500">
                                <li><strong>Natural Language Processing:</strong> Log meals and stress simply by typing or speaking.</li>
                                <li><strong>Voice Biomarker Analysis:</strong> Our Audio Vibe feature detects subtle emotional cues in your voice to assess stress and anxiety levels.</li>
                                <li><strong>Biological Age Estimation:</strong> Based on your lifestyle factors, we estimate your "internal" age vs. your chronological age.</li>
                            </ul>

                            <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500">Current Version</span>
                                    <span className="text-xs font-mono text-cyan-400 bg-cyan-900/20 px-2 py-1 rounded">v1.2.0 (Beta)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Help & Support Section */}
                <div className="bg-vibe-card rounded-2xl border border-slate-700 overflow-hidden">
                    <div className="p-6">
                         <div className="flex items-center mb-6">
                            <HelpCircle className="text-violet-400 mr-2" />
                            <h3 className="font-bold text-xl text-white">Help & Support</h3>
                        </div>
                        
                        <div className="space-y-4">
                            {/* Feature Guides Accordion */}
                            <div className="space-y-2">
                                <div className="border border-slate-700 rounded-xl overflow-hidden">
                                    <button 
                                        onClick={() => toggleSection('dashboard')}
                                        className="w-full flex justify-between items-center p-4 bg-slate-800 hover:bg-slate-750 transition-colors text-left"
                                    >
                                        <div className="flex items-center">
                                            <Activity size={18} className="text-cyan-400 mr-3" />
                                            <span className="font-semibold text-white">Dashboard & Vibe Score</span>
                                        </div>
                                        {openSection === 'dashboard' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {openSection === 'dashboard' && (
                                        <div className="p-4 bg-slate-900/50 text-sm text-slate-300">
                                            <p className="mb-2">Your <strong>Dashboard</strong> is the central hub. The large gauge displays your overall Vibe Score (0-100), calculated daily based on:</p>
                                            <ul className="list-disc pl-5 space-y-1 mb-2">
                                                <li><strong>Nutrition Quality:</strong> Nutrient density and balance.</li>
                                                <li><strong>Sleep Hygiene:</strong> Duration and quality of rest.</li>
                                                <li><strong>Stress Management:</strong> Self-reported levels and voice analysis.</li>
                                                <li><strong>Activity:</strong> Inferred activity levels and energy expenditure.</li>
                                            </ul>
                                            <p>Use the <strong className="text-cyan-400">"Generate Today's Habit"</strong> button to get a fresh AI analysis after logging new data.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="border border-slate-700 rounded-xl overflow-hidden">
                                    <button 
                                        onClick={() => toggleSection('meals')}
                                        className="w-full flex justify-between items-center p-4 bg-slate-800 hover:bg-slate-750 transition-colors text-left"
                                    >
                                        <div className="flex items-center">
                                            <Utensils size={18} className="text-green-400 mr-3" />
                                            <span className="font-semibold text-white">Meal Analysis</span>
                                        </div>
                                        {openSection === 'meals' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {openSection === 'meals' && (
                                        <div className="p-4 bg-slate-900/50 text-sm text-slate-300">
                                            <p className="mb-2">Forget searching databases. Simply describe your meal naturally (e.g., <em>"Grilled salmon with quinoa and roasted asparagus"</em>).</p>
                                            <p>The AI estimates:</p>
                                            <ul className="list-disc pl-5 space-y-1 mt-1">
                                                <li>Calories & Macros (Protein, Carbs, Fats)</li>
                                                <li>Micronutrient density</li>
                                                <li>Health Score (0-10)</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="border border-slate-700 rounded-xl overflow-hidden">
                                    <button 
                                        onClick={() => toggleSection('diagnostics')}
                                        className="w-full flex justify-between items-center p-4 bg-slate-800 hover:bg-slate-750 transition-colors text-left"
                                    >
                                        <div className="flex items-center">
                                            <Activity size={18} className="text-yellow-400 mr-3" />
                                            <span className="font-semibold text-white">Diagnostics & Tests</span>
                                        </div>
                                        {openSection === 'diagnostics' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {openSection === 'diagnostics' && (
                                        <div className="p-4 bg-slate-900/50 text-sm text-slate-300">
                                            <p>Access clinically standardized self-assessments including:</p>
                                            <ul className="list-disc pl-5 space-y-1 mt-2 mb-2">
                                                <li><strong>GAD-7:</strong> Anxiety Screening</li>
                                                <li><strong>PHQ-9:</strong> Depression Screening</li>
                                                <li><strong>PSS-7:</strong> Perceived Stress Scale</li>
                                                <li><strong>Sleep & Burnout:</strong> Lifestyle assessments</li>
                                            </ul>
                                            <p>Scores are calculated instantly, and you can request a deeper AI analysis of your results for personalized coping strategies.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="border border-slate-700 rounded-xl overflow-hidden">
                                    <button 
                                        onClick={() => toggleSection('audio')}
                                        className="w-full flex justify-between items-center p-4 bg-slate-800 hover:bg-slate-750 transition-colors text-left"
                                    >
                                        <div className="flex items-center">
                                            <Moon size={18} className="text-violet-400 mr-3" />
                                            <span className="font-semibold text-white">Audio & Chat AI</span>
                                        </div>
                                        {openSection === 'audio' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                    {openSection === 'audio' && (
                                        <div className="p-4 bg-slate-900/50 text-sm text-slate-300">
                                            <p className="mb-2"><strong>Audio Vibe:</strong> Record a 30-second journal entry. We analyze not just <em>what</em> you say, but the sentiment behind it to gauge your emotional baseline.</p>
                                            <p><strong>Chat Agent:</strong> A 24/7 wellness companion. If you enable location services, it can also recommend nearby therapists, yoga studios, or medical clinics.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-700">
                                <h4 className="font-bold text-white mb-4">Contact & Legal</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <a href="mailto:support@vibehealth.ai" className="flex items-center space-x-3 p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors">
                                        <div className="p-2 bg-slate-700 rounded-lg text-cyan-400">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white">Email Support</div>
                                            <div className="text-xs text-slate-400">support@vibehealth.ai</div>
                                        </div>
                                    </a>
                                    <div className="flex items-center space-x-3 p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors cursor-pointer">
                                        <div className="p-2 bg-slate-700 rounded-lg text-violet-400">
                                            <Shield size={18} />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-white">Privacy Policy</div>
                                            <div className="text-xs text-slate-400">Your data is stored locally</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};