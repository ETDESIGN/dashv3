
export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'error' | 'offline' | 'pending' | 'thinking';
  currentTask?: string;
  tokensUsed: number;
  costToday: number;
  personaId?: string;
  lastHeartbeat?: number;
  logs?: string[];
  cpuUsage?: number;
  memoryUsage?: number;
}

export interface Task {
  id: string;
  title: string;
  status: 'backlog' | 'draft' | 'build' | 'review' | 'done';
  assigneeId?: string; // Agent ID
  priority: 'low' | 'medium' | 'high' | 'critical';
  costEstimate?: number;
  tags?: string[];
  description?: string;
}

export interface AgentPersona {
  id: string;
  name: string;
  description: string;
  defaultModel: string;
  systemPromptSummary: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  allowedTools: string[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  status: 'success' | 'failure' | 'warning';
}

export interface Department {
  id: string;
  name: string;
  lead: string;
  description: string;
  metrics: {
    label: string;
    value: string | number;
    trend?: 'up' | 'down' | 'neutral';
  }[];
}

export interface SystemHealth {
  cpu: number;
  memory: {
    used: number;
    total: number;
    percent: number;
  };
  disk: number;
}

export interface DashboardData {
  lastUpdated: string;
  version: string;
  stats: {
    totalAgents: number;
    activeSessions: number;
    tokensToday: number;
    costToday: number;
    tasksInProgress: number;
    tasksCompletedToday: number;
  };
  systemHealth: SystemHealth;
  agents: Agent[];
  tasks: Task[]; // Added tasks array
  departments: Department[];
  auditLog: AuditEntry[];
}

export interface WidgetConfig {
  id: string;
  type: 'stats' | 'health' | 'gemini' | 'departments' | 'agent-list' | 'kanban' | 'cost-war-room';
  colSpan: string; // Tailwind classes e.g. "col-span-1 lg:col-span-2"
  rowSpan?: string;
}

export enum WidgetSize {
  Standard = 'standard', // 1x1
  Wide = 'wide', // 2x1 or 2x2
  Tall = 'tall', // 1x2
}
