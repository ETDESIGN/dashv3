
import React, { useState } from 'react';
import { Task } from '../types';
import { Icons } from '../constants';
import { useSystemStore } from '../store/systemStore';

const COLUMNS: { id: Task['status']; label: string; color: string }[] = [
    { id: 'backlog', label: 'Backlog', color: 'bg-slate-100 dark:bg-slate-800' },
    { id: 'draft', label: 'Draft', color: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'build', label: 'Build (CTO)', color: 'bg-purple-50 dark:bg-purple-900/20' },
    { id: 'review', label: 'QA Review', color: 'bg-amber-50 dark:bg-amber-900/20' },
    { id: 'done', label: 'Done', color: 'bg-green-50 dark:bg-green-900/20' },
];

export const KanbanBoard: React.FC = () => {
    const { data, updateTaskStatus } = useSystemStore();
    const [draggedTask, setDraggedTask] = useState<string | null>(null);
    const [dragOverCol, setDragOverCol] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        setDraggedTask(taskId);
        e.dataTransfer.setData("taskId", taskId);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent, colId: string) => {
        e.preventDefault();
        setDragOverCol(colId);
    };

    const handleDrop = (e: React.DragEvent, colId: Task['status']) => {
        e.preventDefault();
        setDragOverCol(null);
        setDraggedTask(null);
        const taskId = e.dataTransfer.getData("taskId");
        if (taskId) {
            updateTaskStatus(taskId, colId);
        }
    };

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Pipeline Visualizer</h3>
                <div className="flex gap-2">
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-500">
                        {data.tasks.length} Tasks
                    </span>
                </div>
            </div>
            
            <div className="flex-1 flex gap-4 overflow-x-auto pb-2 min-h-0">
                {COLUMNS.map(col => (
                    <div 
                        key={col.id}
                        onDragOver={(e) => handleDragOver(e, col.id)}
                        onDrop={(e) => handleDrop(e, col.id)}
                        className={`flex-1 min-w-[200px] flex flex-col rounded-2xl border transition-all duration-200 ${col.color} ${dragOverCol === col.id ? 'ring-2 ring-blue-500 scale-[1.01]' : 'border-transparent'}`}
                    >
                        {/* Column Header */}
                        <div className="p-3 border-b border-black/5 dark:border-white/5 flex justify-between items-center">
                            <span className="font-bold text-xs text-slate-700 dark:text-slate-200 uppercase">{col.label}</span>
                            <span className="text-[10px] font-bold bg-white/50 dark:bg-black/20 px-1.5 rounded-full text-slate-500">
                                {data.tasks.filter(t => t.status === col.id).length}
                            </span>
                        </div>

                        {/* Drop Zone */}
                        <div className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
                            {data.tasks.filter(t => t.status === col.id).map(task => (
                                <div 
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                    className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 cursor-move hover:shadow-md transition-all group relative"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-slate-400">{task.id}</span>
                                        <div className={`w-2 h-2 rounded-full ${task.priority === 'critical' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                                    </div>
                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug mb-2">
                                        {task.title}
                                    </p>
                                    
                                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50 dark:border-slate-800">
                                        {task.assigneeId ? (
                                            <div className="flex items-center gap-1">
                                                <div className="w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                                                    {task.assigneeId.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-[10px] text-slate-500">{task.assigneeId}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-slate-400 italic">Unassigned</span>
                                        )}
                                        {task.costEstimate && (
                                            <span className="text-[10px] font-mono text-slate-400">${task.costEstimate}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {data.tasks.filter(t => t.status === col.id).length === 0 && (
                                <div className="h-20 flex items-center justify-center text-slate-400 opacity-30 text-xs italic border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
                                    Empty
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
