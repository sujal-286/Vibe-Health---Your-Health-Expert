import React, { useState } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
import { db } from '../services/db';

export const StressTracker: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [level, setLevel] = useState(5);
    const [note, setNote] = useState('');
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        const today = new Date().toISOString().split('T')[0];
        db.saveLog(today, 'stressData', { level, note });
        setSaved(true);
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full"><ArrowLeft /></button>
                <h1 className="text-3xl font-bold text-rose-400">Stress Analysis</h1>
            </div>

            <div className="bg-vibe-card p-8 rounded-2xl border border-slate-700">
                {!saved ? (
                    <div className="space-y-8">
                         <div className="flex items-center justify-center mb-2">
                            <div className="bg-rose-900/30 p-4 rounded-full">
                                <Zap size={48} className="text-rose-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-center text-lg font-bold text-white mb-4">Current Stress Level: {level}/10</label>
                            <input 
                                type="range" 
                                min="1" 
                                max="10" 
                                value={level} 
                                onChange={(e) => setLevel(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <span>Relaxed</span>
                                <span>Moderate</span>
                                <span>High Panic</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-2">What's on your mind?</label>
                            <textarea 
                                value={note} 
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full h-32 bg-slate-800 border border-slate-600 rounded-xl p-3 outline-none focus:border-rose-500 resize-none" 
                                placeholder="Work, relationships, health..."
                            />
                        </div>

                        <button 
                            onClick={handleSave}
                            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl"
                        >
                            Log Stress
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <h3 className="text-2xl font-bold text-green-400 mb-2">Stress Logged!</h3>
                        <p className="text-slate-400">Your stress data has been saved for today's Vibe calculation.</p>
                        <button onClick={onBack} className="mt-6 text-rose-400 hover:underline">Return to Dashboard</button>
                    </div>
                )}
            </div>
        </div>
    );
};