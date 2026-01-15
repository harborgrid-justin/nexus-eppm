import React from 'react';
import { Clock, ShieldCheck, History } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { RiskHistoryItem } from '../../types/index';

interface AuditTrailProps {
  logs: RiskHistoryItem[];
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ logs }) => {
  const theme = useTheme();

  return (
    <div className={`${theme.components.card} overflow-hidden bg-white rounded-[2.5rem] border-slate-200 shadow-sm`}>
        <div className={`p-6 ${theme.colors.background} border-b ${theme.colors.border} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
                <History size={18} className="text-nexus-600"/>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Immutable Transaction Journal</h4>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                <ShieldCheck size={12}/> Handshake Verified
            </div>
        </div>
        <div className={`max-h-[400px] overflow-y-auto scrollbar-thin divide-y divide-slate-50 bg-white`}>
            {logs.length > 0 ? (
                logs.map((log, i) => (
                    <div key={i} className={`p-6 flex gap-6 text-sm hover:${theme.colors.background}/50 transition-all duration-300 group`}>
                        <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full mt-1 ${theme.colors.text.tertiary} group-hover:bg-nexus-600 group-hover:scale-125 group-hover:shadow-[0_0_8px_rgba(14,165,233,0.5)] transition-all bg-white border-2 border-slate-200`}></div>
                            <div className="flex-1 w-0.5 bg-slate-100 mt-2 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1.5">
                                <span className="font-black uppercase text-[11px] tracking-tight text-slate-900 group-hover:text-nexus-700 transition-colors">{log.userId}</span>
                                <span className="text-[10px] font-mono font-black text-slate-400 group-hover:text-slate-600 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 shadow-inner">
                                    <Clock size={10}/> {log.date}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-slate-600 leading-relaxed">{log.action}</p>
                            {log.change && (
                                <div className="mt-3 inline-block">
                                    <span className="text-[9px] font-black text-nexus-600 bg-nexus-50 px-2.5 py-1 rounded-xl uppercase tracking-widest border border-nexus-100 shadow-sm">
                                        Delta: {log.change}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="p-20 text-center nexus-empty-pattern flex flex-col items-center justify-center grayscale opacity-60">
                    <Clock size={40} className="mb-4 text-slate-200" strokeWidth={1}/>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Sequence Log Dormant</p>
                </div>
            )}
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
             <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Authorized ledger access required for record modification.</p>
        </div>
    </div>
  );
};