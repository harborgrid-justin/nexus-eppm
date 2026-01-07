import React from 'react';
import { ChevronLeft, ChevronRight, Save, Send, Lock, Plus, Clock } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useTheme } from '../../context/ThemeContext';
import { useTimesheetLogic } from '../../hooks/domain/useTimesheetLogic';
import { Button } from '../ui/Button';
import { EmptyGrid } from '../common/EmptyGrid';

const Timesheet: React.FC = () => {
  const theme = useTheme();
  const { 
      currentWeekStart, weekDates, rows, status, isEditable, grandTotal,
      handleHourChange, shiftWeek, saveSheet, addRow, user
  } = useTimesheetLogic();

  if (!currentWeekStart || !user) return <div className={`p-6 ${theme.colors.text.secondary}`}>Loading timesheet...</div>;

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
                    <div className={`flex items-center gap-2 ${theme.colors.text.tertiary} ${theme.colors.background} px-3 py-2 rounded-lg border ${theme.colors.border}`}>
                        <Lock size={14}/> Period Locked
                    </div>
                )}
            </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-auto">
            {rows.length === 0 && !isEditable ? (
                <div className="h-full flex items-center justify-center p-8">
                     <EmptyGrid 
                        title="Timesheet Empty" 
                        description="No hours recorded for this period."
                        icon={Clock}
                        actionLabel="View Current Period"
                        onAdd={() => shiftWeek('next')}
                     />
                </div>
            ) : (
                <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                    <thead className={`${theme.colors.background} sticky top-0 z-10`}>
                        <tr>
                            <th className={`${theme.components.table.header} w-64 border-r ${theme.colors.border} sticky left-0 z-20 ${theme.colors.background} shadow-sm`}>Task / Project</th>
                            {weekDates.map((date, i) => (
                                <th key={i} className={`${theme.components.table.header} w-24 text-center border-r ${theme.colors.border}`}>
                                    <div className={date.getDay() === 0 || date.getDay() === 6 ? theme.colors.text.tertiary : theme.colors.text.primary}>
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
                                    <td key={dIdx} className={`p-2 text-center border-r ${theme.colors.border}`}>
                                        <input 
                                            type="number" 
                                            min="0"
                                            max="24"
                                            step="0.5"
                                            value={hrs === 0 ? '' : hrs}
                                            onChange={(e) => handleHourChange(rIdx, dIdx, e.target.value)}
                                            disabled={!isEditable}
                                            className={`w-full text-center border ${theme.colors.border} rounded py-1 text-sm focus:ring-2 focus:ring-nexus-500 focus:outline-none disabled:bg-slate-50 disabled:text-slate-500 transition-colors ${hrs > 8 ? 'text-orange-600 font-bold bg-orange-50/50' : theme.colors.surface}`}
                                        />
                                    </td>
                                ))}
                                <td className={`px-4 py-3 text-center font-bold text-sm ${theme.colors.text.primary} ${theme.colors.background}/50`}>
                                    {row.hours.reduce((a,b) => a+b, 0).toFixed(1)}
                                </td>
                            </tr>
                        ))}
                        {isEditable && (
                            <tr>
                                <td colSpan={9} className="p-2">
                                    <Button variant="ghost" size="sm" icon={Plus} onClick={addRow} className={`w-full border-2 border-dashed ${theme.colors.border} ${theme.colors.text.secondary}`}>Add Line</Button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    </div>
  );
};

export default Timesheet;