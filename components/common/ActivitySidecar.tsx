import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { History, User, Zap, MessageSquare, Clock, X, Terminal, CheckCircle } from 'lucide-react';
import { EmptyGrid } from './EmptyGrid';
import { useTheme } from '../../context/ThemeContext';

interface ActivitySidecarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ActivitySidecar: React.FC<ActivitySidecarProps> = ({ isOpen, onClose }) => {
  const { state } = useData();
  const theme = useTheme();
  const auditLogs = state.governance.auditLog || [];

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const getTimeString = (dateStr: string) => {
    if (!mounted) return '...';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-y-0 right-0 w-96 ${theme.colors.surface} border-l ${theme.colors.border} shadow-2xl z-[60] flex flex-col animate-in slide-in-from-right duration-500`}>
      <div className={`p-6 border-b ${theme.colors.border} flex justify-between items-center bg-slate-50/50`}>
        <h3 className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.colors.text.tertiary} flex items-center gap-3`}>
          <History size={16} className="text-nexus-600" /> Operational Pulse
        </h3>
        <button onClick={onClose} className={`p-2 hover:${theme.colors.background} rounded-full text-slate-400 transition-all active:scale-90`}><X size={20} /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-white">
        {auditLogs.length > 0 ? (
            <div className="p-8 space-y-8">
                {auditLogs.slice(0, 50).map((log, idx) => (
                    <div key={`${log.date}-${idx}`} className="relative pl-8 border-l-2 border-slate-100 group">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-200 group-hover:border-nexus-500 transition-all duration-300 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-slate-300 rounded-full group-hover:bg-nexus-500 transition-colors"></div>
                        </div>
                        <div className="text-sm">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className={`text-[11px] font-black uppercase tracking-tight ${theme.colors.text.primary} truncate max-w-[150px]`}>{log.user}</span>
                            <span className={`text-[9px] font-mono font-bold ${theme.colors.text.tertiary}`}>{getTimeString(log.date)}</span>
                        </div>
                        <p className={`text-xs ${theme.colors.text.secondary} leading-relaxed font-medium`}>
                            <span className={`font-black text-slate-800 uppercase text-[10px] tracking-tight`}>{log.action}</span> • {log.details}
                        </p>
                        {log.action.includes('Approved') && (
                            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-50 text-green-700 text-[9px] font-black border border-green-100 uppercase tracking-widest shadow-sm">
                                <CheckCircle size={10} /> Authorized
                            </div>
                        )}
                        {log.action.includes('Alert') || log.action.includes('Failed') && (
                            <div className="mt-2.5 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-red-50 text-red-700 text-[9px] font-black border border-red-100 uppercase tracking-widest shadow-sm">
                                <Zap size={10} /> Critical
                            </div>
                        )}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="p-10 h-full flex flex-col justify-center">
                <EmptyGrid 
                    title="System Silence"
                    description="No organizational actions detected in the current transaction buffer."
                    icon={Terminal}
                />
            </div>
        )}
      </div>

      <div className={`p-6 border-t ${theme.colors.border} bg-slate-50/50`}>
         <button className={`w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-nexus-600 hover:border-nexus-300 transition-all shadow-sm active:scale-95`}>
            Archive Strategy Registry
         </button>
      </div>
    </div>
  );
};