
import React from 'react';
import { Project } from '../../types/index';
import { useScheduleAnalysis } from '../../hooks/useScheduleAnalysis';
import { Calendar, ArrowRight } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { useTheme } from '../../context/ThemeContext';

interface LookaheadViewProps {
  project: Project;
}

const LookaheadView: React.FC<LookaheadViewProps> = ({ project }) => {
  const { lookahead } = useScheduleAnalysis(project);
  const theme = useTheme();

  return (
    <div className={`${theme.components.card} overflow-hidden`}>
        <div className={`p-4 ${theme.colors.background} border-b ${theme.colors.border} flex justify-between items-center`}>
            <h3 className={`${theme.typography.h3} flex items-center gap-2`}>
                <Calendar size={18} className="text-nexus-600"/> 4-Week Lookahead
            </h3>
            <span className={theme.typography.label}>{lookahead.length} Activities</span>
        </div>
        <div className={`divide-y ${theme.colors.border.replace('border-','divide-')}`}>
            {lookahead.map(task => (
                <div key={task.id} className={`p-4 hover:${theme.colors.background} flex items-center justify-between transition-colors`}>
                    <div>
                        <div className={`font-bold text-sm ${theme.colors.text.primary}`}>{task.name}</div>
                        <div className={`${theme.typography.small} mt-1 font-mono`}>{task.startDate} <ArrowRight size={10} className="inline mx-1"/> {task.endDate}</div>
                    </div>
                    <StatusBadge status={task.status} />
                </div>
            ))}
            {lookahead.length === 0 && <div className={`p-8 text-center ${theme.colors.text.tertiary} italic text-sm`}>No upcoming activities in the next 4 weeks.</div>}
        </div>
    </div>
  );
};

export default LookaheadView;