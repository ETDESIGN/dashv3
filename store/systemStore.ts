
import { create } from 'zustand';
import { Agent, Task, DashboardData, AuditEntry } from '../types';
import { MOCK_DATA } from '../constants';

interface SystemState {
  // Core Data
  data: DashboardData;
  isEmergencyStop: boolean;
  selectedAgentId: string | null;
  
  // Actions
  toggleEmergencyStop: () => void;
  updateAgentStatus: (id: string, status: Agent['status']) => void;
  updateTaskStatus: (taskId: string, newStatus: Task['status']) => void;
  addNotification: (title: string, msg: string, type: 'alert' | 'success' | 'info') => void;
  notifications: Array<{ id: number; title: string; msg: string; type: string; time: string }>;
  dismissNotification: (id: number) => void;
  setData: (data: Partial<DashboardData>) => void;
  setSelectedAgentId: (id: string | null) => void;
  simulateHeartbeats: () => void;
  
  // Computed
  projectedCost: () => number;
}

const AGENT_THOUGHTS = [
    "Analyzing recent token usage patterns...",
    "Optimizing local cache...",
    "Ping received from gateway.",
    "Compressing log archives...",
    "Waiting for task assignment.",
    "Scanning for vulnerabilities...",
    "Updating context memory...",
    "Garbage collecting...",
    "Querying vector database...",
];

export const useSystemStore = create<SystemState>((set, get) => ({
  data: { ...MOCK_DATA }, // Initialize with Mock Data
  isEmergencyStop: false,
  notifications: [],
  selectedAgentId: null,

  toggleEmergencyStop: () => set((state) => {
    const newState = !state.isEmergencyStop;
    // Log the event
    const audit: AuditEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        user: 'GM (Manual)',
        action: newState ? 'EMERGENCY STOP' : 'SYSTEM RESUME',
        details: newState ? 'Kill switch activated. All agents paused.' : 'Operations resumed.',
        status: newState ? 'failure' : 'success'
    };
    
    return { 
        isEmergencyStop: newState,
        data: {
            ...state.data,
            // Force all active agents to 'idle' if stopped, or back to 'active' logic if needed (simplified here)
            agents: newState 
                ? state.data.agents.map(a => ({ ...a, status: a.status === 'active' ? 'idle' : a.status })) 
                : state.data.agents,
            auditLog: [audit, ...state.data.auditLog]
        }
    };
  }),

  updateAgentStatus: (id, status) => set((state) => ({
    data: {
      ...state.data,
      agents: state.data.agents.map((a) => a.id === id ? { ...a, status } : a)
    }
  })),

  updateTaskStatus: (taskId, newStatus) => set((state) => ({
    data: {
      ...state.data,
      tasks: state.data.tasks.map((t) => t.id === taskId ? { ...t, status: newStatus } : t)
    }
  })),

  addNotification: (title, msg, type) => set((state) => ({
    notifications: [{ id: Date.now(), title, msg, type, time: new Date().toLocaleTimeString() }, ...state.notifications].slice(0, 5)
  })),

  dismissNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),

  setData: (partialData) => set((state) => ({
    data: { ...state.data, ...partialData }
  })),
  
  setSelectedAgentId: (id) => set({ selectedAgentId: id }),

  simulateHeartbeats: () => set((state) => {
      if (state.isEmergencyStop) return state;

      const newAgents = state.data.agents.map(agent => {
          let newStatus = agent.status;
          let newCpu = agent.cpuUsage || 0;
          let newMem = agent.memoryUsage || 0;
          let newLogs = agent.logs || [];

          if (agent.status === 'active' || agent.status === 'thinking') {
              // Fluctuate CPU between 20 and 90
              newCpu = Math.max(20, Math.min(90, newCpu + (Math.random() * 20 - 10)));
              // Fluctuate Memory gently
              newMem = Math.max(100, newMem + (Math.random() * 10 - 5));
              
              // Randomly add a log
              if (Math.random() > 0.8) {
                  const thought = AGENT_THOUGHTS[Math.floor(Math.random() * AGENT_THOUGHTS.length)];
                  newLogs = [...newLogs, `[${new Date().toLocaleTimeString()}] ${thought}`].slice(-20); // Keep last 20
              }
          } else if (agent.status === 'idle') {
              newCpu = Math.max(0, Math.min(5, newCpu + (Math.random() * 2 - 1)));
          }

          return {
              ...agent,
              status: newStatus,
              cpuUsage: Math.floor(newCpu),
              memoryUsage: Math.floor(newMem),
              logs: newLogs,
              lastHeartbeat: Date.now()
          };
      });

      return {
          data: {
              ...state.data,
              agents: newAgents
          }
      };
  }),

  projectedCost: () => {
      const { costToday } = get().data.stats;
      // Simple linear projection based on 9AM-5PM workday (8 hours) or 24h cycle.
      // Assuming linear burn for demo.
      return costToday * 1.45; 
  }
}));
