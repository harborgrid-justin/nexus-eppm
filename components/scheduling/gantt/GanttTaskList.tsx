
import React, { forwardRef } from 'react';
import { Task, WBSNode } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import { ChevronRight, ChevronDown, Folder, FileText, AlertTriangle } from 'lucide-react';

interface GanttTaskListProps {
  renderList: ({ type: 'wbs', node: WBSNode, level: number } | { type: 'task', task: Task, level: number })[];
  showTaskList: boolean;
  expandedNodes: Set<string>;
  selectedTask: Task | null;
  toggleNode: (id: string) => void;
  setSelectedTask: (task: Task) => void;
  virtualItems: { index: number; offsetTop: number }[];
  totalHeight: number;
  rowHeight: number;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onRowContextMenu?: (e: React.MouseEvent, task: Task) => void;
}

export const GanttTaskList = forwardRef<HTMLDivElement, GanttTaskListProps>(({ 
  renderList, showTaskList, expandedNodes, selectedTask, toggleNode, setSelectedTask,
  virtualItems, totalHeight, rowHeight, onScroll, onRowContextMenu
}, ref) => {
  const theme = useTheme();

  return (
    <div 
        className={`
            flex-shrink-0 border-r border-slate-200 flex flex-col bg-white z-30 shadow-[4px_0_10px_rgba(0,0,0,0.05)]
            absolute inset-y-0 left-0 w-[85%] sm:w-3/4 transform transition-transform duration-300 md:relative md:w-[400px] md:translate-x-0
            ${showTaskList ? 'translate-x-0' : '-translate-x-full'}
        `} 
        role="treegrid"
    >
        {/* Sticky Header */}
        <div className="h-[56px] border-b border-slate-200 bg-slate-50 flex items-end pb-2 px-4 font-bold text-[10px] text-slate-500 uppercase tracking-widest sticky top-0 z-20">
            <div className="flex-1 truncate">Activity Name</div>
            <div className="w-16 text-center flex-shrink-0">Dur</div>
            <div className="w-16 text-center flex-shrink-0">%</div>
        </div>
        
        <div 
            ref={ref}
            className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin bg-white"
            onScroll={onScroll}
        >
            <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
                {virtualItems.map(({ index, offsetTop }) => {
                    const item = renderList[index];
                    if (!item) return null;
                    
                    const paddingLeft = item.level * 16 + 12;

                    // --- WBS NODE ROW ---
                    if (item.type === 'wbs') {
                        const isExpanded = expandedNodes.has(item.node.id);
                        return (
                            <div 
                                key={item.node.id}
                                className="absolute top-0 left-0 w-full flex items-center border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer select-none bg-slate-50/30"
                                style={{ height: `${rowHeight}px`, transform: `translateY(${offsetTop}px)` }}
                                onClick={() => toggleNode(item.node.id)}
                            >
                                <div className="flex-1 flex items-center pr-2" style={{ paddingLeft: `${paddingLeft}px` }}>
                                    <span className="p-0.5 mr-1 text-slate-400">
                                        {isExpanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                                    </span>
                                    <Folder size={14} className="text-blue-400 mr-2 flex-shrink-0 fill-blue-50" />
                                    <span className="font-bold text-xs text-slate-800 truncate">{item.node.name}</span>
                                </div>
                            </div>
                        );
                    } 
                    
                    // --- TASK ROW ---
                    const task = item.task;
                    const isSelected = selectedTask?.id === task.id;
                    const isCritical = task.critical;
                    
                    return (
                        <div 
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            onContextMenu={(e) => onRowContextMenu?.(e, task)}
                            className={`
                              absolute top-0 left-0 w-full flex items-center border-b border-slate-100 cursor-pointer transition-colors
                              ${isSelected ? 'bg-nexus-50' : 'hover:bg-slate-50 bg-white'}
                            `}
                            style={{ 
                                height: `${rowHeight}px`, 
                                transform: `translateY(${offsetTop}px)`,
                                borderLeft: isSelected ? '4px solid #3b82f6' : '4px solid transparent'
                            }}
                        >
                            <div className="flex-1 flex items-center pr-2 overflow-hidden" style={{ paddingLeft: `${paddingLeft + 18}px` }}>
                                {/* Task Icon based on type */}
                                {task.type === 'Milestone' ? (
                                    <div className="w-2.5 h-2.5 bg-slate-800 rotate-45 mr-3 flex-shrink-0"></div>
                                ) : (
                                    <div className={`w-3 h-3 rounded-full mr-2 flex-shrink-0 ${task.status === 'Completed' ? 'bg-green-500' : isCritical ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                )}
                                
                                <span className={`text-xs truncate ${isSelected ? 'font-bold text-nexus-900' : 'text-slate-700'}`}>
                                    {task.name}
                                </span>
                                {isCritical && <AlertTriangle size={10} className="text-red-500 ml-2 flex-shrink-0" />}
                            </div>

                            <div className="w-16 text-center text-xs font-mono text-slate-600 border-l border-slate-50 h-full flex items-center justify-center">
                                {task.duration}d
                            </div>
                            <div className="w-16 text-center text-xs font-mono text-slate-600 border-l border-slate-50 h-full flex items-center justify-center">
                                {Math.round(task.progress)}%
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
});

GanttTaskList.displayName = 'GanttTaskList';
