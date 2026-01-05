
import React, { forwardRef } from 'react';
import { Task, TaskStatus, ProjectCalendar, WBSNode } from '../../../types';
import GanttTaskBar from '../GanttTaskBar';
import DependencyLines from '../DependencyLines';
import { getDaysDiff } from '../../../utils/dateUtils';

interface TimelineHeaders {
    months: Map<string, { start: number, width: number }>;
    days: { date: Date; isWorking: boolean }[];
}

interface RenderItemWBS {
    type: 'wbs';
    node: WBSNode;
    level: number;
}

interface RenderItemTask {
    type: 'task';
    task: Task;
    level: number;
}

type RenderItem = RenderItemWBS | RenderItemTask;

interface GanttTimelineProps {
  timelineHeaders: TimelineHeaders;
  renderList: RenderItem[];
  taskRowMap: Map<string, number>;
  projectStart: Date;
  projectEnd: Date;
  dayWidth: number;
  rowHeight: number;
  showCriticalPath: boolean;
  baselineMap: Record<string, any> | null;
  selectedTask: Task | null;
  projectTasks: Task[];
  calendar: ProjectCalendar; // Updated from 'any' to strict type
  ganttContainerRef: React.RefObject<HTMLDivElement>;
  getStatusColor: (s: TaskStatus) => string;
  handleMouseDown: (e: React.MouseEvent, task: Task, type: 'move' | 'resize-start' | 'resize-end' | 'progress') => void;
  setSelectedTask: (t: Task) => void;
  virtualItems: { index: number; offsetTop: number }[];
  totalHeight: number;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
}

export const GanttTimeline = forwardRef<HTMLDivElement, GanttTimelineProps>(({
  timelineHeaders, renderList, taskRowMap, projectStart, dayWidth, rowHeight,
  showCriticalPath, baselineMap, selectedTask, projectTasks, calendar, ganttContainerRef,
  getStatusColor, handleMouseDown, setSelectedTask, virtualItems, totalHeight, onScroll
}, ref) => {
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    onScroll(e);
  };

  return (
    <div 
        ref={ref} 
        className="flex-1 overflow-auto bg-slate-50 relative scrollbar-thin will-change-transform"
        onScroll={handleScroll}
        style={{ contain: 'strict' }}
    >
        <div style={{ width: `${timelineHeaders.days.length * dayWidth}px`, height: `${totalHeight + 100}px` }}>
            {/* Header Sticky */}
            <div className="sticky top-0 z-20 bg-white border-b border-slate-200 h-[50px] flex shadow-sm will-change-transform">
                {Array.from(timelineHeaders.months.entries()).map(([key, data]) => (
                    <div key={key} className="absolute top-0 border-r border-slate-200 text-xs font-bold text-slate-500 px-2 py-1 truncate bg-white" 
                        style={{ left: `${data.start}px`, width: `${data.width}px` }}>
                        {key}
                    </div>
                ))}
                <div className="flex pt-6">
                    {timelineHeaders.days.map((day) => (
                        <div key={day.date.toISOString()} className={`flex-shrink-0 flex items-center justify-center text-[10px] text-slate-400 border-r border-slate-100 ${day.isWorking ? 'bg-white' : 'bg-slate-50'}`} 
                            style={{ width: `${dayWidth}px` }}>
                            {day.date.getDate()}
                        </div>
                    ))}
                </div>
            </div>

            {/* Virtualized Body */}
            <div className="relative">
                <div 
                    className="absolute inset-0 pointer-events-none" 
                    style={{ 
                        height: `${totalHeight}px`,
                        backgroundImage: `linear-gradient(to right, #f1f5f9 1px, transparent 1px)`,
                        backgroundSize: `${dayWidth}px 100%`,
                        zIndex: 0
                    }} 
                />

                {virtualItems.map(({ index, offsetTop }) => {
                    const item = renderList[index];
                    if (!item || item.type !== 'task') return null;
                    
                    const offsetDays = getDaysDiff(projectStart, new Date(item.task.startDate));
                    const width = (item.task.duration || 1) * dayWidth;
                    const baselineData = baselineMap ? baselineMap[item.task.id] : null;

                    return (
                        <div key={item.task.id} style={{ transform: `translateY(${offsetTop}px)`, position: 'absolute', width: '100%', height: `${rowHeight}px`, top: 0, left: 0, willChange: 'transform' }}>
                            <GanttTaskBar
                                task={item.task}
                                rowIndex={0} 
                                offsetDays={offsetDays}
                                width={width}
                                dayWidth={dayWidth}
                                rowHeight={rowHeight}
                                showCriticalPath={showCriticalPath}
                                getStatusColor={getStatusColor}
                                onMouseDown={handleMouseDown}
                                onSelect={setSelectedTask}
                                isSelected={selectedTask?.id === item.task.id}
                                baselineStart={baselineData?.baselineStartDate}
                                baselineEnd={baselineData?.baselineEndDate}
                                projectStart={projectStart}
                            />
                        </div>
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
});

GanttTimeline.displayName = 'GanttTimeline';
