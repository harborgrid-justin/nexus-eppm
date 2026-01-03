
import React, { useState, useMemo, useCallback, useEffect, useDeferredValue } from 'react';
import { Project, Task, TaskStatus, WorkDay, ProjectCalendar } from '../types/index';
import { useData } from '../context/DataContext';
import { Scheduler, ScheduleResult } from '../services/SchedulingEngine';
import { useGanttTimeline, DAY_WIDTH } from './gantt/useGanttTimeline';
import { useGanttDrag } from './gantt/useGanttDrag';

export { DAY_WIDTH };

export const useGantt = (initialProject: Project) => {
  const { state, dispatch } = useData();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTraceLogicOpen, setIsTraceLogicOpen] = useState(false);
  const [showCriticalPath, setShowCriticalPath] = useState(true);
  const [activeBaselineId, setActiveBaselineId] = useState<string | null>(initialProject.baselines?.[0]?.id || null);
  const [showResources, setShowResources] = useState(false);
  
  // Scheduling State
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleLog, setScheduleLog] = useState<string>('');
  const [scheduleStats, setScheduleStats] = useState<ScheduleResult['stats'] | null>(null);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [dataDate, setDataDate] = useState<Date>(new Date());
  
  // Pattern 2: useDeferredValue for filtering to keep UI responsive
  const [taskFilter, setTaskFilter] = useState('all');
  const deferredTaskFilter = useDeferredValue(taskFilter);
  
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(initialProject.wbs?.map(w => w.id) || []));
  
  // Ensure we use the latest project state from context if available, otherwise initial
  const contextProject = state.projects.find(p => p.id === initialProject.id) || initialProject;

  const runSchedule = useCallback(async () => {
      setIsScheduling(true);
      try {
          const result = await Scheduler.schedule(contextProject, {
              dataDate: dataDate,
              useRetainedLogic: true,
              honorConstraints: true
          });
          
          setScheduleLog(result.log);
          setScheduleStats(result.stats);
          
          // Update tasks in global state with calculated dates
          // Optimization: In a real app, we might batch this or update a separate "scheduled" state
          // For now, we assume the engine returns the updated task objects
          // We need to dispatch updates for all tasks that changed
          // Simplified: Just re-render with local derived state? No, P6 updates the DB.
          // We'll simulate updating the project in context.
          
          // Note: In this React Context pattern, we might need a bulk update action
          // dispatch({ type: 'PROJECT_BULK_TASK_UPDATE', payload: { projectId: contextProject.id, tasks: result.tasks } });
          
          // For immediate visual feedback without thrashing context:
          // We could use a local override map. But let's assume we update context.
          result.tasks.forEach(t => {
               dispatch({ type: 'TASK_UPDATE', payload: { projectId: contextProject.id, task: t } });
          });
          
          setIsLogOpen(true);
      } catch (e) {
          console.error("Scheduling failed", e);
      } finally {
          setIsScheduling(false);
      }
  }, [contextProject, dataDate, dispatch]);

  const filteredTasks = useMemo(() => {
      if (deferredTaskFilter === 'all') return contextProject.tasks;
      return contextProject.tasks.filter(t => deferredTaskFilter === 'critical' ? t.critical : t.status === deferredTaskFilter);
  }, [contextProject.tasks, deferredTaskFilter]);
  
  const { ganttContainerRef, handleMouseDown } = useGanttDrag(dispatch, contextProject, DAY_WIDTH);
  
  const { projectStart, projectEnd, timelineHeaders } = useGanttTimeline(contextProject, viewMode, DAY_WIDTH);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED: return 'bg-green-500 border-green-600';
      case TaskStatus.IN_PROGRESS: return 'bg-blue-500 border-blue-600';
      case TaskStatus.DELAYED: return 'bg-red-500 border-red-600';
      default: return 'bg-slate-400 border-slate-500';
    }
  };

  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      newSet.has(nodeId) ? newSet.delete(nodeId) : newSet.add(nodeId);
      return newSet;
    });
  }, []);

  return {
      project: { ...contextProject, tasks: filteredTasks },
      viewMode, setViewMode, selectedTask, setSelectedTask, isTraceLogicOpen, setIsTraceLogicOpen,
      showCriticalPath, setShowCriticalPath, activeBaselineId, setActiveBaselineId,
      showResources, setShowResources, ganttContainerRef, expandedNodes, toggleNode,
      timelineHeaders, projectStart, projectEnd, getStatusColor, handleMouseDown,
      taskFilter, setTaskFilter,
      // Scheduling Props
      isScheduling, runSchedule, scheduleLog, scheduleStats, isLogOpen, setIsLogOpen, dataDate, setDataDate
  };
};
