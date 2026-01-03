
import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Cloud, Thermometer, Users, Clock, AlertCircle, Plus, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

interface DailyLogProps {
  projectId: string;
}

const DailyLog: React.FC<DailyLogProps> = ({ projectId }) => {
  const theme = useTheme();
  // Hydration safety: Start null or fixed string, sync in effect
  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Mock Data
  const logs = [
    { id: 1, type: 'Weather', time: '07:00 AM', conditions: 'Cloudy', temp: '62°F', notes: 'Light rain expected.' },
    { id: 2, type: 'Work', contractor: 'Acme Concrete', workers: 12, hours: 96, notes: 'Poured foundation for Zone A.' },
    { id: 3, type: 'Delay', category: 'Material', duration: '2 hrs', notes: 'Waiting for rebar delivery.' }
  ];

  if (!selectedDate) return <div className={`p-6 ${theme.colors.text.secondary}`}>Loading logs...</div>;

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
                <Users size={14} className={theme.colors.semantic.info.text}/> 42 Workers
             </div>
             <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full border ${theme.colors.semantic.success.bg} ${theme.colors.semantic.success.border}`}>
                <Clock size={14} className={theme.colors.semantic.success.text}/> 336 Hours
             </div>
             <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full border ${theme.colors.semantic.warning.bg} ${theme.colors.semantic.warning.border}`}>
                <AlertCircle size={14} className={theme.colors.semantic.warning.text}/> 1 Delay
             </div>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto p-6 ${theme.layout.sectionSpacing}`}>
        {/* Weather Card */}
        <div className={`${theme.components.card} p-5`}>
            <div className="flex justify-between items-start mb-4">
                <h3 className={`${theme.typography.h3} flex items-center gap-2`}><CloudRain size={18} className="text-nexus-500"/> Site Conditions</h3>
                <Button size="sm" variant="ghost" icon={Plus}>Update</Button>
            </div>
            <div className={`grid grid-cols-3 ${theme.layout.gridGap}`}>
                <div className={`p-3 ${theme.colors.background} rounded-lg border ${theme.colors.border} flex flex-col items-center`}>
                    <span className={theme.typography.label}>Morning</span>
                    <Cloud size={24} className="text-slate-400 my-1"/>
                    <span className={`font-bold ${theme.colors.text.primary}`}>62°F / Cloudy</span>
                </div>
                <div className={`p-3 ${theme.colors.background} rounded-lg border ${theme.colors.border} flex flex-col items-center`}>
                    <span className={theme.typography.label}>Noon</span>
                    <Sun size={24} className="text-yellow-500 my-1"/>
                    <span className={`font-bold ${theme.colors.text.primary}`}>75°F / Sunny</span>
                </div>
                <div className={`p-3 ${theme.colors.background} rounded-lg border ${theme.colors.border} flex flex-col items-center`}>
                    <span className={theme.typography.label}>Afternoon</span>
                    <CloudRain size={24} className="text-blue-400 my-1"/>
                    <span className={`font-bold ${theme.colors.text.primary}`}>68°F / Rain</span>
                </div>
            </div>
        </div>

        {/* Work Logs */}
        <div className={`${theme.components.card} overflow-hidden`}>
            <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.surface} flex justify-between items-center`}>
                <h3 className={`${theme.typography.h3} flex items-center gap-2`}><Users size={18} className="text-blue-600"/> Work Performed</h3>
                <Button size="sm" icon={Plus}>Add Entry</Button>
            </div>
            <div className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                {[1, 2, 3].map(i => (
                    <div key={i} className={`p-4 hover:${theme.colors.background} transition-colors`}>
                        <div className="flex justify-between items-start mb-2">
                            <span className={`font-bold ${theme.colors.text.primary}`}>Subcontractor {i}</span>
                            <span className={`text-xs font-mono ${theme.colors.background} border ${theme.colors.border} px-2 py-1 rounded ${theme.colors.text.secondary}`}>Cost Code: 03-3000</span>
                        </div>
                        <p className={`${theme.typography.body} mb-2`}>Detailed description of work performed in specific area.</p>
                        <div className={`flex gap-4 text-xs ${theme.colors.text.tertiary}`}>
                            <span><strong>8</strong> Workers</span>
                            <span><strong>64</strong> Hours</span>
                            <span>Location: <strong>Zone B</strong></span>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Notes / Delays */}
        <div className={`${theme.components.card} p-5`}>
             <h3 className={`${theme.typography.h3} mb-4 flex items-center gap-2`}><AlertCircle size={18} className="text-orange-500"/> Delays & Disruptions</h3>
             <div className={`p-3 border-l-4 border-l-orange-400 ${theme.colors.semantic.warning.bg} rounded-r-lg`}>
                <div className={`flex justify-between ${theme.colors.semantic.warning.text} text-sm font-bold`}>
                    <span>Material Delay - Rebar</span>
                    <span>2 Hours</span>
                </div>
                <p className={`text-xs ${theme.colors.semantic.warning.text} mt-1`}>Truck broke down en route. Crew shifted to prep work.</p>
             </div>
        </div>
      </div>
    </div>
  );
};

export default DailyLog;
