import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  actionButton?: React.ReactNode;
  className?: string;
  highlight?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, children, actionButton, className = '', highlight }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 h-full flex flex-col hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 ${className}`}>
    
    {/* Card Header */}
    <div className="flex justify-between items-start mb-4">
      <div>
        {/* Micro Label */}
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
          {title}
        </h3>
        {/* Optional Highlight Value */}
        {highlight && (
          <div className="text-2xl font-black text-slate-900 dark:text-white font-heading">
             {highlight}
          </div>
        )}
      </div>
      
      {/* Optional Top-Right Icon or Action */}
      {actionButton}
    </div>

    {/* Card Body */}
    <div className="flex-1 min-h-0 relative">
      {children}
    </div>
  </div>
);
