
import React from 'react';
import { Risk } from '../../../types/index';
import { Clock } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface RiskHistoryTabProps {
  risk: Risk;
}

export const RiskHistoryTab: React.FC<RiskHistoryTabProps> = ({ risk }) => {
  const theme = useTheme();
  const history = risk.history || [];

  return (
    <div className="space-y-4 animate-in fade-in">
        <h3 className="font-bold text-slate-800 mb-4">Audit Trail</h3>
        <div className="space-y-4 relative pl-4 border-l-2 border-slate-100">
            {history.map((item, i) => (
                <div key={i} className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-200 border-2 border-white"></div>
                    <div className="text-sm">
                        <span className="font-bold text-slate-700">{item.userId}</span> <span className="text-slate-600">{item.action}</span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                        <Clock size={10}/> {new Date(item.date).toLocaleString()}
                    </div>
                </div>
            ))}
            {history.length === 0 && <div className="text-sm text-slate-400 italic">No history recorded yet.</div>}
        </div>
    </div>
  );
};
