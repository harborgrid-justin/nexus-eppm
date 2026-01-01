
import React from 'react';
import { Task, TaskStatus } from '../../types/index';
import { Diamond } from 'lucide-react';
import { getDaysDiff } from '../../utils/dateUtils';

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
  // New props for baseline
  baselineStart?: string;
  baselineEnd?: string;
  projectStart?: Date;
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
  isSelected,
  baselineStart,
  baselineEnd,
  projectStart
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(task);
    }
  };

  // Calculate baseline bar dimensions if data exists
  let baselineLeft = 0;
  let baselineWidth = 0;
  const hasBaseline = baselineStart && baselineEnd && projectStart;

  if (hasBaseline) {
      const blOffset = getDaysDiff(projectStart, new Date(baselineStart));
      const blDuration = getDaysDiff(new Date(baselineStart), new Date(baselineEnd));
      baselineLeft = blOffset * dayWidth;
      baselineWidth = Math.max(blDuration, 1) * dayWidth;
  }

  return (
    <div className="h-[44px] absolute w-full pointer-events-none" style={{ top: `${rowIndex * rowHeight}px` }}>
      
      {/* Baseline Bar (Rendered underneath) */}
      {hasBaseline && (
          <div 
            className="absolute h-3 bg-amber-400 opacity-60 rounded-sm top-5 z-0"
            style={{ left: `${baselineLeft}px`, width: `${baselineWidth}px` }}
            title={`Baseline: ${baselineStart} - ${baselineEnd}`}
          />
      )}

      {/* Actual Task Bar */}
      <button
        onMouseDown={(e) => onMouseDown(e, task, 'move')}
        onClick={() => onSelect(task)}
        onKeyDown={handleKeyDown}
        className={`pointer-events-auto h-5 rounded-sm border shadow-sm absolute top-1 group cursor-grab transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-nexus-500 z-10
          ${getStatusColor(task.status)} 
          ${showCriticalPath && task.critical ? 'ring-2 ring-offset-1 ring-red-500' : ''}
          ${isSelected ? 'ring-2 ring-offset-1 ring-nexus-500 z-20' : ''}
        `}
        style={{ left: `${offsetDays * dayWidth}px`, width: `${width}px` }}
        aria-label={`Task: ${task.name}, Status: ${task.status}, Progress: ${task.progress}%`}
      >
        <div className="absolute h-full w-full left-0 top-0 flex items-center">
          <div className="h-full bg-slate-900/30 rounded-l-sm" style={{ width: `${task.progress}%` }} />
        </div>
        
        {/* Label */}
        <span className="text-white text-[10px] font-medium absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none truncate pr-2 max-w-full">
            {task.name}
        </span>

        {/* Milestone Marker */}
        {task.type === 'Milestone' && (
            <Diamond size={16} className="absolute -right-2 top-1/2 -translate-y-1/2 text-white fill-slate-800" aria-hidden="true" />
        )}

        {/* Resize Handle (Right) */}
        {task.type !== 'Milestone' && (
            <div 
                onMouseDown={(e) => onMouseDown(e, task, 'resize-end')}
                className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize opacity-0 group-hover:opacity-100 hover:bg-white/30 rounded-r-sm"
                aria-hidden="true"
            />
        )}
      </button>
    </div>
  );
});

export default GanttTaskBar;