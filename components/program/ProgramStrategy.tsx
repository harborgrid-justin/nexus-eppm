
import React, { useState } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Target, ArrowDown, CheckSquare, Plus, Edit2, Trash2, Shield, Briefcase, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { StrategicGoal, ProgramObjective } from '../../types';
import { generateId } from '../../utils/formatters';
import { StrategicGoalForm } from './StrategicGoalForm';
import { ProgramObjectiveForm } from './ProgramObjectiveForm';
import { EmptyGrid } from '../common/EmptyGrid';
import { FieldPlaceholder } from '../common/FieldPlaceholder';

interface ProgramStrategyProps {
  programId: string;
}

const ProgramStrategy: React.FC<ProgramStrategyProps> = ({ programId }) => {
  const { strategicGoals, programObjectives, projects } = useProgramData(programId);
  // Fixed: Destructured state from useData to allow access to global strategic goals
  const { state, dispatch } = useData(); 
  const theme = useTheme();

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StrategicGoal | null>(null);
  const [isObjModalOpen, setIsObjModalOpen] = useState(false);
  const [editingObj, setEditingObj] = useState<ProgramObjective | null>(null);

  const handleEditGoal = (goal: StrategicGoal) => {
      setEditingGoal(goal);
      setIsGoalModalOpen(true);
  };

  const handleAddGoal = () => {
      setEditingGoal(null);
      setIsGoalModalOpen(true);
  };

  const handleDeleteGoal = (id: string) => {
      if (confirm('Are you sure you want to delete this Strategic Goal?')) {
          dispatch({ type: 'GOVERNANCE_DELETE_STRATEGIC_GOAL', payload: id });
      }
  };

  const saveGoal = (goal: StrategicGoal) => {
      if (!goal.id) {
          goal.id = generateId('SG');
          dispatch({ type: 'GOVERNANCE_ADD_STRATEGIC_GOAL', payload: goal });
      } else {
          dispatch({ type: 'GOVERNANCE_UPDATE_STRATEGIC_GOAL', payload: goal });
      }
  };

  const handleEditObj = (obj: ProgramObjective) => {
      setEditingObj(obj);
      setIsObjModalOpen(true);
  };

  const handleAddObj = () => {
      setEditingObj(null);
      setIsObjModalOpen(true);
  };

  const handleDeleteObj = (id: string) => {
      if (confirm('Are you sure you want to delete this Objective?')) {
          dispatch({ type: 'PROGRAM_DELETE_OBJECTIVE', payload: id });
      }
  };

  const saveObj = (obj: ProgramObjective) => {
      if (!obj.id) {
          obj.id = generateId('PO');
          dispatch({ type: 'PROGRAM_ADD_OBJECTIVE', payload: obj });
      } else {
          dispatch({ type: 'PROGRAM_UPDATE_OBJECTIVE', payload: obj });
      }
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300 relative scrollbar-thin`}>
        <div className="flex items-center gap-2 mb-4">
            <Target className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Strategic Alignment Matrix</h2>
        </div>

        <div className="relative">
            <div className="mb-12">
                <div className={`flex justify-between items-center mb-4 border-b ${theme.colors.border} pb-2`}>
                    <h3 className={`text-[10px] font-black uppercase tracking-widest text-slate-400`}>1. Organizational Strategy</h3>
                    <button onClick={handleAddGoal} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 bg-white hover:bg-slate-50 px-3 py-1 rounded-xl text-slate-500 border border-slate-200 transition-all shadow-sm`}>
                        <Plus size={12}/> New Mandate
                    </button>
                </div>
                {strategicGoals.length > 0 ? (
                    <div className={`grid grid-cols-1 md:grid-cols-2 ${theme.layout.gridGap}`}>
                        {strategicGoals.map(goal => (
                            <div key={goal.id} className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl relative group overflow-hidden border border-white/5">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEditGoal(goal)} className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white"><Edit2 size={14}/></button>
                                    <button onClick={() => handleDeleteGoal(goal.id)} className="p-1.5 hover:bg-red-900/50 rounded-lg text-slate-400 hover:text-red-400"><Trash2 size={14}/></button>
                                </div>
                                <h4 className="font-black text-lg pr-12 uppercase tracking-tight">{goal.name}</h4>
                                <p className="text-xs text-slate-400 mt-3 leading-relaxed font-medium">{goal.description}</p>
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-white/5 pointer-events-none">
                                    <ArrowDown size={64} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyGrid 
                        title="Strategic Portfolio Isolated" 
                        description="Define the overarching corporate mandates that drive organizational project investment."
                        icon={Target}
                        actionLabel="Define Corporate Mandate"
                        onAdd={handleAddGoal}
                    />
                )}
            </div>

            <div className="mb-12">
                <div className={`flex justify-between items-center mb-4 border-b ${theme.colors.border} pb-2`}>
                    <h3 className={`text-[10px] font-black uppercase tracking-widest text-slate-400`}>2. Program Objectives</h3>
                    <button onClick={handleAddObj} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 bg-nexus-50 hover:bg-nexus-100 px-3 py-1 rounded-xl text-nexus-700 border border-nexus-100 transition-all shadow-sm`}>
                        <Plus size={12}/> Establish Objective
                    </button>
                </div>
                {programObjectives.length > 0 ? (
                    <div className={`grid grid-cols-1 md:grid-cols-2 ${theme.layout.gridGap}`}>
                        {programObjectives.map(obj => {
                            const parentGoal = strategicGoals.find(g => g.id === obj.linkedStrategicGoalId);
                            return (
                                <div key={obj.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm relative group hover:border-nexus-300 transition-all">
                                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleEditObj(obj)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-nexus-600"><Edit2 size={14}/></button>
                                        <button onClick={() => handleDeleteObj(obj.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                                    </div>
                                    <div className="text-[10px] font-black text-nexus-600 uppercase mb-3 flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-nexus-600 rounded-full animate-pulse"></div> Supports: {parentGoal?.name || 'ROOT STRATEGY'}
                                    </div>
                                    <p className="font-bold text-slate-800 pr-12 text-sm leading-relaxed">{obj.description}</p>
                                    <div className="mt-4 flex flex-wrap gap-1.5">
                                        {obj.linkedProjectIds.map(pid => (
                                            <span key={pid} className="text-[9px] font-black uppercase bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg text-slate-500 tracking-tight">{projects.find(p=>p.id===pid)?.code || pid}</span>
                                        ))}
                                        {obj.linkedProjectIds.length === 0 && <span className="text-[9px] font-bold text-slate-300 uppercase italic">No active projects linked</span>}
                                    </div>
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-slate-200 pointer-events-none">
                                        <ArrowDown size={40} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-4">
                        <FieldPlaceholder 
                            label="No program objectives defined to bridge strategy and execution." 
                            onAdd={handleAddObj} 
                            icon={Shield}
                            placeholderLabel="Establish Objective"
                        />
                    </div>
                )}
            </div>

            <div>
                <h3 className={`text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b ${theme.colors.border} pb-2`}>3. Project Execution Topology</h3>
                {projects.length > 0 ? (
                    <div className={`grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap} pb-20`}>
                        {projects.map(proj => {
                            const linkedObj = programObjectives.find(po => po.linkedProjectIds.includes(proj.id));
                            return (
                                <div key={proj.id} className={`${theme.components.card} p-5 flex flex-col justify-between h-full border border-slate-200 transition-all ${!linkedObj ? 'bg-slate-50/50 border-dashed opacity-70' : 'hover:border-nexus-300 shadow-sm'}`}>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`p-1.5 rounded-lg border ${linkedObj ? 'bg-white text-nexus-600 border-nexus-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                                                <Briefcase size={14} />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className={`font-black text-xs ${theme.colors.text.primary} truncate uppercase tracking-tight`}>{proj.name}</h4>
                                                <p className="text-[9px] font-mono text-slate-400 font-bold">{proj.code}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {linkedObj ? (
                                        <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase text-green-700 bg-green-50 px-3 py-1.5 rounded-xl border border-green-100 shadow-sm truncate">
                                            <CheckSquare size={12} className="shrink-0"/> Strategically Aligned
                                        </div>
                                    ) : (
                                        <div className="mt-6 flex flex-col gap-2">
                                            <div className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 flex items-center gap-2">
                                                <AlertTriangle size={12} className="shrink-0"/> Logic Drift Detected
                                            </div>
                                            <button 
                                                onClick={handleAddObj}
                                                className="text-[9px] font-black uppercase text-nexus-600 hover:text-nexus-800 flex items-center justify-center gap-1.5 py-1 transition-all"
                                            >
                                                <Plus size={10}/> Map to Objective
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <EmptyGrid 
                        title="Execution Stream Null" 
                        description="No project components identified for the current strategic branch."
                        icon={Briefcase}
                    />
                )}
            </div>
        </div>

        <StrategicGoalForm 
            isOpen={isGoalModalOpen}
            onClose={() => setIsGoalModalOpen(false)}
            onSave={saveGoal}
            goal={editingGoal}
        />

        <ProgramObjectiveForm 
            isOpen={isObjModalOpen}
            onClose={() => setIsObjModalOpen(false)}
            onSave={saveObj}
            objective={editingObj}
            strategicGoals={state.strategicGoals}
            projects={projects}
        />
    </div>
  );
};

export default ProgramStrategy;
