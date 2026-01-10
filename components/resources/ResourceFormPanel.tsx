
import React, { useState, useEffect } from 'react';
import { Resource } from '../../types';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Save, User, AlertTriangle, Briefcase, DollarSign, Calendar, Wrench, Box } from 'lucide-react';
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
    const [activeTab, setActiveTab] = useState<'general' | 'financials' | 'planning'>('general');

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
            setActiveTab('general');
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
        await new Promise(resolve => setTimeout(resolve, 500));
        const resourceToSave: Resource = {
            id: formData.id || generateId('R'),
            ...formData
        } as Resource;
        onSave(resourceToSave);
        success("Resource Saved", `${resourceToSave.name} has been updated.`);
        setIsSubmitting(false);
    };

    const typeIcon = {
        'Human': User,
        'Equipment': Wrench,
        'Material': Box,
        'Labor': User,
        'Non-Labor': Box
    }[formData.type || 'Human'] || User;

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={onClose}
            title={editingResource?.id ? "Edit Resource Profile" : "Provision New Resource"}
            width="md:w-[600px]"
            footer={
                <>
                    <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button onClick={handleSave} icon={Save} isLoading={isSubmitting}>Commit Record</Button>
                </>
            }
        >
            <div className="flex flex-col h-full">
                {/* Tabs */}
                <div className="flex border-b border-slate-200 mb-6">
                    {[
                        { id: 'general', label: 'Identity & Role', icon: Briefcase },
                        { id: 'financials', label: 'Costing', icon: DollarSign },
                        { id: 'planning', label: 'Availability', icon: Calendar }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                                activeTab === tab.id 
                                ? 'border-nexus-600 text-nexus-700 bg-nexus-50/50' 
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                            <tab.icon size={14} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto px-1">
                    {activeTab === 'general' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Resource Name <span className="text-red-500">*</span></label>
                                <Input 
                                    value={formData.name || ''} 
                                    onChange={e => setFormData({...formData, name: e.target.value})} 
                                    placeholder="e.g. John Doe"
                                    icon={typeIcon}
                                    className={errors.name ? 'border-red-300 focus:ring-red-500' : ''}
                                    autoFocus
                                />
                                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Resource Type</label>
                                    <select 
                                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500"
                                        value={formData.type}
                                        onChange={e => setFormData({...formData, type: e.target.value as any})}
                                    >
                                        <option value="Human">Human</option>
                                        <option value="Equipment">Equipment</option>
                                        <option value="Material">Material</option>
                                        <option value="Labor">Labor (Crew)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
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
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Primary Role <span className="text-red-500">*</span></label>
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
                                </select>
                                {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                            </div>

                            {formData.type === 'Equipment' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Asset Tag / Serial</label>
                                    <Input value={formData.serialNumber || ''} onChange={e => setFormData({...formData, serialNumber: e.target.value})} placeholder="SN-XXXX-YYYY" />
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'financials' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Standard Rate</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                                    <input 
                                        type="number" 
                                        className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-nexus-500 outline-none"
                                        value={formData.hourlyRate} 
                                        onChange={e => setFormData({...formData, hourlyRate: parseFloat(e.target.value)})}
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">/ hr</span>
                                </div>
                            </div>
                            
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                <h4 className="text-xs font-bold text-blue-800 uppercase mb-2">Costing Rules</h4>
                                <div className="flex items-center gap-2 mb-2">
                                    <input type="checkbox" className="rounded text-nexus-600"/>
                                    <span className="text-sm text-blue-700">Calculate Overtime (1.5x)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" className="rounded text-nexus-600" checked readOnly/>
                                    <span className="text-sm text-blue-700">Billable Resource</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'planning' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assigned Calendar</label>
                                <select 
                                    className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500"
                                    value={formData.calendarId}
                                    onChange={e => setFormData({...formData, calendarId: e.target.value})}
                                >
                                    {state.calendars.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    {!state.calendars.length && <option value="CAL-STD">Standard Calendar</option>}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Max Units (FTE)</label>
                                    <Input 
                                        type="number" 
                                        defaultValue="1.0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monthly Capacity (Hrs)</label>
                                    <Input 
                                        type="number" 
                                        value={formData.capacity} 
                                        onChange={e => setFormData({...formData, capacity: parseFloat(e.target.value)})}
                                    />
                                </div>
                            </div>

                            {formData.type === 'Equipment' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Maintenance Status</label>
                                    <select 
                                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                                        value={formData.maintenanceStatus}
                                        onChange={e => setFormData({...formData, maintenanceStatus: e.target.value as any})}
                                    >
                                        <option value="Good">Good (Available)</option>
                                        <option value="Service Required">Service Required</option>
                                        <option value="Down">Down (Unavailable)</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </SidePanel>
    );
};
