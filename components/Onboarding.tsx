import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ArrowRight, Check } from 'lucide-react';

export const Onboarding: React.FC<{ onComplete: (p: UserProfile) => void }> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<Partial<UserProfile>>({
        activityLevel: 'Moderate',
        dietaryPref: 'None',
        medicalHistory: 'None'
    });

    const handleChange = (field: keyof UserProfile, value: any) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const next = () => setStep(step + 1);

    const finish = () => {
        // Basic validation
        if (!data.name || !data.age) {
            alert("Please fill in basic information.");
            setStep(1);
            return;
        }
        onComplete(data as UserProfile);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-vibe-dark p-6">
            <div className="w-full max-w-lg bg-vibe-card border border-slate-700 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }}></div>
                </div>

                <div className="mb-8 mt-4 text-center">
                     <h2 className="text-3xl font-bold text-white mb-2">
                        {step === 1 && "The Basics"}
                        {step === 2 && "Body Metrics"}
                        {step === 3 && "Lifestyle"}
                        {step === 4 && "Health Context"}
                     </h2>
                     <p className="text-slate-400 text-sm">Step {step} of 4</p>
                </div>

                {step === 1 && (
                    <div className="space-y-4 animate-fade-in">
                        <div>
                            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Full Name</label>
                            <input type="text" placeholder="John Doe" className="w-full bg-slate-800 border border-slate-600 rounded-xl p-4 text-white outline-none focus:border-cyan-500 transition-colors" onChange={e => handleChange('name', e.target.value)} value={data.name || ''} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Age</label>
                                <input type="number" placeholder="25" className="w-full bg-slate-800 border border-slate-600 rounded-xl p-4 text-white outline-none focus:border-cyan-500" onChange={e => handleChange('age', parseInt(e.target.value))} value={data.age || ''} />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Gender</label>
                                <select className="w-full bg-slate-800 border border-slate-600 rounded-xl p-4 text-white outline-none focus:border-cyan-500" onChange={e => handleChange('gender', e.target.value)} value={data.gender || ''}>
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Non-binary">Non-binary</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <button onClick={next} className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-xl font-bold mt-6 flex items-center justify-center transition-transform active:scale-95">Next Step <ArrowRight size={18} className="ml-2"/></button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Height</label>
                                <input type="text" placeholder="5'10 / 178cm" className="w-full bg-slate-800 border border-slate-600 rounded-xl p-4 text-white outline-none focus:border-cyan-500" onChange={e => handleChange('height', e.target.value)} value={data.height || ''} />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Weight</label>
                                <input type="text" placeholder="70kg / 154lbs" className="w-full bg-slate-800 border border-slate-600 rounded-xl p-4 text-white outline-none focus:border-cyan-500" onChange={e => handleChange('weight', e.target.value)} value={data.weight || ''} />
                            </div>
                        </div>
                        <button onClick={next} className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-xl font-bold mt-6 flex items-center justify-center transition-transform active:scale-95">Next Step <ArrowRight size={18} className="ml-2"/></button>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 animate-fade-in">
                        <div>
                            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Typical Activity Level</label>
                            <select className="w-full bg-slate-800 border border-slate-600 rounded-xl p-4 text-white outline-none focus:border-cyan-500" onChange={e => handleChange('activityLevel', e.target.value)} value={data.activityLevel || 'Moderate'}>
                                <option value="Sedentary">Sedentary (Little to no exercise)</option>
                                <option value="Light">Lightly Active (1-3 days/week)</option>
                                <option value="Moderate">Moderately Active (3-5 days/week)</option>
                                <option value="Very Active">Very Active (6-7 days/week)</option>
                                <option value="Athlete">Athlete (2x per day)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Dietary Preferences</label>
                            <select className="w-full bg-slate-800 border border-slate-600 rounded-xl p-4 text-white outline-none focus:border-cyan-500" onChange={e => handleChange('dietaryPref', e.target.value)} value={data.dietaryPref || 'None'}>
                                <option value="None">No Restrictions</option>
                                <option value="Vegetarian">Vegetarian</option>
                                <option value="Vegan">Vegan</option>
                                <option value="Keto">Keto</option>
                                <option value="Paleo">Paleo</option>
                                <option value="Gluten-Free">Gluten-Free</option>
                            </select>
                        </div>

                         <div>
                            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Avg. Sleep Hours</label>
                            <input type="number" placeholder="e.g. 7.5" className="w-full bg-slate-800 border border-slate-600 rounded-xl p-4 text-white outline-none focus:border-cyan-500" onChange={e => handleChange('sleepHours', e.target.value)} value={data.sleepHours || ''} />
                        </div>
                        
                        <button onClick={next} className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-xl font-bold mt-6 flex items-center justify-center transition-transform active:scale-95">Next Step <ArrowRight size={18} className="ml-2"/></button>
                    </div>
                )}

                {step === 4 && (
                    <div className="space-y-4 animate-fade-in">
                        <div>
                            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Medical History / Conditions</label>
                            <textarea 
                                placeholder="Any known conditions? (e.g. Diabetes, Hypertension, Asthma, None)"
                                className="w-full h-24 bg-slate-800 border border-slate-600 rounded-xl p-4 text-white outline-none focus:border-violet-500 resize-none"
                                onChange={e => handleChange('medicalHistory', e.target.value)}
                                value={data.medicalHistory || ''}
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Primary Health Goal</label>
                            <textarea 
                                placeholder="What do you want to achieve? (e.g., Lose weight, reduce stress, build muscle)"
                                className="w-full h-24 bg-slate-800 border border-slate-600 rounded-xl p-4 text-white outline-none focus:border-violet-500 resize-none"
                                onChange={e => handleChange('goals', e.target.value)}
                                value={data.goals || ''}
                            />
                        </div>
                        
                        <button onClick={finish} className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 py-4 rounded-xl font-bold mt-6 flex items-center justify-center shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02]">
                            Initialize Vibe Profile <Check size={18} className="ml-2"/>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};