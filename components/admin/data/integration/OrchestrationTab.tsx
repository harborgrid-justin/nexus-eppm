
import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';
import { Input } from '../../../ui/Input';

interface OrchestrationTabProps {
    orchestration: {
        triggerType: string;
        cronExpression: string;
        frequency: string;
        retryAttempts: number;
        backoffInterval: number;
    };
    setOrchestration: (val: any) => void;
}

export const OrchestrationTab: React.FC<OrchestrationTabProps> = ({ orchestration, setOrchestration }) => {
    const theme = useTheme();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-xl p-6 shadow-sm`}>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={18} className="text-nexus-600"/> Scheduling & Triggers</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Trigger Type</label>
                        <div className="flex gap-2">
                            {['Scheduled', 'Event-Based', 'Manual'].map(t => (
                                <button 
                                    key={t}
                                    onClick={() => setOrchestration({...orchestration, triggerType: t})}
                                    className={`flex-1 py-2 text-sm rounded border ${orchestration.triggerType === t ? 'bg-nexus-50 border-nexus-200 text-nexus-700 font-bold' : 'border-slate-200 text-slate-600'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {orchestration.triggerType === 'Scheduled' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                                <select 
                                    className="w-full p-2 border border-slate-300 rounded text-sm"
                                    value={orchestration.frequency}
                                    onChange={e => setOrchestration({...orchestration, frequency: e.target.value})}
                                >
                                    <option>Hourly</option><option>Daily</option><option>Weekly</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">CRON Expression</label>
                                <Input value={orchestration.cronExpression} onChange={e => setOrchestration({...orchestration, cronExpression: e.target.value})} className="font-mono text-sm" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-xl p-6 shadow-sm`}>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><RefreshCw size={18} className="text-orange-500"/> Retry Policy</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Max Attempts</label>
                        <Input type="number" value={orchestration.retryAttempts} onChange={e => setOrchestration({...orchestration, retryAttempts: parseInt(e.target.value)})}/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Backoff (Seconds)</label>
                        <Input type="number" value={orchestration.backoffInterval} onChange={e => setOrchestration({...orchestration, backoffInterval: parseInt(e.target.value)})}/>
                    </div>
                </div>
            </div>
        </div>
    );
};
