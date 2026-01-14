
import React, { useState, useEffect } from 'react';
import { ProgramChangeRequest } from '../../types';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<ProgramChangeRequest>) => void;
    request: Partial<ProgramChangeRequest> | null;
}

export const ProgramChangeRequestForm: React.FC<Props> = ({ isOpen, onClose, onSave, request }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState<Partial<ProgramChangeRequest>>({});

    useEffect(() => {
        if (request) setFormData(request);
    }, [request, isOpen]);

    const handleImpactChange = (field: 'cost' | 'schedule' | 'risk', value: any) => {
        setFormData(prev => ({
            ...prev,
            impact: {
                ...prev.impact,
                cost: prev.impact?.cost || 0,
                schedule: prev.impact?.schedule || 0,
                risk: prev.impact?.risk || 'Low',
                [field]: value
            }
        }));
    };

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title={formData.id ? "Edit Change Request" : "New Change Request"}
            width="md:w-[600px]"
            footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(formData)} icon={Save}>Submit Request</Button></>}
        >
            <div className="space-y-6">
                <div>
                    <label className={theme.typography.label + " block mb-1"}>Title</label>
                    <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Change Request Summary" />
                </div>
                <div>
                    <label className={theme.typography.label + " block mb-1"}>Description</label>
                    <textarea 
                        className={`w-full p-3 border ${theme.colors.border} rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none ${theme.colors.surface} ${theme.colors.text.primary} placeholder:${theme.colors.text.tertiary}`}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Detailed explanation of the proposed change..."
                    />
                </div>
                
                <div className={`p-4 ${theme.colors.background} border ${theme.colors.border} rounded-xl`}>
                    <h4 className={`text-sm font-bold ${theme.colors.text.primary} mb-4`}>Impact Analysis</h4>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className={theme.typography.label + " block mb-1"}>Cost Impact ($)</label>
                            <Input type="number" value={formData.impact?.cost} onChange={e => handleImpactChange('cost', parseFloat(e.target.value))} />
                        </div>
                        <div>
                            <label className={theme.typography.label + " block mb-1"}>Schedule (Days)</label>
                            <Input type="number" value={formData.impact?.schedule} onChange={e => handleImpactChange('schedule', parseFloat(e.target.value))} />
                        </div>
                        <div>
                            <label className={theme.typography.label + " block mb-1"}>Risk Level</label>
                            <select 
                                className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} focus:ring-2 focus:ring-nexus-500 outline-none`}
                                value={formData.impact?.risk}
                                onChange={e => handleImpactChange('risk', e.target.value)}
                            >
                                <option>Low</option><option>Medium</option><option>High</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className={theme.typography.label + " block mb-1"}>Status</label>
                        <select 
                            className={`w-full p-2.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface} focus:ring-2 focus:ring-nexus-500 outline-none`}
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value as any})}
                        >
                            <option value="Pending PCCB">Pending PCCB</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                     <div>
                        <label className={theme.typography.label + " block mb-1"}>Submitter</label>
                        <Input value={formData.submitterId} onChange={e => setFormData({...formData, submitterId: e.target.value})} />
                    </div>
                </div>
            </div>
        </SidePanel>
    );
};
