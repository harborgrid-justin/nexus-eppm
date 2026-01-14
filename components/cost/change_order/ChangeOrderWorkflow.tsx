
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
            <div className={`${theme.components.card} p-5`}>
                <h3 className="font-bold text-slate-800 mb-6 border-b border-slate-100 pb-2">Approval Chain</h3>
                <div className="space-y-6">
                    {['Project Manager', 'Finance Controller', 'Program Sponsor'].map((role, i) => (
                        <div key={role} className="flex items-center gap-4 relative">
                            {/* Connector Line */}
                            {i < 2 && <div className="absolute left-4 top-8 w-0.5 h-8 bg-slate-100"></div>}
                            
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white ${i===0 ? `${theme.colors.semantic.success.border} ${theme.colors.semantic.success.text}` : `${theme.colors.border} text-slate-300`}`}>
                                {i === 0 ? <CheckCircle size={16}/> : i+1}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-800">{role}</p>
                                <p className="text-xs text-slate-500">{i===0 ? 'Approved on Oct 12' : 'Pending Review'}</p>
                            </div>
                            {i === 0 && <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">Sarah Chen</span>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="font-bold text-slate-800 text-sm mb-2">Audit Log</h3>
                <div className="border rounded-xl overflow-hidden border-slate-200">
                    {(co.history || []).map((item, idx) => (
                        <div key={idx} className={`flex gap-3 text-sm p-3 hover:${theme.colors.background} border-b border-slate-50 last:border-0`}>
                            <div className="mt-0.5"><Clock size={14} className="text-slate-400"/></div>
                            <div>
                                <p className={theme.colors.text.primary}><span className="font-bold">{item.userId}</span> {item.action}</p>
                                <p className={`${theme.typography.small} mt-0.5`}>{item.date}</p>
                                {item.comment && <p className="text-xs text-slate-600 italic mt-1 bg-slate-50 p-1.5 rounded border border-slate-100">"{item.comment}"</p>}
                            </div>
                        </div>
                    ))}
                    {(!co.history || co.history.length === 0) && <p className="text-slate-400 text-xs italic p-4 text-center">No history available.</p>}
                </div>
            </div>
        </div>
    );
};
