
import React, { useState, useMemo, useCallback, useEffect, useDeferredValue } from 'react';
// FIX: Corrected import path for types to resolve module resolution errors.
import { Project, Task, TaskStatus, WorkDay, ProjectCalendar } from '../types/index';
import { useData } from '../context/DataContext';
import { calculateCriticalPath } from '../utils/scheduling';
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
  
  // Pattern 2: useDeferredValue for filtering to keep UI responsive
  const [taskFilter, setTaskFilter] = useState('all');
  const deferredTaskFilter = useDeferredValue(taskFilter);
  
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(initialProject.wbs?.map(w => w.id) || []));
  
  const projectCalendar = useMemo(() => {
    return state.calendars.find(c => c.id === initialProject.calendarId);
  }, [state.calendars, initialProject.calendarId]);

  const project = useMemo(() => {
    if (!projectCalendar) return { ...initialProject, calendar: undefined };
    
    const adaptedCalendar: ProjectCalendar = {
        id: projectCalendar.id, 
        name: projectCalendar.name, 
        holidays: (projectCalendar.holidays || []).map(h => h.date),
        workingDays: Object.entries(projectCalendar.workWeek).filter(([,v]) => (v as WorkDay).isWorkDay).map(([k,],i) => i) // Simple index mapping
    };

    try {
      const tasksWithCriticalPath = calculateCriticalPath(initialProject.tasks, adaptedCalendar);
      return { ...initialProject, tasks: tasksWithCriticalPath, calendar: adaptedCalendar };
    } catch (error) {
      console.error("Critical Path Failed", error);
      return { ...initialProject, calendar: adaptedCalendar };
    }
  }, [initialProject, projectCalendar]);

  const filteredTasks = useMemo(() => {
      if (deferredTaskFilter === 'all') return project.tasks;
      return project.tasks.filter(t => deferredTaskFilter === 'critical' ? t.critical : t.status === deferredTaskFilter);
  }, [project.tasks, deferredTaskFilter]);
  
  const { ganttContainerRef, handleMouseDown } = useGanttDrag(dispatch, project, DAY_WIDTH);
  
  const { projectStart, projectEnd, timelineHeaders } = useGanttTimeline(project, viewMode, DAY_WIDTH);

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
      project: { ...project, tasks: filteredTasks }, // Return project with filtered tasks
      viewMode, setViewMode, selectedTask, setSelectedTask, isTraceLogicOpen, setIsTraceLogicOpen,
      showCriticalPath, setShowCriticalPath, activeBaselineId, setActiveBaselineId,
      showResources, setShowResources, ganttContainerRef, expandedNodes, toggleNode,
      timelineHeaders, projectStart, projectEnd, getStatusColor, handleMouseDown,
      taskFilter, setTaskFilter
  };
};
