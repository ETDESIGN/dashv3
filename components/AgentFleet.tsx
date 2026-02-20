
import React from 'react';
import { useSystemStore } from '../store/systemStore';
import { Icons } from '../constants';

export const AgentFleet: React.FC<{ onSelectAgent: (id: string) => void }> = ({ onSelectAgent }) => {
    const { data, setSelectedAgentId } = useSystemStore();

    const handleAgentClick = (id: string) => {
        setSelectedAgentId(id);
        onSelectAgent(id);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Fleet</h3>
                <span className="text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-600 px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span> Live
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pr-2 flex-1">
                {data.agents.map(agent => (
                    <div 
                        key={agent.id}
                        onClick={() => handleAgentClick(agent.id)}
                        className={`relative p-4 rounded-2xl border transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-lg flex flex-col ${
                            agent.status === 'error' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800' :
                            agent.status === 'active' || agent.status === 'thinking' ? 'bg-white dark:bg-slate-800 border-blue-200 dark:border-slate-600 ring-1 ring-blue-500/20' :
                            'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 opacity-80'
                        }`}
                    >
                        {/* Status Pulse */}
                        <div className="absolute top-4 right-4 flex h-3 w-3">
                            {(agent.status === 'active' || agent.status === 'thinking') && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            )}
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${
                                agent.status === 'active' ? 'bg-green-500' :
                                agent.status === 'error' ? 'bg-red-500' :
                                agent.status === 'thinking' ? 'bg-purple-500 animate-bounce' :
                                'bg-slate-400'
                            }`}></span>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-inner transition-colors ${
                                agent.status === 'error' ? 'bg-red-100 text-red-600' : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-600 dark:text-slate-300 group-hover:from-blue-100 group-hover:to-blue-200 dark:group-hover:from-blue-900 dark:group-hover:to-blue-800'
                            }`}>
                                {agent.name.substring(0, 2)}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{agent.name}</h4>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{agent.role}</p>
                            </div>
                        </div>

                        {/* Terminal Line */}
                        <div className="bg-slate-900 rounded-lg p-2 mt-auto overflow-hidden shadow-inner">
                            <p className="font-mono text-[10px] text-green-400 truncate">
                                <span className="text-slate-500 mr-1">$</span>
                                {agent.logs && agent.logs.length > 0 ? agent.logs[agent.logs.length - 1].split(']').pop()?.trim() : 'system_ready'}
                            </p>
                        </div>

                        {/* Stats Row */}
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/50">
                            <div className="flex items-center gap-1.5 w-1/2">
                                <Icons.Cpu className="w-3 h-3 text-slate-400" />
                                <div className="h-1.5 flex-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                     <div className="h-full bg-blue-500 transition-all duration-700" style={{ width: `${agent.cpuUsage || 0}%` }}></div>
                                </div>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                                $<span className="font-bold text-slate-700 dark:text-slate-300">{agent.costToday.toFixed(3)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
