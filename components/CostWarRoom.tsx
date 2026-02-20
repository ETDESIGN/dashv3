
import React from 'react';
import { useSystemStore } from '../store/systemStore';
import { Icons } from '../constants';

export const CostWarRoom: React.FC = () => {
    const { data, projectedCost } = useSystemStore();
    const cost = data.stats.costToday;
    const project = projectedCost();
    const limit = 5.00; // Daily guardrail
    
    const percentage = (cost / limit) * 100;
    const projectedPercentage = (project / limit) * 100;

    // SVG Gauge Calculations
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const strokeDashoffsetProj = circumference - (projectedPercentage / 100) * circumference;

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
                        ${cost.toFixed(4)}
                    </h3>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wide">
                        Daily Spend
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold text-slate-400">
                        Budget: ${limit.toFixed(2)}
                    </div>
                    <div className={`text-xs font-bold ${project > limit ? 'text-red-500' : 'text-green-500'}`}>
                        Proj: ${project.toFixed(2)}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center relative">
                {/* SVG Gauge */}
                <svg className="transform -rotate-90 w-48 h-48">
                    {/* Track */}
                    <circle
                        className="text-slate-100 dark:text-slate-800"
                        strokeWidth="12"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="96"
                        cy="96"
                    />
                    {/* Projection (Ghost) */}
                    <circle
                        className="text-slate-200 dark:text-slate-700 opacity-50"
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffsetProj}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="96"
                        cy="96"
                    />
                    {/* Actual */}
                    <circle
                        className={`${percentage > 90 ? 'text-red-500' : percentage > 75 ? 'text-orange-500' : 'text-blue-600'} transition-all duration-1000 ease-out`}
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="96"
                        cy="96"
                    />
                </svg>
                
                {/* Center Stats */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-black text-slate-900 dark:text-white">
                        {percentage.toFixed(0)}%
                    </div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Used</div>
                </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg text-center border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400">Cheap</div>
                    <div className="font-bold text-blue-500">90%</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg text-center border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400">Prem</div>
                    <div className="font-bold text-purple-500">9%</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg text-center border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400">Burn</div>
                    <div className="font-bold text-slate-700 dark:text-slate-300">
                        {project > limit ? 'High' : 'Safe'}
                    </div>
                </div>
            </div>
        </div>
    );
};
