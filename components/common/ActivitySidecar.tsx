
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { History, User, Zap, MessageSquare, Clock, X } from 'lucide-react';

interface ActivitySidecarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_ACTIVITIES = [
  { id: 1, type: 'edit', user: 'Mike Ross', action: 'updated status of', target: 'Foundation Pour', timeOffset: 2 * 60 * 1000 },
  { id: 2, type: 'alert', user: 'Insight AI', action: 'detected critical path shift in', target: 'WBS 1.3', timeOffset: 15 * 60 * 1000 },
  { id: 3, type: 'comment', user: 'Jessica P.', action: 'replied to thread on', target: 'Budget Baseline', timeOffset: 60 * 60 * 1000 },
  { id: 4, type: 'system', user: 'System', action: 'synced ERP actuals for', target: 'Q3 Financials', timeOffset: 2 * 60 * 60 * 1000 },
];

export const ActivitySidecar: React.FC<ActivitySidecarProps> = ({ isOpen, onClose }) => {
  const theme = useTheme();
  // Hydration safety
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const getTimeString = (offset: number) => {
    if (!mounted) return '...';
    const now = Date.now();
    const time = now - offset;
    const diff = now - time;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-y-0 right-0 w-80 ${theme.colors.surface} border-l ${theme.colors.border} shadow-2xl z-[60] flex flex-col animate-in slide-in-from-right duration-300`}>
      <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center ${theme.colors.background}`}>
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <History size={14} className="text-nexus-600" /> Live Project Pulse
        </h3>
        <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full text-slate-400"><X size={16} /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {MOCK_ACTIVITIES.map((activity) => (
          <div key={activity.id} className="relative pl-6 border-l border-slate-100 group">
            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-slate-200 border-2 border-white group-hover:bg-nexus-500 transition-colors"></div>
            <div className="text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-900">{activity.user}</span>
                <span className="text-[10px] text-slate-400 font-mono">{getTimeString(activity.timeOffset)}</span>
              </div>
              <p className="text-slate-500 leading-relaxed">
                {activity.action} <span className="text-nexus-600 font-semibold cursor-pointer hover:underline">{activity.target}</span>
              </p>
              {activity.type === 'alert' && (
                <div className="mt-2 p-2 bg-nexus-50 border border-nexus-100 rounded text-[10px] text-nexus-700 flex items-center gap-1.5 font-bold">
                  <Zap size={10} className="fill-nexus-500" /> AI INSIGHT GENERATED
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={`p-4 border-t ${theme.colors.border} ${theme.colors.background}`}>
         <button className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-nexus-600 transition-colors">View Audit Ledger</button>
      </div>
    </div>
  );
};
