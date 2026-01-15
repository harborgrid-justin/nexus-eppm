
import React, { useState, useRef, useCallback, useMemo } from 'react';
import GanttToolbar from './scheduling/GanttToolbar';
import ResourceUsageProfile from './scheduling/ResourceUsageProfile';
import ScheduleLog from './scheduling/ScheduleLog';
import { List, X, Network } from 'lucide-react';
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
import { useContainerSize } from '../hooks/useContainerSize';
import { useNavigate } from 'react-router-dom';

const ROW_HEIGHT = 44;

const ProjectGantt: React.FC = () => {
  const { project: workspaceProject } = useProjectWorkspace();
  const { state } = useData();
  const theme = useTheme();
  const navigate = useNavigate();
  
  const {
    project, viewMode, setViewMode, selectedTask, setSelectedTask, isTraceLogicOpen,
    setIsTraceLogicOpen, showCriticalPath, setShowCriticalPath, activeBaselineId,
    setActiveBaselineId, showResources, setShowResources, expandedNodes, toggleNode,
    timelineHeaders, projectStart, projectEnd, getStatusColor, handleMouseDown,
    taskFilter, setTaskFilter, isScheduling, runSchedule, scheduleLog, scheduleStats,
    isLogOpen, setIsLogOpen, dataDate
  } = useGantt(workspaceProject);

  const [showTaskList, setShowTaskList] = useState(true);
  const { flatRenderList, taskRowMap } = useGanttData(project, expandedNodes);
  const projectCalendar = useGanttCalendar(project, state.calendars);
  const [scrollTop, setScrollTop] = useState(0);
  
  const { ref: containerRef, height: containerHeight } = useContainerSize();
  const listRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { virtualItems, totalHeight, onScroll } = useVirtualScroll(scrollTop, {
    totalItems: flatRenderList.length, 
    itemHeight: ROW_HEIGHT, 
    containerHeight: containerHeight || 600
  });

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const top = e.currentTarget.scrollTop;
    onScroll(top);
    setScrollTop(top);
    // Synced scrolling for List and Timeline panels
    if (e.target === listRef.current && timelineRef.current) timelineRef.current.scrollTop = top;
    else if (e.target === timelineRef.current && listRef.current) listRef.current.scrollTop = top;
  }, [onScroll]);

  const baselineMap = useMemo(() => {
    if (!activeBaselineId || !project.baselines) return null;
    return project.baselines.find(b => b.id === activeBaselineId)?.taskBaselines || null;
  }, [activeBaselineId, project.baselines]);

  return (
    <div className={`flex flex-col h-full bg-white rounded-2xl border ${theme.colors.border} shadow-sm overflow-hidden flex-1`}>
      <ScheduleLog isOpen={isLogOpen} onClose={() => setIsLogOpen(false)} log={scheduleLog} stats={scheduleStats} />
      <GanttToolbar 
        project={project} 
        viewMode={viewMode} setViewMode={setViewMode} 
        showCriticalPath={showCriticalPath} setShowCriticalPath={setShowCriticalPath} 
        activeBaselineId={activeBaselineId} setActiveBaselineId={setActiveBaselineId} 
        showResources={showResources} setShowResources={setShowResources} 
        onTraceLogic={() => setIsTraceLogicOpen(true)} isTaskSelected={!!selectedTask} 
        taskFilter={taskFilter} setTaskFilter={setTaskFilter} onSchedule={runSchedule} 
        isScheduling={isScheduling} onViewLog={() => setIsLogOpen(true)} dataDate={dataDate} 
      />
      
      {!project.tasks?.length ? (
          <EmptyGrid 
            title="Schedule Registry Neutral"
            description="The master schedule logic network is currently unpopulated for this project partition."
            icon={Network}
            onAdd={() => navigate('/dataExchange?view=import')} 
            actionLabel="Initialize Schedule"
          />
      ) : (
          <div className="flex flex-1 overflow-hidden relative flex-col">
            <button className={`md:hidden absolute bottom-20 left-4 z-30 p-3 ${theme.colors.primary} text-white rounded-full shadow-lg`} onClick={() => setShowTaskList(!showTaskList)}>{showTaskList ? <X size={20} /> : <List size={20} />}</button>
            
            <div ref={containerRef} className="flex flex-1 overflow-hidden relative bg-slate-50/20">
              <GanttTaskList 
                ref={listRef} 
                renderList={flatRenderList} 
                showTaskList={showTaskList} 
                expandedNodes={expandedNodes} 
                selectedTask={selectedTask} 
                toggleNode={toggleNode} 
                setSelectedTask={setSelectedTask} 
                virtualItems={virtualItems} 
                totalHeight={totalHeight} 
                rowHeight={ROW_HEIGHT} 
                onScroll={handleScroll} 
              />
              <GanttTimeline 
                ref={timelineRef} 
                timelineHeaders={timelineHeaders} 
                renderList={flatRenderList} 
                taskRowMap={taskRowMap} 
                projectStart={projectStart} 
                projectEnd={projectEnd} 
                dayWidth={DAY_WIDTH} 
                rowHeight={ROW_HEIGHT} 
                showCriticalPath={showCriticalPath} 
                baselineMap={baselineMap} 
                selectedTask={selectedTask} 
                projectTasks={project.tasks} 
                calendar={projectCalendar} 
                ganttContainerRef={containerRef} 
                getStatusColor={getStatusColor} 
                handleMouseDown={handleMouseDown} 
                setSelectedTask={setSelectedTask} 
                virtualItems={virtualItems} 
                totalHeight={totalHeight} 
                onScroll={handleScroll} 
              />
            </div>
            
            {showResources && <ResourceUsageProfile project={project} startDate={projectStart} endDate={projectEnd} />}
            
            <div className={`h-8 border-t ${theme.colors.border} bg-slate-900 text-white flex items-center px-4 justify-between text-[9px] font-black uppercase tracking-widest`}>
                <div className="flex gap-6">
                    <span>Baseline: {activeBaselineId || 'LATEST'}</span>
                    <span>Engine: NEXUS_CPM_v1.3</span>
                </div>
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div> {project.tasks.filter(t=>t.critical).length} Critical</span>
                    <span>Total: {project.tasks.length}</span>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default ProjectGantt;
