
import React, { useMemo } from 'react';
import { Project, Task } from '../../types';
import { getDaysDiff } from '../../utils/dateUtils';

interface GanttMinimapProps {
  project: Project;
  projectStart: Date;
  projectEnd: Date;
  viewportStart: Date;
  viewportWidthPercent: number; // 0-100 representing how much of the timeline is visible
}

const GanttMinimap: React.FC<GanttMinimapProps> = ({ 
  project, 
  projectStart, 
  projectEnd, 
  viewportStart, 
  viewportWidthPercent 
}) => {
  const totalDays = getDaysDiff(projectStart, projectEnd) || 1;

  // Calculate positions for bars
  const bars = useMemo(() => {
    return project.tasks.map(task => {
      const startOffset = getDaysDiff(projectStart, new Date(task.startDate));
      const duration = task.duration || 1;
      
      const left = Math.max(0, (startOffset / totalDays) * 100);
      const width = Math.max(0.5, (duration / totalDays) * 100);
      
      return {
        id: task.id,
        left: `${left}%`,
        width: `${width}%`,
        color: task.critical ? 'bg-red-400' : task.status === 'Completed' ? 'bg-green-400' : 'bg-blue-400',
        top: 0 // Will be calculated in render
      };
    });
  }, [project.tasks, projectStart, totalDays]);

  // Viewport Lens calculation
  const lensLeft = Math.max(0, (getDaysDiff(projectStart, viewportStart) / totalDays) * 100);
  
  return (
    <div className="h-16 bg-slate-50 border-t border-slate-200 relative overflow-hidden select-none w-full">
      {/* Mini Bars */}
      <div className="absolute inset-0 top-1 bottom-1 w-full px-4">
        {bars.map((bar, idx) => (
          <div 
            key={bar.id}
            className={`absolute h-1 rounded-full opacity-60 ${bar.color}`}
            style={{ 
              left: bar.left, 
              width: bar.width, 
              top: `${(idx % 10) * 10}%` // Distribute vertically to avoid total overlap
            }}
          />
        ))}
      </div>

      {/* Viewport Lens Overlay */}
      <div 
        className="absolute top-0 bottom-0 border-2 border-nexus-500 bg-nexus-500/10 cursor-grab active:cursor-grabbing"
        style={{
          left: `${lensLeft}%`,
          width: `${Math.min(100, viewportWidthPercent)}%`,
          transition: 'left 0.1s linear'
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-nexus-500 text-white text-[9px] px-1 rounded-b">
          View
        </div>
      </div>
    </div>
  );
};

export default GanttMinimap;
