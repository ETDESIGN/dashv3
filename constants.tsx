
import React from 'react';
import { DashboardData, AgentPersona, AuditEntry, WidgetConfig, Task } from './types';

export const Icons = {
  X: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
  ),
  Lock: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
  ),
  Sparkle: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
  ),
  Search: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  ),
  Menu: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
  ),
  LayoutGrid: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
  ),
  Sun: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
  ),
  Moon: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  ),
  LogOut: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
  ),
  Bell: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
  ),
  Activity: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
  ),
  AlertTriangle: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
  ),
  CheckCircle: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
  ArrowRight: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  ),
  Shield: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
  ),
  Mic: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
  ),
  TrendingUp: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
  ),
  Code: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  ),
  Book: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
  ),
  Briefcase: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
  ),
  Terminal: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
  ),
  Play: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="5 3 19 12 5 21 5 3"/></svg>
  ),
  Users: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  ),
  Radar: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 12 4.09-8.49A10 10 0 1 1 5.46 9.61"/><path d="M12 12V2"/><path d="M12 12 2 12"/></svg>
  ),
  UserPlus: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" x2="20" y1="8" y2="14"/><line x1="23" x2="17" y1="11" y2="11"/></svg>
  ),
  Trash: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
  ),
  Twitter: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
  ),
  FileText: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
  ),
  Volume2: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
  ),
  Send: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
  ),
  Move: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="22"/></svg>
  ),
  Skull: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M8 20v2h8v-2"/><path d="m12.5 17-.5-1-.5 1h1z"/><path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20"/></svg>
  ),
  Cpu: ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
  ),
};

export const PERSONAS: AgentPersona[] = [
    {
        id: 'p_infra',
        name: 'Infrastructure Guardian',
        description: 'Monitors system health and scales resources.',
        defaultModel: 'gemini-3-flash-preview',
        systemPromptSummary: 'You are an SRE bot.',
        riskLevel: 'Low',
        allowedTools: ['read_logs', 'scale_service']
    },
    {
        id: 'p_growth',
        name: 'Growth Hacker',
        description: 'Generates content and analyzes trends.',
        defaultModel: 'gemini-3-pro-preview',
        systemPromptSummary: 'You are a marketing expert.',
        riskLevel: 'Medium',
        allowedTools: ['search_web', 'post_content']
    },
    {
        id: 'p_sec',
        name: 'Security Sentinel',
        description: 'Audits access and detects anomalies.',
        defaultModel: 'gemini-3-pro-preview',
        systemPromptSummary: 'You are a security analyst.',
        riskLevel: 'High',
        allowedTools: ['revoke_access', 'audit_logs']
    }
];

export const MOCK_AUDIT_LOGS: AuditEntry[] = [
    { id: '1', timestamp: '10:00:01 AM', user: 'System', action: 'Auto-Scaling', details: 'Scaled Compute Node 4 up due to load.', status: 'success' },
    { id: '2', timestamp: '10:15:22 AM', user: 'Admin', action: 'Config Change', details: 'Updated Vector DB shard limit.', status: 'warning' },
    { id: '3', timestamp: '10:20:05 AM', user: 'System', action: 'Backup', details: 'Daily snapshot completed.', status: 'success' },
];

const MOCK_TASKS: Task[] = [
    { id: 'T-101', title: 'Implement Gemini 3.0 Flash', status: 'build', assigneeId: 'Sentinel-01', priority: 'high', costEstimate: 0.50 },
    { id: 'T-102', title: 'Fix latency in vector search', status: 'backlog', priority: 'medium', costEstimate: 0.10 },
    { id: 'T-103', title: 'Update department dashboard', status: 'done', priority: 'low', costEstimate: 0.05 },
    { id: 'T-104', title: 'Security Audit Q1', status: 'review', assigneeId: 'Auditor-X', priority: 'critical', costEstimate: 2.00 },
    { id: 'T-105', title: 'Write Blog Post: "Future of AI"', status: 'draft', assigneeId: 'GrowthBot-Alpha', priority: 'medium', costEstimate: 0.15 },
];

export const MOCK_DATA: DashboardData = {
    lastUpdated: new Date().toISOString(),
    version: '1.2.0',
    stats: {
        totalAgents: 12,
        activeSessions: 450,
        tokensToday: 1250000,
        costToday: 3.45,
        tasksInProgress: 8,
        tasksCompletedToday: 156
    },
    systemHealth: {
        cpu: 42,
        memory: {
            used: 16,
            total: 32,
            percent: 50
        },
        disk: 65
    },
    agents: [
        { 
            id: 'a1', 
            name: 'Sentinel-01', 
            role: 'Infrastructure', 
            status: 'active', 
            tokensUsed: 45000, 
            costToday: 0.45, 
            personaId: 'p_infra', 
            cpuUsage: 45,
            memoryUsage: 128,
            logs: ['Starting metric collection...', 'Heartbeat received from Node-1', 'Aggregating stats...']
        },
        { 
            id: 'a2', 
            name: 'GrowthBot-Alpha', 
            role: 'Growth', 
            status: 'idle', 
            tokensUsed: 12000, 
            costToday: 0.12, 
            personaId: 'p_growth',
            cpuUsage: 2,
            memoryUsage: 64,
            logs: ['Campaign analysis complete.', 'Waiting for new task...']
        },
        { 
            id: 'a3', 
            name: 'Auditor-X', 
            role: 'Security', 
            status: 'pending', 
            tokensUsed: 0, 
            costToday: 0.00, 
            personaId: 'p_sec',
            cpuUsage: 0,
            memoryUsage: 0,
            logs: ['Initializing secure sandbox...']
        },
        { 
            id: 'a4', 
            name: 'Strategist-V2', 
            role: 'Strategy', 
            status: 'thinking', 
            tokensUsed: 89000, 
            costToday: 1.20, 
            personaId: 'p_growth',
            cpuUsage: 88,
            memoryUsage: 512,
            logs: ['Reading market report Q3', 'Comparing trends...', 'Synthesizing insight...']
        },
    ],
    tasks: MOCK_TASKS,
    departments: [
        { id: 'eng', name: 'Engineering', lead: 'Sarah C.', description: 'System infrastructure and reliability.', metrics: [{ label: 'Uptime', value: '99.9%' }, { label: 'Deployments', value: 12 }] },
        { id: 'growth', name: 'Growth', lead: 'Mike R.', description: 'Marketing, content, and user acquisition.', metrics: [{ label: 'CAC', value: '$12' }, { label: 'Conversion', value: '3.4%' }] },
        { id: 'coo', name: 'Operations', lead: 'Jessica L.', description: 'Internal efficiency and resource allocation.', metrics: [{ label: 'Efficiency', value: '92%' }, { label: 'Budget', value: 'On Track' }] },
        { id: 'strategy', name: 'Strategy', lead: 'David K.', description: 'Market analysis and long-term planning.', metrics: [{ label: 'Roadmap', value: 'Q3 Ready' }, { label: 'Intel', value: 'High' }] },
        { id: 'library', name: 'Library', lead: 'System', description: 'Central knowledge base and documentation.', metrics: [{ label: 'Docs', value: 156 }, { label: 'Reads', value: '1.2k' }] },
        { id: 'admin', name: 'Admin/HR', lead: 'Alex P.', description: 'User management and system configuration.', metrics: [{ label: 'Users', value: 8 }, { label: 'Open Roles', value: 2 }] },
    ],
    auditLog: MOCK_AUDIT_LOGS
};

export const DEFAULT_WIDGET_LAYOUT: WidgetConfig[] = [
    { id: 'w1', type: 'cost-war-room', colSpan: 'col-span-1 lg:col-span-1' },
    { id: 'w2', type: 'health', colSpan: 'col-span-1 lg:col-span-2' },
    { id: 'w3', type: 'gemini', colSpan: 'col-span-1 lg:col-span-1', rowSpan: 'row-span-2' },
    { id: 'w4', type: 'kanban', colSpan: 'col-span-1 lg:col-span-2', rowSpan: 'row-span-2' },
    { id: 'w5', type: 'agent-list', colSpan: 'col-span-1 lg:col-span-3' },
];
