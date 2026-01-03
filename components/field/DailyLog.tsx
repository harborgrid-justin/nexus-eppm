
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { CloudRain, Sun, Cloud, Thermometer, Users, Clock, AlertCircle, Plus, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { DailyLogEntry } from '../../types';
import { generateId } from '../../utils/formatters';

interface DailyLogProps {
  projectId: string;
}

const DailyLog: React.FC<DailyLogProps> = ({ projectId }) => {
  const { state, dispatch } = useData();
  const theme = useTheme();
  // Hydration safety: Start null or fixed string, sync in effect
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  const logs = useMemo(() => 
    state.dailyLogs.filter(l => l.projectId === projectId && l.date === selectedDate), 
  [state.dailyLogs, projectId, selectedDate]);

  const activeLog = logs.length > 0 ? logs[0] : null;

  const handleCreateLog = () => {
      const newLog: DailyLogEntry = {
          id: generateId('DL'),
          projectId,
          date: selectedDate,
          weather: { condition: 'Sunny', temperature: '75°F' },
          workLogs: [],
          delays: [],
          submittedBy: 'CurrentUser'
      };
      dispatch({ type: 'FIELD_ADD_LOG', payload: newLog });
  };

  const handleAddWork = () => {
      if (!activeLog) return;
      const updatedLog = { ...activeLog, workLogs: [...activeLog.workLogs, { 
          id: generateId('WL'), 
          contractor: 'New Crew', 
          headcount: 5, 
          hours: 40, 
          location: 'Zone 1', 
          description: 'General labor' 
      }]};
      dispatch({ type: 'FIELD_UPDATE_LOG', payload: updatedLog });
  };

  if (!selectedDate) return <div className={`p-6 ${theme.colors.text.secondary}`}>Loading logs...</div>;

  const totalWorkers = activeLog?.workLogs.reduce((sum, w) => sum + w.headcount, 0) || 0;
  const totalHours = activeLog?.workLogs.reduce((sum, w) => sum + w.hours, 0) || 0;

  return (
    <div className={`h-full flex flex-col ${theme.colors.background}`}>
      {/* Date Picker & Summary */}
      <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-center gap-4 ${theme.colors.surface}`}>
        <div className="flex items-center gap-2">
            <Calendar size={18} className={theme.colors.text.tertiary}/>
            <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`p-2 border ${theme.colors.border} rounded-lg text-sm focus:ring-2 focus:ring-nexus-500 outline-none ${theme.colors.surface} ${theme.colors.text.primary}`}
            />
        </div>
        <div className={`flex gap-4 text-xs font-medium ${theme.colors.text.secondary}`}>
             <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full border ${theme.colors.semantic.info.bg} ${theme.colors.semantic.info.border}`}>
                <Users size={14} className={theme.colors.semantic.info.text}/> {totalWorkers} Workers
             </div>
             <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full border ${theme.colors.semantic.success.bg} ${theme.colors.semantic.success.border}`}>
                <Clock size={14} className={theme.colors.semantic.success.text}/> {totalHours} Hours
             </div>
             <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full border ${theme.colors.semantic.warning.bg} ${theme.colors.semantic.warning.border}`}>
                <AlertCircle size={14} className={theme.colors.semantic.warning.text}/> {activeLog?.delays.length || 0} Delays
             </div>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto p-6 ${theme.layout.sectionSpacing}`}>
        {!activeLog && (
            <div className="text-center p-12">
                <p className="text-slate-500 mb-4">No log entry for this date.</p>
                <Button onClick={handleCreateLog}>Create Daily Report</Button>
            </div>
        )}

        {activeLog && (
            <>
                {/* Weather Card */}
                <div className={`${theme.components.card} p-5`}>
                    <div className="flex justify-between items-start mb-4">
                        <h3 className={`${theme.typography.h3} flex items-center gap-2`}><CloudRain size={18} className="text-nexus-500"/> Site Conditions</h3>
                        <Button size="sm" variant="ghost" icon={Plus}>Update</Button>
                    </div>
                    <div className={`grid grid-cols-3 ${theme.layout.gridGap}`}>
                        <div className={`p-3 ${theme.colors.background} rounded-lg border ${theme.colors.border} flex flex-col items-center`}>
                            <span className={theme.typography.label}>Conditions</span>
                            <Sun size={24} className="text-yellow-500 my-1"/>
                            <span className={`font-bold ${theme.colors.text.primary}`}>{activeLog.weather.temperature} / {activeLog.weather.condition}</span>
                        </div>
                    </div>
                </div>

                {/* Work Logs */}
                <div className={`${theme.components.card} overflow-hidden`}>
                    <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.surface} flex justify-between items-center`}>
                        <h3 className={`${theme.typography.h3} flex items-center gap-2`}><Users size={18} className="text-blue-600"/> Work Performed</h3>
                        <Button size="sm" icon={Plus} onClick={handleAddWork}>Add Entry</Button>
                    </div>
                    <div className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                        {activeLog.workLogs.map(log => (
                            <div key={log.id} className={`p-4 hover:${theme.colors.background} transition-colors`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`font-bold ${theme.colors.text.primary}`}>{log.contractor}</span>
                                    {log.costCode && <span className={`text-xs font-mono ${theme.colors.background} border ${theme.colors.border} px-2 py-1 rounded ${theme.colors.text.secondary}`}>Code: {log.costCode}</span>}
                                </div>
                                <p className={`${theme.typography.body} mb-2`}>{log.description}</p>
                                <div className={`flex gap-4 text-xs ${theme.colors.text.tertiary}`}>
                                    <span><strong>{log.headcount}</strong> Workers</span>
                                    <span><strong>{log.hours}</strong> Hours</span>
                                    <span>Location: <strong>{log.location}</strong></span>
                                </div>
                            </div>
                        ))}
                        {activeLog.workLogs.length === 0 && <div className="p-8 text-center text-slate-400">No work logged.</div>}
                    </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default DailyLog;
