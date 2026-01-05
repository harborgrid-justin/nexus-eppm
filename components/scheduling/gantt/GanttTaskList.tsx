
import React, { forwardRef } from 'react';
import { Task, WBSNode } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';

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
}

export const GanttTaskList = forwardRef<HTMLDivElement, GanttTaskListProps>(({ 
  renderList, showTaskList, expandedNodes, selectedTask, toggleNode, setSelectedTask,
  virtualItems, totalHeight, rowHeight, onScroll
}, ref) => {
  const theme = useTheme();

  return (
    <div 
        className={`
            flex-shrink-0 border-r ${theme.colors.border} flex flex-col ${theme.colors.surface} z-20
            absolute inset-y-0 left-0 w-[85%] sm:w-3/4 shadow-xl transform transition-transform duration-300 md:relative md:w-[380px] md:shadow-none md:translate-x-0
            ${showTaskList ? 'translate-x-0' : '-translate-x-full'}
        `} 
        role="treegrid"
    >
        <div className={`sticky top-0 z-30 ${theme.colors.background}/95 backdrop-blur-sm border-b ${theme.colors.border} h-[50px] flex items-center px-4 font-bold text-[10px] ${theme.colors.text.secondary} uppercase tracking-widest flex-shrink-0`}>
            <div className="flex-1 truncate">Task / Element Name</div>
            <div className="w-12 text-center flex-shrink-0">Dur.</div>
        </div>
        
        {/* Virtualized Scroll Container */}
        <div 
            ref={ref}
            className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin"
            onScroll={onScroll}
        >
            <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
                {virtualItems.map(({ index, offsetTop }) => {
                    const item = renderList[index];
                    if (!item) return null;

                    if (item.type === 'wbs') {
                        return (
                            <button 
                                key={item.node.id}
                                className={`group h-[44px] w-full flex items-center px-4 border-b ${theme.colors.border.replace('border-', 'border-b-').replace('200','100')} hover:${theme.colors.background} text-xs text-left font-bold ${theme.colors.background}/50 focus:outline-none transition-all flex-shrink-0 min-w-0 absolute top-0 left-0`}
                                style={{ 
                                    paddingLeft: `${Math.min(item.level * 16 + 12, 100)}px`,
                                    transform: `translateY(${offsetTop}px)`
                                }}
                                onClick={() => toggleNode(item.node.id)}
                            >
                                <span className={`mr-2 transition-transform duration-200 ${theme.colors.text.tertiary} w-4 flex-shrink-0 ${expandedNodes.has(item.node.id) ? 'rotate-0' : '-rotate-90'}`}>▼</span>
                                <span className={`truncate flex-1 ${theme.colors.text.primary}`}>{item.node.name}</span>
                            </button>
                        );
                    } else {
                        const isSelected = selectedTask?.id === item.task.id;
                        return (
                            <div 
                                key={item.task.id}
                                onClick={() => setSelectedTask(item.task)}
                                className={`
                                  h-[44px] w-full flex items-center px-4 border-b ${theme.colors.border.replace('border-', 'border-b-').replace('200','100')} text-xs text-left cursor-pointer transition-all flex-shrink-0 min-w-0 border-l-4 absolute top-0 left-0
                                  ${isSelected ? 'bg-nexus-50/50 border-l-nexus-600 font-semibold text-nexus-900' : `hover:${theme.colors.background} border-l-transparent ${theme.colors.text.secondary}`}
                                `}
                                style={{ 
                                    paddingLeft: `${Math.min(item.level * 16 + 32, 120)}px`,
                                    transform: `translateY(${offsetTop}px)`
                                }}
                            >
                                <div className="flex-1 truncate">{item.task.name}</div>
                                <div className={`w-12 text-center text-[10px] ${theme.colors.text.tertiary} font-mono font-bold flex-shrink-0`}>{item.task.duration}d</div>
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    </div>
  );
});

GanttTaskList.displayName = 'GanttTaskList';
