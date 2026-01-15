
import React, { useState, useEffect } from 'react';
import { StrategicGoal } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Target } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface StrategicGoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goal: StrategicGoal) => void;
  goal?: StrategicGoal | null;
}

export const StrategicGoalForm: React.FC<StrategicGoalFormProps> = ({ isOpen, onClose, onSave, goal }) => {
  const theme = useTheme();
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
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
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
                <label className={`${theme.typography.label} block mb-1`}>Goal Name</label>
                <Input 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. Increase Market Share in APAC"
                />
            </div>
            <div>
                <label className={`${theme.typography.label} block mb-1`}>Description & KPIs</label>
                <textarea 
                    className={`w-full p-4 border ${theme.colors.border} rounded-lg text-sm h-48 focus:ring-2 focus:ring-nexus-500 outline-none ${theme.colors.surface}`}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the goal and how success will be measured..."
                />
            </div>
        </div>
    </Modal>
  );
};
