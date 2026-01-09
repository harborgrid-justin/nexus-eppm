
import React from 'react';
import { Task, ProjectCalendar, WBSNode } from '../../types/index';
import { getWorkingDaysDiff } from '../../utils/dateUtils';

interface DependencyLinesProps {
  renderList: ({ type: 'wbs', node: WBSNode, level: number } | { type: 'task', task: Task, level: number })[];
  taskRowMap: Map<string, number>;
  projectTasks: Task[];
  projectStart: Date;
  calendar?: ProjectCalendar;
  timelineWidth: number;
  dayWidth: number;
  rowHeight: number;
}

const DependencyLines: React.FC<DependencyLinesProps> = React.memo(({ 
  renderList, 
  taskRowMap, 
  projectTasks, 
  projectStart, 
  calendar, 
  timelineWidth,
  dayWidth,
  rowHeight
}) => {
  if (!calendar) return null;

  return (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ width: `${timelineWidth}px`, height: `${renderList.length * rowHeight}px` }}>
      <defs>
          <marker id="arrow-normal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
          </marker>
          <marker id="arrow-critical" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
          </marker>
      </defs>
      {renderList.map((item) => {
          if (item.type !== 'task') return null;
          const task = item.task;
          return task.dependencies.map((dep) => {
              const predRowIndex = taskRowMap.get(dep.targetId);
              const succRowIndex = taskRowMap.get(task.id);
              
              // Only render if both tasks are currently in the virtualization list (or close enough context)
              // Note: For full correctness in virtualization, we might need a separate logic, 
              // but limiting to renderList ensures we don't draw thousands of invisible lines.
              if (predRowIndex === undefined || succRowIndex === undefined) return null;

              const predTask = projectTasks.find((t) => t.id === dep.targetId)!;
              
              // Determine Criticality
              const isCritical = task.critical && predTask.critical;
              const strokeColor = isCritical ? '#ef4444' : '#cbd5e1'; // Red vs Slate-300
              const strokeWidth = isCritical ? 2 : 1.5;
              const zIndex = isCritical ? 10 : 1;

              // Coordinates
              const startOffset = getWorkingDaysDiff(projectStart, new Date(predTask.endDate), calendar);
              const startX = startOffset * dayWidth + (predTask.duration * dayWidth);
              const startY = predRowIndex * rowHeight + (rowHeight / 2);

              const endOffset = getWorkingDaysDiff(projectStart, new Date(task.startDate), calendar);
              const endX = endOffset * dayWidth;
              const endY = succRowIndex * rowHeight + (rowHeight / 2);

              // Path Logic: Bezier Curve
              // Control points create a smooth S-shape
              const deltaX = endX - startX;
              const deltaY = endY - startY;
              
              let path = '';

              // Standard Forward dependency
              if (deltaX > 20) {
                 const cp1x = startX + 20; // Control point 1
                 const cp2x = endX - 20;   // Control point 2
                 path = `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`;
              } else {
                 // Backward or very close dependency (S-loop)
                 // Go down, then back, then forward
                 const midY = startY + (deltaY / 2);
                 path = `M ${startX} ${startY} 
                        L ${startX + 10} ${startY} 
                        L ${startX + 10} ${midY} 
                        L ${endX - 10} ${midY} 
                        L ${endX - 10} ${endY} 
                        L ${endX} ${endY}`;
                 // Alternatively, use a simpler curve that loops under
                 path = `M ${startX} ${startY} 
                         C ${startX + 40} ${startY}, ${startX + 40} ${endY}, ${endX - 10} ${endY}
                         L ${endX} ${endY}`;
              }

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
    </svg>
  );
});

export default DependencyLines;
