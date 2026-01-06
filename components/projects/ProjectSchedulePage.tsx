
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useGantt, DAY_WIDTH } from '../../hooks/useGantt';
import { GanttTaskList } from '../scheduling/gantt/GanttTaskList';
import { GanttTimeline } from '../scheduling/gantt/GanttTimeline';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { 
    Calendar, ZoomIn, ZoomOut, ChevronRight, 
    ArrowLeft, Filter, Play, Download, Search, Loader2, Plus
} from 'lucide-react';
import { Button } from '../ui/Button';

const ROW_HEIGHT = 44;

const ProjectSchedulePage: React.FC = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { state } = useData();
    const theme = useTheme();

    // Default to first project if no ID provided in URL, or handle specific ID
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

    // --- Template Logic Adaptation ---
    const [showTaskList, setShowTaskList] = useState(true);
    const [scrollTop, setScrollTop] = useState(0);
    const [containerHeight, setContainerHeight] = useState(800);
    
    // Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);

    // Flatten WBS for Virtualization (same logic as ProjectGantt)
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
        return list;
    }, [project, expandedNodes]);

    const taskRowMap = useMemo(() => {
        const map = new Map<string, number>();
        flatRenderList.forEach((item, index) => { if (item.type === 'task') map.set(item.task.id, index); });
        return map;
    }, [flatRenderList]);

    // Calendar & Baseline Resolution
    const projectCalendar = useMemo(() => {
        if (!project) return { id: 'default', name: 'Standard', workingDays: [1,2,3,4,5], holidays: [] };
        
        const globalCal = state.calendars.find(c => c.id === project.calendarId) || state.calendars[0];
        
        if (!globalCal || !globalCal.workWeek) {
            return { id: 'default', name: 'Standard', workingDays: [1,2,3,4,5], holidays: [] };
        }

        const workingDays: number[] = [];
        const dayMap: Record<string, number> = { 'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3, 'thursday': 4, 'friday': 5, 'saturday': 6 };
        Object.entries(globalCal.workWeek).forEach(([dayName, workDay]) => {
            if ((workDay as any).isWorkDay) workingDays.push(dayMap[dayName.toLowerCase()]);
        });
        return { 
            id: globalCal.id, 
            name: globalCal.name, 
            workingDays, 
            holidays: globalCal.holidays ? globalCal.holidays.map(h => h.date) : [] 
        };
    }, [project, state.calendars]);

    const baselineMap = useMemo(() => {
        if (!activeBaselineId || !project || !project.baselines) return null;
        return project.baselines.find(b => b.id === activeBaselineId)?.taskBaselines || null;
    }, [activeBaselineId, project]);

    // Virtual Scroll Hook
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
    
    if (!activeProject) {
         return (
            <div className={`h-full flex items-center justify-center ${theme.colors.background} text-slate-400`}>
                <div className="text-center">
                    <p>Project not found.</p>
                    <Button variant="secondary" onClick={() => navigate('/projectList')} className="mt-4">Back to Projects</Button>
                </div>
            </div>
         );
    }

    return (
        <div className={`h-full flex flex-col ${theme.colors.background}`}>
            {/* Immersive Header */}
            <div className={`h-16 ${theme.colors.surface} border-b ${theme.colors.border} flex items-center justify-between px-6 shadow-sm z-40`}>
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/projectList')} className={`p-2 rounded-full hover:bg-slate-100 text-slate-500`}>
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg font-black text-slate-900 flex items-center gap-2">
                            <Calendar className="text-nexus-600" size={20}/> Master Schedule View
                        </h1>
                        <p className="text-xs text-slate-500">Full-screen Gantt visualization</p>
                    </div>
                    <div className="h-8 w-px bg-slate-200 mx-2"></div>
                    <select 
                        className={`bg-slate-50 border ${theme.colors.border} text-sm font-bold text-slate-700 rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-nexus-500 outline-none w-64`}
                        value={activeProject.id}
                        onChange={handleProjectChange}
                    >
                        {state.projects.map(p => (
                            <option key={p.id} value={p.id}>{p.code}: {p.name}</option>
                        ))}
                    </select>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        {['day', 'week', 'month'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setViewMode(mode as any)}
                                className={`px-3 py-1.5 text-xs font-bold uppercase rounded-md transition-all ${viewMode === mode ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-900'}`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" size="sm" icon={Download}>Export</Button>
                    <Button onClick={runSchedule} isLoading={isScheduling} icon={Play}>Run Schedule</Button>
                </div>
            </div>

            {/* Filter / Config Bar */}
            <div className={`h-12 bg-slate-50 border-b ${theme.colors.border} flex items-center px-6 gap-4 z-30`}>
                <div className="flex items-center gap-2 relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input className="pl-9 pr-4 py-1.5 text-xs border border-slate-300 rounded-md w-64" placeholder="Filter activities..." />
                </div>
                <div className="h-6 w-px bg-slate-300"></div>
                <button 
                    onClick={() => setShowCriticalPath(!showCriticalPath)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${showCriticalPath ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-white border border-slate-300 text-slate-600'}`}
                >
                    <div className={`w-2 h-2 rounded-full ${showCriticalPath ? 'bg-red-600' : 'bg-slate-400'}`}></div> Critical Path
                </button>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Baseline:</span>
                    <select 
                        className="text-xs border border-slate-300 rounded py-1 px-2 bg-white"
                        value={activeBaselineId || ''}
                        onChange={(e) => setActiveBaselineId(e.target.value)}
                    >
                        <option value="">None</option>
                        {project.baselines?.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Gantt Canvas */}
            <div className="flex-1 flex overflow-hidden relative">
                <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
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
                        projectTasks={project.tasks || []} 
                        calendar={projectCalendar} 
                        ganttContainerRef={{ current: null }} // No drag in view-only mode for now
                        getStatusColor={getStatusColor} 
                        handleMouseDown={handleMouseDown} 
                        setSelectedTask={setSelectedTask}
                        virtualItems={virtualItems}
                        totalHeight={totalHeight}
                        onScroll={handleScroll}
                    />
                </div>
            </div>
            
            {/* Status Footer */}
            <div className={`h-8 ${theme.colors.surface} border-t ${theme.colors.border} flex items-center justify-between px-4 text-[10px] text-slate-500 font-medium z-40`}>
                 <div>Data Date: <span className="font-bold text-slate-800">{new Date().toLocaleDateString()}</span></div>
                 <div className="flex gap-4">
                     <span>Total Activities: {project.tasks?.length || 0}</span>
                     <span>Remaining Duration: {project.tasks?.reduce((sum, t) => sum + (t.status !== 'Completed' ? t.duration : 0), 0) || 0}d</span>
                 </div>
            </div>
        </div>
    );
};

export default ProjectSchedulePage;
