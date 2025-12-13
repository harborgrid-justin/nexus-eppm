
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Timesheet as TimesheetType, TimesheetRow } from '../../types/resource';
import { ChevronLeft, ChevronRight, Save, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';

const Timesheet: React.FC = () => {
  const { state } = useData();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getMonday(new Date()));
  const [status, setStatus] = useState<'Draft' | 'Submitted'>('Draft');

  function getMonday(d: Date) {
    d = new Date(d);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  }

  const weekDates = useMemo(() => {
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
      const tasks = [];
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
      const newDate = new Date(currentWeekStart);
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
      setCurrentWeekStart(newDate);
      // In a real app, fetch data for new week here
      setStatus('Draft'); // Reset for demo
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50">
            <div className="flex items-center gap-4">
                <div className="flex items-center bg-white border border-slate-300 rounded-lg p-1">
                    <button onClick={() => shiftWeek('prev')} className="p-1 hover:bg-slate-100 rounded text-slate-600"><ChevronLeft size={20}/></button>
                    <span className="px-4 text-sm font-medium text-slate-800 min-w-[140px] text-center">
                        {currentWeekStart.toLocaleDateString(undefined, {month:'short', day:'numeric'})} - {weekDates[6].toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                    </span>
                    <button onClick={() => shiftWeek('next')} className="p-1 hover:bg-slate-100 rounded text-slate-600"><ChevronRight size={20}/></button>
                </div>
                <Badge variant={status === 'Draft' ? 'neutral' : 'success'}>
                    {status === 'Draft' ? 'Draft' : 'Submitted'}
                </Badge>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-600 mr-4">Total: {grandTotal.toFixed(1)} hrs</span>
                <button 
                    disabled={status === 'Submitted'}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50"
                >
                    <Save size={16}/> Save
                </button>
                <button 
                    disabled={status === 'Submitted'}
                    onClick={() => setStatus('Submitted')}
                    className="flex items-center gap-2 px-4 py-2 bg-nexus-600 text-white font-medium rounded-lg text-sm hover:bg-nexus-700 disabled:bg-green-600 disabled:opacity-100"
                >
                    {status === 'Submitted' ? <CheckCircle size={16}/> : <Send size={16}/>}
                    {status === 'Submitted' ? 'Submitted' : 'Submit'}
                </button>
            </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b w-64 border-r">Task / Project</th>
                        {weekDates.map((date, i) => (
                            <th key={i} className="px-2 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b w-24">
                                <div>{date.toLocaleDateString('en-US', {weekday: 'short'})}</div>
                                <div className="text-[10px] font-normal">{date.getDate()}</div>
                            </th>
                        ))}
                        <th className="px-4 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50 border-b w-24">Total</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                    {rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50">
                            <td className="px-4 py-3 border-r border-slate-100">
                                <div className="font-medium text-sm text-slate-900 truncate max-w-[200px]" title={row.taskName}>{row.taskName}</div>
                                <div className="text-xs text-slate-500 truncate max-w-[200px]">{row.projectName}</div>
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
                                        className="w-full text-center border border-slate-200 rounded py-1 text-sm focus:ring-2 focus:ring-nexus-500 focus:outline-none disabled:bg-slate-50"
                                    />
                                </td>
                            ))}
                            <td className="px-4 py-3 text-center font-bold text-sm text-slate-700 bg-slate-50/50">
                                {calculateRowTotal(row).toFixed(1)}
                            </td>
                        </tr>
                    ))}
                    {/* Totals Row */}
                    <tr className="bg-slate-100 font-bold text-slate-700">
                        <td className="px-4 py-3 border-r border-slate-200 text-right text-xs uppercase">Daily Total</td>
                        {weekDates.map((_, i) => (
                            <td key={i} className="px-2 py-3 text-center text-sm">
                                {calculateDailyTotal(i).toFixed(1)}
                            </td>
                        ))}
                        <td className="px-4 py-3 text-center text-sm bg-slate-200">
                            {grandTotal.toFixed(1)}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        {rows.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <AlertCircle size={32} className="mb-2 opacity-50"/>
                <p>No tasks assigned for this period.</p>
            </div>
        )}
    </div>
  );
};

export default Timesheet;
