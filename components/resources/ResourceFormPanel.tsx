
import React, { useState, useEffect } from 'react';
import { Resource } from '../../types';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Save, User } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { generateId } from '../../utils/formatters';

interface ResourceFormPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (resource: Resource) => void;
    editingResource: Partial<Resource> | null;
}

export const ResourceFormPanel: React.FC<ResourceFormPanelProps> = ({ isOpen, onClose, onSave, editingResource }) => {
    const { state } = useData();
    const [formData, setFormData] = useState<Partial<Resource>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(editingResource || {
                name: '',
                type: 'Human',
                role: 'Team Member',
                status: 'Active',
                capacity: 160,
                hourlyRate: 0,
                calendarId: state.calendars[0]?.id || '',
                skills: [],
                costRates: []
            });
        }
    }, [editingResource, isOpen, state.calendars]);

    const handleSave = () => {
        if (!formData.name) {
            alert('Resource Name is required.');
            return;
        }

        const resourceToSave: Resource = {
            id: formData.id || generateId('R'),
            ...formData
        } as Resource;

        onSave(resourceToSave);
    };

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title={editingResource?.id ? "Edit Resource" : "Provision Resource"}
            width="md:w-[500px]"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave} icon={Save}>Save Resource</Button>
                </>
            }
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Resource Name</label>
                    <Input 
                        value={formData.name || ''} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        placeholder="e.g. John Doe or Excavator 01"
                        icon={User}
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                        <select 
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
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
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value as any})}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Role / Class</label>
                    <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                    >
                        <option value="">Select Role...</option>
                        {state.roles.map(r => <option key={r.id} value={r.title}>{r.title}</option>)}
                        {/* Fallback options if roles list is empty or for equipment */}
                        <option value="Project Manager">Project Manager</option>
                        <option value="Senior Engineer">Senior Engineer</option>
                        <option value="Excavator">Excavator</option>
                        <option value="Crane">Crane</option>
                    </select>
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

                <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Calendar</label>
                     <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                        value={formData.calendarId}
                        onChange={e => setFormData({...formData, calendarId: e.target.value})}
                    >
                        {state.calendars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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
