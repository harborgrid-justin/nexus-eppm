
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Timesheet, TimesheetRow } from '../../types/resource';
import { generateId } from '../../utils/formatters';

export const useTimesheetLogic = () => {
  const { state, dispatch } = useData();
  const { user } = useAuth();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date | null>(null);
  const [rows, setRows] = useState<TimesheetRow[]>([]);
  const [status, setStatus] = useState<'Draft' | 'Submitted' | 'Approved' | 'Rejected'>('Draft');

  // Helper to get Monday
  const getMonday = useCallback((d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
    return new Date(date.setDate(diff));
  }, []);

  useEffect(() => {
    setCurrentWeekStart(getMonday(new Date()));
  }, [getMonday]);

  const weekDates = useMemo(() => {
    if (!currentWeekStart) return [];
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(currentWeekStart);
        d.setDate(d.getDate() + i);
        dates.push(d);
    }
    return dates;
  }, [currentWeekStart]);

  const weekStr = currentWeekStart?.toISOString().split('T')[0];

  // Find existing timesheet in global state
  const activeTimesheet = useMemo(() => {
      if (!user || !weekStr) return null;
      return state.timesheets.find(t => t.resourceId === user.id && t.periodStart === weekStr);
  }, [state.timesheets, weekStr, user]);

  // Sync local state with global state or initialize new
  useEffect(() => {
      if (activeTimesheet) {
          setRows(activeTimesheet.rows);
          setStatus(activeTimesheet.status);
      } else if (user && currentWeekStart) {
          // Auto-populate based on assignments
          const tasks: TimesheetRow[] = [];
          state.projects.forEach(p => {
              p.tasks.forEach(t => {
                  // Check if user assigned OR if they have logged time previously
                  if (t.assignments && t.assignments.some(a => a.resourceId === user.id)) {
                      tasks.push({
                          taskId: t.id,
                          projectId: p.id,
                          taskName: t.name,
                          projectName: p.name,
                          hours: [0, 0, 0, 0, 0, 0, 0]
                      });
                  }
              });
          });
          setRows(tasks);
          setStatus('Draft');
      }
  }, [activeTimesheet, currentWeekStart, state.projects, user]);

  const handleHourChange = (rowIndex: number, dayIndex: number, val: string) => {
      let numVal = parseFloat(val);
      if (isNaN(numVal) || numVal < 0) numVal = 0;
      if (numVal > 24) numVal = 24; 

      const newRows = rows.map((row, idx) => {
          if (idx !== rowIndex) return row;
          const newHours = [...row.hours];
          newHours[dayIndex] = numVal;
          return { ...row, hours: newHours };
      });
      setRows(newRows);
  };

  const shiftWeek = (direction: 'prev' | 'next') => {
      if (!currentWeekStart) return;
      const newDate = new Date(currentWeekStart);
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      setCurrentWeekStart(newDate);
  };

  const saveSheet = (newStatus: Timesheet['status']) => {
      if (!currentWeekStart || !user) return;
      
      const totalHours = rows.reduce((sum, row) => sum + row.hours.reduce((a,b) => a + b, 0), 0);
      
      const sheet: Timesheet = {
          id: activeTimesheet?.id || generateId('TS'),
          resourceId: user.id,
          periodStart: currentWeekStart.toISOString().split('T')[0],
          status: newStatus,
          totalHours,
          rows: rows
      };
      
      dispatch({ type: 'SUBMIT_TIMESHEET', payload: sheet });
      setStatus(newStatus);
  };
  
  const addRow = () => {
      // Logic to add an ad-hoc row (e.g. Admin time)
      const newRow: TimesheetRow = {
          taskId: generateId('ADHOC'),
          projectId: 'ADMIN',
          taskName: 'Administrative / Other',
          projectName: 'Internal',
          hours: [0, 0, 0, 0, 0, 0, 0]
      };
      setRows([...rows, newRow]);
  };

  return {
      currentWeekStart,
      weekDates,
      rows,
      status,
      isEditable: status === 'Draft' || status === 'Rejected',
      grandTotal: rows.reduce((sum, row) => sum + row.hours.reduce((a,b) => a+b, 0), 0),
      handleHourChange,
      shiftWeek,
      saveSheet,
      addRow,
      user
  };
};
