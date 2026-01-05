

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
  const [scheduleLog, setScheduleLog] = useState<