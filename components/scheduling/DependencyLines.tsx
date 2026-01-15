
import React from 'react';
import { Task, ProjectCalendar, WBSNode } from '../../types/index';
import { getWorkingDaysDiff } from '../../utils/dateUtils';

interface DraftLink {
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    isValid: boolean;
}

interface DependencyLinesProps {
  renderList: ({ type: 'wbs', node: WBSNode, level: number } | { type: 'task', task: Task, level: number })[];
  taskRowMap: Map<string, number>;
  projectTasks: Task[];
  projectStart: Date;
  calendar?: ProjectCalendar;
  timelineWidth: number;
  dayWidth: number;
  rowHeight: number;
  draftLink?: DraftLink | null;
}

const DependencyLines: React.FC<DependencyLinesProps> = React.memo(({ 
  renderList, 
  taskRowMap, 
  projectTasks, 
  projectStart, 
  calendar, 
  timelineWidth,
  dayWidth,
  rowHeight,
  draftLink
}) => {
  if (!calendar) return null;

  const getPath = (startX: number, startY: number, endX: number, endY: number) => {
      const deltaX = endX - startX;
      const controlX = Math.min(60, Math.max(20, Math.abs(deltaX) / 2)); 
      
      if (deltaX >= 20) {
          return `M ${startX} ${startY} C ${startX + controlX} ${startY}, ${endX - controlX} ${endY}, ${endX} ${endY}`;
      } else {
          const verticalDrop = endY > startY ? 15 : -15; 
          return `M ${startX} ${startY} 
                  C ${startX + 40} ${startY}, ${startX + 40} ${startY + verticalDrop}, ${startX + 40} ${startY + verticalDrop}
                  L ${startX + 40} ${endY - verticalDrop}
                  C ${startX + 40} ${endY}, ${endX - 20} ${endY}, ${endX} ${endY}`;
      }
  };

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ width: `${timelineWidth}px`, height: `${renderList.length * rowHeight}px` }}>
      <defs>
          <marker id="arrow-normal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--schedule-dependency)" />
          </marker>
          <marker id="arrow-critical" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--schedule-criticalPath)" />
          </marker>
          <marker id="arrow-draft" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-primary)" />
          </marker>
          <marker id="arrow-invalid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-error)" />
          </marker>
      </defs>

      {renderList.map((item) => {
          if (item.type !== 'task') return null;
          const task = item.task;
          return task.dependencies.map((dep) => {
              const predRowIndex = taskRowMap.get(dep.targetId);
              const succRowIndex = taskRowMap.get(task.id);
              
              if (predRowIndex === undefined || succRowIndex === undefined) return null;

              const predTask = projectTasks.find((t) => t.id === dep.targetId)!;
              
              const isCritical = task.critical && predTask.critical;
              const strokeColor = isCritical ? 'var(--schedule-criticalPath)' : 'var(--schedule-dependency)'; 
              const strokeWidth = isCritical ? 2 : 1.5;
              const zIndex = isCritical ? 10 : 1;

              const startOffset = getWorkingDaysDiff(projectStart, new Date(predTask.endDate), calendar);
              const startX = startOffset * dayWidth + (predTask.duration * dayWidth);
              const startY = predRowIndex * rowHeight + (rowHeight / 2) + 10; 

              const endOffset = getWorkingDaysDiff(projectStart, new Date(task.startDate), calendar);
              const endX = endOffset * dayWidth;
              const endY = succRowIndex * rowHeight + (rowHeight / 2) + 10;

              const path = getPath(startX, startY, endX, endY);

              return (
                  <path 
                    key={`${task.id}-${dep.targetId}`} 
                    d={path} 
                    stroke={strokeColor} 
                    strokeWidth={strokeWidth} 
                    fill="none" 
                    markerEnd={`url(#arrow-${isCritical ? 'critical' : 'normal'})`}
                    style={{ zIndex }}
                  />
              );
          });
      })}

      {draftLink && (
          <path 
            d={getPath(draftLink.startX, draftLink.startY, draftLink.currentX, draftLink.currentY)}
            stroke={draftLink.isValid ? 'var(--color-primary)' : 'var(--color-error)'}
            strokeWidth="2"
            strokeDasharray="5 5"
            fill="none"
            markerEnd={draftLink.isValid ? `url(#arrow-draft)` : `url(#arrow-invalid)`}
            className="animate-pulse"
          />
      )}
    </svg>
  );
});

export default DependencyLines;
