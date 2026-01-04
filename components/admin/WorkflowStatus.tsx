
import React from 'react';
import { Activity, CheckCircle, Server } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

export const WorkflowStatus: React.FC = () => {
  const theme = useTheme();
  const { state } = useData();
  const queueLength = state.dataJobs.filter(j => j.status === 'In Progress').length;
  
  return (
    <div className={`${theme.components.card} ${theme.layout.cardPadding} flex items-center justify-between`}>
        <div className="flex items-center gap-4">
            <div className={`p-2 ${theme.colors.semantic.success.bg} rounded-lg ${theme.colors.semantic.success.text} border ${theme.colors.semantic.success.border}`}>
                <Activity size={24} className="animate-pulse"/>
            </div>
            <div>
                <h4 className="font-bold text-sm text-slate-800">Workflow Engine</h4>
                <p className={`text-xs ${theme.colors.text.secondary}`}>Processing Queue: {queueLength} items</p>
            </div>
        </div>
        <div className="flex gap-4 text-xs font-mono">
            <span className={`flex items-center gap-1 ${theme.colors.semantic.success.text}`}><CheckCircle size={12}/> Services OK</span>
            <span className={`flex items-center gap-1 ${theme.colors.semantic.info.text}`}><Server size={12}/> v2.4.1</span>
        </div>
    </div>
  );
};
