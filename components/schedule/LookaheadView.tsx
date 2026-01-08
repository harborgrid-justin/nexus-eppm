
import React from 'react';
import { Project } from '../../types/index';
import { useScheduleAnalysis } from '../../hooks/useScheduleAnalysis';
import { Calendar, ArrowRight, Plus } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { useTheme } from '../../context/ThemeContext';
import { FieldPlaceholder } from '../common/FieldPlaceholder';

interface LookaheadViewProps {
  project: Project;
}

const LookaheadView: React.FC<LookaheadViewProps> = ({ project }) => {
  const { lookahead } = useScheduleAnalysis(project);
  const theme = useTheme();

  return (
    <div className={`${theme.components.card} overflow-hidden flex flex-col h-full`}>
        <div className={`p-4 ${theme.colors.background} border-b ${theme.colors.border} flex justify-between items-center shrink-0`}>
            <h3 className={`${theme.typography.h3} flex items-center gap-2`}>
                <Calendar size={18} className="text-nexus-600"/> 4-Week Lookahead
            </h3>
            <span className={theme.typography.label}>{lookahead.length} Activities</span>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin">
            {lookahead.length === 0 ? (
                <div className="p-4 h-full">
                    <FieldPlaceholder 
                        label="No imminent activities in the 4-week window." 
                        onAdd={() => {}} // Navigation to schedule or open task modal
                        icon={Calendar}
                    />
                </div>
            ) : (
                <div className={`divide-y ${theme.colors.border.replace('border-','divide-')}`}>
                    {lookahead.map(task => (
                        <div key={task.id} className={`p-4 hover:${theme.colors.background} flex items-center justify-between transition-colors group`}>
                            <div className="min-w-0 flex-1 pr-4">
                                <div className={`font-bold text-sm ${theme.colors.text.primary} truncate`}>{task.name}</div>
                                <div className={`${theme.typography.small} mt-1 font-mono flex items-center gap-1.5`}>
                                    {task.startDate} <ArrowRight size={10} className="text-slate-300"/> {task.endDate}
                                </div>
                            </div>
                            <StatusBadge status={task.status} />
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        {lookahead.length > 0 && (
            <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-center">
                 <button className="text-[10px] font-black uppercase text-nexus-600 hover:text-nexus-800 tracking-widest flex items-center gap-1">
                    <Plus size={12}/> Append Milestone
                 </button>
            </div>
        )}
    </div>
  );
};

export default LookaheadView;
