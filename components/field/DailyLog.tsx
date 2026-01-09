
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { CloudRain, Sun, Users, Clock, AlertCircle, Plus, Calendar, Clipboard } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { DailyLogEntry } from '../../types';
import { generateId } from '../../utils/formatters';
import { EmptyGrid } from '../common/EmptyGrid';
import { NarrativeField } from '../common/NarrativeField';
import { FieldPlaceholder } from '../common/FieldPlaceholder';

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
          submittedBy: user?.name || 'System User', // Updated User Context
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

  if (!selectedDate) return <div className={`p-6 ${theme.colors.text.secondary} animate-pulse font-bold uppercase tracking-widest text-xs`}>Initializing Site Logs...</div>;

  const totalWorkers = activeLog?.workLogs.reduce((sum, w) => sum + w.headcount, 0) || 0;
  const totalHours = activeLog?.workLogs.reduce((sum, w) => sum + w.hours, 0) || 0;

  return (
    <div className={`h-full flex flex-col ${theme.colors.background}`}>
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
            <div className="space-y-8 animate-nexus-in max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className={`${theme.components.card} p-5`}>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <CloudRain size={16} className="text-nexus-500"/> Meteorological Conditions
                        </h3>
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <Sun size={32} className="text-yellow-500" />
                                <div>
                                    <p className="text-2xl font-black text-slate-900">{activeLog.weather.temperature}</p>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{activeLog.weather.condition}</p>
                                </div>
                            </div>
                            <Button size="sm" variant="ghost">Adjust Conditions</Button>
                        </div>
                    </div>

                    <NarrativeField 
                        label="Site Safety & General Notes"
                        value={activeLog.notes}
                        placeholderLabel="No strategic site observations recorded."
                        onAdd={() => {}}
                    />
                </div>

                <div className={`${theme.components.card} overflow-hidden`}>
                    <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.surface} flex justify-between items-center`}>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <Users size={16} className="text-blue-600"/> Workforce Distribution
                        </h3>
                        <Button size="sm" icon={Plus} onClick={handleAddWork}>Add Labor Entry</Button>
                    </div>
                    <div className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                        {activeLog.workLogs.length > 0 ? (
                            activeLog.workLogs.map(log => (
                                <div key={log.id} className={`p-5 hover:${theme.colors.background} transition-colors group`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`font-black text-slate-900`}>{log.contractor}</span>
                                        <span className={`text-[10px] font-mono font-bold ${theme.colors.background} border ${theme.colors.border} px-2 py-1 rounded text-slate-500 uppercase`}>Code: {log.costCode || 'General'}</span>
                                    </div>
                                    <p className="text-sm text-slate-600 mb-3">{log.description}</p>
                                    <div className={`flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400`}>
                                        <span className="flex items-center gap-1.5"><Users size={12}/> {log.headcount} Pax</span>
                                        <span className="flex items-center gap-1.5"><Clock size={12}/> {log.hours} Man-Hours</span>
                                        <span>Loc: {log.location}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-1">
                                <FieldPlaceholder label="No labor records logged for this shift." onAdd={handleAddWork} />
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="text-xs text-slate-400 text-right font-mono">
                    Filed by: {activeLog.submittedBy}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DailyLog;
