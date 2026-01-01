
import React from 'react';
import { Task, TaskStatus } from '../../../types';
import GanttTaskBar from '../GanttTaskBar';
import DependencyLines from '../DependencyLines';
import { getDaysDiff } from '../../../utils/dateUtils';

interface GanttTimelineProps {
  timelineHeaders: { months: Map<string, { start: number, width: number }>, days: { date: Date; isWorking: boolean }[] };
  renderList: any[];
  taskRowMap: Map<string, number>;
  projectStart: Date;
  projectEnd: Date;
  dayWidth: number;
  rowHeight: number;
  showCriticalPath: boolean;
  baselineMap: any;
  selectedTask: Task | null;
  projectTasks: Task[];
  calendar: any;
  ganttContainerRef: React.RefObject<HTMLDivElement>;
  getStatusColor: (s: TaskStatus) => string;
  handleMouseDown: any;
  setSelectedTask: (t: Task) => void;
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({
  timelineHeaders, renderList, taskRowMap, projectStart, dayWidth, rowHeight,
  showCriticalPath, baselineMap, selectedTask, projectTasks, calendar, ganttContainerRef,
  getStatusColor, handleMouseDown, setSelectedTask
}) => {
  return (
    <div ref={ganttContainerRef} className="flex-1 overflow-auto bg-slate-50 relative scrollbar-thin">
        <div style={{ width: `${timelineHeaders.days.length * dayWidth}px`, height: `${renderList.length * rowHeight + 100}px` }}>
            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 h-[50px] flex">
                {Array.from(timelineHeaders.months.entries()).map(([key, data]) => (
                    <div key={key} className="absolute top-0 border-r border-slate-200 text-xs font-bold text-slate-500 px-2 py-1 truncate bg-white" 
                        style={{ left: `${data.start}px`, width: `${data.width}px` }}>
                        {key}
                    </div>
                ))}
                <div className="flex pt-6">
                    {timelineHeaders.days.map((day) => (
                        // Rule 40: Identity-Stable Keys (using ISO string instead of index)
                        <div key={day.date.toISOString()} className={`flex-shrink-0 flex items-center justify-center text-[10px] text-slate-400 border-r border-slate-100 ${day.isWorking ? 'bg-white' : 'bg-slate-50'}`} 
                            style={{ width: `${dayWidth}px` }}>
                            {day.date.getDate()}
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative">
                {/* Grid Lines */}
                {timelineHeaders.days.map((day, i) => (
                    // Stable key for grid line
                    <div key={`grid-${day.date.toISOString()}`} className={`absolute top-0 bottom-0 border-r border-slate-100 ${day.isWorking ? '' : 'bg-slate-200/20'}`} 
                        style={{ left: `${(i + 1) * dayWidth}px`, height: '100%' }} />
                ))}

                {renderList.map((item: any, index: number) => {
                    if (item.type !== 'task') return null;
                    const offsetDays = getDaysDiff(projectStart, new Date(item.task.startDate));
                    const width = (item.task.duration || 1) * dayWidth;
                    const baselineData = baselineMap ? baselineMap[item.task.id] : null;

                    return (
                        <GanttTaskBar
                            key={item.task.id}
                            task={item.task}
                            rowIndex={index}
                            offsetDays={offsetDays}
                            width={width}
                            dayWidth={dayWidth}
                            rowHeight={rowHeight}
                            showCriticalPath={showCriticalPath}
                            getStatusColor={getStatusColor}
                            onMouseDown={handleMouseDown}
                            onSelect={setSelectedTask}
                            isSelected={selectedTask?.id === item.task.id}
                            // Visual comparison props
                            baselineStart={baselineData?.baselineStartDate}
                            baselineEnd={baselineData?.baselineEndDate}
                            projectStart={projectStart}
                        />
                    );
                })}

                <DependencyLines 
                    renderList={renderList}
                    taskRowMap={taskRowMap}
                    projectTasks={projectTasks}
                    projectStart={projectStart}
                    calendar={calendar}
                    timelineWidth={timelineHeaders.days.length * dayWidth}
                    dayWidth={dayWidth}
                    rowHeight={rowHeight}
                />
            </div>
        </div>
    </div>
  );
};
