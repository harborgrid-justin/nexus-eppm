
import React from 'react';
import { Clock, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { RiskHistoryItem } from '../../types/index';

interface AuditTrailProps {
  logs: RiskHistoryItem[];
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ logs }) => {
  const theme = useTheme();

  return (
    <div className={`${theme.components.card} overflow-hidden bg-white`}>
        <div className={`p-4 ${theme.colors.background} border-b ${theme.colors.border} text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center justify-between`}>
            <span>Immutable History Log</span>
            <ShieldCheck size={14} className="text-nexus-500"/>
        </div>
        <div className={`divide-y ${theme.colors.border.replace('border-', 'divide-')} bg-white`}>
            {logs.length > 0 ? (
                logs.map((log, i) => (
                    <div key={i} className={`p-4 flex gap-4 text-sm hover:${theme.colors.background}/50 transition-colors group`}>
                        <div className="flex flex-col items-center">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${theme.colors.text.tertiary} group-hover:bg-nexus-500 group-hover:scale-125 transition-all`}></div>
                            <div className="flex-1 w-px bg-slate-100 mt-2"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={theme.colors.text.primary}><span className="font-black uppercase text-[11px] tracking-tight">{log.userId}</span> <span className="text-slate-500">{log.action}</span></p>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1">
                                    <Clock size={10}/> {log.date}
                                </span>
                                {log.change && <span className="text-[9px] font-bold text-nexus-600 bg-nexus-50 px-1.5 rounded uppercase tracking-tighter border border-nexus-100">{log.change}</span>}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-12 text-center nexus-empty-pattern">
                    <Clock size={32} className="mx-auto mb-3 text-slate-200 opacity-50"/>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">No chronological data committed</p>
                </div>
            )}
        </div>
    </div>
  );
};
