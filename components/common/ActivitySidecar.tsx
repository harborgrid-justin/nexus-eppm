
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
    <div className={`fixed inset-y-0 right-0 w-80 ${theme.colors.surface} border-l ${theme.colors.border} shadow-2xl z-[60] flex flex-col animate-in slide-in-from-right duration-300`}>
      <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.background}`}>
        <h3 className={`text-xs font-black uppercase tracking-widest ${theme.colors.text.tertiary} flex items-center gap-2`}>
          <History size={14} className="text-nexus-600" /> Live Project Pulse
        </h3>
        <button onClick={onClose} className={`p-1 hover:${theme.colors.background} rounded-full text-slate-400`}><X size={16} /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {auditLogs.length > 0 ? (
            <div className="p-4 space-y-6">
                {auditLogs.slice(0, 50).map((log, idx) => (
                    <div key={`${log.date}-${idx}`} className="relative pl-6 border-l border-slate-100 group">
                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white group-hover:bg-nexus-500 transition-colors"></div>
                        <div className="text-xs">
                        <div className="flex justify-between items-center mb-1">
                            <span className={`font-bold ${theme.colors.text.primary} truncate max-w-[120px]`}>{log.user}</span>
                            <span className={`text-[10px] ${theme.colors.text.tertiary} font-mono`}>{getTimeString(log.date)}</span>
                        </div>
                        <p className={`${theme.colors.text.secondary} leading-relaxed`}>
                            <span className={`font-semibold ${theme.colors.text.secondary}`}>{log.action}</span> - {log.details}
                        </p>
                        {log.action.includes('Approved') && (
                            <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-50 text-green-700 text-[9px] font-bold border border-green-100">
                                <CheckCircle size={8} /> DECISION
                            </div>
                        )}
                        {log.action.includes('Alert') && (
                            <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-50 text-red-700 text-[9px] font-bold border border-red-100">
                                <Zap size={8} /> CRITICAL
                            </div>
                        )}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="p-6 h-full flex flex-col justify-center">
                <EmptyGrid 
                    title="No Live Activity"
                    description="The project pulse is currently silent. Actions taken in the workspace will appear here in real-time."
                    icon={Terminal}
                />
            </div>
        )}
      </div>

      <div className={`p-4 border-t ${theme.colors.border} ${theme.colors.background}`}>
         <button className={`w-full py-2 text-[10px] font-black uppercase tracking-widest ${theme.colors.text.tertiary} hover:text-nexus-600 transition-colors`}>View Full Audit Ledger</button>
      </div>
    </div>
  );
};
