
import React from 'react';
import { Shield, UserCheck, AlertTriangle, ShieldCheck } from 'lucide-react';
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
        <div className="max-w-3xl mx-auto space-y-8 animate-nexus-in">
            <div className={`bg-white border ${theme.colors.border} rounded-[2rem] p-8 shadow-sm relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 p-12 bg-green-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-green-500/10 transition-colors"></div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-8 flex items-center gap-3 relative z-10 border-b pb-4 border-slate-50">
                    <Shield size={18} className="text-green-600"/> Data Integrity Gates
                </h3>
                <div className="space-y-10 relative z-10">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Global Validation Strategy</label>
                        <select 
                            className={`w-full p-4 border ${theme.colors.border} rounded-2xl text-sm font-black bg-slate-50 focus:bg-white transition-all outline-none focus:ring-8 focus:ring-nexus-500/5 focus:border-nexus-500 text-slate-800 shadow-inner`}
                            value={governance.validationMode}
                            onChange={e => setGovernance({...governance, validationMode: e.target.value})}
                        >
                            <option value="Strict">Strict Enforcement (Fail on Any Error)</option>
                            <option value="Permissive">Log & Continue (Quarantine Faulty Rows)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Abort Threshold (Error Rate %)</label>
                        <div className="flex items-center gap-6">
                            <input 
                                type="range" min="0" max="20" 
                                value={governance.errorThreshold} 
                                onChange={e => setGovernance({...governance, errorThreshold: parseInt(e.target.value)})}
                                className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-nexus-600 shadow-inner"
                            />
                            <div className="bg-slate-900 text-white w-16 h-10 rounded-xl flex items-center justify-center font-mono font-black shadow-lg">
                                {governance.errorThreshold}%
                            </div>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4 flex items-center gap-2">
                            <AlertTriangle size={14} className="text-red-500" /> Auto-termination triggered if records exceed this boundary.
                        </p>
                    </div>
                </div>
            </div>

            <div className={`bg-white border ${theme.colors.border} rounded-[2rem] p-8 shadow-sm relative overflow-hidden group`}>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] mb-8 flex items-center gap-3 relative z-10 border-b pb-4 border-slate-50">
                    <UserCheck size={18} className="text-blue-600"/> Ownership & Escalation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Primary Data Steward</label>
                        <Input value={governance.dataSteward} onChange={e => setGovernance({...governance, dataSteward: e.target.value})} className="font-bold text-slate-800" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Security Alert Recipient</label>
                        <Input value={governance.notifyEmails} onChange={e => setGovernance({...governance, notifyEmails: e.target.value})} placeholder="admin@nexus-ppm.com" className="font-mono font-black" />
                    </div>
                </div>
                <div className="mt-8 p-6 bg-slate-900 rounded-[2rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
                     <div className="relative z-10 flex gap-5 items-start">
                        <div className="p-3 bg-white/10 rounded-2xl border border-white/10 shadow-inner">
                            <ShieldCheck size={28} className="text-nexus-400"/>
                        </div>
                        <div>
                            <h4 className="font-black text-base tracking-tight uppercase mb-2">Immutable Audit Chain</h4>
                            <p className="text-[10px] text-slate-400 leading-relaxed font-medium uppercase tracking-tight max-w-lg">
                                Governance parameters are session-locked once a transaction thread begins. All modifications to these gates are permanently recorded in the global system audit ledger.
                            </p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};
