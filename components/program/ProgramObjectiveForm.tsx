
import React, { useState, useEffect } from 'react';
import { ProgramObjective, StrategicGoal, Project } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Layers } from 'lucide-react';

interface ProgramObjectiveFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (obj: ProgramObjective) => void;
  objective?: ProgramObjective | null;
  strategicGoals: StrategicGoal[];
  projects: Project[];
}

export const ProgramObjectiveForm: React.FC<ProgramObjectiveFormProps> = ({ isOpen, onClose, onSave, objective, strategicGoals, projects }) => {
  const [formData, setFormData] = useState<Partial<ProgramObjective>>({
    description: '',
    linkedStrategicGoalId: '',
    linkedProjectIds: []
  });

  useEffect(() => {
    if (objective) {
        setFormData({ ...objective });
    } else {
        setFormData({ description: '', linkedStrategicGoalId: '', linkedProjectIds: [] });
    }
  }, [objective, isOpen]);

  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        title={
          <span className="flex items-center gap-2">
            <Layers className="text-nexus-600"/> {objective ? 'Edit Objective' : 'New Program Objective'}
          </span>
        }
        footer={
            <>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={() => { onSave(formData as ProgramObjective); onClose(); }}>Save Objective</Button>
            </>
        }
    >
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Objective Description</label>
                <textarea 
                    className="w-full p-4 border border-slate-300 rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="e.g. Deliver integrated ticketing system by Q4..."
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Supports Strategic Goal</label>
                <select 
                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500"
                    value={formData.linkedStrategicGoalId}
                    onChange={e => setFormData({...formData, linkedStrategicGoalId: e.target.value})}
                >
                    <option value="">-- Select Goal --</option>
                    {strategicGoals.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Linked Projects (Execution)</label>
                <div className="border border-slate-200 rounded-lg max-h-64 overflow-y-auto p-2 bg-slate-50">
                    {projects.map(p => (
                        <label key={p.id} className="flex items-center gap-3 p-3 hover:bg-white rounded cursor-pointer border border-transparent hover:border-slate-100 transition-colors">
                            <input 
                                type="checkbox"
                                className="rounded text-nexus-600 focus:ring-nexus-500 h-4 w-4"
                                checked={formData.linkedProjectIds?.includes(p.id)}
                                onChange={e => {
                                    const current = formData.linkedProjectIds || [];
                                    if(e.target.checked) {
                                        setFormData({...formData, linkedProjectIds: [...current, p.id]});
                                    } else {
                                        setFormData({...formData, linkedProjectIds: current.filter(id => id !== p.id)});
                                    }
                                }}
                            />
                            <span className="text-sm text-slate-700">{p.name}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    </Modal>
  );
};
