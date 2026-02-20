
import React, { useState, useEffect, useRef } from 'react';
import { Icons, DEFAULT_WIDGET_LAYOUT, PERSONAS } from './constants';
import { DashboardCard } from './components/ui/Card';
import { GeminiLive } from './components/GeminiLive';
import { GeminiAssistant } from './components/GeminiAssistant';
import { TopologyMap } from './components/TopologyMap';
import { AgentFleet } from './components/AgentFleet';
import { AgentDetailPanel } from './components/AgentDetailPanel';
import { KanbanBoard } from './components/KanbanBoard';
import { CostWarRoom } from './components/CostWarRoom';
import { useSystemStore } from './store/systemStore';
import { Agent, WidgetConfig, DashboardData } from './types';

// --- SUB-COMPONENTS ---

const Gatekeeper: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    setError(false);
    
    // Simulate API Check
    setTimeout(() => {
      if (code === 'NB-2026') {
        onUnlock();
      } else {
        setError(true);
        setVerifying(false);
        setCode('');
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-md bg-slate-800 rounded-3xl border border-slate-700 p-8 shadow-2xl relative overflow-hidden">
         <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
         <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>

         <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-600 shadow-inner">
               <Icons.Lock />
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-white mb-2">Restricted Access</h1>
            <p className="text-slate-400 text-sm mb-8">NB Studio Mission Control is intended for authorized personnel only.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
               <div className="relative">
                  <input 
                    type="password" 
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter Access Code"
                    className={`w-full bg-slate-900/50 border ${error ? 'border-red-500 text-red-500' : 'border-slate-600 text-white focus:border-blue-500'} rounded-xl px-4 py-3 text-center tracking-[0.5em] font-mono text-lg outline-none transition-all placeholder:tracking-normal placeholder:text-slate-600`}
                    autoFocus
                  />
               </div>
               
               <button 
                 type="submit" 
                 disabled={verifying || !code}
                 className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
               >
                 {verifying ? (
                   <><Icons.Sparkle /> Verifying Identity...</>
                 ) : (
                   'Authenticate'
                 )}
               </button>
            </form>
            
            {error && <p className="text-red-500 text-xs mt-4 animate-bounce font-bold">Access Denied. Invalid Credentials.</p>}
            
            <div className="mt-8 pt-6 border-t border-slate-700/50">
               <p className="text-[10px] text-slate-600 uppercase tracking-widest">System ID: CLAW-NODE-01</p>
            </div>
         </div>
      </div>
    </div>
  );
};

const CommandPalette: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void;
    actions: { id: string; label: string; icon: React.ReactNode; shortcut?: string; action: () => void }[];
}> = ({ isOpen, onClose, actions }) => {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredActions = actions.filter(a => a.label.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        if (isOpen) {
            setSearch('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % filteredActions.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + filteredActions.length) % filteredActions.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredActions[selectedIndex]) {
                    filteredActions[selectedIndex].action();
                    onClose();
                }
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, filteredActions, selectedIndex, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-start justify-center pt-[15vh] px-4" onClick={onClose}>
            <div 
                className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[60vh] animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-100 dark:border-slate-700">
                    <Icons.Search />
                    <input 
                        ref={inputRef}
                        type="text"
                        className="flex-1 bg-transparent text-lg outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                        placeholder="Type a command or search..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setSelectedIndex(0); }}
                    />
                    <div className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">ESC</div>
                </div>
                <div className="overflow-y-auto custom-scrollbar p-2">
                    {filteredActions.length === 0 ? (
                         <div className="p-8 text-center text-slate-500">No results found.</div>
                    ) : (
                        filteredActions.map((action, i) => (
                            <div 
                                key={action.id}
                                onClick={() => { action.action(); onClose(); }}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors ${i === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`${i === selectedIndex ? 'text-blue-500' : 'text-slate-400'}`}>{action.icon}</div>
                                    <span className="font-medium">{action.label}</span>
                                </div>
                                {action.shortcut && (
                                    <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded border border-slate-200 dark:border-slate-600">{action.shortcut}</span>
                                )}
                            </div>
                        ))
                    )}
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2 border-t border-slate-100 dark:border-slate-700 text-[10px] text-slate-500 flex justify-between">
                    <span>NB Studio Command Line</span>
                    <span>Use ↑↓ to navigate, Enter to select</span>
                </div>
            </div>
        </div>
    );
};

const Header: React.FC<{ 
  darkMode: boolean; 
  toggleTheme: () => void;
  currentView: string;
  setView: (view: string) => void;
  toggleMobileMenu: () => void;
  onLogout: () => void;
  onOpenCmd: () => void;
  isEmergencyStop: boolean;
  onToggleEmergencyStop: () => void;
}> = ({ darkMode, toggleTheme, currentView, setView, toggleMobileMenu, onLogout, onOpenCmd, isEmergencyStop, onToggleEmergencyStop }) => (
  <header className="h-16 flex-none border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 z-30 px-4 md:px-6 flex items-center justify-between relative transition-colors duration-500">
    
    <div className="flex items-center gap-3">
      <button onClick={toggleMobileMenu} className="xl:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <Icons.Menu />
      </button>

      <div 
        className="flex items-center gap-3 cursor-pointer group" 
        onClick={() => setView('mission_control')}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white transition-transform group-hover:scale-105 hidden xs:flex ${isEmergencyStop ? 'bg-red-600 animate-pulse' : 'bg-blue-600'}`}>
          {isEmergencyStop ? <Icons.Skull /> : <Icons.LayoutGrid />}
        </div>
        <h1 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white tracking-tight">NB Studio</h1>
      </div>
      <span className="hidden md:block px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 uppercase border border-slate-200 dark:border-slate-700">
        {currentView === 'mission_control' ? 'Mission Control' : currentView.replace('_', ' ')}
      </span>
    </div>

    <nav className="hidden xl:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto">
       {[
         { id: 'mission_control', label: 'Overview' },
         { id: 'agents', label: 'Agents' },
         { id: 'cost', label: 'Cost' },
         { id: 'library', label: 'Library' },
         { id: 'strategy', label: 'Strategy' },
         { id: 'admin', label: 'Admin/HR' },
       ].map((item) => (
           <button 
             key={item.id} 
             onClick={() => setView(item.id)}
             className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
               currentView === item.id 
                 ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                 : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
             }`}
           >
               {item.label}
           </button>
       ))}
    </nav>

    <div className="flex items-center gap-2 md:gap-3">
        {/* Emergency Stop Button */}
        <button 
            onClick={onToggleEmergencyStop}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                isEmergencyStop 
                ? 'bg-red-600 text-white border-red-700 animate-pulse' 
                : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-red-500 hover:border-red-200 border-slate-200 dark:border-slate-700'
            }`}
            title="Emergency Kill Switch"
        >
            <Icons.Skull />
            <span className="hidden sm:inline">{isEmergencyStop ? 'SYSTEM HALTED' : 'KILL SWITCH'}</span>
        </button>

        <button 
            onClick={onOpenCmd} 
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
            <Icons.Search /> 
            <span>Cmd</span>
            <span className="bg-slate-200 dark:bg-slate-700 px-1.5 rounded text-[10px] ml-1">⌘K</span>
        </button>
        <button onClick={toggleTheme} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700">
            {darkMode ? <Icons.Sun /> : <Icons.Moon />}
        </button>
    </div>
  </header>
);

const SmartRail: React.FC<{ 
    isMobileOpen: boolean; 
    closeMobile: () => void; 
    chaosMode: boolean;
    toggleChaos: () => void;
}> = ({ isMobileOpen, closeMobile, chaosMode, toggleChaos }) => {
    const { isEmergencyStop, notifications, dismissNotification } = useSystemStore();
    const mobileClasses = `fixed inset-y-0 right-0 w-80 z-50 transform transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'} xl:translate-x-0 xl:static xl:shadow-none`;
    
    return (
    <>
        {isMobileOpen && (
            <div className="fixed inset-0 bg-slate-900/50 z-40 xl:hidden backdrop-blur-sm" onClick={closeMobile}></div>
        )}

        <aside className={`${mobileClasses} flex-none bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 overflow-y-auto flex flex-col p-5 gap-4`}>
            
            <div className="flex xl:hidden justify-between items-center mb-2">
                <span className="font-heading font-bold text-lg text-slate-900 dark:text-white">Smart Rail</span>
                <button onClick={closeMobile} className="p-2 text-slate-500"><Icons.X /></button>
            </div>

            {/* Status Widget */}
            <div className={`bg-white dark:bg-slate-800 p-4 rounded-2xl border ${isEmergencyStop ? 'border-red-500 shadow-red-500/20' : chaosMode ? 'border-amber-400 dark:border-amber-500' : 'border-slate-200 dark:border-slate-700'} shadow-sm flex justify-between items-center transition-all`}>
                <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${isEmergencyStop ? 'bg-red-500' : chaosMode ? 'bg-amber-500 animate-pulse' : 'bg-green-500 animate-pulse'}`}></div>
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Status</div>
                        <div className={`text-sm font-bold ${isEmergencyStop ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                            {isEmergencyStop ? 'EMERGENCY STOP' : chaosMode ? 'UNSTABLE' : 'OPERATIONAL'}
                        </div>
                    </div>
                </div>
                <button 
                    onClick={toggleChaos}
                    className={`p-2 rounded-lg transition-colors ${chaosMode ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 dark:bg-slate-700/50 dark:text-slate-500'}`}
                    title="Toggle Chaos Simulation"
                >
                    <Icons.Activity />
                </button>
            </div>

             {/* Notifications */}
             <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex-1 max-h-64 flex flex-col">
                 <div className="flex items-center gap-2 mb-3 flex-none">
                     <Icons.Bell />
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Alerts</span>
                 </div>
                 <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 pr-1">
                    {notifications.length === 0 ? (
                        <div className="text-xs text-slate-400 italic text-center py-4">No new alerts</div>
                    ) : (
                        notifications.map(n => (
                            <div key={n.id} className={`flex flex-col gap-2 p-2 rounded-lg animate-fade-in relative group ${n.type === 'alert' ? 'bg-red-50 dark:bg-red-900/20' : n.type === 'success' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                                <button 
                                    onClick={() => dismissNotification(n.id)}
                                    className="absolute top-1 right-1 p-1 rounded-full text-slate-400 hover:bg-black/5 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Icons.X className="w-3 h-3" />
                                </button>
                                
                                <div className="flex gap-2 items-start">
                                    <div className={`mt-0.5 ${n.type === 'alert' ? 'text-red-500' : n.type === 'success' ? 'text-green-500' : 'text-blue-500'}`}>
                                        {n.type === 'alert' ? <Icons.AlertTriangle /> : n.type === 'success' ? <Icons.CheckCircle /> : <Icons.Activity />}
                                    </div>
                                    <div className="text-xs pr-4">
                                        <span className="font-bold text-slate-900 dark:text-white block">{n.title}</span>
                                        <span className="text-slate-500 leading-tight block">{n.msg}</span>
                                        <div className="text-[10px] text-slate-400 mt-1 opacity-70">{n.time}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                 </div>
             </div>

            {/* Gemini Live Widget */}
            <div className="h-64 flex-none">
                <GeminiLive />
            </div>
        </aside>
    </>
    );
};

// --- MISSION CONTROL ---

const MissionControl: React.FC<{ setView: (id: string) => void; layoutMode: boolean; toggleLayoutMode: () => void }> = ({ setView, layoutMode, toggleLayoutMode }) => {
    const { data, isEmergencyStop } = useSystemStore();
    const [layout, setLayout] = useState<WidgetConfig[]>(() => {
        const saved = localStorage.getItem('nb_dashboard_layout');
        return saved ? JSON.parse(saved) : DEFAULT_WIDGET_LAYOUT;
    });

    useEffect(() => {
        localStorage.setItem('nb_dashboard_layout', JSON.stringify(layout));
    }, [layout]);

    const dragItem = useRef<number | null>(null);
    const dragOverItem = useRef<number | null>(null);

    const handleDragStart = (e: React.DragEvent, index: number) => {
        dragItem.current = index;
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragEnter = (e: React.DragEvent, index: number) => {
        dragOverItem.current = index;
    };

    const handleDragEnd = () => {
        const dragIndex = dragItem.current;
        const hoverIndex = dragOverItem.current;

        if (dragIndex !== null && hoverIndex !== null && dragIndex !== hoverIndex) {
            const newLayout = [...layout];
            const draggedItem = newLayout[dragIndex];
            newLayout.splice(dragIndex, 1);
            newLayout.splice(hoverIndex, 0, draggedItem);
            setLayout(newLayout);
        }
        dragItem.current = null;
        dragOverItem.current = null;
    };

    const renderWidgetContent = (type: string) => {
        if (isEmergencyStop) {
            return (
                <div className="h-full flex flex-col items-center justify-center text-red-500 animate-pulse bg-red-50 dark:bg-red-900/10 rounded-2xl">
                    <Icons.Skull className="w-12 h-12 mb-2" />
                    <span className="font-heading font-black uppercase text-xl">System Halted</span>
                </div>
            );
        }

        switch(type) {
            case 'cost-war-room':
                return (
                    <DashboardCard title="Cost War Room">
                        <CostWarRoom />
                    </DashboardCard>
                );
            case 'stats': // Legacy fallback
                return (
                    <DashboardCard title="Cost Analytics" highlight={`$${data.stats.costToday.toFixed(4)}`}>
                        <div className="flex gap-8 mt-2">
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-400 uppercase font-bold">Tokens</span>
                                <span className="text-lg font-bold font-heading">{data.stats.tokensToday.toLocaleString()}</span>
                            </div>
                        </div>
                    </DashboardCard>
                );
            case 'health':
                return (
                    <DashboardCard title="Infrastructure Health" highlight={`${data.systemHealth.cpu}%`}>
                        <div className="h-40 -mx-2 mb-2">
                             <TopologyMap onNodeSelect={(id) => console.log('Node selected:', id)} />
                        </div>
                        <div className="space-y-4 mt-2">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                                    <span>CPU Usage</span>
                                    <span>{data.systemHealth.cpu}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-700 ${data.systemHealth.cpu > 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${data.systemHealth.cpu}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </DashboardCard>
                );
            case 'gemini':
                return (
                    <DashboardCard title="Gemini Intelligence" actionButton={<Icons.Sparkle className="text-purple-500" />}>
                        <GeminiAssistant 
                            viewName="Mission Control"
                            context={`Stats: ${JSON.stringify(data.stats)}, Health: ${JSON.stringify(data.systemHealth)}`}
                        />
                    </DashboardCard>
                );
            case 'kanban':
                return (
                    <DashboardCard title="Pipeline Visualizer">
                        <KanbanBoard />
                    </DashboardCard>
                );
            case 'agent-list':
                return (
                    <DashboardCard title="Agent Fleet" actionButton={<button onClick={() => setView('agents')} className="text-xs text-blue-500 font-bold hover:underline">View Details</button>}>
                        <AgentFleet onSelectAgent={() => setView('agents')} />
                    </DashboardCard>
                );
            default: return null;
        }
    };

    return (
        <div className="h-full flex flex-col">
             <div className="flex justify-end mb-2">
                 <button onClick={toggleLayoutMode} className={`text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${layoutMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:text-blue-500 bg-slate-100 dark:bg-slate-800'}`}>
                     <Icons.LayoutGrid /> {layoutMode ? 'Save Layout' : 'Edit Layout'}
                 </button>
             </div>
    
             <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 auto-rows-[minmax(220px,auto)] gap-5 lg:gap-6 grid-flow-dense pb-8`}>
                {layout.map((widget, index) => (
                    <div 
                        key={widget.id}
                        className={`${widget.colSpan} ${widget.rowSpan || ''} transition-all duration-300 relative group ${layoutMode ? 'cursor-grab active:cursor-grabbing hover:ring-2 ring-blue-500 rounded-3xl' : ''}`}
                        draggable={layoutMode}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        {layoutMode && (
                            <div className="absolute top-2 right-2 z-20 bg-blue-500 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-sm">
                                <Icons.Move className="w-4 h-4" />
                            </div>
                        )}
                        {renderWidgetContent(widget.type)}
                    </div>
                ))}
             </div>
        </div>
    );
};

// --- NEW COMPONENT DEFINITIONS ---

const DeployModal: React.FC<{ onClose: () => void; onDeploy: (agent: Agent) => void }> = ({ onClose, onDeploy }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('Generalist');
    const [personaId, setPersonaId] = useState(PERSONAS[0].id);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newAgent: Agent = {
            id: `a-${Date.now()}`,
            name,
            role,
            status: 'idle',
            tokensUsed: 0,
            costToday: 0,
            personaId
        };
        onDeploy(newAgent);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white">Deploy New Agent</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><Icons.X /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Agent Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                            placeholder="e.g. Sentinel-02"
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                        <select 
                            value={role} 
                            onChange={e => setRole(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        >
                            <option value="Infrastructure">Infrastructure</option>
                            <option value="Growth">Growth</option>
                            <option value="Security">Security</option>
                            <option value="Strategy">Strategy</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Persona</label>
                        <select 
                            value={personaId} 
                            onChange={e => setPersonaId(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        >
                            {PERSONAS.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({p.riskLevel} Risk)</option>
                            ))}
                        </select>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">Deploy Agent</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CostView: React.FC<{ data: DashboardData }> = ({ data }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Daily Spending Trend</h3>
                    <div className="h-64 flex items-end gap-2">
                        {[35, 42, 28, 65, 45, 58, 48].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-blue-100 dark:bg-blue-900/30 rounded-t-lg relative overflow-hidden h-full">
                                    <div 
                                        style={{ height: `${h}%` }} 
                                        className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all group-hover:bg-blue-400"
                                    ></div>
                                </div>
                                <span className="text-xs text-slate-400 font-bold">Day {i+1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                     <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Resource Allocation by Department</h3>
                     <div className="space-y-4">
                        {data.departments.map(dept => (
                            <div key={dept.id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-bold text-slate-700 dark:text-slate-300">{dept.name}</span>
                                    <span className="text-slate-500">$124.50</span>
                                </div>
                                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 w-1/3 rounded-full"></div>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>
            
            <div className="space-y-6">
                <DashboardCard title="Real-Time Ticker">
                    <CostWarRoom />
                </DashboardCard>
                
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
                    <Icons.Sparkle className="w-8 h-8 mb-4 opacity-80" />
                    <h3 className="text-xl font-bold mb-2">Cost Optimization</h3>
                    <p className="text-indigo-100 text-sm mb-6">Gemini suggests switching "GrowthBot-Alpha" to Flash model to save ~15% on daily inference costs.</p>
                    <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md py-2 rounded-xl font-bold transition-colors">
                        Apply Recommendation
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [view, setView] = useState('mission_control');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCmdOpen, setIsCmdOpen] = useState(false);
    const [chaosMode, setChaosMode] = useState(false);
    
    // Store
    const { 
        data, 
        isEmergencyStop, 
        toggleEmergencyStop, 
        updateAgentStatus, 
        addNotification,
        setData,
        simulateHeartbeats
    } = useSystemStore();

    // Modal States
    const [deployModalOpen, setDeployModalOpen] = useState(false);
    const [layoutMode, setLayoutMode] = useState(false);

    // Toggle Theme
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    // Live Heartbeat Simulation Loop
    useEffect(() => {
        const interval = setInterval(() => {
            simulateHeartbeats();
        }, 1000);
        return () => clearInterval(interval);
    }, [simulateHeartbeats]);

    // Handle Chaos Mode Simulation (Legacy Anomaly generator)
    useEffect(() => {
        if (!chaosMode) return;
        const interval = setInterval(() => {
            if (isEmergencyStop) return;

            setData({
                systemHealth: {
                    cpu: Math.min(100, Math.max(0, data.systemHealth.cpu + (Math.random() * 20 - 10))),
                    memory: { ...data.systemHealth.memory, percent: Math.min(100, Math.max(0, data.systemHealth.memory.percent + (Math.random() * 10 - 5))) },
                    disk: data.systemHealth.disk
                }
            });
            if (Math.random() > 0.85) {
                 addNotification('Anomaly Detected', `Unusual traffic pattern on Node-${Math.floor(Math.random()*10)}`, 'alert');
            }
        }, 2000);
        return () => clearInterval(interval);
    }, [chaosMode, isEmergencyStop]);

    // Command Palette Actions
    const cmdActions = [
        { id: 'goto_home', label: 'Go to Mission Control', icon: <Icons.LayoutGrid />, action: () => setView('mission_control') },
        { id: 'deploy_agent', label: 'Deploy New Agent', icon: <Icons.UserPlus />, shortcut: 'D', action: () => setDeployModalOpen(true) },
        { id: 'kill_switch', label: isEmergencyStop ? 'Resume Operations' : 'Emergency Stop', icon: <Icons.Skull />, shortcut: 'K', action: toggleEmergencyStop },
        { id: 'toggle_theme', label: 'Toggle Dark Mode', icon: darkMode ? <Icons.Sun /> : <Icons.Moon />, shortcut: 'T', action: () => setDarkMode(!darkMode) },
    ];

    const handleDeployAgent = (newAgent: Agent) => {
        setData({ agents: [...data.agents, newAgent] });
        addNotification('Deployment Initiated', `${newAgent.name} is starting up.`, 'success');
    };

    return (
        <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans selection:bg-blue-500/30 ${darkMode ? 'dark' : ''} ${isEmergencyStop ? 'grayscale' : ''}`}>
            
            {/* Gatekeeper Overlay */}
            {!authenticated && <Gatekeeper onUnlock={() => setAuthenticated(true)} />}

            {/* Command Palette */}
            <CommandPalette 
                isOpen={isCmdOpen} 
                onClose={() => setIsCmdOpen(false)} 
                actions={cmdActions}
            />

            {/* Global Inspector Overlay */}
            <AgentDetailPanel />

            {/* Modals */}
            {deployModalOpen && <DeployModal onClose={() => setDeployModalOpen(false)} onDeploy={handleDeployAgent} />}

            <div className="flex flex-col h-screen overflow-hidden">
                <Header 
                    darkMode={darkMode} 
                    toggleTheme={() => setDarkMode(!darkMode)}
                    currentView={view}
                    setView={setView}
                    toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    onLogout={() => setAuthenticated(false)}
                    onOpenCmd={() => setIsCmdOpen(true)}
                    isEmergencyStop={isEmergencyStop}
                    onToggleEmergencyStop={toggleEmergencyStop}
                />

                <div className="flex flex-1 overflow-hidden relative">
                    <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 relative scroll-smooth">
                         <div className="max-w-7xl mx-auto h-full flex flex-col">
                             {view === 'mission_control' ? (
                                 <MissionControl 
                                    setView={setView} 
                                    layoutMode={layoutMode}
                                    toggleLayoutMode={() => setLayoutMode(!layoutMode)}
                                 />
                             ) : view === 'cost' ? (
                                 <div className="h-full flex flex-col">
                                     <h2 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white mb-6">Financial Intelligence</h2>
                                     <CostView data={data} />
                                 </div>
                             ) : view === 'agents' ? (
                                <div className="h-full flex flex-col">
                                    <h2 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white mb-6">Agent Fleet Status</h2>
                                    <AgentFleet onSelectAgent={() => {}} />
                                </div>
                             ) : (
                                 <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                                     <Icons.Lock className="w-12 h-12 mb-4" />
                                     <h3 className="text-xl font-bold uppercase tracking-widest">Restricted Area</h3>
                                     <p>This module requires higher clearance or is under maintenance.</p>
                                 </div>
                             )}
                         </div>
                    </main>

                    {/* Right Rail */}
                    <SmartRail 
                        isMobileOpen={isMobileMenuOpen}
                        closeMobile={() => setIsMobileMenuOpen(false)}
                        chaosMode={chaosMode}
                        toggleChaos={() => setChaosMode(!chaosMode)}
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
