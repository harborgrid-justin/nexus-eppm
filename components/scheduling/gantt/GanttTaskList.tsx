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
            absolute inset-y-0 left-0 w-[85%] sm:w-3/4 shadow-xl transform transition-transform duration-300 md:relative md:w-[380px] md:shadow-none md:translate-x-0
            ${showTaskList ? 'translate-x-0' : '-translate-x-full'}
        `} 
        role="treegrid"
    >
    <div className="sticky top-0 z-30 bg-slate-50/90 backdrop-blur-sm border-b border-slate-200 h-[50px] flex items-center px-4 font-bold text-[10px] text-slate-500 uppercase tracking-widest flex-shrink-0">
        <div className="flex-1 truncate">Task / Element Name</div>
        <div className="w-12 text-center flex-shrink-0">Dur.</div>
    </div>
    <div className="flex-1 flex flex-col bg-white">
        {renderList.map((item, index) => {
            if (item.type === 'wbs') {
                return (
                    <button 
                        key={item.node.id}
                        className={`group h-[44px] w-full flex items-center px-4 border-b border-slate-100 hover:bg-slate-50 text-xs text-left font-bold bg-slate-50/50 focus:outline-none transition-all flex-shrink-0 min-w-0`}
                        style={{ paddingLeft: `${Math.min(item.level * 16 + 12, 100)}px` }}
                        onClick={() => toggleNode(item.node.id)}
                    >
                        <span className={`mr-2 transition-transform duration-200 text-slate-400 w-4 flex-shrink-0 ${expandedNodes.has(item.node.id) ? 'rotate-0' : '-rotate-90'}`}>▼</span>
                        <span className="truncate flex-1 text-slate-800">{item.node.name}</span>
                    </button>
                );
            } else {
                const isSelected = selectedTask?.id === item.task.id;
                return (
                    <div 
                        key={item.task.id}
                        onClick={() => setSelectedTask(item.task)}
                        className={`
                          h-[44px] w-full flex items-center px-4 border-b border-slate-100 text-xs text-left cursor-pointer transition-all flex-shrink-0 min-w-0 border-l-4
                          ${isSelected ? 'bg-nexus-50/50 border-l-nexus-600 font-semibold text-nexus-900' : 'hover:bg-slate-50 border-l-transparent text-slate-700'}
                        `}
                        style={{ paddingLeft: `${Math.min(item.level * 16 + 32, 120)}px` }}
                    >
                        <div className="flex-1 truncate">{item.task.name}</div>
                        <div className="w-12 text-center text-[10px] text-slate-400 font-mono font-bold flex-shrink-0">{item.task.duration}d</div>
                    </div>
                );
            }
        })}
    </div>
    </div>
  );
};