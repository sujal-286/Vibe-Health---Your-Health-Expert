import React from 'react';
import { ArrowLeft } from 'lucide-react';

export const History: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
         <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full"><ArrowLeft /></button>
                <h1 className="text-3xl font-bold">History</h1>
            </div>
            <div className="p-10 text-center text-slate-500 bg-vibe-card rounded-2xl border border-slate-700">
                No past history available yet. Start tracking your meals and vitals today!
            </div>
        </div>
    );
}