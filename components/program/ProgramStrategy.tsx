
import React from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Target, ArrowDown, Folder, CheckSquare } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ProgramStrategyProps {
  programId: string;
}

const ProgramStrategy: React.FC<ProgramStrategyProps> = ({ programId }) => {
  const { strategicGoals, programObjectives, projects } = useProgramData(programId);
  const theme = useTheme();

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-4">
            <Target className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Strategic Alignment Matrix</h2>
        </div>

        <div className="relative">
            {/* Layer 1: Corporate Strategy */}
            <div className="mb-12">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">1. Organizational Strategy</h3>
                <div className="grid grid-cols-2 gap-6">
                    {strategicGoals.map(goal => (
                        <div key={goal.id} className="p-5 bg-slate-800 text-white rounded-xl shadow-lg relative">
                            <h4 className="font-bold text-lg">{goal.name}</h4>
                            <p className="text-sm text-slate-300 mt-2">{goal.description}</p>
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-slate-300">
                                <ArrowDown size={24} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Layer 2: Program Objectives */}
            <div className="mb-12">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">2. Program Objectives</h3>
                <div className="grid grid-cols-2 gap-6">
                    {programObjectives.map(obj => {
                        const parentGoal = strategicGoals.find(g => g.id === obj.linkedStrategicGoalId);
                        return (
                            <div key={obj.id} className="p-5 bg-nexus-50 border-2 border-nexus-200 rounded-xl shadow-sm relative">
                                <div className="text-xs font-bold text-nexus-600 uppercase mb-1 flex items-center gap-1">
                                    <Target size={12}/> Supports: {parentGoal?.name}
                                </div>
                                <p className="font-medium text-slate-800">{obj.description}</p>
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-nexus-300">
                                    <ArrowDown size={24} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Layer 3: Project Deliverables */}
            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">3. Project Execution</h3>
                <div className="grid grid-cols-3 gap-4">
                    {projects.map(proj => {
                        // Find which objective this project supports
                        const linkedObj = programObjectives.find(po => po.linkedProjectIds.includes(proj.id));
                        
                        return (
                            <div key={proj.id} className={`p-4 bg-white border border-slate-200 rounded-lg shadow-sm ${!linkedObj ? 'opacity-50 border-dashed' : ''}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Folder size={16} className="text-slate-400"/>
                                    <h4 className="font-bold text-sm text-slate-900">{proj.name}</h4>
                                </div>
                                {linkedObj ? (
                                    <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
                                        <CheckSquare size={12}/> Aligned: {linkedObj.id}
                                    </div>
                                ) : (
                                    <div className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded flex items-center gap-1">
                                        ⚠ No direct strategic link
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProgramStrategy;
