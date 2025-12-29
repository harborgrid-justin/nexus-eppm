
import React, { useState, useEffect } from 'react';
import { StrategicGoal } from '../../types';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Target } from 'lucide-react';

interface StrategicGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: StrategicGoal) => void;
  goal?: StrategicGoal | null;
}

export const StrategicGoalForm: React.FC<StrategicGoalFormProps> = ({ isOpen, onClose, onSave, goal }) => {
  const [formData, setFormData] = useState<Partial<StrategicGoal>>({
    name: '',
    description: '',
    programs: []
  });

  useEffect(() => {
    if (goal) {
        setFormData({ ...goal });
    } else {
        setFormData({ name: '', description: '', programs: [] });
    }
  }, [goal, isOpen]);

  return (
    <SidePanel
        isOpen={isOpen}
        onClose={onClose}
        width="md:w-[500px]"
        title={
          <span className="flex items-center gap-2">
             <Target className="text-nexus-600"/> {goal ? 'Edit Strategic Goal' : 'Define Strategic Goal'}
          </span>
        }
        footer={
            <>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={() => { onSave(formData as StrategicGoal); onClose(); }}>Save Goal</Button>
            </>
        }
    >
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Goal Name</label>
                <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Increase Market Share in APAC"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description & KPIs</label>
                <textarea 
                    className="w-full p-4 border border-slate-300 rounded-lg text-sm h-48 focus:ring-2 focus:ring-nexus-500 outline-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the goal and how success will be measured..."
                />
            </div>
        </div>
    </SidePanel>
  );
};
