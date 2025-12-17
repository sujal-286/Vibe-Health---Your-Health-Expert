import React, { useState } from 'react';
import { ArrowLeft, Mic, StopCircle } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { db } from '../services/db';

export const AudioAnalysis: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [recording, setRecording] = useState(false);
    const [analysis, setAnalysis] = useState<string | null>(null);

    const toggleRecord = () => {
        if (!recording) {
            setRecording(true);
            setAnalysis(null);
        } else {
            setRecording(false);
            handleAnalyze();
        }
    };

    const handleAnalyze = async () => {
        const mockTranscript = "I've been feeling really overwhelmed lately with work and I just can't seem to get enough sleep. I feel anxious all the time.";
        try {
            const result = await geminiService.analyzeAudioContext(mockTranscript);
            setAnalysis(result);
            
            const today = new Date().toISOString().split('T')[0];
            db.saveLog(today, 'audioAnalysis', result);

        } catch (e) {
            setAnalysis("Could not analyze audio.");
        }
    };

    return (
        <div className="max-w-2xl mx-auto text-center h-full flex flex-col items-center justify-center">
            <div className="absolute top-8 left-8">
                 <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full"><ArrowLeft /></button>
            </div>
            
            <h2 className="text-3xl font-bold mb-8">Voice Vibe Check</h2>
            
            <div className="relative">
                {recording && <div className="absolute inset-0 bg-rose-500 rounded-full animate-ping opacity-20"></div>}
                <button 
                    onClick={toggleRecord}
                    className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all ${recording ? 'bg-rose-600 scale-110 shadow-[0_0_40px_rgba(225,29,72,0.5)]' : 'bg-slate-800 hover:bg-slate-700 border border-slate-600'}`}
                >
                    {recording ? <StopCircle size={48} className="text-white" /> : <Mic size={48} className="text-cyan-400" />}
                </button>
            </div>

            <p className="mt-8 text-slate-400">
                {recording ? "Listening... Speak naturally about your day." : "Tap to record your thoughts"}
            </p>

            {analysis && (
                <div className="mt-10 p-6 bg-vibe-card border border-violet-500/30 rounded-2xl max-w-lg animate-fade-in shadow-2xl shadow-violet-500/10">
                    <h3 className="text-violet-400 font-bold mb-2 text-lg">Vibe AI Analysis</h3>
                    <p className="text-slate-200 leading-relaxed">{analysis}</p>
                    <div className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-700">Saved to today's log</div>
                </div>
            )}
        </div>
    );
};