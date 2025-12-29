
import React, { useState } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Target, ArrowDown, Folder, CheckSquare, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { StrategicGoal, ProgramObjective } from '../../types';
import { generateId } from '../../utils/formatters';
import { StrategicGoalForm } from './StrategicGoalForm';
import { ProgramObjectiveForm } from './ProgramObjectiveForm';

interface ProgramStrategyProps {
  programId: string;
}

const ProgramStrategy: React.FC<ProgramStrategyProps> = ({ programId }) => {
  const { strategicGoals, programObjectives, projects } = useProgramData(programId);
  const { dispatch, state } = useData(); 
  const theme = useTheme();

  // --- Modal State ---
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StrategicGoal | null>(null);
  
  const [isObjModalOpen, setIsObjModalOpen] = useState(false);
  const [editingObj, setEditingObj] = useState<ProgramObjective | null>(null);

  // --- Goal Handlers ---
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
          dispatch({ type: 'DELETE_STRATEGIC_GOAL', payload: id });
      }
  };

  const saveGoal = (goal: StrategicGoal) => {
      if (!goal.id) {
          goal.id = generateId('SG');
          dispatch({ type: 'ADD_STRATEGIC_GOAL', payload: goal });
      } else {
          dispatch({ type: 'UPDATE_STRATEGIC_GOAL', payload: goal });
      }
  };

  // --- Objective Handlers ---
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
          dispatch({ type: 'DELETE_PROGRAM_OBJECTIVE', payload: id });
      }
  };

  const saveObj = (obj: ProgramObjective) => {
      if (!obj.id) {
          obj.id = generateId('PO');
          dispatch({ type: 'ADD_PROGRAM_OBJECTIVE', payload: obj });
      } else {
          dispatch({ type: 'UPDATE_PROGRAM_OBJECTIVE', payload: obj });
      }
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300 relative`}>
        <div className="flex items-center gap-2 mb-4">
            <Target className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Strategic Alignment Matrix</h2>
        </div>

        <div className="relative">
            {/* Layer 1: Corporate Strategy */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">1. Organizational Strategy</h3>
                    <button onClick={handleAddGoal} className="text-xs flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600 font-medium transition-colors">
                        <Plus size={12}/> Add Goal
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {strategicGoals.map(goal => (
                        <div key={goal.id} className="p-5 bg-slate-800 text-white rounded-xl shadow-lg relative group">
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEditGoal(goal)} className="p-1 hover:bg-slate-700 rounded"><Edit2 size={14}/></button>
                                <button onClick={() => handleDeleteGoal(goal.id)} className="p-1 hover:bg-red-900 rounded"><Trash2 size={14}/></button>
                            </div>
                            <h4 className="font-bold text-lg pr-12">{goal.name}</h4>
                            <p className="text-sm text-slate-300 mt-2">{goal.description}</p>
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-slate-300">
                                <ArrowDown size={24} />
                            </div>
                        </div>
                    ))}
                    {strategicGoals.length === 0 && (
                        <div className="col-span-2 p-8 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-400">
                            No strategic goals defined for this program.
                        </div>
                    )}
                </div>
            </div>

            {/* Layer 2: Program Objectives */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-2">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">2. Program Objectives</h3>
                    <button onClick={handleAddObj} className="text-xs flex items-center gap-1 bg-nexus-50 hover:bg-nexus-100 px-2 py-1 rounded text-nexus-700 font-medium transition-colors">
                        <Plus size={12}/> Add Objective
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {programObjectives.map(obj => {
                        const parentGoal = strategicGoals.find(g => g.id === obj.linkedStrategicGoalId);
                        return (
                            <div key={obj.id} className="p-5 bg-nexus-50 border-2 border-nexus-200 rounded-xl shadow-sm relative group">
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEditObj(obj)} className="p-1 hover:bg-nexus-100 rounded text-slate-600"><Edit2 size={14}/></button>
                                    <button onClick={() => handleDeleteObj(obj.id)} className="p-1 hover:bg-red-100 rounded text-red-500"><Trash2 size={14}/></button>
                                </div>
                                <div className="text-xs font-bold text-nexus-600 uppercase mb-1 flex items-center gap-1">
                                    <Target size={12}/> Supports: {parentGoal?.name || 'Unlinked'}
                                </div>
                                <p className="font-medium text-slate-800 pr-12">{obj.description}</p>
                                <div className="mt-2 flex flex-wrap gap-1">
                                    {obj.linkedProjectIds.map(pid => (
                                        <span key={pid} className="text-[10px] bg-white border border-nexus-100 px-1.5 py-0.5 rounded text-slate-500">{projects.find(p=>p.id===pid)?.name || pid}</span>
                                    ))}
                                </div>
                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-nexus-300">
                                    <ArrowDown size={24} />
                                </div>
                            </div>
                        );
                    })}
                    {programObjectives.length === 0 && (
                        <div className="col-span-2 p-8 border-2 border-dashed border-nexus-200 rounded-xl flex items-center justify-center text-nexus-400 bg-nexus-50/30">
                            No objectives defined.
                        </div>
                    )}
                </div>
            </div>

            {/* Layer 3: Project Deliverables */}
            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">3. Project Execution</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {projects.map(proj => {
                        // Find which objective this project supports
                        const linkedObj = programObjectives.find(po => po.linkedProjectIds.includes(proj.id));
                        
                        return (
                            <div key={proj.id} className={`p-4 bg-white border border-slate-200 rounded-lg shadow-sm ${!linkedObj ? 'opacity-70 border-dashed' : ''}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Folder size={16} className="text-slate-400"/>
                                    <h4 className="font-bold text-sm text-slate-900">{proj.name}</h4>
                                </div>
                                {linkedObj ? (
                                    <div className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded flex items-center gap-1 mt-auto">
                                        <CheckSquare size={12}/> Aligned: {linkedObj.description.substring(0, 20)}...
                                    </div>
                                ) : (
                                    <div className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded flex items-center gap-1 mt-auto">
                                        ⚠ No direct strategic link
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
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
            strategicGoals={strategicGoals}
            projects={projects}
        />
    </div>
  );
};

export default ProgramStrategy;
