
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
  const isCritical = showCriticalPath && task.critical;
  
  // Baseline Calculations
  let baselineLeft = 0;
  let baselineWidth = 0;
  const hasBaseline = baselineStart && baselineEnd && projectStart;
  if (hasBaseline) {
      const blOffset = getDaysDiff(projectStart, new Date(baselineStart));
      const blDuration = getDaysDiff(new Date(baselineStart), new Date(baselineEnd));
      baselineLeft = blOffset * dayWidth;
      baselineWidth = Math.max(blDuration, 1) * dayWidth;
  }

  // Styles based on status/criticality
  let barColorClass = 'bg-blue-500 border-blue-600';
  let progressColorClass = 'bg-blue-700';

  if (task.status === TaskStatus.COMPLETED) {
      barColorClass = 'bg-green-500 border-green-600';
      progressColorClass = 'bg-green-700';
  } else if (isCritical) {
      barColorClass = 'bg-red-500 border-red-600';
      progressColorClass = 'bg-red-700';
  } else if (task.status === TaskStatus.DELAYED) {
      barColorClass = 'bg-amber-400 border-amber-500';
      progressColorClass = 'bg-amber-600';
  }

  // --- MILESTONE RENDERING ---
  if (task.type === 'Milestone') {
      return (
        <div className="absolute top-0 h-full flex items-center justify-center" style={{ left: `${offsetDays * dayWidth}px`, width: '24px' }}>
            {hasBaseline && (
                <div 
                    className="absolute w-3 h-3 bg-yellow-300 border border-yellow-500 rotate-45 opacity-50 top-[28px]"
                    title={`Baseline Milestone: ${baselineStart}`}
                ></div>
            )}
            <div
                onMouseDown={(e) => onMouseDown(e, task, 'move')}
                onClick={() => onSelect(task)}
                className={`relative z-10 w-4 h-4 rotate-45 border-2 shadow-sm cursor-pointer transition-transform hover:scale-125 ${
                    task.status === TaskStatus.COMPLETED ? 'bg-green-500 border-green-700' : 
                    isCritical ? 'bg-red-500 border-red-700' : 'bg-slate-800 border-slate-900'
                } ${isSelected ? 'ring-2 ring-offset-1 ring-nexus-500' : ''}`}
            >
            </div>
             <span className="absolute left-6 text-[10px] font-bold text-slate-600 whitespace-nowrap z-0 pointer-events-none select-none">
                {task.name}
            </span>
        </div>
      );
  }

  // --- TASK BAR RENDERING ---
  return (
    <div className="absolute h-full pointer-events-none" style={{ left: 0, top: 0, width: '100%' }}>
      
      {/* Baseline Shadow Bar */}
      {hasBaseline && (
          <div 
            className="absolute h-1.5 bg-yellow-400 opacity-60 rounded-full top-[30px]"
            style={{ left: `${baselineLeft}px`, width: `${baselineWidth}px` }}
            title={`Baseline: ${baselineStart} - ${baselineEnd}`}
          />
      )}

      {/* Main Bar Container */}
      <div
        className={`pointer-events-auto absolute top-[10px] h-[24px] rounded-[3px] border shadow-sm cursor-pointer group transition-shadow ${barColorClass} ${isSelected ? 'ring-2 ring-offset-1 ring-nexus-500 z-20' : 'z-10'}`}
        style={{ left: `${offsetDays * dayWidth}px`, width: `${width}px` }}
        onMouseDown={(e) => onMouseDown(e, task, 'move')}
        onClick={() => onSelect(task)}
      >
        {/* Progress Fill */}
        <div 
            className={`h-full ${progressColorClass} opacity-30 rounded-l-[2px] transition-all duration-300`} 
            style={{ width: `${task.progress}%` }} 
        />
        
        {/* Text Label (Inside or Outside based on width) */}
        <span className={`absolute top-1/2 -translate-y-1/2 text-[10px] font-bold whitespace-nowrap px-2 pointer-events-none select-none ${width < 60 ? 'left-full text-slate-700 ml-1' : 'left-0 text-white drop-shadow-md'}`}>
            {task.name} {task.progress > 0 && `(${task.progress}%)`}
        </span>

        {/* Interaction Handles (Only visible on hover) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Left Resize */}
            <div 
                className="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize hover:bg-white/20 rounded-l-[3px]"
                onMouseDown={(e) => { e.stopPropagation(); onMouseDown(e, task, 'resize-start'); }}
            />
            {/* Right Resize */}
            <div 
                className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize hover:bg-white/20 rounded-r-[3px]"
                onMouseDown={(e) => { e.stopPropagation(); onMouseDown(e, task, 'resize-end'); }}
            />
        </div>
      </div>
    </div>
  );
});

export default GanttTaskBar;
