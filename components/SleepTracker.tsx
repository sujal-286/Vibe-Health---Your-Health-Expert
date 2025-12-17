import React, { useState } from 'react';
import { ArrowLeft, Moon } from 'lucide-react';
import { db } from '../services/db';

export const SleepTracker: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [hours, setHours] = useState('');
    const [quality, setQuality] = useState('Good');
    const [bedTime, setBedTime] = useState('');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        if (!hours || !bedTime) return alert("Please fill in all fields");
        const today = new Date().toISOString().split('T')[0];
        db.saveLog(today, 'sleepData', { hours: parseFloat(hours), quality, time: bedTime });
        setSaved(true);
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full"><ArrowLeft /></button>
                <h1 className="text-3xl font-bold text-indigo-400">Sleep Analysis</h1>
            </div>

            <div className="bg-vibe-card p-8 rounded-2xl border border-slate-700">
                {!saved ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-center mb-6">
                            <div className="bg-indigo-900/30 p-4 rounded-full">
                                <Moon size={48} className="text-indigo-400" />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Hours Slept</label>
                            <input 
                                type="number" 
                                value={hours} 
                                onChange={(e) => setHours(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded-xl p-3 outline-none focus:border-indigo-500" 
                                placeholder="e.g. 7.5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Bedtime</label>
                            <input 
                                type="time" 
                                value={bedTime} 
                                onChange={(e) => setBedTime(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-600 rounded-xl p-3 outline-none focus:border-indigo-500 text-white" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Sleep Quality</label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Poor', 'Fair', 'Good', 'Excellent'].map(q => (
                                    <button 
                                        key={q}
                                        onClick={() => setQuality(q)}
                                        className={`p-3 rounded-xl text-sm font-bold border transition-all ${quality === q ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button 
                            onClick={handleSave}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl mt-4"
                        >
                            Log Sleep
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <h3 className="text-2xl font-bold text-green-400 mb-2">Sleep Logged!</h3>
                        <p className="text-slate-400">Your sleep data has been saved for today's Vibe calculation.</p>
                        <button onClick={onBack} className="mt-6 text-indigo-400 hover:underline">Return to Dashboard</button>
                    </div>
                )}
            </div>
        </div>
    );
};