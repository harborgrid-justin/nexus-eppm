
import React from 'react';
import { Clock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface AuditTrailProps {
  logs: { date: string; user: string; action: string }[];
}

export const AuditTrail: React.FC<AuditTrailProps> = ({ logs }) => {
  const theme = useTheme();

  return (
    <div className={`${theme.components.card} overflow-hidden`}>
        <div className={`p-3 ${theme.colors.background} border-b ${theme.colors.border} ${theme.typography.label}`}>
            Recent Activity
        </div>
        <div className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
            {logs.map((log, i) => (
                <div key={i} className={`p-3 flex gap-3 text-sm hover:${theme.colors.background} transition-colors`}>
                    <Clock size={16} className={`${theme.colors.text.tertiary} shrink-0 mt-0.5`}/>
                    <div>
                        <p className={theme.colors.text.primary}><span className="font-bold">{log.user}</span> {log.action}</p>
                        <p className={`${theme.typography.small} mt-0.5`}>{log.date}</p>
                    </div>
                </div>
            ))}
            {logs.length === 0 && <div className={`p-4 text-center ${theme.colors.text.tertiary} italic text-xs`}>No activity recorded.</div>}
        </div>
    </div>
  );
};
