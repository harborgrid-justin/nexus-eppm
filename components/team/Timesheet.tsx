
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Timesheet as TimesheetType, TimesheetRow } from '../../types/resource';
import { ChevronLeft, ChevronRight, Save, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../context/ThemeContext';

const Timesheet: React.FC = () => {
  const { state } = useData();
  const theme = useTheme();
  // Hydration safety: Start with null/default and sync on mount
  const [currentWeekStart, setCurrentWeekStart] = useState<Date | null>(null);
  const [status, setStatus] = useState<'Draft' | 'Submitted'>('Draft');

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

  // Mock initial rows based on assigned tasks
  const [rows, setRows] = useState<TimesheetRow[]>(() => {
      // Find tasks assigned to 'R-001' (Mock User)
      const tasks: any[] = [];
      const targetResourceId = 'R-001';
      
      state.projects.forEach(p => {
          p.tasks.forEach(t => {
              if (t.assignments.some(a => a.resourceId === targetResourceId)) {
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
      return tasks.slice(0, 5); // Limit for demo
  });

  const handleHourChange = (rowIndex: number, dayIndex: number, val: string) => {
      if (status === 'Submitted') return;
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

  const shiftWeek = (direction: 'prev' | 'next') => {
      if (!currentWeekStart) return;
      const newDate = new Date(currentWeekStart);
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      setCurrentWeekStart(newDate);
      // In a real app, fetch data for new week here
      setStatus('Draft'); // Reset for demo
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
                <Badge variant={status === 'Draft' ? 'neutral' : 'success'}>
                    {status === 'Draft' ? 'Draft' : 'Submitted'}
                </Badge>
            </div>

            <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${theme.colors.text.secondary} mr-4`}>Total: {grandTotal.toFixed(1)} hrs</span>
                <button 
                    disabled={status === 'Submitted'}
                    className={`flex items-center gap-2 px-4 py-2 ${theme.colors.surface} border ${theme.colors.border} ${theme.colors.text.primary} font-medium rounded-lg text-sm hover:${theme.colors.background} disabled:opacity-50`}
                >
                    <Save size={16}/> Save
                </button>
                <button 
                    disabled={status === 'Submitted'}
                    onClick={() => setStatus('Submitted')}
                    className={`flex items-center gap-2 px-4 py-2 ${theme.colors.primary} text-white font-medium rounded-lg text-sm ${theme.colors.primaryHover} disabled:opacity-100`}
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
                                        disabled={status === 'Submitted'}
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
