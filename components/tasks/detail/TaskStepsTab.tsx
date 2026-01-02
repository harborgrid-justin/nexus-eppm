
import React, { useState, useMemo } from 'react';
import { Task, ActivityStep } from '../../../types';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { useTheme } from '../../../context/ThemeContext';
import { generateId } from '../../../utils/formatters';

interface TaskStepsTabProps {
  task: Task;
  isReadOnly: boolean;
  onUpdate: (field: string, value: any) => void;
}

export const TaskStepsTab: React.FC<TaskStepsTabProps> = ({ task, isReadOnly, onUpdate }) => {
  const theme = useTheme();
  const [steps, setSteps] = useState<ActivityStep[]>(task.steps || []);
  const [newStepName, setNewStepName] = useState('');
  const [newStepWeight, setNewStepWeight] = useState(1);

  // Calculate Weighted Progress
  const progressStats = useMemo(() => {
      const totalWeight = steps.reduce((sum, s) => sum + s.weight, 0);
      const completedWeight = steps.filter(s => s.completed).reduce((sum, s) => sum + s.weight, 0);
      const physicalPercent = totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;
      return { totalWeight, physicalPercent };
  }, [steps]);

  const handleAddStep = () => {
    if (!newStepName) return;
    const newStep: ActivityStep = {
        id: generateId('STEP'),
        name: newStepName,
        weight: newStepWeight,
        completed: false
    };
    const updatedSteps = [...steps, newStep];
    setSteps(updatedSteps);
    onUpdate('steps', updatedSteps);
    setNewStepName('');
    setNewStepWeight(1);
  };

  const toggleStep = (id: string) => {
      if (isReadOnly) return;
      const updatedSteps = steps.map(s => s.id === id ? { ...s, completed: !s.completed, completedDate: !s.completed ? new Date().toISOString() : undefined } : s);
      setSteps(updatedSteps);
      onUpdate('steps', updatedSteps);
      
      // Auto-update task progress if Physical % Complete is used
      const totalWeight = updatedSteps.reduce((sum, s) => sum + s.weight, 0);
      const completedWeight = updatedSteps.filter(s => s.completed).reduce((sum, s) => sum + s.weight, 0);
      const physicalPercent = totalWeight > 0 ? (completedWeight / totalWeight) * 100 : 0;
      onUpdate('progress', Math.round(physicalPercent));
  };

  const deleteStep = (id: string) => {
      if (isReadOnly) return;
      const updatedSteps = steps.filter(s => s.id !== id);
      setSteps(updatedSteps);
      onUpdate('steps', updatedSteps);
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
                <h4 className="font-bold text-slate-800 text-sm">Physical % Complete</h4>
                <p className="text-xs text-slate-500">Calculated from step weights.</p>
            </div>
            <div className="text-right">
                <div className="text-2xl font-black text-nexus-600 font-mono">{progressStats.physicalPercent.toFixed(1)}%</div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Weight: {progressStats.totalWeight}</div>
            </div>
        </div>

        <div className="space-y-2">
            {steps.map(step => (
                <div key={step.id} className={`flex items-center gap-3 p-3 border rounded-lg transition-all ${step.completed ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                    <button onClick={() => toggleStep(step.id)} className={`flex-shrink-0 ${step.completed ? 'text-green-600' : 'text-slate-300 hover:text-slate-500'}`}>
                        {step.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                    </button>
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${step.completed ? 'text-slate-600 line-through' : 'text-slate-900'}`}>{step.name}</p>
                        {step.completed && <p className="text-[10px] text-green-700">Completed: {step.completedDate?.split('T')[0]}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">Wt: {step.weight}</span>
                        {!isReadOnly && <button onClick={() => deleteStep(step.id)} className="text-slate-400 hover:text-red-500"><Trash2 size={16}/></button>}
                    </div>
                </div>
            ))}
            {steps.length === 0 && <div className="p-8 text-center text-slate-400 text-sm italic">No steps defined. Define steps to drive physical progress.</div>}
        </div>

        {!isReadOnly && (
            <div className="flex gap-2 items-end border-t border-slate-200 pt-4">
                <div className="flex-1">
                    <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Step Description</label>
                    <Input value={newStepName} onChange={e => setNewStepName(e.target.value)} placeholder="e.g. Pour Concrete" />
                </div>
                <div className="w-24">
                     <label className="text-[10px] font-bold uppercase text-slate-500 mb-1 block">Weight</label>
                     <Input type="number" value={newStepWeight} onChange={e => setNewStepWeight(parseFloat(e.target.value))} />
                </div>
                <Button icon={Plus} onClick={handleAddStep} disabled={!newStepName}>Add</Button>
            </div>
        )}
    </div>
  );
};
