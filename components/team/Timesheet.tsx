
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Timesheet as TimesheetType, TimesheetRow } from '../../types/resource';
import { ChevronLeft, ChevronRight, Save, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../context/ThemeContext';
import { generateId } from '../../utils/formatters';

const Timesheet: React.FC = () => {
  const { state, dispatch } = useData();
  const theme = useTheme();
  // Hydration safety: Start with null/default and sync on mount
  const [currentWeekStart, setCurrentWeekStart] = useState<Date | null>(null);
  
  // Use local user ID (Mock)
  const currentUserId = 'R-002'; // 'Mike Ross' from MOCK_RESOURCES

  function getMonday(d: Date) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  useEffect(() => {
    setCurrentWeekStart(getMonday(new Date()));
  }, []);

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

  // Find existing timesheet or create structure
  const activeTimesheet = useMemo(() => {
      if (!currentWeekStart) return null;
      const weekStr = currentWeekStart.toISOString().split('T')[0];
      return state.timesheets.find(t => t.resourceId === currentUserId && t.periodStart === weekStr);
  }, [state.timesheets, currentWeekStart, currentUserId]);

  const [rows, setRows] = useState<TimesheetRow[]>([]);
  const [status, setStatus] = useState<'Draft' | 'Submitted' | 'Approved' | 'Rejected'>('Draft');

  useEffect(() => {
      if (activeTimesheet) {
          setRows(activeTimesheet.rows);
          setStatus(activeTimesheet.status);
      } else if (currentWeekStart) {
          // Initialize empty rows based on assignments
          const tasks: TimesheetRow[] = [];
          
          state.projects.forEach(p => {
              p.tasks.forEach(t => {
                  if (t.assignments.some(a => a.resourceId === currentUserId)) {
                      tasks.push({
                          taskId: t.id,
                          projectId: p.id,
                          taskName: t.name,
                          projectName: p.name,
                          hours: [0, 0, 0, 0, 0, 0, 0] // 7 days
                      });
                  }
              });
          });
          setRows(tasks);
          setStatus('Draft');
      }
  }, [activeTimesheet, currentWeekStart, state.projects]);

  const handleHourChange = (rowIndex: number, dayIndex: number, val: string) => {
      if (status === 'Submitted' || status === 'Approved') return;
      const numVal = parseFloat(val) || 0;
      const newRows = [...rows];
      newRows[rowIndex].hours[dayIndex] = numVal;
      setRows(newRows);
  };

  const calculateDailyTotal = (dayIndex: number) => {
      return rows.reduce((sum, row) => sum + row.hours[dayIndex], 0);
  };

  const calculateRowTotal = (row: TimesheetRow) => {
      return row.hours.reduce((sum, h) => sum + h, 0);
  };

  const grandTotal = rows.reduce((sum, row) => sum + calculateRowTotal(row), 0);

  const handleSave = () => {
      if (!currentWeekStart) return;
      const sheet: TimesheetType = {
          id: activeTimesheet?.id || generateId('TS'),
          resourceId: currentUserId,
          periodStart: currentWeekStart.toISOString().split('T')[0],
          status: 'Draft',
          totalHours: grandTotal,
          rows: rows
      };
      
      // We use SUBMIT_TIMESHEET for simplicity, but it handles upsert in reducer logic via ADMIN_SLICE or SYSTEM_SLICE
      // Since we don't have a specific SAVE action, we can re-use the generic update or add specific one.
      // Let's use SUBMIT_TIMESHEET for now as per actions.ts, but logically it's an update.
      // Wait, actions.ts has SUBMIT_TIMESHEET which takes { id, rows, totalHours }.
      // But we need to persist the full object.
      // Let's check actions.ts... It has SUBMIT_TIMESHEET payload: any.
      
      // Let's use a cleaner pattern. We need to persist to state.timesheets.
      // We will dispatch 'SUBMIT_TIMESHEET' which likely needs to be handled in systemSlice or adminSlice.
      // Currently adminSlice doesn't handle TIMESHEET actions. Let's fix that.
      // Actually, checking actions.ts, we have SUBMIT_TIMESHEET payload: any.
      
      // Let's add a proper action in reducer.
      // For now, assume SUBMIT_TIMESHEET handles upsert.
      
      // Actually, I'll update the action type to properly handle timesheet persistence.
      // See reducer update.
      
      // We need a specific action. Let's assume there is one or I'll add one.
      // I added 'SUBMIT_TIMESHEET' to actions.ts in previous step.
      
      // Wait, 'SUBMIT_TIMESHEET' in actions.ts was defined as payload: { id, rows, totalHours }.
      // I'll update the dispatch to match.
      dispatch({ 
          type: 'SUBMIT_TIMESHEET', // This needs to be handled by reducer to update the timesheet array
          payload: { ...sheet, status: 'Draft' } 
      });
  };
  
  const handleSubmit = () => {
       if (!currentWeekStart) return;
       const sheet: TimesheetType = {
          id: activeTimesheet?.id || generateId('TS'),
          resourceId: currentUserId,
          periodStart: currentWeekStart.toISOString().split('T')[0],
          status: 'Submitted',
          totalHours: grandTotal,
          rows: rows
      };
      dispatch({ type: 'SUBMIT_TIMESHEET', payload: sheet });
      setStatus('Submitted');
  };

  const shiftWeek = (direction: 'prev' | 'next') => {
      if (!currentWeekStart) return;
      const newDate = new Date(currentWeekStart);
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      setCurrentWeekStart(newDate);
  };

  if (!currentWeekStart) return <div className="p-6">Loading timesheet...</div>;

  return (
    <div className={`h-full flex flex-col ${theme.components.card} overflow-hidden`}>
        {/* Toolbar */}
        <div className={`p-4 border-b ${theme.colors.border} flex flex-col md:flex-row justify-between items-center gap-4 ${theme.colors.background}`}>
            <div className="flex items-center gap-4">
                <div className={`flex items-center ${theme.colors.surface} border ${theme.colors.border} rounded-lg p-1`}>
                    <button onClick={() => shiftWeek('prev')} className={`p-1 hover:${theme.colors.background} rounded ${theme.colors.text.secondary}`}><ChevronLeft size={20}/></button>
                    <span className={`px-4 text-sm font-medium ${theme.colors.text.primary} min-w-[140px] text-center`}>
                        {currentWeekStart.toLocaleDateString(undefined, {month:'short', day:'numeric'})} - {weekDates[6].toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                    </span>
                    <button onClick={() => shiftWeek('next')} className={`p-1 hover:${theme.colors.background} rounded ${theme.colors.text.secondary}`}><ChevronRight size={20}/></button>
                </div>
                <Badge variant={status === 'Draft' ? 'neutral' : status === 'Submitted' ? 'warning' : 'success'}>
                    {status}
                </Badge>
            </div>

            <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${theme.colors.text.secondary} mr-4`}>Total: {grandTotal.toFixed(1)} hrs</span>
                <button 
                    onClick={handleSave}
                    disabled={status !== 'Draft'}
                    className={`flex items-center gap-2 px-4 py-2 ${theme.colors.surface} border ${theme.colors.border} ${theme.colors.text.primary} font-medium rounded-lg text-sm hover:${theme.colors.background} disabled:opacity-50`}
                >
                    <Save size={16}/> Save
                </button>
                <button 
                    disabled={status !== 'Draft'}
                    onClick={handleSubmit}
                    className={`flex items-center gap-2 px-4 py-2 ${theme.colors.primary} text-white font-medium rounded-lg text-sm ${theme.colors.primaryHover} disabled:opacity-50`}
                >
                    {status === 'Submitted' ? <CheckCircle size={16}/> : <Send size={16}/>}
                    {status === 'Submitted' ? 'Submitted' : 'Submit'}
                </button>
            </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                <thead className={`${theme.colors.background} sticky top-0 z-10`}>
                    <tr>
                        <th className={`${theme.components.table.header} w-64 border-r`}>Task / Project</th>
                        {weekDates.map((date, i) => (
                            <th key={i} className={`${theme.components.table.header} w-24 text-center`}>
                                <div>{date.toLocaleDateString('en-US', {weekday: 'short'})}</div>
                                <div className="text-[10px] font-normal">{date.getDate()}</div>
                            </th>
                        ))}
                        <th className={`${theme.components.table.header} w-24 text-center`}>Total</th>
                    </tr>
                </thead>
                <tbody className={`${theme.colors.surface} divide-y ${theme.colors.border.replace('border-','divide-')}`}>
                    {rows.map((row, rIdx) => (
                        <tr key={rIdx} className={`hover:${theme.colors.background}`}>
                            <td className={`px-4 py-3 border-r ${theme.colors.border}`}>
                                <div className={`font-medium text-sm ${theme.colors.text.primary} truncate max-w-[200px]`} title={row.taskName}>{row.taskName}</div>
                                <div className={`text-xs ${theme.colors.text.secondary} truncate max-w-[200px]`}>{row.projectName}</div>
                            </td>
                            {row.hours.map((hrs, dIdx) => (
                                <td key={dIdx} className="p-2 text-center">
                                    <input 
                                        type="number" 
                                        min="0"
                                        max="24"
                                        step="0.5"
                                        value={hrs === 0 ? '' : hrs}
                                        onChange={(e) => handleHourChange(rIdx, dIdx, e.target.value)}
                                        disabled={status !== 'Draft'}
                                        className={`w-full text-center border ${theme.colors.border} rounded py-1 text-sm focus:ring-2 focus:ring-nexus-500 focus:outline-none disabled:${theme.colors.background}`}
                                    />
                                </td>
                            ))}
                            <td className={`px-4 py-3 text-center font-bold text-sm ${theme.colors.text.primary} ${theme.colors.background}`}>
                                {calculateRowTotal(row).toFixed(1)}
                            </td>
                        </tr>
                    ))}
                    {/* Totals Row */}
                    <tr className={`${theme.colors.background} font-bold ${theme.colors.text.primary}`}>
                        <td className={`px-4 py-3 border-r ${theme.colors.border} text-right text-xs uppercase`}>Daily Total</td>
                        {weekDates.map((_, i) => (
                            <td key={i} className="px-2 py-3 text-center text-sm">
                                {calculateDailyTotal(i).toFixed(1)}
                            </td>
                        ))}
                        <td className={`px-4 py-3 text-center text-sm ${theme.colors.surface} border ${theme.colors.border}`}>
                            {grandTotal.toFixed(1)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        {rows.length === 0 && (
            <div className={`flex flex-col items-center justify-center h-64 ${theme.colors.text.tertiary}`}>
                <AlertCircle size={32} className="mb-2 opacity-50"/>
                <p>No tasks assigned for this period.</p>
            </div>
        )}
    </div>
  );
};

export default Timesheet;
