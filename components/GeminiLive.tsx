import React, { useEffect, useRef, useState } from 'react';
import { GeminiLiveClient, createPcmBlob, decodeAudioData, base64ToArrayBuffer } from '../services/geminiService';
import { Icons } from '../constants';

export const GeminiLive: React.FC = () => {
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  
  // Refs for audio handling
  const clientRef = useRef<GeminiLiveClient | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null); // Track input context
  const analyserRef = useRef<AnalyserNode | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Visualizer Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);

  // Initialize Client
  useEffect(() => {
    try {
      clientRef.current = new GeminiLiveClient();
    } catch (e) {
      console.error("Gemini Live Client Init Error:", e);
    }
    return () => {
      stopSession();
    };
  }, []);

  // Visualizer Loop
  const drawVisualizer = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    analyser.getByteFrequencyData(dataArray);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Visualizer Settings
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;

    // Draw Bars
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] / 2;
      
      // Gradient Color
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#60a5fa'); // blue-400
      gradient.addColorStop(1, '#3b82f6'); // blue-500
      
      ctx.fillStyle = status === 'speaking' ? '#a855f7' : gradient; // Purple if AI speaking
      
      // Rounded top bars
      ctx.beginPath();
      ctx.roundRect(x, canvas.height - barHeight, barWidth, barHeight, 5);
      ctx.fill();

      x += barWidth + 1;
    }

    animationFrameRef.current = requestAnimationFrame(drawVisualizer);
  };

  const startSession = async () => {
    if (!clientRef.current) return;
    setStatus('connecting');

    try {
      // Setup Audio Contexts
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass({ sampleRate: 24000 });
      audioContextRef.current = ctx;

      // Setup Visualizer Analyser
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // Low FFT size for fewer, wider bars
      analyserRef.current = analyser;

      // Microphone Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Connect to Gemini Live
      await clientRef.current.connect({
        onopen: () => {
          setStatus('listening');
          setActive(true);
          
          // Setup Input Processing
          const inputCtx = new AudioContextClass({ sampleRate: 16000 });
          inputContextRef.current = inputCtx;

          const source = inputCtx.createMediaStreamSource(stream);
          
          // Connect Mic to Visualizer
          const visSource = ctx.createMediaStreamSource(stream);
          visSource.connect(analyser);

          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmData = createPcmBlob(inputData);
            clientRef.current?.sendRealtimeInput({ media: pcmData });
          };

          source.connect(processor);
          processor.connect(inputCtx.destination);
          
          inputSourceRef.current = source;
          processorRef.current = processor;
          
          // Start Visualizer
          drawVisualizer();
        },
        onmessage: async (message) => {
            // Handle Interruption
            if (message.serverContent?.interrupted) {
                sourcesRef.current.forEach(source => {
                    try { source.stop(); } catch(e) {}
                });
                sourcesRef.current.clear();
                nextStartTimeRef.current = 0;
                setStatus('listening');
                return;
            }

            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
                setStatus('speaking');
                const ctx = audioContextRef.current;
                
                // Decode
                const audioBuffer = await decodeAudioData(
                    base64ToArrayBuffer(base64Audio),
                    ctx,
                    24000,
                    1
                );
                
                // Play
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                
                // Connect Audio -> Analyser -> Speaker
                if (analyserRef.current) {
                    source.connect(analyserRef.current);
                    analyserRef.current.connect(ctx.destination);
                } else {
                    source.connect(ctx.destination);
                }
                
                // Sync playback
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += audioBuffer.duration;
                
                sourcesRef.current.add(source);
                source.onended = () => {
                    sourcesRef.current.delete(source);
                    // Only go back to listening if no other sources are playing
                    if (sourcesRef.current.size === 0) {
                        setStatus('listening');
                    }
                };
            }
        },
        onclose: () => {
            stopSession();
        },
        onerror: (err) => {
            console.error(err);
            stopSession();
        }
      });

    } catch (e) {
      console.error("Failed to start live session", e);
      setStatus('idle');
      setActive(false);
    }
  };

  const stopSession = () => {
    setActive(false);
    setStatus('idle');
    
    // Stop Animation
    cancelAnimationFrame(animationFrameRef.current);
    
    // Stop Mic
    streamRef.current?.getTracks().forEach(t => t.stop());
    processorRef.current?.disconnect();
    inputSourceRef.current?.disconnect();
    
    // Stop Audio Contexts
    audioContextRef.current?.close();
    inputContextRef.current?.close();
    
    // Disconnect Client
    clientRef.current?.disconnect();
    
    // Reset Refs
    streamRef.current = null;
    processorRef.current = null;
    inputSourceRef.current = null;
    audioContextRef.current = null;
    inputContextRef.current = null;
    analyserRef.current = null;
    nextStartTimeRef.current = 0;
    sourcesRef.current.clear();
    
    // Clear Canvas
    if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const toggleSession = () => {
    if (active) {
      stopSession();
    } else {
      startSession();
    }
  };

  return (
    <div className={`flex flex-col h-full justify-between transition-colors duration-500 ${active ? 'bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-900' : ''} rounded-2xl p-4`}>
        <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
                 <div className={`w-3 h-3 rounded-full ${status === 'listening' ? 'bg-green-500 animate-pulse' : status === 'speaking' ? 'bg-purple-500 animate-pulse' : 'bg-slate-300'}`}></div>
                 <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{status === 'idle' ? 'Live Off' : status}</span>
            </div>
            {active && <Icons.Activity className="text-slate-400" />}
        </div>

        <div className="flex-1 flex items-end justify-center my-4 relative overflow-hidden rounded-xl">
             {/* Canvas Visualizer */}
             <canvas 
                ref={canvasRef} 
                width="200" 
                height="80" 
                className={`w-full h-full object-cover opacity-80 ${active ? 'block' : 'hidden'}`}
             />
             
             {/* Static Placeholder if not active */}
             {!active && (
                 <div className="flex gap-1 items-end h-8 mb-4 opacity-30">
                     {[...Array(8)].map((_, i) => (
                         <div key={i} className="w-2 bg-slate-400 rounded-full h-2"></div>
                     ))}
                 </div>
             )}
        </div>

        <button 
            onClick={toggleSession}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all z-10 ${
                active 
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30' 
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30'
            }`}
        >
            {active ? (
                <>Stop Live Session</>
            ) : (
                <><Icons.Mic /> Start Voice Command</>
            )}
        </button>
    </div>
  );
};