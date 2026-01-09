import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Users, Clock, Clipboard, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { DailyLogEntry } from '../../types';
import { generateId } from '../../utils/formatters';
import { EmptyGrid } from '../common/EmptyGrid';
import { NarrativeField } from '../common/NarrativeField';
import { WeatherWidget } from './daily/WeatherWidget';
import { WorkforceGrid } from './daily/WorkforceGrid';
import { Card } from '../ui/Card';

interface DailyLogProps {
  projectId: string;
}

const DailyLog: React.FC<DailyLogProps> = ({ projectId }) => {
  const { state, dispatch } = useData();
  const { user } = useAuth();
  const theme = useTheme();
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
          submittedBy: user?.name || 'System User',
          notes: ''
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
  
  const handleUpdateNotes = (notes: string) => {
       if (!activeLog) return;
       dispatch({ type: 'FIELD_UPDATE_LOG', payload: { ...activeLog, notes } });
  };

  if (!selectedDate) return <div className={`p-6 ${theme.colors.text.secondary} animate-pulse font-bold uppercase tracking-widest text-xs`}>Initializing Site Logs...</div>;

  const totalWorkers = activeLog?.workLogs.reduce((sum, w) => sum + w.headcount, 0) || 0;
  const totalHours = activeLog?.workLogs.reduce((sum, w) => sum + w.hours, 0) || 0;

  return (
    <div className={`h-full flex flex-col ${theme.colors.background}`}>
      {/* Date Header */}
      <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-center gap-4 ${theme.colors.surface}`}>
        <div className="flex items-center gap-2">
            <Calendar size={18} className={theme.colors.text.tertiary}/>
            <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className={`p-2 border ${theme.colors.border} rounded-lg text-sm font-bold focus:ring-2 focus:ring-nexus-500 outline-none ${theme.colors.surface} ${theme.colors.text.primary}`}
            />
        </div>
        {activeLog && (
            <div className={`flex gap-4 text-xs font-black uppercase tracking-tighter ${theme.colors.text.secondary}`}>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${theme.colors.semantic.info.bg} ${theme.colors.semantic.info.border}`}>
                    <Users size={14} className={theme.colors.semantic.info.text}/> {totalWorkers} Force
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${theme.colors.semantic.success.bg} ${theme.colors.semantic.success.border}`}>
                    <Clock size={14} className={theme.colors.semantic.success.text}/> {totalHours} Hours
                </div>
            </div>
        )}
      </div>

      <div className={`flex-1 overflow-y-auto p-6 ${theme.layout.sectionSpacing}`}>
        {!activeLog ? (
            <EmptyGrid 
                title="Daily Report Pending"
                description={`No superintendent journal has been initialized for ${selectedDate}. Reports are mandatory for payroll and insurance compliance.`}
                onAdd={handleCreateLog}
                actionLabel="Initialize Daily Report"
                icon={Clipboard}
            />
        ) : (
            <div className="space-y-6 animate-nexus-in max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <WeatherWidget weather={activeLog.weather} onAdjust={() => {}} />
                    
                    <Card className="p-5">
                         <NarrativeField 
                            label="Site Safety & General Notes"
                            value={activeLog.notes}
                            placeholderLabel="No strategic site observations recorded."
                            onSave={handleUpdateNotes}
                        />
                    </Card>
                </div>

                <WorkforceGrid logs={activeLog.workLogs} onAdd={handleAddWork} />
                
                <div className="text-xs text-slate-400 text-right font-mono mt-4">
                    Filed by: {activeLog.submittedBy}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DailyLog;
