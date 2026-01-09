
import React, { useState, useEffect } from 'react';
import { Resource } from '../../types';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Save, User, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../context/ToastContext';
import { generateId } from '../../utils/formatters';

interface ResourceFormPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (resource: Resource) => void;
    editingResource: Partial<Resource> | null;
}

export const ResourceFormPanel: React.FC<ResourceFormPanelProps> = ({ isOpen, onClose, onSave, editingResource }) => {
    const { state } = useData();
    const { success } = useToast();
    const [formData, setFormData] = useState<Partial<Resource>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(editingResource || {
                name: '',
                type: 'Human',
                role: 'Team Member',
                status: 'Active',
                capacity: 160,
                allocated: 0,
                hourlyRate: 0,
                calendarId: state.calendars[0]?.id || 'CAL-STD',
                skills: [],
                costRates: []
            });
            setErrors({});
        }
    }, [editingResource, isOpen, state.calendars]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.role) newErrors.role = 'Role is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setIsSubmitting(true);
        
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async

        const resourceToSave: Resource = {
            id: formData.id || generateId('R'),
            ...formData
        } as Resource;

        onSave(resourceToSave);
        success("Resource Saved", `${resourceToSave.name} has been updated.`);
        setIsSubmitting(false);
    };

    // Calculate utilization for warning
    const capacity = formData.capacity || 160;
    const allocated = formData.allocated || 0;
    const utilization = capacity > 0 ? (allocated / capacity) * 100 : 0;

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title={editingResource?.id ? "Edit Resource" : "Provision Resource"}
            width="md:w-[500px]"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button onClick={handleSave} icon={Save} isLoading={isSubmitting}>Save Resource</Button>
                </>
            }
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Resource Name <span className="text-red-500">*</span></label>
                    <Input 
                        value={formData.name || ''} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        placeholder="e.g. John Doe or Excavator 01"
                        icon={User}
                        className={errors.name ? 'border-red-300 focus:ring-red-500' : ''}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                        <select 
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500"
                            value={formData.type}
                            onChange={e => setFormData({...formData, type: e.target.value as any})}
                        >
                            <option value="Human">Human</option>
                            <option value="Equipment">Equipment</option>
                            <option value="Material">Material</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                         <select 
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500"
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value as any})}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Role / Class <span className="text-red-500">*</span></label>
                    <select 
                        className={`w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 ${errors.role ? 'border-red-300' : 'border-slate-300'}`}
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                        <option value="">Select Role...</option>
                        {state.roles.map(r => <option key={r.id} value={r.title}>{r.title}</option>)}
                        <option value="Project Manager">Project Manager</option>
                        <option value="Senior Engineer">Senior Engineer</option>
                        <option value="Excavator">Excavator</option>
                        <option value="Crane">Crane</option>
                    </select>
                    {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Standard Rate ($/hr)</label>
                        <Input 
                            type="number" 
                            value={formData.hourlyRate} 
                            onChange={e => setFormData({...formData, hourlyRate: parseFloat(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Capacity (Hrs/Mo)</label>
                         <Input 
                            type="number" 
                            value={formData.capacity} 
                            onChange={e => setFormData({...formData, capacity: parseFloat(e.target.value)})}
                        />
                    </div>
                </div>
                
                {utilization > 100 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={16} />
                        <div>
                            <p className="text-xs font-bold text-red-700">Over-allocation Warning</p>
                            <p className="text-xs text-red-600">Current allocation ({allocated}h) exceeds capacity ({capacity}h).</p>
                        </div>
                    </div>
                )}

                <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Calendar</label>
                     <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500"
                        value={formData.calendarId}
                        onChange={e => setFormData({...formData, calendarId: e.target.value})}
                    >
                        {state.calendars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        {!state.calendars.length && <option value="CAL-STD">Standard Calendar</option>}
                    </select>
                </div>

                {formData.type === 'Equipment' && (
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Maintenance Status</label>
                         <select 
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                            value={formData.maintenanceStatus}
                            onChange={e => setFormData({...formData, maintenanceStatus: e.target.value as any})}
                        >
                            <option value="Good">Good</option>
                            <option value="Service Required">Service Required</option>
                            <option value="Down">Down</option>
                        </select>
                    </div>
                )}
            </div>
        </SidePanel>
    );
};
