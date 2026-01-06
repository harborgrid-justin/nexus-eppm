
import React, { useState, useMemo, useCallback, useEffect, useDeferredValue } from 'react';
import { Project, Task, TaskStatus, WorkDay, ProjectCalendar } from '../types/index';
import { useData } from '../context/DataContext';
import { Scheduler, ScheduleResult } from '../services/SchedulingEngine';
import { useGanttTimeline, DAY_WIDTH as BASE_DAY_WIDTH } from './gantt/useGanttTimeline';
import { useGanttDrag } from './gantt/useGanttDrag';

export const DAY_WIDTH = BASE_DAY_WIDTH;

export const useGantt = (initialProject: Project | undefined) => {
  const { state, dispatch } = useData();
  
  // Guard: if initialProject is undefined, use a dummy or handle it. 
  // However, state hooks must run. 
  // We'll initialize state with undefined/null friendly values.
  
  const [project, setProject] = useState<Project | undefined>(initialProject);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTraceLogicOpen, setIsTraceLogicOpen] = useState(false);
  const [showCriticalPath, setShowCriticalPath] = useState(true);
  const [activeBaselineId, setActiveBaselineId] = useState<string | null>(initialProject?.baselines?.[0]?.id || null);
  const [showResources, setShowResources] = useState(false);
  
  // Scheduling State
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleLog, setScheduleLog] = useState<string>('');
  const [scheduleStats, setScheduleStats] = useState<ScheduleResult['stats'] | null>(null);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [dataDate, setDataDate] = useState(new Date(initialProject?.dataDate || Date.now()));
  const [taskFilter, setTaskFilter] = useState('all');
  
  // Update local project if initialProject changes (e.g. loaded async)
  useEffect(() => {
    if (initialProject) {
        setProject(initialProject);
        if (!activeBaselineId && initialProject.baselines?.length) {
            setActiveBaselineId(initialProject.baselines[0].id);
        }
    }
  }, [initialProject]);

  const dayWidth = useMemo(() => {
    switch(viewMode) {
      case 'day': return 100;
      case 'week': return 50;
      case 'month': return 20;
    }
  }, [viewMode]);

  // Safe timeline hooks
  const safeProject = project || { tasks: [], startDate: new Date().toISOString(), endDate: new Date().toISOString() } as unknown as Project;

  const {
      timelineHeaders,
      projectStart,
      projectEnd
  } = useGanttTimeline(safeProject, viewMode, dayWidth);
  
  const { ganttContainerRef, handleMouseDown } = useGanttDrag(dispatch, safeProject, dayWidth);

  const [expandedNodes, setExpandedNodes] = useState(new Set<string>(project?.wbs?.map(w => w.id) || []));
  const toggleNode = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
    const result = await Scheduler.schedule(project, { dataDate, useRetainedLogic: true, honorConstraints: true });
    setScheduleLog(result.log);
    setScheduleStats(result.stats);
    // Update tasks in state
    if (result.success) {
      dispatch({ type: 'PROJECT_UPDATE', payload: { projectId: project.id, updatedData: { tasks: result.tasks } }});
      // Update local project state too
      setProject(p => p ? ({...p, tasks: result.tasks}) : undefined);
    }
    setIsScheduling(false);
  }, [project, dataDate, dispatch]);
  
  return {
    project: safeProject, // Return safe object to prevent downstream crashes
    viewMode,
    setViewMode,
    selectedTask,
    setSelectedTask,
    isTraceLogicOpen,
    setIsTraceLogicOpen,
    showCriticalPath,
    setShowCriticalPath,
    activeBaselineId,
    setActiveBaselineId,
    showResources,
    setShowResources,
    ganttContainerRef,
    expandedNodes,
    toggleNode,
    timelineHeaders,
    projectStart,
    projectEnd,
    getStatusColor,
    handleMouseDown,
    taskFilter,
    setTaskFilter,
    isScheduling,
    runSchedule,
    scheduleLog,
    scheduleStats,
    isLogOpen,
    setIsLogOpen,
    dataDate
  };
};
