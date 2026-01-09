
import React from 'react';
import { Shield, UserCheck } from 'lucide-react';
import { useTheme } from '../../../../context/ThemeContext';
import { Input } from '../../../ui/Input';

interface GovernanceTabProps {
    governance: {
        validationMode: string;
        errorThreshold: number;
        dataSteward: string;
        notifyEmails: string;
    };
    setGovernance: (val: any) => void;
}

export const GovernanceTab: React.FC<GovernanceTabProps> = ({ governance, setGovernance }) => {
    const theme = useTheme();

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-xl p-6 shadow-sm`}>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Shield size={18} className="text-green-600"/> Data Quality Gates</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Validation Mode</label>
                        <select 
                            className="w-full p-2 border border-slate-300 rounded text-sm"
                            value={governance.validationMode}
                            onChange={e => setGovernance({...governance, validationMode: e.target.value})}
                        >
                            <option value="Strict">Strict (Fail Batch on Any Error)</option>
                            <option value="Permissive">Permissive (Skip Errors & Log)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Error Threshold (%)</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="range" min="0" max="20" 
                                value={governance.errorThreshold} 
                                onChange={e => setGovernance({...governance, errorThreshold: parseInt(e.target.value)})}
                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-nexus-600"
                            />
                            <span className="w-12 text-right font-bold text-sm">{governance.errorThreshold}%</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Job aborts if error rate exceeds this value.</p>
                    </div>
                </div>
            </div>

            <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-xl p-6 shadow-sm`}>
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><UserCheck size={18} className="text-blue-600"/> Stewardship & Alerting</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Data Steward</label>
                        <Input value={governance.dataSteward} onChange={e => setGovernance({...governance, dataSteward: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Failure Notification</label>
                        <Input value={governance.notifyEmails} onChange={e => setGovernance({...governance, notifyEmails: e.target.value})} placeholder="email@company.com" />
                    </div>
                </div>
            </div>
        </div>
    );
};
