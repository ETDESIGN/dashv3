
import React, { useEffect, useRef } from 'react';
import { useSystemStore } from '../store/systemStore';
import { Icons } from '../constants';

export const AgentDetailPanel: React.FC = () => {
    const { data, selectedAgentId, setSelectedAgentId, isEmergencyStop } = useSystemStore();
    const agent = data.agents.find(a => a.id === selectedAgentId);
    const logsEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logs
    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [agent?.logs]);

    if (!agent) return null;

    return (
        <div className="fixed inset-0 z-[60] flex justify-end pointer-events-none">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm pointer-events-auto transition-opacity"
                onClick={() => setSelectedAgentId(null)}
            ></div>

            {/* Panel */}
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl pointer-events-auto border-l border-slate-200 dark:border-slate-700 flex flex-col animate-slide-in-right">
                
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-inner ${
                            agent.status === 'error' ? 'bg-red-100 text-red-600' : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                            {agent.name.substring(0, 2)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">{agent.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{agent.role}</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    agent.status === 'active' ? 'bg-green-100 text-green-700' :
                                    agent.status === 'error' ? 'bg-red-100 text-red-700' :
                                    'bg-slate-100 text-slate-600'
                                }`}>
                                    {agent.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setSelectedAgentId(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <Icons.X />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-2 text-slate-500">
                                <Icons.Cpu className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase">CPU Load</span>
                            </div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white mb-2">{agent.cpuUsage}%</div>
                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full transition-all duration-500 ${agent.cpuUsage && agent.cpuUsage > 80 ? 'bg-red-500' : 'bg-blue-500'}`} 
                                    style={{ width: `${agent.cpuUsage}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-2 text-slate-500">
                                <Icons.Activity className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase">Memory</span>
                            </div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white mb-2">{agent.memoryUsage} MB</div>
                            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-purple-500 transition-all duration-500" 
                                    style={{ width: `${Math.min(100, (agent.memoryUsage || 0) / 10)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Terminal */}
                    <div className="bg-slate-900 rounded-2xl p-4 font-mono text-xs overflow-hidden flex flex-col h-96 shadow-inner border border-slate-800">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800 text-slate-500">
                            <span className="font-bold">Live System Logs</span>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                            {isEmergencyStop && <div className="text-red-500 font-bold">!!! SYSTEM HALTED BY KILL SWITCH !!!</div>}
                            {agent.logs?.map((log, i) => (
                                <div key={i} className="text-slate-300 break-all">
                                    <span className="text-slate-600 mr-2">$</span>
                                    {log}
                                </div>
                            ))}
                            <div ref={logsEndRef}></div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <Icons.Terminal /> SSH Connect
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                            <Icons.Trash /> Kill Process
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};
