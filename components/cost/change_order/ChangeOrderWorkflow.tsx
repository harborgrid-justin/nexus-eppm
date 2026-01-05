
import React from 'react';
import { ChangeOrder } from '../../../types';
import { CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface ChangeOrderWorkflowProps {
    co: ChangeOrder;
}

export const ChangeOrderWorkflow: React.FC<ChangeOrderWorkflowProps> = ({ co }) => {
    const theme = useTheme();
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className={`${theme.components.card} p-4`}>
                <h3 className="font-bold text-slate-800 mb-4">Approval Chain</h3>
                <div className="space-y-4">
                    {['Project Manager', 'Finance Controller', 'Program Sponsor'].map((role, i) => (
                        <div key={role} className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${i===0 ? `${theme.colors.semantic.success.bg} border-green-500 ${theme.colors.semantic.success.text}` : `${theme.colors.surface} ${theme.colors.border} text-slate-300`}`}>
                                {i === 0 ? <CheckCircle size={16}/> : i+1}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-800">{role}</p>
                                <p className="text-xs text-slate-500">{i===0 ? 'Approved on Oct 12' : 'Pending Review'}</p>
                            </div>
                            {i === 0 && <span className="text-xs font-mono text-slate-400">Sarah Chen</span>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="font-bold text-slate-800 text-sm">Audit Log</h3>
                {(co.history || []).map((item, idx) => (
                    <div key={idx} className={`flex gap-3 text-sm p-2 hover:${theme.colors.background} rounded`}>
                        <div className="mt-1"><Clock size={14} className="text-slate-400"/></div>
                        <div>
                            <p className={theme.colors.text.primary}><span className="font-bold">{item.userId}</span> {item.action}</p>
                            <p className={`${theme.typography.small} mt-0.5`}>{item.date}</p>
                            {item.comment && <p className="text-xs text-slate-600 italic mt-1">"{item.comment}"</p>}
                        </div>
                    </div>
                ))}
                {(!co.history || co.history.length === 0) && <p className="text-slate-400 text-xs italic">No history available.</p>}
            </div>
        </div>
    );
};
