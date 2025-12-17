import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, Activity, CheckCircle, AlertTriangle } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { db } from '../services/db';

interface TestOption {
    label: string;
    value: number;
}

interface TestSchema {
    id: string;
    name: string;
    description: string;
    options: TestOption[];
    questions: string[];
    reverseIndices?: number[]; // indices of questions to reverse score (3 - value)
    grading: { min: number; max: number; label: string; color: string }[];
}

const TESTS: TestSchema[] = [
    {
        id: 'gad7',
        name: 'GAD-7 Anxiety Screening',
        description: 'Screening for Generalized Anxiety Disorder',
        options: [
            { label: 'Not at all', value: 0 },
            { label: 'Several days', value: 1 },
            { label: 'More than half the days', value: 2 },
            { label: 'Nearly every day', value: 3 }
        ],
        questions: [
            'Feeling nervous, anxious, or on edge',
            'Not being able to stop or control worrying',
            'Worrying too much about different things',
            'Trouble relaxing',
            'Feeling restless, hard to sit still',
            'Becoming easily annoyed or irritable',
            'Feeling afraid as if something awful might happen'
        ],
        grading: [
            { min: 0, max: 4, label: 'Minimal Anxiety', color: 'text-green-400' },
            { min: 5, max: 9, label: 'Mild Anxiety', color: 'text-yellow-400' },
            { min: 10, max: 14, label: 'Moderate Anxiety', color: 'text-orange-400' },
            { min: 15, max: 21, label: 'Severe Anxiety', color: 'text-red-400' }
        ]
    },
    {
        id: 'phq9',
        name: 'PHQ-9 Depression (Short)',
        description: 'Screening for Depression',
        options: [
            { label: 'Not at all', value: 0 },
            { label: 'Several days', value: 1 },
            { label: 'More than half the days', value: 2 },
            { label: 'Nearly every day', value: 3 }
        ],
        questions: [
            'Little interest or pleasure in doing things',
            'Feeling down, depressed, or hopeless',
            'Trouble sleeping or sleeping too much',
            'Feeling tired or having little energy',
            'Poor appetite or overeating',
            'Feeling bad about yourself or like a failure',
            'Trouble concentrating on tasks'
        ],
        grading: [
             { min: 0, max: 4, label: 'None', color: 'text-green-400' },
             { min: 5, max: 9, label: 'Mild Depression', color: 'text-yellow-400' },
             { min: 10, max: 14, label: 'Moderate Depression', color: 'text-orange-400' },
             { min: 15, max: 21, label: 'Severe Depression', color: 'text-red-400' }
        ]
    },
    {
        id: 'sleep',
        name: 'Sleep Quality Index',
        description: 'Assess your sleep patterns',
        options: [
            { label: 'Very good', value: 0 },
            { label: 'Good', value: 1 },
            { label: 'Poor', value: 2 },
            { label: 'Very poor', value: 3 }
        ],
        questions: [
            'Overall sleep quality',
            'Time taken to fall asleep',
            'Number of night awakenings',
            'Feeling rested after sleep',
            'Consistency of sleep schedule',
            'Daytime sleepiness',
            'Sleep interruptions (noise, phone, thoughts)'
        ],
        grading: [
            { min: 0, max: 6, label: 'Healthy Sleep', color: 'text-green-400' },
            { min: 7, max: 13, label: 'Moderate Issues', color: 'text-yellow-400' },
            { min: 14, max: 21, label: 'Poor Sleep', color: 'text-red-400' }
        ]
    },
    {
        id: 'pss7',
        name: 'Perceived Stress Scale',
        description: 'Measure perception of stress',
        options: [
            { label: 'Never', value: 0 },
            { label: 'Sometimes', value: 1 },
            { label: 'Often', value: 2 },
            { label: 'Very often', value: 3 }
        ],
        questions: [
            'Felt stressed or tense',
            'Felt unable to control important things',
            'Felt nervous or “stressed out”',
            'Felt confident handling personal problems', // Reverse
            'Felt things were going your way', // Reverse
            'Felt difficulties piling up',
            'Felt overwhelmed by responsibilities'
        ],
        reverseIndices: [3, 4],
        grading: [
            { min: 0, max: 6, label: 'Low Stress', color: 'text-green-400' },
            { min: 7, max: 13, label: 'Moderate Stress', color: 'text-yellow-400' },
            { min: 14, max: 21, label: 'High Stress', color: 'text-red-400' }
        ]
    },
    {
        id: 'focus',
        name: 'Focus & Attention Assessment',
        description: 'Evaluate concentration levels',
        options: [
            { label: 'Never', value: 0 },
            { label: 'Rarely', value: 1 },
            { label: 'Often', value: 2 },
            { label: 'Always', value: 3 }
        ],
        questions: [
            'I lose focus while studying/working',
            'I switch tasks without finishing them',
            'I check my phone frequently during tasks',
            'I struggle to concentrate for 30+ minutes',
            'I forget what I was just doing',
            'I procrastinate important tasks',
            'I feel mentally scattered'
        ],
        grading: [
            { min: 0, max: 6, label: 'Strong Focus', color: 'text-green-400' },
            { min: 7, max: 13, label: 'Moderate Difficulty', color: 'text-yellow-400' },
            { min: 14, max: 21, label: 'Poor Attention', color: 'text-red-400' }
        ]
    },
    {
        id: 'burnout',
        name: 'Burnout Assessment',
        description: 'Check for signs of burnout',
        options: [
            { label: 'Never', value: 0 },
            { label: 'Occasionally', value: 1 },
            { label: 'Frequently', value: 2 },
            { label: 'Always', value: 3 }
        ],
        questions: [
            'I feel emotionally exhausted',
            'I feel drained at the end of the day',
            'I lack motivation for work/studies',
            'I feel detached or numb',
            'I feel pressure even when resting',
            'I feel unproductive despite effort',
            'I feel like I’m “running on empty”'
        ],
        grading: [
            { min: 0, max: 6, label: 'No Burnout', color: 'text-green-400' },
            { min: 7, max: 13, label: 'Early Signs', color: 'text-yellow-400' },
            { min: 14, max: 21, label: 'Severe Burnout', color: 'text-red-400' }
        ]
    },
    {
        id: 'diet',
        name: 'Nutritional Habits Assessment',
        description: 'Evaluate dietary choices',
        options: [
            { label: 'Always', value: 0 },
            { label: 'Often', value: 1 },
            { label: 'Rarely', value: 2 },
            { label: 'Never', value: 3 }
        ],
        questions: [
            'I eat balanced meals',
            'I consume fruits & vegetables daily',
            'I drink enough water',
            'I skip meals', // Reverse
            'I consume junk/fast food', // Reverse
            'I overconsume sugary drinks', // Reverse
            'I eat at regular times'
        ],
        reverseIndices: [3, 4, 5],
        grading: [
            { min: 0, max: 6, label: 'Healthy Habits', color: 'text-green-400' },
            { min: 7, max: 13, label: 'Needs Improvement', color: 'text-yellow-400' },
            { min: 14, max: 21, label: 'Poor Habits', color: 'text-red-400' }
        ]
    }
];

export const Diagnostics: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeTest, setActiveTest] = useState<TestSchema | null>(null);
    const [answers, setAnswers] = useState<number[]>([]);
    const [calculatedScore, setCalculatedScore] = useState<number | null>(null);
    const [grade, setGrade] = useState<{ label: string; color: string } | null>(null);
    const [geminiAnalysis, setGeminiAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const startTest = (test: TestSchema) => {
        setActiveTest(test);
        setAnswers(new Array(test.questions.length).fill(-1)); // -1 means unanswered
        setCalculatedScore(null);
        setGrade(null);
        setGeminiAnalysis(null);
    };

    const handleAnswer = (questionIndex: number, value: number) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = value;
        setAnswers(newAnswers);
    };

    const calculateResult = () => {
        if (!activeTest) return;
        if (answers.some(a => a === -1)) {
            alert("Please answer all questions.");
            return;
        }

        let total = 0;
        answers.forEach((ans, idx) => {
            if (activeTest.reverseIndices?.includes(idx)) {
                total += (3 - ans);
            } else {
                total += ans;
            }
        });

        setCalculatedScore(total);

        // Find grade
        const g = activeTest.grading.find(range => total >= range.min && total <= range.max);
        if (g) setGrade({ label: g.label, color: g.color });
    };

    const analyzeWithGemini = async () => {
        if (!activeTest || calculatedScore === null || !grade) return;
        setLoading(true);

        try {
            // Format answers for AI
            const formattedAnswers = activeTest.questions.map((q, i) => {
                const ansValue = answers[i];
                const optionLabel = activeTest.options.find(o => o.value === ansValue)?.label;
                return `Q: ${q} | A: ${optionLabel} (${ansValue})`;
            });

            // Append score context
            formattedAnswers.push(`TOTAL SCORE: ${calculatedScore}`);
            formattedAnswers.push(`RESULT CATEGORY: ${grade.label}`);

            const analysis = await geminiService.analyzeDiagnostic(formattedAnswers, activeTest.name);
            setGeminiAnalysis(analysis);
            
            const today = new Date().toISOString().split('T')[0];
            db.saveLog(today, 'diagnosticResult', { 
                type: activeTest.name, 
                score: calculatedScore,
                category: grade.label,
                result: analysis 
            });

        } catch (e) {
            setGeminiAnalysis("AI Analysis failed. Check connection.");
        } finally {
            setLoading(false);
        }
    };

    if (activeTest) {
        return (
            <div className="max-w-3xl mx-auto pb-10">
                <button onClick={() => setActiveTest(null)} className="mb-6 flex items-center text-slate-400 hover:text-white"><ArrowLeft size={16} className="mr-2"/> Back to Tests</button>
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-cyan-400">{activeTest.name}</h2>
                        <p className="text-sm text-slate-400">{activeTest.description}</p>
                    </div>
                </div>
                
                {/* Scoring Result Display */}
                {calculatedScore !== null && grade && (
                    <div className="mb-8 p-6 bg-slate-800 rounded-2xl border border-slate-700 animate-fade-in flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <div className="text-sm text-slate-400 uppercase tracking-widest mb-1">Your Score</div>
                            <div className={`text-4xl font-black ${grade.color}`}>{calculatedScore} <span className="text-lg text-slate-500">/ 21</span></div>
                            <div className={`font-bold text-lg mt-1 ${grade.color}`}>{grade.label}</div>
                        </div>
                        
                        {!geminiAnalysis ? (
                            <button 
                                onClick={analyzeWithGemini}
                                disabled={loading}
                                className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl font-bold text-white shadow-lg shadow-violet-500/20 hover:scale-105 transition-transform"
                            >
                                {loading ? 'Analyzing with AI...' : 'Get AI Professional Insights'}
                            </button>
                        ) : (
                            <div className="hidden md:block text-green-400 font-bold flex items-center">
                                <CheckCircle className="mr-2" /> Analysis Complete
                            </div>
                        )}
                    </div>
                )}

                {/* AI Analysis Result */}
                {geminiAnalysis && (
                    <div className="mb-8 bg-vibe-card p-6 rounded-2xl border border-violet-500/30 shadow-2xl shadow-violet-500/10 animate-fade-in">
                        <h3 className="text-violet-400 font-bold mb-4 flex items-center"><Activity className="mr-2"/> AI Assessment & Recommendations</h3>
                        <div className="prose prose-invert prose-sm max-w-none">
                            <pre className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed bg-transparent border-none p-0">
                                {(() => {
                                    try {
                                        const parsed = JSON.parse(geminiAnalysis);
                                        return (
                                            <>
                                                <div className="mb-2"><strong className="text-white">Assessment:</strong> {parsed.assessment}</div>
                                                <div><strong className="text-white">Recommendation:</strong> {parsed.recommendation}</div>
                                            </>
                                        );
                                    } catch {
                                        return geminiAnalysis;
                                    }
                                })()}
                            </pre>
                        </div>
                    </div>
                )}

                {/* Questions List */}
                {calculatedScore === null && (
                    <div className="space-y-6">
                        {activeTest.questions.map((q, i) => (
                            <div key={i} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                                <div className="text-lg font-medium mb-4 text-slate-200">{i + 1}. {q}</div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {activeTest.options.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleAnswer(i, opt.value)}
                                            className={`p-3 rounded-xl text-sm font-semibold transition-all border ${
                                                answers[i] === opt.value
                                                    ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]'
                                                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        
                        <button 
                            onClick={calculateResult}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/20 transition-all mt-8"
                        >
                            Calculate Result
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-10">
            <div className="flex items-center space-x-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-full"><ArrowLeft /></button>
                <h1 className="text-3xl font-bold text-white">Diagnostics Hub</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {TESTS.map(test => (
                    <div 
                        key={test.id}
                        onClick={() => startTest(test)}
                        className="bg-vibe-card p-6 rounded-2xl border border-slate-700 hover:border-cyan-500/50 cursor-pointer group transition-all hover:translate-y-[-2px]"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                                <Activity size={24} />
                            </div>
                            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">{test.questions.length} Qs</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-white group-hover:text-cyan-400 transition-colors">{test.name}</h3>
                        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{test.description}</p>
                        
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
                             <div className="text-xs text-slate-600 font-mono">Standardized</div>
                             <ChevronRight className="text-slate-600 group-hover:text-cyan-400 transition-colors" size={18} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};