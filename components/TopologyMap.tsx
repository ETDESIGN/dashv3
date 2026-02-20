
import React, { useEffect, useState } from 'react';

interface TopologyMapProps {
    onNodeSelect?: (nodeId: string) => void;
}

export const TopologyMap: React.FC<TopologyMapProps> = ({ onNodeSelect }) => {
    // Simulate pulse effects
    const [pulse, setPulse] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPulse(p => (p + 1) % 100);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const handleNodeClick = (nodeId: string) => {
        if (onNodeSelect) {
            onNodeSelect(nodeId);
        }
    };

    return (
        <div className="w-full h-full bg-[#0f172a] rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-700 shadow-inner group">
            {/* Retro Grid Background */}
            <div 
                className="absolute inset-0 opacity-20 pointer-events-none" 
                style={{ 
                    backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }} 
            />
            
            {/* Map SVG */}
            <svg width="100%" height="100%" viewBox="0 0 600 400" className="z-10">
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
                        <path d="M0,0 L0,6 L9,3 z" fill="#475569" />
                    </marker>
                </defs>

                {/* Connections */}
                <path d="M300,50 L300,120" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" /> {/* Internet -> Gateway */}
                <path d="M300,180 L150,250" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" /> {/* Gateway -> Auth */}
                <path d="M300,180 L450,250" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" /> {/* Gateway -> Vector */}
                <path d="M300,180 L300,320" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)" /> {/* Gateway -> Compute */}
                <path d="M150,290 L300,320" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" /> {/* Auth -> Compute */}
                <path d="M450,290 L300,320" stroke="#334155" strokeWidth="2" strokeDasharray="5,5" /> {/* Vector -> Compute */}

                {/* Animated Packets */}
                <circle r="4" fill="#60a5fa">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M300,50 L300,120" />
                </circle>
                <circle r="4" fill="#34d399">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M300,180 L300,320" begin="0.5s" />
                </circle>
                <circle r="3" fill="#f472b6">
                    <animateMotion dur="4s" repeatCount="indefinite" path="M300,180 L150,250" begin="1s" />
                </circle>

                {/* Nodes */}
                
                {/* Gateway Node */}
                <g 
                    transform="translate(270, 120)" 
                    onClick={() => handleNodeClick('gateway')}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <rect x="0" y="0" width="60" height="60" rx="10" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" filter="url(#glow)" />
                    <text x="30" y="35" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">GATEWAY</text>
                    <circle cx="50" cy="10" r="3" fill="#22c55e" className="animate-pulse" />
                </g>

                {/* Auth Node */}
                <g 
                    transform="translate(120, 250)"
                    onClick={() => handleNodeClick('auth')}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <rect x="0" y="0" width="60" height="40" rx="8" fill="#1e293b" stroke="#a855f7" strokeWidth="2" />
                    <text x="30" y="25" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">AUTH</text>
                </g>

                {/* Vector DB Node */}
                <g 
                    transform="translate(420, 250)"
                    onClick={() => handleNodeClick('vector')}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <rect x="0" y="0" width="60" height="40" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                    <path d="M10,10 L50,10 L50,30 L10,30 Z" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.5" />
                    <text x="30" y="25" textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="bold">VECTOR</text>
                </g>

                {/* Compute Cluster */}
                <g 
                    transform="translate(250, 320)"
                    onClick={() => handleNodeClick('compute')}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <rect x="0" y="0" width="100" height="60" rx="10" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
                    <text x="50" y="25" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">COMPUTE</text>
                    
                    {/* CPU Load Bars - Fixed Height Calculations */}
                    <rect x="20" y="35" width="5" height="15" fill="#334155" />
                    <rect x="20" y="50" width="5" height={Math.max(0, 10 + (Math.sin(pulse/5) * 5))} fill="#22c55e" transform="scale(1, -1) translate(0, -100)" />
                    
                    <rect x="30" y="35" width="5" height="15" fill="#334155" />
                    <rect x="30" y="50" width="5" height={Math.max(0, 8 + (Math.cos(pulse/5) * 7))} fill="#22c55e" transform="scale(1, -1) translate(0, -100)" />

                    <rect x="40" y="35" width="5" height="15" fill="#334155" />
                    <rect x="40" y="50" width="5" height={Math.max(0, 12 + (Math.sin(pulse/8) * 3))} fill="#22c55e" transform="scale(1, -1) translate(0, -100)" />
                    
                    <text x="75" y="45" fill="#94a3b8" fontSize="8">Active</text>
                </g>

            </svg>

            {/* Labels Overlay */}
            <div className="absolute top-4 left-4">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900/80 px-2 py-1 rounded border border-slate-700">
                    Live Topology
                </div>
            </div>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-slate-500 italic">
                Click nodes to inspect
            </div>
        </div>
    );
}
