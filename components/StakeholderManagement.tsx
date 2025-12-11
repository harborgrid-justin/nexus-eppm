import React from 'react';
import { useProjectState } from '../hooks';
import { Users, Plus, ArrowRight, ArrowUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface StakeholderManagementProps {
  projectId: string;
}

const StakeholderManagement: React.FC<StakeholderManagementProps> = ({ projectId }) => {
  const { stakeholders } = useProjectState(projectId);
  const theme = useTheme();

  const getGridPosition = (influence: string, interest: string) => {
    const influenceMap = { 'Low': 'row-start-2', 'High': 'row-start-1' };
    const interestMap = { 'Low': 'col-start-1', 'High': 'col-start-2' };
    return `${influenceMap[influence as keyof typeof influenceMap]} ${interestMap[interest as keyof typeof interestMap]}`;
  };

  const getStrategyColor = (influence: string, interest: string) => {
    if (influence === 'High' && interest === 'High') return 'bg-blue-50 border-blue-200 text-blue-800'; // Manage Closely
    if (influence === 'High' && interest === 'Low') return 'bg-green-50 border-green-200 text-green-800'; // Keep Satisfied
    if (influence === 'Low' && interest === 'High') return 'bg-yellow-50 border-yellow-200 text-yellow-800'; // Keep Informed
    return 'bg-slate-50 border-slate-200 text-slate-800'; // Monitor
  };

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
       <div className={theme.layout.header}>
          <div>
            <h1 className={theme.typography.h1}>
              <Users className="text-nexus-600" /> Stakeholder Management
            </h1>
            <p className={theme.typography.small}>Analyze and plan engagement for all project stakeholders.</p>
          </div>
          <button className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium`}>
             <Plus size={16} /> Add Stakeholder
          </button>
       </div>

       <div className={theme.layout.panelContainer}>
         <div className="h-full overflow-y-auto p-6">
            <h3 className={`${theme.typography.h3} mb-4`}>Interest / Influence Matrix</h3>
            <div className="relative grid grid-cols-[auto_1fr_1fr] grid-rows-[auto_1fr_1fr] gap-1">
                {/* Y Axis Label */}
                <div className="flex items-center justify-center -rotate-90 row-span-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Influence</span>
                <ArrowUp size={14} className="ml-1" />
                </div>
                {/* X Axis Label */}
                <div className="col-span-2 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interest</span>
                    <ArrowRight size={14} className="ml-1" />
                </div>

                {/* Matrix Quadrants */}
                <div className={`p-4 rounded-lg min-h-[200px] ${getStrategyColor('High', 'Low')}`}>
                <h4 className="font-bold">Keep Satisfied</h4>
                <p className="text-xs opacity-70">Low Interest / High Influence</p>
                </div>
                <div className={`p-4 rounded-lg min-h-[200px] ${getStrategyColor('High', 'High')}`}>
                <h4 className="font-bold">Manage Closely</h4>
                <p className="text-xs opacity-70">High Interest / High Influence</p>
                </div>
                <div className={`p-4 rounded-lg min-h-[200px] ${getStrategyColor('Low', 'Low')}`}>
                <h4 className="font-bold">Monitor</h4>
                <p className="text-xs opacity-70">Low Interest / Low Influence</p>
                </div>
                <div className={`p-4 rounded-lg min-h-[200px] ${getStrategyColor('Low', 'High')}`}>
                <h4 className="font-bold">Keep Informed</h4>
                <p className="text-xs opacity-70">High Interest / Low Influence</p>
                </div>
                
                {/* Stakeholder Bubbles */}
                {stakeholders.map(s => (
                <div key={s.id} className={`absolute m-8 ${getGridPosition(s.influence, s.interest)} z-10`} title={s.engagementStrategy}>
                    <div className={`px-3 py-2 ${theme.colors.surface} rounded-lg shadow-lg border ${theme.colors.border} cursor-pointer hover:scale-105 transition-transform`}>
                    <p className="font-semibold text-sm text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.role}</p>
                    </div>
                </div>
                ))}
            </div>
         </div>
       </div>
    </div>
  );
};

export default StakeholderManagement;
