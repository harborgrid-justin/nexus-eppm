
import React, { useState } from 'react';
import { ProgramDependency, Project } from '../../../types';
import { SidePanel } from '../../ui/SidePanel';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Link, ArrowRight, Save } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface DependencyFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (dep: Partial<ProgramDependency>) => void;
    projects: Project[];
}

export const DependencyForm: React.FC<DependencyFormProps> = ({ isOpen, onClose, onSave, projects }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState<Partial<ProgramDependency>>({
        sourceProjectId: '',
        targetProjectId: '',
        description: '',
        type: 'Technical',
        status: 'Active'
    });

    const handleSubmit = () => {
        if (!formData.sourceProjectId || !formData.targetProjectId) {
            alert("Both source and target projects are required.");
            return;
        }
        if (formData.sourceProjectId === formData.targetProjectId) {
            alert("Self-dependency is not supported.");
            return;
        }
        onSave(formData);
    };

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title="Define Strategic Link"
            width="md:w-[500px]"
            footer={<>
                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} icon={Save}>Establish Logic</Button>
            </>}
        >
            <div className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3">
                    <Link size={20} className="text-blue-600"/>
                    <p className="text-xs text-blue-800 font-medium">Cross-project dependencies visualize systemic impacts on the long-range roadmap.</p>
                </div>

                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                    <div>
                        <label className={theme.typography.label + " block mb-1.5 ml-1"}>Predecessor</label>
                        <select 
                            className={`w-full p-3 border ${theme.colors.border} rounded-xl text-sm font-bold focus:ring-2 focus:ring-nexus-500 outline-none bg-white`}
                            value={formData.sourceProjectId}
                            onChange={e => setFormData({...formData, sourceProjectId: e.target.value})}
                        >
                            <option value="">Select Project...</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div className="pt-6"><ArrowRight size={20} className="text-slate-300"/></div>
                    <div>
                        <label className={theme.typography.label + " block mb-1.5 ml-1"}>Successor</label>
                         <select 
                            className={`w-full p-3 border ${theme.colors.border} rounded-xl text-sm font-bold focus:ring-2 focus:ring-nexus-500 outline-none bg-white`}
                            value={formData.targetProjectId}
                            onChange={e => setFormData({...formData, targetProjectId: e.target.value})}
                        >
                            <option value="">Select Project...</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                </div>

                <div>
                    <label className={theme.typography.label + " block mb-1.5 ml-1"}>Constraint Type</label>
                    <select 
                        className={`w-full p-3 border ${theme.colors.border} rounded-xl text-sm font-bold focus:ring-2 focus:ring-nexus-500 outline-none bg-white`}
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value as any})}
                    >
                        <option>Technical</option>
                        <option>Resource</option>
                        <option>Market</option>
                        <option>Financial</option>
                    </select>
                </div>

                <div>
                    <label className={theme.typography.label + " block mb-1.5 ml-1"}>Impact Description</label>
                    <textarea 
                        className={`w-full p-4 border ${theme.colors.border} rounded-xl text-sm focus:ring-2 focus:ring-nexus-500 outline-none h-32 resize-none bg-white`}
                        placeholder="e.g. Phase 2 depends on core API release from Platform team..."
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                </div>
            </div>
        </SidePanel>
    );
};
