import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Lock, Calculator, Coffee, Utensils, Apple, UtensilsCrossed, Sparkles } from 'lucide-react';
import { MealEntry } from '../types';
import { geminiService } from '../services/geminiService';
import { db } from '../services/db';

export const MealTracker: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [meals, setMeals] = useState<MealEntry[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeType, setActiveType] = useState<string | null>(null);
    const [totals, setTotals] = useState({ cal: 0, pro: 0, carb: 0, fat: 0 });
    const [suggestion, setSuggestion] = useState<string>('');

    const hour = new Date().getHours();
    const canLog = {
        Breakfast: true, 
        Lunch: hour >= 11,
        Snack: true,
        Dinner: hour >= 17
    };

    const mealIcons = {
        Breakfast: Coffee,
        Lunch: Utensils,
        Snack: Apple,
        Dinner: UtensilsCrossed
    };

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        const todaysMeals = db.getMeals(today);
        setMeals(todaysMeals);
        calculateTotals(todaysMeals);
    }, []);

    const calculateTotals = async (currentMeals: MealEntry[]) => {
        const t = currentMeals.reduce((acc, curr) => ({
            cal: acc.cal + (curr.calories || 0),
            pro: acc.pro + (curr.protein || 0),
            carb: acc.carb + (curr.carbs || 0),
            fat: acc.fat + (curr.fats || 0)
        }), { cal: 0, pro: 0, carb: 0, fat: 0 });
        setTotals(t);

        if(currentMeals.length > 0 && !suggestion) {
            try {
                const sugg = await geminiService.getMealSuggestions(currentMeals);
                setSuggestion(sugg);
            } catch(e) { console.error(e) }
        }
    };

    const handleAnalyze = async () => {
        if (!input.trim() || !activeType) return;
        setLoading(true);
        try {
            const result = await geminiService.analyzeMeal(input);
            const newMeal: MealEntry = {
                id: Date.now().toString(),
                type: activeType as any,
                description: input,
                timestamp: Date.now(),
                ...result
            };
            const today = new Date().toISOString().split('T')[0];
            db.saveMeal(today, newMeal);
            const updatedMeals = [...meals, newMeal];
            setMeals(updatedMeals);
            calculateTotals(updatedMeals);
            setInput('');
            setActiveType(null);
        } catch (e) {
            alert("Analysis failed.");
        } finally {
            setLoading(false);
        }
    };

    const MealCard = ({ type }: { type: string }) => {
        const locked = !canLog[type as keyof typeof canLog];
        const logged = meals.filter(m => m.type === type);
        const Icon = mealIcons[type as keyof typeof mealIcons] || Utensils;
        
        return (
            <div className={`p-6 rounded-2xl border ${locked ? 'bg-slate-900/50 border-slate-800' : 'bg-vibe-card border-slate-700'} relative h-full flex flex-col`}>
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${locked ? 'bg-slate-800 text-slate-600' : 'bg-cyan-500/10 text-cyan-400'}`}>
                            <Icon size={20} />
                        </div>
                        <h3 className="text-xl font-bold">{type}</h3>
                    </div>
                    {locked && <Lock className="text-slate-600" size={20} />}
                </div>

                <div className="space-y-3 flex-1">
                    {logged.length > 0 ? logged.map(m => (
                        <div key={m.id} className="bg-slate-800 p-3 rounded-lg text-sm border border-slate-700">
                            <div className="font-semibold">{m.description}</div>
                            <div className="text-xs text-cyan-400 mt-1 flex gap-2">
                                <span>{m.calories} cal</span>
                                <span>{m.protein}p {m.carbs}c {m.fats}f</span>
                            </div>
                        </div>
                    )) : (
                        <div className="text-slate-500 text-sm italic py-4">No meals logged.</div>
                    )}
                </div>

                {!locked && (
                    <button 
                        onClick={() => setActiveType(type)}
                        className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-700 hover:border-cyan-500/50"
                    >
                        + Add {type}
                    </button>
                )}
                
                {locked && <div className="mt-4 text-xs text-red-900/50 bg-red-900/10 p-2 rounded text-center border border-red-900/20">Locked until time</div>}
            </div>
        );
    };

    return (
        <div className="max-w-5xl mx-auto pb-10">
            <div className="flex items-center space-x-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full"><ArrowLeft /></button>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Meal Analysis</h1>
            </div>

            {/* Daily Summary */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700 mb-8 flex flex-col md:flex-row gap-6 items-center shadow-lg">
                <div className="flex-1 w-full">
                    <h2 className="text-lg font-bold text-slate-300 mb-4 flex items-center"><Calculator className="mr-2"/> Today's Total Nutrition</h2>
                    <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                            <div className="text-2xl font-bold text-white">{totals.cal}</div>
                            <div className="text-xs text-slate-500 uppercase">Cals</div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                            <div className="text-2xl font-bold text-green-400">{totals.pro}g</div>
                            <div className="text-xs text-slate-500 uppercase">Protein</div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                            <div className="text-2xl font-bold text-orange-400">{totals.carb}g</div>
                            <div className="text-xs text-slate-500 uppercase">Carbs</div>
                        </div>
                        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                            <div className="text-2xl font-bold text-yellow-400">{totals.fat}g</div>
                            <div className="text-xs text-slate-500 uppercase">Fats</div>
                        </div>
                    </div>
                </div>
                {suggestion && (
                    <div className="flex-1 w-full bg-cyan-900/10 p-4 rounded-xl border border-cyan-500/20">
                        <h3 className="text-cyan-400 font-bold mb-2 text-sm flex items-center"><Sparkles size={14} className="mr-2"/> Vibe AI Insight</h3>
                        <p className="text-sm text-cyan-100 leading-relaxed italic">"{suggestion}"</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MealCard type="Breakfast" />
                <MealCard type="Lunch" />
                <MealCard type="Snack" />
                <MealCard type="Dinner" />
            </div>

            {/* Input Modal */}
            {activeType && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Log {activeType}</h3>
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="e.g., Grilled chicken salad with avocado..."
                            className="w-full h-32 bg-slate-800 border border-slate-600 rounded-xl p-4 text-white focus:border-cyan-500 outline-none resize-none"
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setActiveType(null)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                            <button 
                                onClick={handleAnalyze} 
                                disabled={loading}
                                className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold flex items-center transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                            >
                                {loading ? 'Analyzing...' : 'Analyze with Gemini'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};