import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Users, Clock, Clipboard, Calendar, CloudRain, Hammer, ShieldAlert } from 'lucide-react';
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

  const activeLog = useMemo(() => 
    state.dailyLogs.find(l => l.projectId === projectId && l.date === selectedDate), 
  [state.dailyLogs, projectId, selectedDate]);

  const handleCreateLog = () => {
      const newLog: DailyLogEntry = {
          id: generateId('DL'),
          projectId,
          date: selectedDate,
          weather: { condition: 'Partly Cloudy', temperature: '68°F' },
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
          contractor: 'General Contractor Team', 
          headcount: 0, 
          hours: 0, 
          location: 'Primary Site', 
          description: '' 
      }]};
      dispatch({ type: 'FIELD_UPDATE_LOG', payload: updatedLog });
  };
  
  const handleUpdateNotes = (notes: string) => {
       if (!activeLog) return;
       dispatch({ type: 'FIELD_UPDATE_LOG', payload: { ...activeLog, notes } });
  };

  if (!selectedDate) return <div className="h-full nexus-empty-pattern flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Initializing Site Controller...</div>;

  const totalWorkers = activeLog?.workLogs.reduce((sum, w) => sum + (Number(w.headcount) || 0), 0) || 0;
  const totalHours = activeLog?.workLogs.reduce((sum, w) => sum + (Number(w.hours) || 0), 0) || 0;

  return (
    <div className={`h-full flex flex-col ${theme.colors.background} animate-in fade-in duration-500`}>
      <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-center gap-4 ${theme.colors.surface} shadow-sm z-10`}>
        <div className="flex items-center gap-3">
            <Calendar size={18} className="text-nexus-500"/>
            <input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl text-sm font-black focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 outline-none bg-slate-50"
            />
        </div>
        {activeLog && (
            <div className="flex gap-4">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border bg-white shadow-sm`}>
                    <Users size={14} className="text-blue-500"/> 
                    <span className="text-[10px] font-black uppercase text-slate-400">Force:</span>
                    <span className="text-sm font-black text-slate-800">{totalWorkers}</span>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border bg-white shadow-sm`}>
                    <Clock size={14} className="text-green-500"/> 
                    <span className="text-[10px] font-black uppercase text-slate-400">Util:</span>
                    <span className="text-sm font-black text-slate-800">{totalHours}h</span>
                </div>
            </div>
        )}
      </div>

      <div className={`flex-1 overflow-y-auto p-8 ${theme.layout.sectionSpacing} scrollbar-thin`}>
        {!activeLog ? (
            <EmptyGrid 
                title="Superintendent Journal Pending"
                description={`A formal site record is required for ${selectedDate}. Compliance mandates require daily reporting of workforce, weather, and safety observations.`}
                onAdd={handleCreateLog}
                actionLabel="Establish Daily Journal"
                icon={Clipboard}
            />
        ) : (
            <div className="space-y-8 animate-nexus-in max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <WeatherWidget weather={activeLog.weather} onAdjust={() => {}} />
                    
                    <Card className="p-6 border-l-4 border-l-amber-500">
                         <NarrativeField 
                            label="Site Safety & Critical Observations"
                            value={activeLog.notes}
                            placeholderLabel="Log any delays, safety briefings, or hazardous site conditions."
                            onSave={handleUpdateNotes}
                        />
                    </Card>
                </div>

                <WorkforceGrid logs={activeLog.workLogs} onAdd={handleAddWork} />
                
                <div className={`p-4 rounded-xl bg-slate-900 text-white flex justify-between items-center shadow-lg relative overflow-hidden`}>
                    <div className="flex items-center gap-3 relative z-10">
                        <ShieldAlert size={20} className="text-nexus-400" />
                        <div>
                            <p className="text-xs font-bold">Field Compliance Audit</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Digital Signature Required</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 relative z-10 uppercase">Auth: {activeLog.submittedBy}</span>
                    <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-1/4 translate-y-1/4">
                        <Clipboard size={160} />
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default DailyLog;