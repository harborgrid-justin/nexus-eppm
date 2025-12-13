
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Project, Task, TaskStatus } from '../types';
import { useData } from '../context/DataContext';
import { calculateCriticalPath } from '../utils/scheduling';
import { toISODateString, addWorkingDays, getWorkingDaysDiff } from '../utils/dateUtils';

export const DAY_WIDTH = 28;

export const useGantt = (initialProject: Project) => {
  const { state, dispatch } = useData();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTraceLogicOpen, setIsTraceLogicOpen] = useState(false);
  const [showCriticalPath, setShowCriticalPath] = useState(true);
  const [activeBaselineId, setActiveBaselineId] = useState<string | null>(initialProject.baselines?.[0]?.id || null);
  const [showResources, setShowResources] = useState(false);
  const [taskFilter, setTaskFilter] = useState('all');
  
  const ganttContainerRef = useRef<HTMLDivElement>(null);
  
  const [draggingTask, setDraggingTask] = useState<{ task: Task, startX: number, type: 'move' | 'resize-end' | 'progress' } | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(initialProject.wbs?.map(w => w.id) || []));
  
  const rafRef = useRef<number | null>(null);

  // Retrieve global calendar based on project settings
  const projectCalendar = useMemo(() => {
      const globalCal = state.calendars.find(c => c.id === initialProject.calendarId);
      if (!globalCal) return undefined;
      
      // Adapt GlobalCalendar to legacy ProjectCalendar shape for scheduling util
      const workingDays: number[] = [];
      if (globalCal.workWeek.sunday.isWorkDay) workingDays.push(0);
      if (globalCal.workWeek.monday.isWorkDay) workingDays.push(1);
      if (globalCal.workWeek.tuesday.isWorkDay) workingDays.push(2);
      if (globalCal.workWeek.wednesday.isWorkDay) workingDays.push(3);
      if (globalCal.workWeek.thursday.isWorkDay) workingDays.push(4);
      if (globalCal.workWeek.friday.isWorkDay) workingDays.push(5);
      if (globalCal.workWeek.saturday.isWorkDay) workingDays.push(6);

      const holidays = globalCal.holidays.map(h => h.date);

      return {
          id: globalCal.id,
          name: globalCal.name,
          workingDays,
          holidays
      };
  }, [state.calendars, initialProject.calendarId]);

  const project = useMemo(() => {
    // Inject the resolved calendar into the project object for child components that expect it
    // Note: 'calendar' property is not on Project type anymore, but we cast or extend for internal use
    const projWithCal = { ...initialProject, calendar: projectCalendar };

    if (!projectCalendar) {
        console.warn("Project calendar is missing. Critical path calculation skipped.");
        return projWithCal;
    }
    try {
      let tasks = initialProject.tasks;
      // Filter tasks before calculating critical path if a filter is active
      if (taskFilter !== 'all') {
          tasks = tasks.filter(t => {
              if (taskFilter === 'critical') return t.critical; 
              return t.status === taskFilter;
          });
      }
      
      const tasksWithCriticalPath = calculateCriticalPath(initialProject.tasks, projectCalendar);

      if (taskFilter !== 'all') {
          return {
              ...projWithCal,
              tasks: tasksWithCriticalPath.filter(t => {
                  if (taskFilter === 'critical') return t.critical;
                  return t.status === taskFilter;
              }),
          };
      }

      return { ...projWithCal, tasks: tasksWithCriticalPath };
    } catch (error) {
      console.error("Critical Path Calculation Failed", error);
      return projWithCal;
    }
  }, [initialProject, taskFilter, projectCalendar]);
  
  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) newSet.delete(nodeId);
      else newSet.add(nodeId);
      return newSet;
    });
  }, []);

  const projectStart = useMemo(() => {
      if (initialProject.tasks.length === 0) return new Date();
      const minDate = new Date(initialProject.tasks.reduce((min, t) => t.startDate < min ? t.startDate : min, initialProject.tasks[0].startDate));
      minDate.setDate(minDate.getDate() - 7);
      return minDate;
  }, [initialProject.tasks]);

  const projectEnd = useMemo(() => {
      if (initialProject.tasks.length === 0) {
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + 30);
          return endDate;
      }
      const maxDate = new Date(initialProject.tasks.reduce((max, t) => t.endDate > max ? t.endDate : max, initialProject.tasks[0].endDate));
      maxDate.setDate(maxDate.getDate() + 30);
      return maxDate;
  }, [initialProject.tasks]);

  const timelineHeaders = useMemo(() => {
    const headers = { months: new Map<string, { start: number, width: number }>(), days: [] as { date: Date; isWorking: boolean }[] };
    if (!projectCalendar) return headers;

    let current = new Date(projectStart);
    let dayIndex = 0;
    while (current <= projectEnd) {
        const isWorking = projectCalendar.workingDays.includes(current.getDay());
        const monthYear = current.toLocaleString('default', { month: 'long', year: 'numeric' });
        if(!headers.months.has(monthYear)){
            headers.months.set(monthYear, { start: dayIndex * DAY_WIDTH, width: 0 });
        }
        const monthData = headers.months.get(monthYear);
        if (monthData) {
            monthData.width += DAY_WIDTH;
        }

        headers.days.push({ date: new Date(current), isWorking });
        current.setDate(current.getDate() + 1);
        if(isWorking || !isWorking) dayIndex++; 
    }
    return headers;
  }, [projectStart, projectEnd, projectCalendar]);

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.COMPLETED: return 'bg-green-500 border-green-600';
      case TaskStatus.IN_PROGRESS: return 'bg-blue-500 border-blue-600';
      case TaskStatus.DELAYED: return 'bg-red-500 border-red-600';
      default: return 'bg-slate-400 border-slate-500';
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, task: Task, type: 'move' | 'resize-end' | 'progress') => {
    e.stopPropagation();
    document.body.style.cursor = type === 'move' ? 'grabbing' : 'ew-resize';
    setDraggingTask({ task, startX: e.clientX, type });
  }, []);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingTask || !ganttContainerRef.current || !projectCalendar) return;

    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      const dx = e.clientX - draggingTask.startX;
      const daysMoved = Math.round(dx / DAY_WIDTH);

      if (daysMoved !== 0 || draggingTask.type === 'progress') {
        let updatedTask = { ...draggingTask.task };
        const calendar = projectCalendar;

        try {
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
          
          setDraggingTask(prev => prev ? { ...prev, startX: e.clientX } : null);
          dispatch({ type: 'UPDATE_TASK', payload: { projectId: initialProject.id, task: updatedTask } });
        } catch (err) {
          console.error("Error updating task during drag", err);
        }
      }
      rafRef.current = null;
    });
  }, [draggingTask, initialProject.id, projectCalendar, dispatch]);

  const handleMouseUp = useCallback(() => {
    if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
    }
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
      if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
      }
    };
  }, [draggingTask, handleMouseMove, handleMouseUp]);

  return {
      project,
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
      setTaskFilter
  };
};
