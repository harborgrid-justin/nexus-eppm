import React from 'react';
import { Task, TaskStatus } from '../../types';
import { Diamond } from 'lucide-react';

interface GanttTaskBarProps {
  task: Task;
  rowIndex: number;
  offsetDays: number;
  width: number;
  dayWidth: number;
  rowHeight: number;
  showCriticalPath: boolean;
  getStatusColor: (status: TaskStatus) => string;
  onMouseDown: (e: React.MouseEvent, task: Task, type: 'move' | 'resize-end' | 'progress') => void;
  onSelect: (task: Task) => void;
  isSelected: boolean;
}

const GanttTaskBar: React.FC<GanttTaskBarProps> = React.memo(({ 
  task, 
  rowIndex, 
  offsetDays, 
  width, 
  dayWidth,
  rowHeight,
  showCriticalPath, 
  getStatusColor, 
  onMouseDown, 
  onSelect,
  isSelected
}) => {
  return (
    <div className="h-[44px] flex items-center absolute w-full" style={{ top: `${rowIndex * rowHeight}px` }}>
      <div
        onMouseDown={(e) => onMouseDown(e, task, 'move')}
        onClick={() => onSelect(task)}
        className={`h-6 rounded-sm border shadow-sm relative group cursor-grab transition-all 
          ${getStatusColor(task.status)} 
          ${showCriticalPath && task.critical ? 'ring-2 ring-offset-1 ring-red-500' : ''}
          ${isSelected ? 'ring-2 ring-offset-1 ring-blue-500' : ''}
        `}
        style={{ left: `${offsetDays * dayWidth}px`, width: `${width}px` }}
        role="button"
        aria-label={`Task ${task.name}, Status ${task.status}, Progress ${task.progress}%`}
      >
        <div className="absolute h-full w-full left-0 top-0 flex items-center">
          <div className="h-full bg-black/20 rounded-l-sm" style={{ width: `${task.progress}%` }} />
        </div>
        
        {/* Label */}
        <span className="text-white text-xs font-medium absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none truncate pr-2 max-w-full">
            {task.name}
        </span>

        {/* Milestone Marker */}
        {task.type === 'Milestone' && (
            <Diamond size={16} className="absolute -right-2 top-1/2 -translate-y-1/2 text-white fill-slate-800" />
        )}

        {/* Resize Handle (Right) */}
        {task.type !== 'Milestone' && (
            <div 
                onMouseDown={(e) => onMouseDown(e, task, 'resize-end')}
                className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize opacity-0 group-hover:opacity-100 hover:bg-white/30 rounded-r-sm"
            />
        )}
      </div>
    </div>
  );
});

export default GanttTaskBar;