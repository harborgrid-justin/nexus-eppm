
import React, { forwardRef } from 'react';
import { Task, TaskStatus, ProjectCalendar, WBSNode } from '../../../types/index';
import GanttTaskBar from '../GanttTaskBar';
import DependencyLines from '../DependencyLines';
import { getDaysDiff } from '../../../utils/dateUtils';
import { useTheme } from '../../../context/ThemeContext';
import { useGanttLink } from '../../../hooks/gantt/useGanttLink';

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
  calendar: ProjectCalendar; 
  ganttContainerRef: React.RefObject<HTMLDivElement>;
  getStatusColor: (s: TaskStatus) => string;
  handleMouseDown: (e: React.MouseEvent, task: Task, type: 'move' | 'resize-start' | 'resize-end' | 'progress') => void;
  setSelectedTask: (t: Task) => void;
  virtualItems: { index: number; offsetTop: number }[];
  totalHeight: number;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  onTimelineContextMenu?: (e: React.MouseEvent, task: Task | null) => void;
}

export const GanttTimeline = forwardRef<HTMLDivElement, GanttTimelineProps>(({
  timelineHeaders, renderList, taskRowMap, projectStart, dayWidth, rowHeight,
  showCriticalPath, baselineMap, selectedTask, projectTasks, calendar, ganttContainerRef,
  getStatusColor, handleMouseDown, setSelectedTask, virtualItems, totalHeight, onScroll,
  onTimelineContextMenu
}, ref) => {
  const theme = useTheme();
  
  // Initialize Linking Logic
  const { draftLink, handleLinkStart, handleLinkHoverTask } = useGanttLink(
      { id: 'PROJ', tasks: projectTasks } as any, // Minimal project obj
      projectStart,
      dayWidth,
      rowHeight,
      taskRowMap,
      ganttContainerRef
  );

  // Calculate Today Line Position
  const today = new Date();
  const todayOffset = getDaysDiff(projectStart, today);
  const todayLeft = todayOffset * dayWidth + (dayWidth / 2);
  const showToday = todayOffset >= 0;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    onScroll(e);
  };

  const totalWidth = timelineHeaders.days.length * dayWidth;

  return (
    <div 
        ref={ref} 
        className={`flex-1 overflow-auto bg-white relative scrollbar-thin will-change-transform ${draftLink ? 'cursor-crosshair' : ''}`}
        onScroll={handleScroll}
        onContextMenu={(e) => onTimelineContextMenu?.(e, null)}
        style={{ contain: 'strict' }}
    >
        <div style={{ width: `${totalWidth}px`, height: `${totalHeight + 60}px`, position: 'relative' }}>
            
            {/* --- 1. HEADER SECTION (Sticky) --- */}
            <div className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm h-[56px]">
                {/* Month Row */}
                <div className="h-7 relative border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none overflow-hidden">
                    {Array.from(timelineHeaders.months.entries()).map(([key, data]) => (
                        <div key={key} className="absolute top-0 bottom-0 border-r border-slate-200 px-2 flex items-center whitespace-nowrap overflow-hidden"
                            style={{ left: `${data.start}px`, width: `${data.width}px` }}>
                            {key}
                        </div>
                    ))}
                </div>
                {/* Day Row */}
                <div className="h-7 flex">
                    {timelineHeaders.days.map((day, idx) => (
                        <div 
                            key={idx} 
                            className={`flex-shrink-0 flex flex-col items-center justify-center text-[10px] border-r border-slate-100 select-none ${
                                !day.isWorking ? 'bg-slate-100/50 text-slate-400' : 'bg-white text-slate-700'
                            }`} 
                            style={{ width: `${dayWidth}px` }}
                        >
                            <span className="font-bold">{day.date.getDate()}</span>
                            {dayWidth > 30 && <span className="text-[8px] opacity-60 font-normal">{day.date.toLocaleDateString('en-US', {weekday: 'narrow'})}</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* --- 2. BACKGROUND GRID (Full Height) --- */}
            <div className="absolute top-[56px] bottom-0 left-0 right-0 z-0 flex pointer-events-none">
                 {timelineHeaders.days.map((day, idx) => (
                    <div 
                        key={idx} 
                        className={`flex-shrink-0 border-r border-slate-100 h-full ${!day.isWorking ? 'bg-slate-50/60 pattern-diagonal-lines' : ''}`}
                        style={{ width: `${dayWidth}px` }}
                    />
                 ))}
            </div>

            {/* --- 3. TODAY LINE --- */}
            {showToday && (
                <div 
                    className="absolute top-[56px] bottom-0 w-px bg-red-500 z-10 pointer-events-none"
                    style={{ left: `${todayLeft}px` }}
                >
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-red-500 rounded-full shadow-sm"></div>
                </div>
            )}

            {/* --- 4. DEPENDENCY LINES & RUBBER BAND --- */}
            <div className="absolute top-[56px] left-0 w-full pointer-events-none z-10">
                <DependencyLines 
                    renderList={renderList}
                    taskRowMap={taskRowMap}
                    projectTasks={projectTasks}
                    projectStart={projectStart}
                    calendar={calendar}
                    timelineWidth={totalWidth}
                    dayWidth={dayWidth}
                    rowHeight={rowHeight}
                    draftLink={draftLink}
                />
            </div>

            {/* --- 5. TASK BARS (Virtualized) --- */}
            <div className="relative z-20 top-[0px]"> 
                {virtualItems.map(({ index, offsetTop }) => {
                    const item = renderList[index];
                    if (!item || item.type !== 'task') return null;
                    
                    const offsetDays = getDaysDiff(projectStart, new Date(item.task.startDate));
                    const width = Math.max(item.task.duration * dayWidth, 2); 
                    const baselineData = baselineMap ? baselineMap[item.task.id] : null;

                    return (
                        <div 
                            key={item.task.id} 
                            style={{ 
                                transform: `translateY(${offsetTop + 56}px)`,
                                position: 'absolute', 
                                width: '100%', 
                                height: `${rowHeight}px`, 
                                top: 0, 
                                left: 0,
                                borderBottom: '1px solid transparent' 
                            }}
                            className="hover:bg-blue-50/30 transition-colors"
                            onContextMenu={(e) => { e.stopPropagation(); onTimelineContextMenu?.(e, item.task); }}
                        >
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
                                
                                // Linking Handlers
                                isLinking={!!draftLink}
                                onLinkStart={handleLinkStart}
                                onLinkEnter={handleLinkHoverTask}
                                onLinkLeave={() => { /* Optional: Clear target highlight */ }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
});

GanttTimeline.displayName = 'GanttTimeline';
