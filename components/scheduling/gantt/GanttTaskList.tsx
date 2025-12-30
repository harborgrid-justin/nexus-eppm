
import React from 'react';
import { Task, WBSNode } from '../../../types';

interface GanttTaskListProps {
  renderList: ({ type: 'wbs', node: WBSNode, level: number } | { type: 'task', task: Task, level: number })[];
  showTaskList: boolean;
  expandedNodes: Set<string>;
  selectedTask: Task | null;
  toggleNode: (id: string) => void;
  setSelectedTask: (task: Task) => void;
}

export const GanttTaskList: React.FC<GanttTaskListProps> = ({ 
  renderList, showTaskList, expandedNodes, selectedTask, toggleNode, setSelectedTask 
}) => {
  return (
    <div 
        className={`
            flex-shrink-0 border-r border-slate-200 flex flex-col bg-white overflow-y-auto z-20
            absolute inset-y-0 left-0 w-3/4 shadow-xl transform transition-transform duration-300 md:relative md:w-[400px] md:shadow-none md:translate-x-0
            ${showTaskList ? 'translate-x-0' : '-translate-x-full'}
        `} 
        role="treegrid"
    >
    <div className="sticky top-0 z-20 bg-slate-50 border-b border-slate-200 h-[50px] flex items-center px-4 font-bold text-xs text-slate-500 uppercase tracking-wider">
        <div className="flex-1">Task Name</div>
        <div className="w-16 text-center">Dur.</div>
    </div>
    {renderList.map((item) => {
        if (item.type === 'wbs') {
            return (
                <button 
                    key={item.node.id}
                    className="group h-[44px] w-full flex items-center px-4 border-b border-slate-100 hover:bg-slate-50 text-sm text-left font-bold bg-slate-50/50 focus:outline-none"
                    style={{ paddingLeft: `${item.level * 20 + 16}px` }}
                    onClick={() => toggleNode(item.node.id)}
                >
                    <span className="mr-2 text-slate-400">{expandedNodes.has(item.node.id) ? '▼' : '▶'}</span>
                    <span className="truncate">{item.node.name}</span>
                </button>
            );
        } else {
            return (
                <div 
                    key={item.task.id}
                    onClick={() => setSelectedTask(item.task)}
                    className={`h-[44px] w-full flex items-center px-4 border-b border-slate-100 text-sm text-left cursor-pointer ${selectedTask?.id === item.task.id ? 'bg-nexus-50' : 'hover:bg-white'}`}
                    style={{ paddingLeft: `${item.level * 20 + 36}px` }}
                >
                    <div className="flex-1 truncate">{item.task.name}</div>
                    <div className="w-16 text-center text-xs text-slate-500 font-mono">{item.task.duration}d</div>
                </div>
            );
        }
    })}
    </div>
  );
};
