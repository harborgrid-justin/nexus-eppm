
import React, { useState, useEffect } from 'react';
import { Program } from '../../types';
import { useData } from '../../context/DataContext';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';
import { Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ProgramFormProps {
    isOpen: boolean;
    onClose: () => void;
    program?: Program | null;
}

export const ProgramForm: React.FC<ProgramFormProps> = ({ isOpen, onClose, program }) => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const [formData, setFormData] = useState<Partial<Program>>({});

    useEffect(() => {
        if (program) {
            setFormData(program);
        } else {
            setFormData({
                name: '',
                description: '',
                managerId: '',
                budget: 0,
                startDate: new Date().toISOString().split('T')[0],
                endDate: '',
                status: 'Planned',
                health: 'Good',
                category: 'Strategic',
                strategicImportance: 5
            });
        }
    }, [program, isOpen]);

    const handleSubmit = () => {
        if (!formData.name) return;

        const programToSave: Program = {
            id: formData.id || generateId('PRG'),
            name: formData.name,
            description: formData.description || '',
            managerId: formData.managerId || 'Unassigned',
            budget: Number(formData.budget) || 0,
            startDate: formData.startDate || '',
            endDate: formData.endDate || '',
            status: formData.status as any,
            health: formData.health as any,
            category: formData.category || 'General',
            strategicImportance: Number(formData.strategicImportance) || 5,
            
            // Defaults for new fields
            benefits: formData.benefits || '',
            financialValue: formData.financialValue || 0,
            riskScore: formData.riskScore || 0,
            calculatedPriorityScore: formData.calculatedPriorityScore || 50,
            businessCase: formData.businessCase || ''
        };

        if (formData.id) {
            dispatch({ type: 'UPDATE_PROGRAM', payload: programToSave });
        } else {
            dispatch({ type: 'ADD_PROGRAM', payload: programToSave });
        }
        onClose();
    };

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title={program ? "Edit Program" : "Establish New Program"}
            width="md:w-[600px]"
            footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit} icon={Save}>Save Program</Button></>}
        >
            <div className="space-y-6">
                <div>
                    <label className={theme.typography.label + " block mb-1"}>Program Name</label>
                    <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Digital Transformation Initiative" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={theme.typography.label + " block mb-1"}>Program Manager</label>
                        <select 
                            className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} focus:ring-2 focus:ring-nexus-500 outline-none`}
                            value={formData.managerId}
                            onChange={e => setFormData({...formData, managerId: e.target.value})}
                        >
                            <option value="">Select Manager...</option>
                            {state.resources.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className={theme.typography.label + " block mb-1"}>Total Budget Authority</label>
                        <Input type="number" value={formData.budget} onChange={e => setFormData({...formData, budget: parseFloat(e.target.value)})} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input type="date" label="Start Date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                    <Input type="date" label="Target Completion" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                         <label className={theme.typography.label + " block mb-1"}>Status</label>
                         <select className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} focus:ring-2 focus:ring-nexus-500 outline-none`} value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                             <option>Planned</option><option>Active</option><option>Closed</option>
                         </select>
                    </div>
                    <div>
                         <label className={theme.typography.label + " block mb-1"}>Health</label>
                         <select className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} focus:ring-2 focus:ring-nexus-500 outline-none`} value={formData.health} onChange={e => setFormData({...formData, health: e.target.value as any})}>
                             <option>Good</option><option>Warning</option><option>Critical</option>
                         </select>
                    </div>
                    <div>
                        <label className={theme.typography.label + " block mb-1"}>Category</label>
                        <select className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} focus:ring-2 focus:ring-nexus-500 outline-none`} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                            <option>Strategic</option><option>Operational</option><option>Compliance</option><option>Innovation</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className={theme.typography.label + " block mb-1"}>Description & Scope</label>
                    <textarea 
                        className={`w-full p-3 border ${theme.colors.border} rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none ${theme.colors.surface}`}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Define the strategic objectives and boundaries..."
                    />
                </div>
            </div>
        </SidePanel>
    );
};
