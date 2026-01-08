
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useGantt, DAY_WIDTH } from '../../hooks/useGantt';
import { GanttTaskList } from '../scheduling/gantt/GanttTaskList';
import { GanttTimeline } from '../scheduling/gantt/GanttTimeline';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { 
    Calendar, ZoomIn, ZoomOut, ChevronRight, 
    ArrowLeft, Filter, Play, Download, Search, Loader2, Plus,
    MoreVertical, UserPlus, ShieldAlert, AlertCircle, Trash2, Edit3,
    CheckCircle2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Task, TaskStatus } from '../../types';
import { generateId } from '../../utils/formatters';

const ROW_HEIGHT = 44;

export const ProjectSchedulePage: React.FC = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { state, dispatch } = useData();
    const theme = useTheme();

    const activeProject = useMemo(() => 
        projectId 
          ? state.projects.find(p => p.id === projectId) 
          : state.projects[0], 
    [state.projects, projectId]);

    const {
        project, viewMode, setViewMode, selectedTask, setSelectedTask,
        showCriticalPath, setShowCriticalPath, activeBaselineId,
        setActiveBaselineId, expandedNodes, toggleNode, timelineHeaders, 
        projectStart, projectEnd, getStatusColor, handleMouseDown,
        isScheduling, runSchedule
    } = useGantt(activeProject);

    // --- Layout & Scroll ---
    const [showTaskList, setShowTaskList] = useState(true);
    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(800);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    // --- Context Menu State ---
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; task: Task | null } | null>(null);

    const flatRenderList = useMemo(() => {
        if (!project || !project.tasks) return [];
        const list: any[] = [];
        const traverse = (nodes: any[], level: number) => {
            nodes.forEach(node => {
                list.push({ type: 'wbs', node, level });
                if (expandedNodes.has(node.id)) {
                    project.tasks.filter(t => t.wbsCode.startsWith(node.wbsCode) && t.wbsCode !== node.wbsCode)
                      .forEach(task => list.push({ type: 'task', task, level: level + 1 }));
                    traverse(node.children, level + 1);
                }
            });
        };
        if (project.wbs) traverse(project.wbs, 0);
        else if (project.tasks) {
            // Flat list if no WBS
            project.tasks.forEach(t => list.push({ type: 'task', task: t, level: 0 }));
        }
        return list;
    }, [project, expandedNodes]);

    const taskRowMap = useMemo(() => {
        const map = new Map<string, number>();
        flatRenderList.forEach((item, index) => { if (item.type === 'task') map.set(item.task.id, index); });
        return map;
    }, [flatRenderList]);

    const projectCalendar = useMemo(() => {
        if (!project) return { id: 'default', name: 'Standard', workingDays: [1,2,3,4,5], holidays: [] };
        const globalCal = state.calendars.find(c => c.id === project.calendarId) || state.calendars[0];
        if (!globalCal || !globalCal.workWeek) return { id: 'default', name: 'Standard', workingDays: [1,2,3,4,5], holidays: [] };
        const workingDays: number[] = [];
        const dayMap: Record<string, number> = { 'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6 };
        Object.entries(globalCal.workWeek).forEach(([dayName, workDay]) => { if ((workDay as any).isWorkDay) workingDays.push(dayMap[dayName.toLowerCase()]); });
        return { id: globalCal.id, name: globalCal.name, workingDays, holidays: globalCal.holidays ? globalCal.holidays.map(h => h.date) : [] };
    }, [project, state.calendars]);

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
        totalItems: flatRenderList.length,
        itemHeight: ROW_HEIGHT,
        containerHeight
    });

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const top = e.currentTarget.scrollTop;
        onScroll(top);
        setScrollTop(top);
        if (e.target === listRef.current && timelineRef.current) timelineRef.current.scrollTop = top;
        else if (e.target === timelineRef.current && listRef.current) listRef.current.scrollTop = top;
    };

    const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        navigate(`/schedule/${e.target.value}`);
    };

    // --- Context Menu Handlers ---
    const handleContextMenu = useCallback((e: React.MouseEvent, task: Task | null) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, task });
    }, []);

    const closeContextMenu = useCallback(() => {
        setContextMenu(null);
    }, []);

    useEffect(() => {
        const handleClick = () => closeContextMenu();
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [closeContextMenu]);

    // --- Action Implementations ---
    const handleAddActivity = () => {
        if (!project) return;
        const newTask: Task = {
            id: generateId('T'),
            name: 'New Activity',
            wbsCode: selectedTask?.wbsCode || '1',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            duration: 1,
            status: TaskStatus.NOT_STARTED,
            progress: 0,
            dependencies: [],
            critical: false,
            type: 'Task',
            effortType: 'Fixed Duration',
            assignments: []
        };
        const updatedTasks = [...project.tasks, newTask];
        dispatch({ type: 'PROJECT_UPDATE', payload: { projectId: project.id, updatedData: { tasks: updatedTasks } } });
        closeContextMenu();
    };

    const handleAddRisk = () => {
        if (!contextMenu?.task) return;
        const newRisk = {
            id: generateId('R'),
            projectId: project.id,
            description: `New threat identified for ${contextMenu.task.name}`,
            category: 'Schedule',
            status: 'Open',
            probabilityValue: 3,
            impactValue: 3,
            score: 9,
            ownerId: 'Unassigned',
            strategy: 'Mitigate',
            linkedTaskId: contextMenu.task.id,
            responseActions: []
        };
        dispatch({ type: 'ADD_RISK', payload: newRisk });
        closeContextMenu();
        alert("Risk registered and linked to task.");
    };

    const handleAddIssue = () => {
        if (!contextMenu?.task) return;
        const newIssue = {
            id: generateId('ISS'),
            projectId: project.id,
            priority: 'Medium',
            status: 'Open',
            description: `Impediment impacting ${contextMenu.task.name}`,
            assigneeId: 'Unassigned',
            dateIdentified: new Date().toISOString().split('T')[0],
            activityId: contextMenu.task.id
        };
        dispatch({ type: 'ADD_ISSUE', payload: newIssue });
        closeContextMenu();
        alert("Issue logged and linked to task.");
    };

    const handleDeleteTask = () => {
        if (!contextMenu?.task || !project) return;
        if (confirm(`Delete activity ${contextMenu.task.name}?`)) {
            const updatedTasks = project.tasks.filter(t => t.id !== contextMenu.task?.id);
            dispatch({ type: 'PROJECT_UPDATE', payload: { projectId: project.id, updatedData: { tasks: updatedTasks } } });
        }
        closeContextMenu();
    };

    if (!activeProject && !state.projects.length) {
         return (
            <div className={`h-full flex items-center justify-center ${theme.colors.background} text-slate-400`}>
                <div className="text-center p-8 bg-white border border-slate-200 rounded-xl shadow-sm max-w-md">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Calendar size={32} className="text-slate-300"/>
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No Projects Available</h3>
                    <p className="text-sm text-slate-500 mb-6">Create a project to start visualizing the master schedule and critical path.</p>
                    <Button onClick={() => navigate('/projectList?action=create')} icon={Plus}>Create Project</Button>
                </div>
            </div>
         );
    }

    return (
        <div className={`h-full flex flex-col ${theme.colors.background} relative`}>
            {/* Context Menu Component */}
            {contextMenu && (
                <div 
                    className="fixed z-[100] bg-white border border-slate-200 rounded-xl shadow-2xl w-56 py-2 overflow-hidden animate-in zoom-in-95 duration-100"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-4 py-2 border-b border-slate-100 mb-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{contextMenu.task ? contextMenu.task.wbsCode : 'Schedule Actions'}</p>
                        <p className="text-xs font-bold text-slate-700 truncate">{contextMenu.task ? contextMenu.task.name : 'New Element'}</p>
                    </div>
                    
                    <button onClick={handleAddActivity} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-nexus-50 hover:text-nexus-700 flex items-center gap-3 transition-colors">
                        <Plus size={14}/> Add Activity
                    </button>
                    
                    {contextMenu.task && (
                        <>
                            <button onClick={() => { setSelectedTask(contextMenu.task!); closeContextMenu(); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-nexus-50 hover:text-nexus-700 flex items-center gap-3 transition-colors">
                                <Edit3 size={14}/> Activity Detail
                            </button>
                            <div className="h-px bg-slate-100 my-1 mx-2"></div>
                            <button onClick={handleAddRisk} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-nexus-50 hover:text-nexus-700 flex items-center gap-3 transition-colors">
                                <ShieldAlert size={14} className="text-orange-500"/> Assign Risk Link
                            </button>
                            <button onClick={handleAddIssue} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-nexus-50 hover:text-nexus-700 flex items-center gap-3 transition-colors">
                                <AlertCircle size={14} className="text-yellow-500"/> Log Issue Link
                            </button>
                            <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-nexus-50 hover:text-nexus-700 flex items-center gap-3 transition-colors">
                                <UserPlus size={14}/> Assign Resource
                            </button>
                            <div className="h-px bg-slate-100 my-1 mx-2"></div>
                            <button onClick={handleDeleteTask} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors">
                                <Trash2 size={14}/> Delete Activity
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Immersive Header */}
            <div className={`h-16 ${theme.colors.surface} border-b ${theme.colors.border} flex items-center justify-between px-6 shadow-sm z-40`}>
                <div className="flex items-center gap-4 min-w-0 flex-1">
                    <button onClick={() => navigate('/projectList')} className={`p-2 rounded-full hover:bg-slate-100 text-slate-500`}>
                        <ArrowLeft size={20} />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-lg font-black text-slate-900 flex items-center gap-2 truncate">
                            <Calendar className="text-nexus-600 shrink-0" size={20}/> Master Schedule
                        </h1>
                        <p className="text-xs text-slate-500 truncate hidden sm:block">Real-time Critical Path Method (CPM) Explorer</p>
                    </div>
                    <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
                    <select 
                        className={`hidden md:block bg-slate-50 border ${theme.colors.border} text-sm font-bold text-slate-700 rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-nexus-500 outline-none w-64`}
                        value={activeProject.id}
                        onChange={handleProjectChange}
                    >
                        {state.projects.map(p => (
                            <option key={p.id} value={p.id}>{p.code}: {p.name}</option>
                        ))}
                    </select>
                </div>
                
                <div className="flex items-center gap-3 shrink-0 ml-4">
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        {['day', 'week', 'month'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode as any)}
                                className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${viewMode === mode ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" icon={Download} className="hidden sm:flex">Export</Button>
                    <Button onClick={runSchedule} isLoading={isScheduling} icon={Play} size="sm">Schedule (F9)</Button>
                </div>
            </div>

            {/* Config Bar */}
            <div className={`h-12 bg-slate-50 border-b ${theme.colors.border} flex items-center px-6 gap-4 z-30 shrink-0 overflow-x-auto scrollbar-hide`}>
                <div className="flex items-center gap-2 relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input className="pl-9 pr-4 py-1.5 text-xs border border-slate-300 rounded-md w-48 focus:ring-1 focus:ring-nexus-500 outline-none" placeholder="Search tasks..." />
                </div>
                <div className="h-6 w-px bg-slate-300"></div>
                <button 
                    onClick={() => setShowCriticalPath(!showCriticalPath)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[10px] uppercase font-black tracking-widest transition-colors whitespace-nowrap ${showCriticalPath ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-white border border-slate-300 text-slate-600'}`}
                >
                    <div className={`w-2 h-2 rounded-full ${showCriticalPath ? 'bg-red-600' : 'bg-slate-400'}`}></div> Critical Path
                </button>
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Baseline:</span>
                    <select 
                        className="text-[10px] font-bold border border-slate-300 rounded py-1 px-2 bg-white outline-none focus:ring-1 focus:ring-nexus-500"
                        value={activeBaselineId || ''}
                        onChange={(e) => setActiveBaselineId(e.target.value)}
                    >
                        <option value="">None</option>
                        {project.baselines?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
                <div className="ml-auto flex items-center gap-3">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-green-500"/> Sched OK
                     </span>
                </div>
            </div>

            {/* Gantt Canvas */}
            <div className="flex-1 flex overflow-hidden relative">
                <div 
                    ref={containerRef} 
                    className="flex-1 flex overflow-hidden relative nexus-empty-pattern"
                    onContextMenu={(e) => handleContextMenu(e, null)}
                >
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
                        onRowContextMenu={handleContextMenu}
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
                        projectTasks={project.tasks || []} 
                        calendar={projectCalendar} 
                        ganttContainerRef={{ current: null }} 
                        getStatusColor={getStatusColor} 
                        handleMouseDown={handleMouseDown} 
                        setSelectedTask={setSelectedTask}
                        virtualItems={virtualItems}
                        totalHeight={totalHeight}
                        onScroll={handleScroll}
                        onTimelineContextMenu={handleContextMenu}
                    />
                </div>
            </div>
            
            {/* Status Footer */}
            <div className={`h-8 ${theme.colors.surface} border-t ${theme.colors.border} flex items-center justify-between px-4 text-[10px] text-slate-500 font-medium z-40 select-none`}>
                 <div>Data Date: <span className="font-bold text-slate-800">{new Date().toLocaleDateString()}</span></div>
                 <div className="flex gap-4">
                     <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500"></div> Critical: {project.tasks?.filter(t=>t.critical).length}</span>
                     <span>Total Activities: {project.tasks?.length || 0}</span>
                     <span className="hidden sm:inline">Remaining: {project.tasks?.reduce((sum, t) => sum + (t.status !== 'Completed' ? t.duration : 0), 0) || 0}d</span>
                 </div>
            </div>
        </div>
    );
};

export default ProjectSchedulePage;
