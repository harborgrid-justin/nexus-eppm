
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useGantt, DAY_WIDTH } from '../../hooks/useGantt';
import { GanttTaskList } from '../scheduling/gantt/GanttTaskList';
import { GanttTimeline } from '../scheduling/gantt/GanttTimeline';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { Task, TaskStatus } from '../../types';
import { generateId } from '../../utils/formatters';
import { EmptyGrid } from '../common/EmptyGrid';
import { GanttChartSquare } from 'lucide-react';
import { ScheduleContextMenu } from './schedule/ScheduleContextMenu';
import { ScheduleHeader } from './schedule/ScheduleHeader';
import { ScheduleToolbar } from './schedule/ScheduleToolbar';
import { useGanttData } from '../../hooks/gantt/useGanttData';
import { useGanttCalendar } from '../../hooks/gantt/useGanttCalendar';

const ROW_HEIGHT = 44;

export const ProjectSchedulePage: React.FC = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { state, dispatch } = useData();
    const theme = useTheme();

    const activeProject = useMemo(() => 
        projectId ? state.projects.find(p => p.id === projectId) : state.projects[0], 
    [state.projects, projectId]);

    const {
        project, viewMode, setViewMode, selectedTask, setSelectedTask,
        showCriticalPath, setShowCriticalPath, activeBaselineId,
        setActiveBaselineId, expandedNodes, toggleNode, timelineHeaders, 
        projectStart, projectEnd, getStatusColor, handleMouseDown,
        isScheduling, runSchedule
    } = useGantt(activeProject);

    const [showTaskList, setShowTaskList] = useState(true);
    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(800);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; task: Task | null } | null>(null);

    // Hooks for data processing
    const { flatRenderList, taskRowMap } = useGanttData(project, expandedNodes);
    const projectCalendar = useGanttCalendar(project, state.calendars);

    const baselineMap = useMemo(() => {
        if (!activeBaselineId || !project || !project.baselines) return null;
        return project.baselines.find(b => b.id === activeBaselineId)?.taskBaselines || null;
    }, [activeBaselineId, project]);

    useEffect(() => {
        if (containerRef.current) setContainerHeight(containerRef.current.clientHeight);
        const handleResize = () => containerRef.current && setContainerHeight(containerRef.current.clientHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const { virtualItems, totalHeight, onScroll } = useVirtualScroll(scrollTop, {
        totalItems: flatRenderList.length, itemHeight: ROW_HEIGHT, containerHeight
    });

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const top = e.currentTarget.scrollTop;
        onScroll(top);
        setScrollTop(top);
        if (e.target === listRef.current && timelineRef.current) timelineRef.current.scrollTop = top;
        else if (e.target === timelineRef.current && listRef.current) listRef.current.scrollTop = top;
    };

    // --- Actions ---
    const handleAddActivity = () => {
        if (!project) return;
        const newTask: Task = {
            id: generateId('T'), name: 'New Activity', wbsCode: selectedTask?.wbsCode || '1',
            startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0],
            duration: 1, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [], critical: false,
            type: 'Task', effortType: 'Fixed Duration', assignments: []
        };
        dispatch({ type: 'PROJECT_UPDATE', payload: { projectId: project.id, updatedData: { tasks: [...project.tasks, newTask] } } });
        setContextMenu(null);
    };

    const handleDeleteTask = () => {
        if (!contextMenu?.task || !project) return;
        if (confirm(`Delete activity ${contextMenu.task.name}?`)) {
            dispatch({ type: 'PROJECT_UPDATE', payload: { projectId: project.id, updatedData: { tasks: project.tasks.filter(t => t.id !== contextMenu.task?.id) } } });
        }
        setContextMenu(null);
    };

    const handleAddRisk = () => {
         if (!contextMenu?.task) return;
         dispatch({ type: 'ADD_RISK', payload: { id: generateId('R'), projectId: project.id, description: `New threat for ${contextMenu.task.name}`, category: 'Schedule', status: 'Open', score: 9, linkedTaskId: contextMenu.task.id } });
         setContextMenu(null);
    };

    const handleAddIssue = () => {
        if (!contextMenu?.task) return;
        dispatch({ type: 'ADD_ISSUE', payload: { id: generateId('ISS'), projectId: project.id, priority: 'Medium', status: 'Open', description: `Impediment on ${contextMenu.task.name}`, activityId: contextMenu.task.id } });
        setContextMenu(null);
    };

    if (!activeProject && !state.projects.length) {
         return (
            <div className={`h-full flex items-center justify-center ${theme.colors.background}`}>
                <EmptyGrid title="Schedule View Empty" description="No projects available. Create a project to enable the CPM engine." actionLabel="Create Project" onAdd={() => navigate('/projectList?action=create')} icon={GanttChartSquare} />
            </div>
         );
    }

    return (
        <div className={`h-full flex flex-col ${theme.colors.background} relative`}>
            {contextMenu && (
                <ScheduleContextMenu 
                    contextMenu={contextMenu} onClose={() => setContextMenu(null)}
                    onAddActivity={handleAddActivity} onSelectTask={setSelectedTask}
                    onAddRisk={handleAddRisk} onAddIssue={handleAddIssue} onDeleteTask={handleDeleteTask}
                />
            )}

            <ScheduleHeader 
                projects={state.projects} activeProjectId={activeProject?.id || ''} 
                onProjectChange={(e) => navigate(`/schedule/${e.target.value}`)}
                onBack={() => navigate('/projectList')} viewMode={viewMode} setViewMode={setViewMode}
                runSchedule={runSchedule} isScheduling={isScheduling}
            />

            <ScheduleToolbar 
                showCriticalPath={showCriticalPath} setShowCriticalPath={setShowCriticalPath}
                activeBaselineId={activeBaselineId} setActiveBaselineId={setActiveBaselineId}
                baselines={project.baselines}
            />

            <div className="flex-1 flex overflow-hidden relative">
                <div ref={containerRef} className="flex-1 flex overflow-hidden relative nexus-empty-pattern" onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, task: null }); }}>
                     <GanttTaskList 
                        ref={listRef} renderList={flatRenderList} showTaskList={showTaskList} expandedNodes={expandedNodes}
                        selectedTask={selectedTask} toggleNode={toggleNode} setSelectedTask={setSelectedTask}
                        virtualItems={virtualItems} totalHeight={totalHeight} rowHeight={ROW_HEIGHT} onScroll={handleScroll}
                        onRowContextMenu={(e, task) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, task }); }}
                    />
                    <GanttTimeline 
                        ref={timelineRef} timelineHeaders={timelineHeaders} renderList={flatRenderList} taskRowMap={taskRowMap}
                        projectStart={projectStart} projectEnd={projectEnd} dayWidth={DAY_WIDTH} rowHeight={ROW_HEIGHT}
                        showCriticalPath={showCriticalPath} baselineMap={baselineMap} selectedTask={selectedTask}
                        projectTasks={project.tasks || []} calendar={projectCalendar} ganttContainerRef={{ current: null }} 
                        getStatusColor={getStatusColor} handleMouseDown={handleMouseDown} setSelectedTask={setSelectedTask}
                        virtualItems={virtualItems} totalHeight={totalHeight} onScroll={handleScroll}
                        onTimelineContextMenu={(e, task) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, task }); }}
                    />
                </div>
            </div>
            
            <div className={`h-8 ${theme.colors.surface} border-t ${theme.colors.border} flex items-center justify-between px-4 text-[10px] text-slate-500 font-medium z-40 select-none`}>
                 <div>Data Date: <span className="font-bold text-slate-800">{new Date().toLocaleDateString()}</span></div>
                 <div className="flex gap-4">
                     <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Critical: {project.tasks?.filter(t=>t.critical).length}</span>
                     <span>Total: {project.tasks?.length || 0}</span>
                 </div>
            </div>
        </div>
    );
};

export default ProjectSchedulePage;
