import React from 'react';
import { DailyMetrics, AppState } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUp, Droplets, Zap, Moon, Heart, Activity, Sparkles, AlertCircle } from 'lucide-react';

interface DashboardProps {
    metrics: DailyMetrics | null;
    onNavigate: (s: AppState) => void;
    onGenerate?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ metrics, onNavigate, onGenerate }) => {
    if (!metrics) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                    <div className="text-slate-500">No data available for today.</div>
                    {onGenerate && <button onClick={onGenerate} className="text-cyan-400 underline">Generate Initial Report</button>}
                </div>
            </div>
        );
    }

    const gaugeData = [
        { name: 'Score', value: metrics.vibeScore || 0 },
        { name: 'Remaining', value: 100 - (metrics.vibeScore || 0) }
    ];
    const gaugeColors = ['#06b6d4', '#1e293b'];

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Top Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                <div className="text-center">
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Biological Age</div>
                    <div className="text-2xl font-bold text-cyan-400">{metrics.biologicalAge} <span className="text-sm text-slate-500">yrs</span></div>
                </div>
                <div className="text-center border-l border-slate-700">
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Chronological</div>
                    <div className="text-2xl font-bold text-white">{metrics.chronologicalAge} <span className="text-sm text-slate-500">yrs</span></div>
                </div>
                <div className="text-center border-l border-slate-700">
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Vibe Score</div>
                    <div className="text-2xl font-bold text-violet-400">{metrics.vibeScore}</div>
                </div>
                 <div className="text-center border-l border-slate-700">
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Stress Level</div>
                    <div className={`text-xl font-bold ${metrics.stressLevelTag === 'High' ? 'text-red-400' : metrics.stressLevelTag === 'Moderate' ? 'text-yellow-400' : 'text-green-400'}`}>
                        {metrics.stressLevelTag}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Gauge Section */}
                <div className="lg:col-span-2 bg-vibe-card rounded-3xl p-6 border border-slate-700 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                    
                    <div className="flex justify-between items-start mb-6">
                         <h3 className="text-xl font-bold flex items-center"><Activity className="mr-2 text-cyan-400"/> Overall Lifestyle Score</h3>
                         {onGenerate && (
                             <button 
                                onClick={onGenerate}
                                className="flex items-center px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-violet-500/25 transition-all"
                             >
                                <Sparkles size={14} className="mr-2" /> Generate Today's Habit
                             </button>
                         )}
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-center justify-around">
                        <div className="relative w-64 h-48 flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={gaugeData}
                                        cx="50%"
                                        cy="70%"
                                        startAngle={180}
                                        endAngle={0}
                                        innerRadius={80}
                                        outerRadius={100}
                                        dataKey="value"
                                        paddingAngle={5}
                                        stroke="none"
                                    >
                                        {gaugeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={gaugeColors[index]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <div className="text-5xl font-black text-white">{metrics.vibeScore}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 w-full md:w-auto mt-6 md:mt-0">
                             {[
                                 { label: 'Nutrition', val: metrics.nutritionScore, color: 'text-green-400' },
                                 { label: 'Sleep', val: metrics.sleepScore, color: 'text-indigo-400' },
                                 { label: 'Stress', val: metrics.stressScore, color: 'text-rose-400' },
                                 { label: 'Activity', val: metrics.activityScore, color: 'text-orange-400' },
                             ].map((m) => (
                                 <div key={m.label} className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50 relative">
                                     <div className="text-xs text-slate-400 mb-1">{m.label}</div>
                                     <div className={`text-xl font-bold ${m.color}`}>{m.val}</div>
                                     {m.val === 0 && (
                                         <div className="absolute top-1 right-1" title="Analysis Remaining">
                                             <AlertCircle size={10} className="text-yellow-500" />
                                         </div>
                                     )}
                                 </div>
                             ))}
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                         <div 
                            onClick={() => onNavigate(AppState.MEAL_ANALYSIS)}
                            className="p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:bg-slate-800 group"
                         >
                             <div className="text-cyan-400 mb-2 group-hover:scale-110 transition-transform">🍔</div>
                             <div className="text-sm font-semibold">Meal Analysis</div>
                         </div>
                         <div 
                            onClick={() => onNavigate(AppState.AUDIO_ANALYSIS)}
                            className="p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-violet-500/50 cursor-pointer transition-all hover:bg-slate-800 group"
                         >
                             <div className="text-violet-400 mb-2 group-hover:scale-110 transition-transform">🎤</div>
                             <div className="text-sm font-semibold">Audio Vibe</div>
                         </div>
                         <div 
                            onClick={() => onNavigate(AppState.DIAGNOSTICS)}
                            className="p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-green-500/50 cursor-pointer transition-all hover:bg-slate-800 group"
                         >
                             <div className="text-green-400 mb-2 group-hover:scale-110 transition-transform">📋</div>
                             <div className="text-sm font-semibold">Diagnostics</div>
                         </div>
                         <div 
                            onClick={() => onNavigate(AppState.SLEEP_ANALYSIS)}
                            className="p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all hover:bg-slate-800 group"
                         >
                             <div className="text-indigo-400 mb-2 group-hover:scale-110 transition-transform">💤</div>
                             <div className="text-sm font-semibold">Sleep Check</div>
                         </div>
                    </div>
                </div>

                {/* Right Sidebar Metrics */}
                <div className="bg-vibe-card rounded-3xl p-6 border border-slate-700 space-y-6">
                    <h3 className="text-lg font-bold text-slate-300">Biometrics</h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-rose-500/20 rounded-full text-rose-500"><Heart size={18} /></div>
                                <div>
                                    <div className="text-sm text-slate-400">Resting HR</div>
                                    <div className="font-bold">{metrics.restingHR} BPM</div>
                                </div>
                            </div>
                        </div>

                         <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-orange-500/20 rounded-full text-orange-500"><Activity size={18} /></div>
                                <div>
                                    <div className="text-sm text-slate-400">HRV</div>
                                    <div className="font-bold">{metrics.hrv} ms</div>
                                </div>
                            </div>
                        </div>

                         <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-yellow-500/20 rounded-full text-yellow-500"><Zap size={18} /></div>
                                <div>
                                    <div className="text-sm text-slate-400">Energy</div>
                                    <div className="font-bold">{metrics.energyLevel}%</div>
                                </div>
                            </div>
                        </div>

                         <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500/20 rounded-full text-blue-500"><Droplets size={18} /></div>
                                <div>
                                    <div className="text-sm text-slate-400">Hydration</div>
                                    <div className="font-bold">{metrics.hydrationLevel}%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-vibe-card p-6 rounded-2xl border border-slate-700">
                    <h4 className="text-cyan-400 font-bold mb-2">Meal Quality</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{metrics.mealQualitySummary}</p>
                </div>
                <div className="bg-vibe-card p-6 rounded-2xl border border-slate-700">
                    <h4 className="text-orange-400 font-bold mb-2">Activity</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{metrics.activitySummary}</p>
                </div>
                <div className="bg-vibe-card p-6 rounded-2xl border border-slate-700">
                    <h4 className="text-indigo-400 font-bold mb-2">Sleep Insight</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">{metrics.sleepSummary}</p>
                </div>
                <div className="bg-vibe-card p-6 rounded-2xl border border-slate-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-green-500/20 to-transparent rounded-bl-3xl"></div>
                    <h4 className="text-green-400 font-bold mb-2">Daily Habits</h4>
                    <ul className="text-sm text-slate-300 space-y-2">
                        {metrics.dailyHabits && metrics.dailyHabits.length > 0 ? (
                            metrics.dailyHabits.map((h, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="mr-2 text-green-500">•</span> {h}
                                </li>
                            ))
                        ) : (
                            <li className="text-slate-500 italic">No habits generated yet.</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};