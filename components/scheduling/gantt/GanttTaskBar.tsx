
import React from 'react';
import { Task, TaskStatus } from '../../../types/index';
import { getDaysDiff } from '../../../utils/dateUtils';

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
  onLinkStart: (e: React.MouseEvent, task: Task, side: 'start' | 'end') => void;
  onLinkEnter: (task: Task) => void;
  onLinkLeave: () => void;
  onSelect: (task: Task) => void;
  isSelected: boolean;
  isLinking?: boolean;
  baselineStart?: string;
  baselineEnd?: string;
  projectStart?: Date;
}

const GanttTaskBar: React.FC<GanttTaskBarProps> = React.memo(({ 
  task, 
  offsetDays, 
  width, 
  dayWidth,
  showCriticalPath, 
  onMouseDown, 
  onLinkStart,
  onLinkEnter,
  onLinkLeave,
  onSelect,
  isSelected,
  isLinking,
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

  // Semantic Token Mapping
  let barColor = 'var(--schedule-task)';
  let progressColor = 'rgba(255,255,255,0.3)';

  if (task.status === TaskStatus.COMPLETED) {
      barColor = 'var(--status-completed)';
  } else if (isCritical) {
      barColor = 'var(--schedule-criticalPath)';
  } else if (task.status === TaskStatus.DELAYED) {
      barColor = 'var(--status-onHold)';
  }

  // Interaction Handles Styles
  const anchorClass = "absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-slate-400 rounded-full opacity-0 group-hover:opacity-100 hover:scale-125 hover:border-nexus-600 z-30 transition-all cursor-crosshair shadow-sm";

  // --- MILESTONE RENDERING ---
  if (task.type === 'Milestone') {
      return (
        <div 
            className="absolute top-0 h-full flex items-center justify-center group" 
            style={{ left: `${offsetDays * dayWidth}px`, width: '24px' }}
            onMouseEnter={() => isLinking && onLinkEnter(task)}
            onMouseLeave={() => isLinking && onLinkLeave()}
        >
            <div className={`${anchorClass} -left-2`} onMouseDown={(e) => { e.stopPropagation(); onLinkStart(e, task, 'start'); }} />
            <div className={`${anchorClass} -right-2`} onMouseDown={(e) => { e.stopPropagation(); onLinkStart(e, task, 'end'); }} />

            {hasBaseline && (
                <div 
                    className="absolute w-3 h-3 rotate-45 opacity-50 top-[28px]"
                    style={{ backgroundColor: 'var(--schedule-baseline)', border: '1px solid var(--schedule-baseline)' }}
                    title={`Baseline Milestone: ${baselineStart}`}
                ></div>
            )}
            <div
                onMouseDown={(e) => onMouseDown(e, task, 'move')}
                onClick={() => onSelect(task)}
                className={`relative z-10 w-4 h-4 rotate-45 border-2 shadow-sm cursor-pointer transition-transform hover:scale-125 ${isSelected ? 'ring-2 ring-offset-1 ring-nexus-500' : ''}`}
                style={{ backgroundColor: barColor, borderColor: 'rgba(0,0,0,0.1)' }}
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
            className="absolute h-1.5 opacity-60 rounded-full top-[30px]"
            style={{ 
                left: `${baselineLeft}px`, 
                width: `${baselineWidth}px`, 
                backgroundColor: 'var(--schedule-baseline)' 
            }}
            title={`Baseline: ${baselineStart} - ${baselineEnd}`}
          />
      )}

      {/* Main Bar Container */}
      <div
        className={`pointer-events-auto absolute top-[10px] h-[24px] rounded-[3px] border shadow-sm cursor-pointer group transition-shadow ${isSelected ? 'ring-2 ring-offset-1 ring-nexus-500 z-20' : 'z-10'}`}
        style={{ 
            left: `${offsetDays * dayWidth}px`, 
            width: `${width}px`,
            backgroundColor: barColor,
            borderColor: 'rgba(0,0,0,0.1)'
        }}
        onMouseDown={(e) => onMouseDown(e, task, 'move')}
        onMouseEnter={() => isLinking && onLinkEnter(task)}
        onMouseLeave={() => isLinking && onLinkLeave()}
        onClick={() => onSelect(task)}
      >
        {/* Progress Fill */}
        <div 
            className={`h-full rounded-l-[2px] transition-all duration-300`} 
            style={{ 
                width: `${task.progress}%`,
                backgroundColor: progressColor 
            }} 
        />
        
        <span className={`absolute top-1/2 -translate-y-1/2 text-[10px] font-bold whitespace-nowrap px-2 pointer-events-none select-none ${width < 60 ? 'left-full text-slate-700 ml-1' : 'left-0 text-white drop-shadow-md'}`}>
            {task.name} {task.progress > 0 && `(${task.progress}%)`}
        </span>

        {/* Interaction Handles */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute left-0 top-0 bottom-0 w-2 cursor-w-resize hover:bg-white/20 rounded-l-[3px] z-20" onMouseDown={(e) => { e.stopPropagation(); onMouseDown(e, task, 'resize-start'); }} />
            <div className="absolute right-0 top-0 bottom-0 w-2 cursor-e-resize hover:bg-white/20 rounded-r-[3px] z-20" onMouseDown={(e) => { e.stopPropagation(); onMouseDown(e, task, 'resize-end'); }} />
        </div>

        <div className={`${anchorClass} -left-1.5`} title="Drag to link as Successor" onMouseDown={(e) => { e.stopPropagation(); onLinkStart(e, task, 'start'); }} />
        <div className={`${anchorClass} -right-1.5`} title="Drag to link to Predecessor" onMouseDown={(e) => { e.stopPropagation(); onLinkStart(e, task, 'end'); }} />
      </div>
    </div>
  );
});

export default GanttTaskBar;
