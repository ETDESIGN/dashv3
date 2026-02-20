import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';
import { generateText, generateSpeech, decodeAudioData, base64ToArrayBuffer } from '../services/geminiService';

interface GeminiAssistantProps {
    viewName?: string;
    context?: string;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ viewName = 'Mission Control', context = '' }) => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    // Clear response when view changes to avoid stale context
    useEffect(() => {
        setResponse('');
        setPrompt('');
    }, [viewName]);

    const handleAsk = async (overridePrompt?: string) => {
        const finalPrompt = overridePrompt || prompt;
        if (!finalPrompt.trim()) return;
        
        setLoading(true);
        // Only clear response if it's a new manual query, keep it for auto-analyze initially to show transition if needed
        if (!overridePrompt) setResponse(''); 
        
        try {
            // Inject context system instruction implicitly by appending it
            const enrichedPrompt = `Context: You are analyzing the "${viewName}" of NB Studio. 
            System Data: ${context ? context.slice(0, 1000) : 'No specific data provided.'}
            
            User Query: ${finalPrompt}
            
            Keep answer concise (under 50 words) and operational.`;

            const text = await generateText(enrichedPrompt);
            setResponse(text || "No response received.");
        } catch (e) {
            setResponse("Error: Could not connect to Gemini.");
        } finally {
            setLoading(false);
        }
    };

    const handleAutoAnalyze = () => {
        const autoPrompt = `Analyze the current status of ${viewName} and identify any anomalies or efficiency opportunities.`;
        setPrompt(autoPrompt);
        handleAsk(autoPrompt);
    };

    const handleTTS = async () => {
        if(!response) return;
        try {
            const audioData = await generateSpeech(response.slice(0, 200));
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
            
            const buffer = await decodeAudioData(
                base64ToArrayBuffer(audioData), 
                ctx, 
                24000, 
                1
            );
            
            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.connect(ctx.destination);
            
            source.onended = () => {
                ctx.close();
            };
            
            source.start(0);
        } catch(e) {
            console.error(e);
        }
    }

    return (
        <div className="flex flex-col h-full relative">
            <div className="flex justify-between items-center mb-2 px-1">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                    Context: {viewName}
                </span>
                <button 
                    onClick={handleAutoAnalyze}
                    className="text-[10px] flex items-center gap-1 font-bold text-slate-400 hover:text-blue-500 transition-colors"
                    title="Generate automated insight"
                >
                    <Icons.Sparkle /> Auto-Analyze
                </button>
            </div>

            <div className="flex-1 bg-slate-50 dark:bg-slate-900 rounded-xl p-3 mb-3 overflow-y-auto custom-scrollbar text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium shadow-inner">
                {loading ? (
                    <div className="flex items-center gap-2 text-slate-400 animate-pulse">
                        <Icons.Sparkle /> Processing System Telemetry...
                    </div>
                ) : response ? (
                    <div className="animate-fade-in">
                        <div className="flex items-start gap-2">
                            <div className="mt-1 text-blue-500"><Icons.Sparkle /></div>
                            <div>{response}</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 opacity-60">
                        <Icons.Sparkle />
                        <span className="text-xs italic text-center">Ready for queries regarding<br/>{viewName} operations.</span>
                    </div>
                )}
            </div>
            
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
                    placeholder={`Ask about ${viewName}...`}
                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all shadow-sm"
                />
                <button onClick={() => handleAsk()} disabled={loading} className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm">
                    <Icons.Send />
                </button>
                {response && (
                    <button onClick={handleTTS} className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-200 p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-200 dark:border-slate-600">
                        <Icons.Volume2 />
                    </button>
                )}
            </div>
        </div>
    );
};