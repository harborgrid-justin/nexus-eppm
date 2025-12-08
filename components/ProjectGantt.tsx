import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { Project, Task, TaskStatus, WBSNode } from '../types';
import TaskDetailModal from './TaskDetailModal';
import { useData } from '../context/DataContext';
import GanttToolbar from './scheduling/GanttToolbar';
import ResourceUsageView from './scheduling/ResourceUsageView';
import { calculateCriticalPath } from '../utils/scheduling';
import { toISODateString, addWorkingDays, getWorkingDaysDiff } from '../utils/dateUtils';
import { Diamond, AlertTriangle, CheckCircle2, Circle, Clock, ChevronRight, ChevronDown, GripVertical } from 'lucide-react';

interface ProjectGanttProps {
  project: Project;
}

const ROW_HEIGHT = 44;
const DAY_WIDTH = 28;

const GanttTaskRow: React.FC<{
  task: Task;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
  onSelect: () => void;
  hasChildren: boolean;
  isCritical: boolean;
  showCriticalPath: boolean;
}> = ({ task, level, isExpanded, onToggle, onSelect, hasChildren, isCritical, showCriticalPath }) => {
  return (
    <div 
      onClick={onSelect}
      className="group h-[44px] flex items-center px-4 border-b border-slate-100 hover:bg-slate-50 text-sm cursor-pointer"
      style={{ paddingLeft: `${level * 20 + 16}px` }}
    >
      <div className="flex-1 font-medium text-slate-700 truncate pr-2 flex items-center gap-2 group-hover:text-nexus-600 transition-colors">
        {hasChildren ? (
          <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className="p-1 -ml-6 mr-1">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        ) : (
          <div className="w-6 h-6 -ml-6 mr-1"></div>
        )}
        {task.type === 'Milestone' ? <Diamond size={10} className="text-nexus-600 fill-current" /> : (showCriticalPath && isCritical) && <span className="w-1.5 h-1.5 rounded-full bg-red-500" title="Critical Path"></span>}
        <span className="font-mono text-xs text-slate-500 w-16">{task.wbsCode}</span>
        {task.name}
      </div>
      <div className="w-20 text-center text-slate-500">{task.duration > 0 ? `${task.duration}d` : '-'}</div>
    </div>
  );
};

const ProjectGantt: React.FC<ProjectGanttProps> = ({ project: initialProject }) => {
  const { dispatch } = useData();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCriticalPath, setShowCriticalPath] = useState(true);
  const [activeBaselineId, setActiveBaselineId] = useState<string | null>(initialProject.baselines?.[0]?.id || null);
  const [showResources, setShowResources] = useState(false);
  
  const ganttContainerRef = useRef<HTMLDivElement>(null);
  const [draggingTask, setDraggingTask] = useState<{ task: Task, startX: number, type: 'move' | 'resize-end' | 'progress' } | null>(null);
  const [linkCreation, setLinkCreation] = useState<{ fromTask: Task, fromHandle: 'start' | 'end' } | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(initialProject.wbs?.map(w => w.id) || []));

  const project = useMemo(() => {
    if (!initialProject.calendar) return initialProject;
    const tasksWithCriticalPath = calculateCriticalPath(initialProject.tasks, initialProject.calendar);
    return { ...initialProject, tasks: tasksWithCriticalPath };
  }, [initialProject]);
  
  const { flattenedTasks, taskWbsMap } = useMemo(() => {
    const taskMap = new Map(project.tasks.map(t => [t.id, t]));
    const wbsMap = new Map<string, WBSNode>();
    const taskWbsMap = new Map<string, WBSNode>();

    const traverseWbs = (nodes: WBSNode[], parent: WBSNode | null) => {
      nodes.forEach(node => {
        wbsMap.set(node.id, node);
        project.tasks.forEach(task => {
            if (task.wbsCode === node.wbsCode) {
                taskWbsMap.set(task.id, node);
            }
        });
        if(node.children) traverseWbs(node.children, node);
      });
    };
    if (project.wbs) traverseWbs(project.wbs, null);

    const flattened: { task: Task; level: number; hasChildren: boolean }[] = [];
    const buildFlat = (wbsNodes: WBSNode[], level: number) => {
        wbsNodes.forEach(node => {
            if (expandedNodes.has(node.id)) {
                const childTasks = project.tasks.filter(t => t.wbsCode === node.wbsCode);
                childTasks.forEach(t => flattened.push({task: t, level, hasChildren: false}))
                if(node.children) {
                    buildFlat(node.children, level + 1);
                }
            }
        });
    };
    if(project.wbs) buildFlat(project.wbs, 0);

    return { flattenedTasks: flattened, taskWbsMap };

  }, [project.tasks, project.wbs, expandedNodes]);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) newSet.delete(nodeId);
      else newSet.add(nodeId);
      return newSet;
    });
  };

  const projectStart = useMemo(() => {
      const minDate = new Date(project.tasks.reduce((min, t) => t.startDate < min ? t.startDate : min, project.tasks[0]?.startDate || new Date().toISOString()));
      minDate.setDate(minDate.getDate() - 7);
      return minDate;
  }, [project.tasks]);

  const projectEnd = useMemo(() => {
      const maxDate = new Date(project.tasks.reduce((max, t) => t.endDate > max ? t.endDate : max, project.tasks[0]?.endDate || new Date().toISOString()));
      maxDate.setDate(maxDate.getDate() + 30);
      return maxDate;
  }, [project.tasks]);

  const totalDays = getWorkingDaysDiff(projectStart, projectEnd, project.calendar!);
  
  const timelineHeaders = useMemo(() => {
    const headers = { months: new Map<string, { start: number, width: number }>(), days: [] as any[] };
    let current = new Date(projectStart);
    let dayIndex = 0;
    while (current <= projectEnd) {
        const isWorking = project.calendar?.workingDays.includes(current.getDay());
        const monthYear = current.toLocaleString('default', { month: 'long', year: 'numeric' });
        if(!headers.months.has(monthYear)){
            headers.months.set(monthYear, { start: dayIndex * DAY_WIDTH, width: 0 });
        }
        headers.months.get(monthYear)!.width += DAY_WIDTH;

        headers.days.push({ date: new Date(current), isWorking });
        current.setDate(current.getDate() + 1);
        if(isWorking) dayIndex++;
    }
    return headers;
  }, [projectStart, projectEnd, viewMode, project.calendar]);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED: return 'bg-green-500 border-green-600';
      case TaskStatus.IN_PROGRESS: return 'bg-blue-500 border-blue-600';
      case TaskStatus.DELAYED: return 'bg-red-500 border-red-600';
      default: return 'bg-slate-400 border-slate-500';
    }
  };

  const handleMouseDown = (e: React.MouseEvent, task: Task, type: 'move' | 'resize-end' | 'progress') => {
    e.stopPropagation();
    document.body.style.cursor = type === 'move' ? 'grabbing' : 'ew-resize';
    setDraggingTask({ task, startX: e.clientX, type });
  };
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingTask || !ganttContainerRef.current) return;

    const dx = e.clientX - draggingTask.startX;
    const daysMoved = Math.round(dx / DAY_WIDTH);

    if (daysMoved !== 0) {
      let updatedTask = { ...draggingTask.task };
      const calendar = project.calendar!;

      if (draggingTask.type === 'move') {
        const newStartDate = addWorkingDays(new Date(draggingTask.task.startDate), daysMoved, calendar);
        updatedTask.startDate = toISODateString(newStartDate);
        updatedTask.endDate = toISODateString(addWorkingDays(newStartDate, updatedTask.duration, calendar));
      } else if (draggingTask.type === 'resize-end') {
        const newDuration = updatedTask.duration + daysMoved;
        updatedTask.duration = Math.max(1, newDuration);
        updatedTask.endDate = toISODateString(addWorkingDays(new Date(updatedTask.startDate), updatedTask.duration, calendar));
      } else if (draggingTask.type === 'progress') {
          const barWidth = updatedTask.duration * DAY_WIDTH;
          const currentProgressWidth = barWidth * (updatedTask.progress / 100);
          const newProgressWidth = currentProgressWidth + dx;
          updatedTask.progress = Math.max(0, Math.min(100, (newProgressWidth / barWidth) * 100));
      }
      
      setDraggingTask({ ...draggingTask, startX: e.clientX });
      dispatch({ type: 'UPDATE_TASK', payload: { projectId: project.id, task: updatedTask } });
    }
  }, [draggingTask, project.id, project.calendar, dispatch]);

  const handleMouseUp = useCallback(() => {
    document.body.style.cursor = 'default';
    setDraggingTask(null);
  }, []);

  useEffect(() => {
    if (draggingTask) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingTask, handleMouseMove, handleMouseUp]);

  const activeBaseline = project.baselines?.find(b => b.id === activeBaselineId);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden relative">
      <GanttToolbar 
        project={project}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showCriticalPath={showCriticalPath}
        setShowCriticalPath={setShowCriticalPath}
        activeBaselineId={activeBaselineId}
        setActiveBaselineId={setActiveBaselineId}
        showResources={showResources}
        setShowResources={setShowResources}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[450px] flex-shrink-0 border-r border-slate-200 flex flex-col bg-white overflow-y-auto z-10">
          <div className="sticky top-0 z-20 bg-slate-100 border-b border-slate-200 h-[50px] flex items-center px-4 font-semibold text-xs text-slate-600 uppercase tracking-wider">
            <div className="flex-1">Task Name</div>
            <div className="w-20 text-center">Duration</div>
          </div>
          {project.wbs && project.wbs.map(node => (
             <div key={node.id}>
                <div onClick={() => toggleNode(node.id)} className="font-bold text-slate-800 bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2 cursor-pointer">
                  {expandedNodes.has(node.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  {node.name}
                </div>
                {expandedNodes.has(node.id) && project.tasks.filter(t => t.wbsCode.startsWith(node.wbsCode)).map(task => (
                   <GanttTaskRow 
                     key={task.id}
                     task={task}
                     level={task.wbsCode.split('.').length -1}
                     isExpanded={true} // child tasks dont expand
                     onToggle={() => {}}
                     onSelect={() => setSelectedTask(task)}
                     hasChildren={false}
                     isCritical={task.critical}
                     showCriticalPath={showCriticalPath}
                   />
                ))}
             </div>
          ))}
        </div>

        <div className="flex-1 overflow-auto relative bg-white" id="gantt-timeline" ref={ganttContainerRef}>
           <div className="sticky top-0 left-0 z-10 bg-slate-100 border-b border-slate-200 h-[50px] whitespace-nowrap" style={{ width: `${timelineHeaders.days.length * DAY_WIDTH}px` }}>
             {Array.from(timelineHeaders.months.entries()).map(([monthYear, {start, width}]) => (
                <div key={monthYear} className="absolute top-0 text-center font-bold text-slate-700 border-r border-b border-slate-200" style={{left: `${start}px`, width: `${width}px`}}>{monthYear}</div>
             ))}
             {timelineHeaders.days.map(({date, isWorking}, i) => (
               <div key={i} className={`absolute top-6 bottom-0 border-l ${isWorking ? 'border-slate-200' : 'bg-slate-200/50 border-slate-300'} px-2 pt-0.5 text-xs text-center font-semibold text-slate-500`} style={{ left: `${i * DAY_WIDTH}px`, width: `${DAY_WIDTH}px`}}>
                 {date.getDate()}
               </div>
             ))}
           </div>
          
           <svg className="absolute top-[50px] left-0 w-full h-full pointer-events-none z-10" style={{ width: `${timelineHeaders.days.length * DAY_WIDTH}px` }}>
               {/* Dependency Lines */}
           </svg>


           <div className="relative pt-0" style={{ width: `${timelineHeaders.days.length * DAY_WIDTH}px`, height: `${project.tasks.length * ROW_HEIGHT}px` }}>
              {/* Grid Lines */}
              {timelineHeaders.days.map(({date, isWorking}, i) => <div key={`grid-${i}`} className={`absolute top-0 bottom-0 border-l ${isWorking ? 'border-slate-100' : 'bg-slate-100/70 border-slate-200'}`} style={{ left: `${i * DAY_WIDTH}px` }} />)}

              {project.tasks.map((task, idx) => {
                const offsetDays = getWorkingDaysDiff(projectStart, new Date(task.startDate), project.calendar!);
                const width = task.type === 'Milestone' ? DAY_WIDTH : Math.max(task.duration * DAY_WIDTH, 2);
                
                return (
                  <div key={`bar-${task.id}`} className="h-[44px] flex items-center absolute w-full" style={{ top: `${idx * ROW_HEIGHT}px` }}>
                    <div
                      onMouseDown={(e) => handleMouseDown(e, task, 'move')}
                      onClick={() => setSelectedTask(task)}
                      className={`h-6 rounded-sm border shadow-sm relative group cursor-grab transition-all ${getStatusColor(task.status)} ${showCriticalPath && task.critical ? 'ring-2 ring-offset-1 ring-red-500' : ''}`}
                      style={{ left: `${offsetDays * DAY_WIDTH}px`, width: `${width}px` }}
                    >
                      <div className="absolute h-full w-full left-0 top-0 flex items-center">
                        <div className="h-full bg-black/20 rounded-l-sm" style={{ width: `${task.progress}%` }} />
                      </div>
                      <span className="text-white text-xs font-medium absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none truncate pr-2">{task.name}</span>
                       {task.type === 'Milestone' && <Diamond size={16} className="absolute -right-2 top-1/2 -translate-y-1/2 text-white fill-slate-800" />}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>
      </div>
      
      {showResources && <ResourceUsageView project={project} dayWidth={DAY_WIDTH} projectStartDate={projectStart} />}
      
      {selectedTask && <TaskDetailModal task={selectedTask} project={project} onClose={() => setSelectedTask(null)} />}
    </div>
  );
};

export default ProjectGantt;