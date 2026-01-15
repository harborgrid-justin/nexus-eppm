
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Project, Task, TaskStatus } from '../types/index';
import { useData } from '../context/DataContext';
import { Scheduler } from '../services/SchedulingEngine';
import { useGanttTimeline, DAY_WIDTH } from './gantt/useGanttTimeline';
import { useGanttDrag } from './gantt/useGanttDrag';

export { DAY_WIDTH };

export const useGantt = (initialProject: Project | undefined) => {
  const { state, dispatch } = useData();
  const [project, setProject] = useState<Project | undefined>(initialProject);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTraceLogicOpen, setIsTraceLogicOpen] = useState(false);
  const [showCriticalPath, setShowCriticalPath] = useState(true);
  const [activeBaselineId, setActiveBaselineId] = useState<string | null>(initialProject?.baselines?.[0]?.id || null);
  const [showResources, setShowResources] = useState(false);
  
  // Scheduling Logic State
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleLog, setScheduleLog] = useState('');
  const [scheduleStats, setScheduleStats] = useState<any>(null);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [dataDate, setDataDate] = useState(new Date(initialProject?.dataDate || Date.now()));
  const [taskFilter, setTaskFilter] = useState('all');
  
  useEffect(() => {
    if (initialProject) {
        setProject(initialProject);
        if (!activeBaselineId && initialProject.baselines?.length) {
            setActiveBaselineId(initialProject.baselines[0].id);
        }
    }
  }, [initialProject, activeBaselineId]);

  const currentDayWidth = useMemo(() => {
    switch(viewMode) {
      case 'day': return 100;
      case 'week': return 50;
      case 'month': return 25;
      default: return 50;
    }
  }, [viewMode]);

  const safeProject = useMemo(() => project || { 
      id: 'UNSET', tasks: [], startDate: new Date().toISOString(), endDate: new Date().toISOString() 
  } as unknown as Project, [project]);

  const { timelineHeaders, projectStart, projectEnd } = useGanttTimeline(safeProject, viewMode, currentDayWidth);
  const { ganttContainerRef, handleMouseDown } = useGanttDrag(dispatch, safeProject, currentDayWidth);

  const [expandedNodes, setExpandedNodes] = useState(new Set<string>(project?.wbs?.map(w => w.id) || []));
  
  const toggleNode = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const getStatusColor = (status: TaskStatus): string => {
    switch(status) {
        case TaskStatus.COMPLETED: return 'bg-green-500 border-green-700';
        case TaskStatus.IN_PROGRESS: return 'bg-blue-500 border-blue-700';
        case TaskStatus.DELAYED: return 'bg-red-500 border-red-700';
        default: return 'bg-slate-400 border-slate-600';
    }
  };
  
  const runSchedule = useCallback(async () => {
    if(!project) return;
    setIsScheduling(true);
    try {
        const result = await Scheduler.schedule(project, { dataDate, useRetainedLogic: true });
        setScheduleLog(result.log);
        setScheduleStats(result.stats);
        if (result.success) {
          dispatch({ type: 'TASK_UPDATE', payload: { projectId: project.id, task: result.tasks } });
          setProject(p => p ? ({...p, tasks: result.tasks}) : undefined);
        }
    } finally {
        setIsScheduling(false);
    }
  }, [project, dataDate, dispatch]);
  
  return {
    project: safeProject, viewMode, setViewMode, selectedTask, setSelectedTask,
    isTraceLogicOpen, setIsTraceLogicOpen, showCriticalPath, setShowCriticalPath,
    activeBaselineId, setActiveBaselineId, showResources, setShowResources,
    ganttContainerRef, expandedNodes, toggleNode, timelineHeaders,
    projectStart, projectEnd, getStatusColor, handleMouseDown,
    taskFilter, setTaskFilter, isScheduling, runSchedule,
    scheduleLog, scheduleStats, isLogOpen, setIsLogOpen, dataDate
  };
};
