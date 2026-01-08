
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import GanttToolbar from './scheduling/GanttToolbar';
import ResourceUsageProfile from './scheduling/ResourceUsageProfile';
import ScheduleLog from './scheduling/ScheduleLog';
import { List, X, Calendar } from 'lucide-react';
import { useGantt, DAY_WIDTH } from '../hooks/useGantt';
import { GanttTaskList } from './scheduling/gantt/GanttTaskList';
import { GanttTimeline } from './scheduling/gantt/GanttTimeline';
import { useTheme } from '../context/ThemeContext';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';
import { useVirtualScroll } from '../hooks/useVirtualScroll';
import { useData } from '../context/DataContext';
import { useGanttData } from '../hooks/gantt/useGanttData';
import { useGanttCalendar } from '../hooks/gantt/useGanttCalendar';
import { EmptyGrid } from './common/EmptyGrid';

const ROW_HEIGHT = 44;

const ProjectGantt: React.FC = () => {
  const { project: initialProject } = useProjectWorkspace();
  const { state } = useData();
  const theme = useTheme();
  
  const {
    project, viewMode, setViewMode, selectedTask, setSelectedTask, isTraceLogicOpen,
    setIsTraceLogicOpen, showCriticalPath, setShowCriticalPath, activeBaselineId,
    setActiveBaselineId, showResources, setShowResources, expandedNodes, toggleNode,
    timelineHeaders, projectStart, projectEnd, getStatusColor, handleMouseDown,
    taskFilter, setTaskFilter, isScheduling, runSchedule, scheduleLog, scheduleStats,
    isLogOpen, setIsLogOpen, dataDate
  } = useGantt(initialProject as any);

  const [showTaskList, setShowTaskList] = useState(true);
  const { flatRenderList, taskRowMap } = useGanttData(project, expandedNodes);
  const projectCalendar = useGanttCalendar(project, state.calendars);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(600);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) setContainerHeight(containerRef.current.clientHeight);
  }, []);

  const { virtualItems, totalHeight, onScroll } = useVirtualScroll(scrollTop, {
    totalItems: flatRenderList.length, itemHeight: ROW_HEIGHT, containerHeight
  });

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    onScroll(top);
    setScrollTop(top);
    if (e.target === listRef.current && timelineRef.current) timelineRef.current.scrollTop = top;
    else if (e.target === timelineRef.current && listRef.current) listRef.current.scrollTop = top;
  }, [onScroll]);

  const baselineMap = useMemo(() => {
    if (!activeBaselineId || !project.baselines) return null;
    return project.baselines.find(b => b.id === activeBaselineId)?.taskBaselines || null;
  }, [activeBaselineId, project.baselines]);

  const hasTasks = project.tasks && project.tasks.length > 0;

  return (
    <div className={`flex flex-col h-full ${theme.colors.surface} rounded-lg border ${theme.colors.border} shadow-sm flex-1`}>
      <ScheduleLog isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} log={scheduleLog} stats={scheduleStats} />
      <GanttToolbar project={project} viewMode={viewMode} setViewMode={setViewMode} showCriticalPath={showCriticalPath} setShowCriticalPath={setShowCriticalPath} activeBaselineId={activeBaselineId} setActiveBaselineId={setActiveBaselineId} showResources={showResources} setShowResources={setShowResources} onTraceLogic={() => setIsTraceLogicOpen(true)} isTaskSelected={!!selectedTask} taskFilter={taskFilter} setTaskFilter={setTaskFilter} onSchedule={runSchedule} isScheduling={isScheduling} onViewLog={() => setIsLogOpen(true)} dataDate={dataDate} />
      
      {!hasTasks ? (
          <EmptyGrid 
            title="Schedule Logic Missing"
            description="The master schedule currently has no activities. Import an XER file or manually add tasks to calculate the critical path."
            icon={Calendar}
            onAdd={() => {}} // CRUD action handled by toolbar or context menu normally
            actionLabel="Add First Task"
          />
      ) : (
          <div className="flex flex-1 overflow-hidden relative flex-col">
            <button className="md:hidden absolute bottom-20 left-4 z-30 p-3 bg-primary text-white rounded-full shadow-lg" onClick={() => setShowTaskList(!showTaskList)}>{showTaskList ? <X size={20} /> : <List size={20} />}</button>
            <div ref={containerRef} className="flex flex-1 overflow-hidden relative">
              <GanttTaskList ref={listRef} renderList={flatRenderList} showTaskList={showTaskList} expandedNodes={expandedNodes} selectedTask={selectedTask} toggleNode={toggleNode} setSelectedTask={setSelectedTask} virtualItems={virtualItems} totalHeight={totalHeight} rowHeight={ROW_HEIGHT} onScroll={handleScroll} />
              <GanttTimeline ref={timelineRef} timelineHeaders={timelineHeaders} renderList={flatRenderList} taskRowMap={taskRowMap} projectStart={projectStart} projectEnd={projectEnd} dayWidth={DAY_WIDTH} rowHeight={ROW_HEIGHT} showCriticalPath={showCriticalPath} baselineMap={baselineMap} selectedTask={selectedTask} projectTasks={project.tasks} calendar={projectCalendar} ganttContainerRef={containerRef} getStatusColor={getStatusColor} handleMouseDown={handleMouseDown} setSelectedTask={setSelectedTask} virtualItems={virtualItems} totalHeight={totalHeight} onScroll={handleScroll} />
            </div>
            {showResources && <ResourceUsageProfile project={project} startDate={projectStart} endDate={projectEnd} />}
          </div>
      )}
    </div>
  );
};
export default ProjectGantt;
