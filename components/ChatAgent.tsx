import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, MapPin } from 'lucide-react';
import { geminiService } from '../services/geminiService';

export const ChatAgent: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [messages, setMessages] = useState<{ role: 'user' | 'model', parts: string }[]>([
        { role: 'model', parts: "Hi, I'm Vibe AI. I can help with stress, anxiety, or finding professional help. How are you feeling?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);
    const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

    useEffect(() => {
        scrollToBottom();
        // Pre-fetch location if possible
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            },
            (err) => console.log("Location access denied or error", err)
        );
    }, [messages]);

    const scrollToBottom = () => endRef.current?.scrollIntoView({ behavior: "smooth" });

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', parts: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            // Refresh location to ensure accuracy for grounding
            let currentLoc = location;
            if (!currentLoc) {
                try {
                     const pos: any = await new Promise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
                     });
                     currentLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                     setLocation(currentLoc);
                } catch(e) {
                    // ignore error, proceed without loc
                }
            }

            const response = await geminiService.getChatResponse(messages, userMsg, currentLoc);
            setMessages(prev => [...prev, { role: 'model', parts: response }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'model', parts: "I'm having trouble connecting right now." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto">
            <div className="flex items-center space-x-4 mb-4">
                <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full"><ArrowLeft /></button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Vibe AI Therapist</h1>
                    {location && <div className="flex items-center text-xs text-green-400"><MapPin size={10} className="mr-1"/> Location Active</div>}
                </div>
            </div>

            <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-cyan-900/50 text-cyan-100 rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>
                                {m.parts}
                            </div>
                        </div>
                    ))}
                    {loading && <div className="text-xs text-slate-500 ml-4 animate-pulse">Vibe AI is thinking...</div>}
                    <div ref={endRef} />
                </div>
                
                <div className="p-4 bg-slate-800 border-t border-slate-700 flex gap-2">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Tell me how you feel or ask for nearby doctors..."
                        className="flex-1 bg-slate-900 border-none rounded-xl px-4 text-white focus:ring-2 focus:ring-violet-500 outline-none"
                    />
                    <button onClick={handleSend} disabled={loading} className="p-3 bg-violet-600 rounded-xl hover:bg-violet-500 disabled:opacity-50 transition-colors">
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};