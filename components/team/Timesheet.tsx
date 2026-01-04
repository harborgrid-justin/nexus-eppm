
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Timesheet as TimesheetType, TimesheetRow } from '../../types/resource';
import { ChevronLeft, ChevronRight, Save, Send, AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../context/ThemeContext';
import { generateId } from '../../utils/formatters';

const Timesheet: React.FC = () => {
  const { state, dispatch } = useData();
  const theme = useTheme();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date | null>(null);
  
  // Use local user ID (Mock - in real app this comes from AuthContext)
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
  const isEditable = status === 'Draft' || status === 'Rejected';

  useEffect(() => {
      if (activeTimesheet) {
          setRows(activeTimesheet.rows);
          setStatus(activeTimesheet.status);
      } else if (currentWeekStart) {
          // Initialize empty rows based on assignments from Project Tasks
          const tasks: TimesheetRow[] = [];
          state.projects.forEach(p => {
              p.tasks.forEach(t => {
                  if (t.assignments && t.assignments.some(a => a.resourceId === currentUserId)) {
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
      if (!isEditable) return;
      
      let numVal = parseFloat(val);
      if (isNaN(numVal) || numVal < 0) numVal = 0;
      if (numVal > 24) numVal = 24; // Cap daily hours

      const newRows = [...rows];
      // Create deep copy of hours array to avoid mutation issues
      newRows[rowIndex] = { ...newRows[rowIndex], hours: [...newRows[rowIndex].hours] };
      newRows[rowIndex].hours[dayIndex] = numVal;
      setRows(newRows);
  };

  const calculateDailyTotal = (dayIndex: number) => {
      return rows.reduce((sum, row) => sum + (row.hours[dayIndex] || 0), 0);
  };

  const calculateRowTotal = (row: TimesheetRow) => {
      return row.hours.reduce((sum, h) => sum + (h || 0), 0);
  };

  const grandTotal = rows.reduce((sum, row) => sum + calculateRowTotal(row), 0);

  const saveSheet = (newStatus: TimesheetType['status']) => {
      if (!currentWeekStart) return;
      
      const sheet: TimesheetType = {
          id: activeTimesheet?.id || generateId('TS'),
          resourceId: currentUserId,
          periodStart: currentWeekStart.toISOString().split('T')[0],
          status: newStatus,
          totalHours: grandTotal,
          rows: rows
      };
      
      dispatch({ 
          type: 'SUBMIT_TIMESHEET', 
          payload: sheet
      });
      setStatus(newStatus);
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
                <div className={`text-sm font-bold ${theme.colors.text.secondary} mr-4 flex items-center gap-2`}>
                   <span>Total:</span>
                   <span className="text-xl font-black text-nexus-600">{grandTotal.toFixed(1)}</span>
                   <span className="text-xs font-normal">hrs</span>
                </div>
                {isEditable ? (
                    <>
                        <button 
                            onClick={() => saveSheet('Draft')}
                            className={`flex items-center gap-2 px-4 py-2 ${theme.colors.surface} border ${theme.colors.border} ${theme.colors.text.primary} font-medium rounded-lg text-sm hover:${theme.colors.background} disabled:opacity-50`}
                        >
                            <Save size={16}/> Save Draft
                        </button>
                        <button 
                            onClick={() => saveSheet('Submitted')}
                            className={`flex items-center gap-2 px-4 py-2 ${theme.colors.primary} text-white font-medium rounded-lg text-sm ${theme.colors.primaryHover} shadow-sm active:scale-95 transition-all`}
                        >
                            <Send size={16}/> Submit
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-2 text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                        <Lock size={14}/> Period Locked
                    </div>
                )}
            </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                <thead className={`${theme.colors.background} sticky top-0 z-10`}>
                    <tr>
                        <th className={`${theme.components.table.header} w-64 border-r sticky left-0 z-20 ${theme.colors.background} shadow-sm`}>Task / Project</th>
                        {weekDates.map((date, i) => (
                            <th key={i} className={`${theme.components.table.header} w-24 text-center border-r`}>
                                <div className={date.getDay() === 0 || date.getDay() === 6 ? 'text-slate-400' : ''}>
                                    {date.toLocaleDateString('en-US', {weekday: 'short'})}
                                </div>
                                <div className={`text-[10px] font-normal ${date.toDateString() === new Date().toDateString() ? 'bg-nexus-600 text-white px-1.5 rounded-full' : ''}`}>
                                    {date.getDate()}
                                </div>
                            </th>
                        ))}
                        <th className={`${theme.components.table.header} w-24 text-center`}>Total</th>
                    </tr>
                </thead>
                <tbody className={`${theme.colors.surface} divide-y ${theme.colors.border.replace('border-','divide-')}`}>
                    {rows.map((row, rIdx) => (
                        <tr key={rIdx} className={`hover:${theme.colors.background} group`}>
                            <td className={`px-4 py-3 border-r ${theme.colors.border} sticky left-0 z-10 bg-white group-hover:bg-slate-50`}>
                                <div className={`font-medium text-sm ${theme.colors.text.primary} truncate max-w-[200px]`} title={row.taskName}>{row.taskName}</div>
                                <div className={`text-xs ${theme.colors.text.secondary} truncate max-w-[200px]`}>{row.projectName}</div>
                            </td>
                            {row.hours.map((hrs, dIdx) => (
                                <td key={dIdx} className="p-2 text-center border-r border-slate-50">
                                    <input 
                                        type="number" 
                                        min="0"
                                        max="24"
                                        step="0.5"
                                        value={hrs === 0 ? '' : hrs}
                                        onChange={(e) => handleHourChange(rIdx, dIdx, e.target.value)}
                                        disabled={!isEditable}
                                        className={`w-full text-center border ${theme.colors.border} rounded py-1 text-sm focus:ring-2 focus:ring-nexus-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 transition-colors ${hrs > 8 ? 'text-orange-600 font-bold bg-orange-50/50' : ''}`}
                                    />
                                </td>
                            ))}
                            <td className={`px-4 py-3 text-center font-bold text-sm ${theme.colors.text.primary} bg-slate-50/50`}>
                                {calculateRowTotal(row).toFixed(1)}
                            </td>
                        </tr>
                    ))}
                    {/* Totals Row */}
                    <tr className={`${theme.colors.background} font-bold ${theme.colors.text.primary} sticky bottom-0 z-20 shadow-[0_-2px_5px_rgba(0,0,0,0.05)]`}>
                        <td className={`px-4 py-3 border-r ${theme.colors.border} text-right text-xs uppercase sticky left-0 z-30 ${theme.colors.background}`}>Daily Total</td>
                        {weekDates.map((_, i) => (
                            <td key={i} className="px-2 py-3 text-center text-sm border-r border-slate-200">
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
