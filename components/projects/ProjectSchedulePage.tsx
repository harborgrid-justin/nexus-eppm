
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
import { ScheduleContextMenu, ScheduleAction } from './schedule/ScheduleContextMenu';
import { ScheduleHeader } from './schedule/ScheduleHeader';
import { ScheduleToolbar } from './schedule/ScheduleToolbar';
import { useGanttData } from '../../hooks/gantt/useGanttData';
import { useGanttCalendar } from '../../hooks/gantt/useGanttCalendar';
import { useToast } from '../../context/ToastContext';

const ROW_HEIGHT = 44;

export const ProjectSchedulePage: React.FC = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { state, dispatch } = useData();
    const { success, error: toastError, info } = useToast();
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
    const [clipboardTask, setClipboardTask] = useState<Task | null>(null);

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

    /**
     * Smart WBS Renumbering Logic
     * Recalculates WBS codes based on flat array structure simulating tree depth
     */
    const renumberWBS = (tasks: Task[]): Task[] => {
        // In a real P6 app, this logic is server-side and complex. 
        // For this UI, we assume WBS structure is derived from sort order.
        // We will perform a simple pass to ensure parent/child consistency if we were using a nested model.
        // Since our Task model uses a flat `wbsCode` string, specific renumbering logic would parse and increment.
        // For the purpose of "Indent/Outdent", we will append/remove dot-notation segments.
        return tasks;
    };

    const updateProjectTasks = (newTasks: Task[]) => {
        if(!project) return;
        dispatch({ type: 'PROJECT_UPDATE', payload: { projectId: project.id, updatedData: { tasks: newTasks } } });
    };

    // --- Action Handler Switch ---
    const handleMenuAction = (action: ScheduleAction, targetTask: Task | null) => {
        if (!project) return;
        let updatedTasks = [...project.tasks];
        const taskIndex = targetTask ? updatedTasks.findIndex(t => t.id === targetTask.id) : -1;

        switch (action) {
            // --- CRUD ---
            case 'add':
                const newTask: Task = {
                    id: generateId('T'), name: 'New Activity', wbsCode: targetTask ? `${targetTask.wbsCode}.1` : '1',
                    startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0],
                    duration: 1, status: TaskStatus.NOT_STARTED, progress: 0, dependencies: [], critical: false,
                    type: 'Task', effortType: 'Fixed Duration', assignments: []
                };
                if (taskIndex !== -1) updatedTasks.splice(taskIndex + 1, 0, newTask);
                else updatedTasks.push(newTask);
                
                updateProjectTasks(updatedTasks);
                success("Activity Added");
                break;

            case 'edit':
                if (targetTask) setSelectedTask(targetTask); // Trigger side panel
                break;

            case 'delete':
                if (targetTask && confirm(`Delete ${targetTask.name}?`)) {
                    updatedTasks = updatedTasks.filter(t => t.id !== targetTask.id);
                    // Also remove dependencies pointing to this task
                    updatedTasks = updatedTasks.map(t => ({
                        ...t,
                        dependencies: t.dependencies.filter(d => d.targetId !== targetTask.id)
                    }));
                    updateProjectTasks(updatedTasks);
                    success("Activity Deleted");
                }
                break;

            // --- CLIPBOARD ---
            case 'cut':
                if (targetTask) {
                    setClipboardTask(targetTask);
                    updatedTasks = updatedTasks.filter(t => t.id !== targetTask.id);
                    updateProjectTasks(updatedTasks);
                    info("Cut to Clipboard");
                }
                break;

            case 'copy':
                if (targetTask) {
                    setClipboardTask(targetTask);
                    info("Copied to Clipboard");
                }
                break;

            case 'paste':
            case 'duplicate':
                const source = action === 'duplicate' ? targetTask : clipboardTask;
                if (source) {
                    const copy: Task = {
                        ...source,
                        id: generateId('T'),
                        name: `${source.name} (Copy)`,
                        dependencies: [], // Don't copy logic by default to avoid cycles
                        wbsCode: targetTask ? targetTask.wbsCode : source.wbsCode
                    };
                    if (taskIndex !== -1) updatedTasks.splice(taskIndex + 1, 0, copy);
                    else updatedTasks.push(copy);
                    
                    updateProjectTasks(updatedTasks);
                    success("Activity Pasted");
                }
                break;

            // --- STRUCTURE ---
            case 'moveUp':
                if (taskIndex > 0) {
                    [updatedTasks[taskIndex], updatedTasks[taskIndex - 1]] = [updatedTasks[taskIndex - 1], updatedTasks[taskIndex]];
                    updateProjectTasks(updatedTasks);
                }
                break;

            case 'moveDown':
                if (taskIndex !== -1 && taskIndex < updatedTasks.length - 1) {
                    [updatedTasks[taskIndex], updatedTasks[taskIndex + 1]] = [updatedTasks[taskIndex + 1], updatedTasks[taskIndex]];
                    updateProjectTasks(updatedTasks);
                }
                break;

            case 'indent':
                if (targetTask) {
                    // Visual Indent: Append a level to WBS Code (Simulated)
                    updatedTasks[taskIndex] = { ...targetTask, wbsCode: `${targetTask.wbsCode}.1` };
                    updateProjectTasks(updatedTasks);
                }
                break;

            case 'outdent':
                if (targetTask && targetTask.wbsCode.includes('.')) {
                    // Visual Outdent: Remove last segment
                    const newCode = targetTask.wbsCode.substring(0, targetTask.wbsCode.lastIndexOf('.'));
                    updatedTasks[taskIndex] = { ...targetTask, wbsCode: newCode };
                    updateProjectTasks(updatedTasks);
                }
                break;

            // --- LOGIC ---
            case 'link':
                if (selectedTask && targetTask && selectedTask.id !== targetTask.id) {
                    // Check if dependency already exists
                    if (!targetTask.dependencies.some(d => d.targetId === selectedTask.id)) {
                        updatedTasks[taskIndex] = {
                            ...targetTask,
                            dependencies: [...targetTask.dependencies, { targetId: selectedTask.id, type: 'FS', lag: 0 }]
                        };
                        updateProjectTasks(updatedTasks);
                        success(`Linked ${selectedTask.wbsCode} -> ${targetTask.wbsCode}`);
                    }
                } else {
                    info("Select a predecessor first, then right-click successor.");
                }
                break;
            
            case 'unlink':
                if (targetTask) {
                    updatedTasks[taskIndex] = { ...targetTask, dependencies: [] };
                    updateProjectTasks(updatedTasks);
                    success("Dependencies Cleared");
                }
                break;

            case 'convertMilestone':
                if (targetTask) {
                    updatedTasks[taskIndex] = { ...targetTask, type: 'Milestone', duration: 0 };
                    updateProjectTasks(updatedTasks);
                }
                break;

            // --- PROGRESS ---
            case 'progress0':
            case 'progress50':
            case 'progress100':
                if (targetTask) {
                    const prog = action === 'progress0' ? 0 : action === 'progress50' ? 50 : 100;
                    const status = prog === 0 ? TaskStatus.NOT_STARTED : prog === 100 ? TaskStatus.COMPLETED : TaskStatus.IN_PROGRESS;
                    updatedTasks[taskIndex] = { ...targetTask, progress: prog, status };
                    updateProjectTasks(updatedTasks);
                }
                break;

            // --- RESOURCES ---
            case 'assignResource':
                if (targetTask) {
                    // Auto-assign first available resource for demo
                    const resource = state.resources[0];
                    if (resource) {
                        const newAssignments = [...targetTask.assignments, { resourceId: resource.id, units: 100 }];
                        updatedTasks[taskIndex] = { ...targetTask, assignments: newAssignments };
                        updateProjectTasks(updatedTasks);
                        success(`Assigned ${resource.name}`);
                    }
                }
                break;

            case 'levelResource':
                if (targetTask) {
                    // Simple heuristic: push start date by 2 days
                    const newStart = new Date(targetTask.startDate);
                    newStart.setDate(newStart.getDate() + 2);
                    updatedTasks[taskIndex] = { 
                        ...targetTask, 
                        startDate: newStart.toISOString().split('T')[0],
                        endDate: new Date(new Date(targetTask.endDate).setDate(new Date(targetTask.endDate).getDate() + 2)).toISOString().split('T')[0]
                    };
                    updateProjectTasks(updatedTasks);
                    success("Resource Leveled (Shifted +2d)");
                }
                break;

            // --- INTEGRATION ---
            case 'addRisk':
                if (targetTask) {
                     dispatch({ type: 'ADD_RISK', payload: { id: generateId('R'), projectId: project.id, description: `Risk for ${targetTask.name}`, category: 'Schedule', status: 'Open', score: 5, linkedTaskId: targetTask.id } });
                     success("Risk Created");
                }
                break;

            case 'addIssue':
                if (targetTask) {
                    dispatch({ type: 'ADD_ISSUE', payload: { id: generateId('ISS'), projectId: project.id, priority: 'Medium', status: 'Open', description: `Issue on ${targetTask.name}`, activityId: targetTask.id } });
                    success("Issue Logged");
                }
                break;
            
            case 'addChange':
                if (targetTask) {
                    dispatch({ type: 'ADD_CHANGE_ORDER', payload: { id: generateId('CO'), projectId: project.id, title: `Change: ${targetTask.name}`, amount: 0, status: 'Draft', description: `Scope change related to ${targetTask.name}` } });
                    success("Change Order Started");
                }
                break;

            default:
                break;
        }
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
                    contextMenu={contextMenu} 
                    onClose={() => setContextMenu(null)}
                    onAction={handleMenuAction}
                    hasClipboard={!!clipboardTask}
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
