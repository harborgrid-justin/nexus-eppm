
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
    <svg className="absolute top-[50px] left-0 pointer-events-none z-[5]" style={{ width: `${timelineWidth}px`, height: `${renderList.length * rowHeight}px` }}>
      <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" /></marker>
      </defs>
      {renderList.map((item) => {
          if (item.type !== 'task') return null;
          const task = item.task;
          return task.dependencies.map((dep) => {
              const predRowIndex = taskRowMap.get(dep.targetId);
              const succRowIndex = taskRowMap.get(task.id);
              if (predRowIndex === undefined || succRowIndex === undefined) return null;

              const predTask = projectTasks.find((t) => t.id === dep.targetId)!;

              const startOffset = getWorkingDaysDiff(projectStart, new Date(predTask.endDate), calendar);
              const startX = startOffset * dayWidth + (predTask.duration * dayWidth);
              const startY = predRowIndex * rowHeight + (rowHeight / 2);

              const endOffset = getWorkingDaysDiff(projectStart, new Date(task.startDate), calendar);
              const endX = endOffset * dayWidth;
              const endY = succRowIndex * rowHeight + (rowHeight / 2);

              // Simple S-curve or direct line logic could go here. Currently using direct L-shape logic.
              return <path key={`${task.id}-${dep.targetId}`} d={`M ${startX} ${startY} L ${endX} ${endY}`} stroke="#64748b" strokeWidth="1" fill="none" markerEnd="url(#arrow)" />;
          });
      })}
    </svg>
  );
});

export default DependencyLines;