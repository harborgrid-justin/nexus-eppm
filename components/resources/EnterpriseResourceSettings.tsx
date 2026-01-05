



import React, { useState } from 'react';
import { Users, Sliders, Landmark, Save } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import { SidePanel } from '../ui/SidePanel';
import { Input } from '../ui/Input';
// FIX: Corrected import path to use the barrel file to resolve module ambiguity.
import { EnterpriseRole } from '../../types/index';
import { generateId } from '../../utils/formatters';
import { RoleSettings } from './settings/RoleSettings';
import { LevelingSettings } from './settings/LevelingSettings';
import { RateSettings } from './settings/RateSettings';

const EnterpriseResourceSettings: React.FC = () => {
    const { dispatch } = useData();
    const [activeTab, setActiveTab] = useState<'roles' | 'leveling' | 'rates'>('roles');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Partial<EnterpriseRole> | null>(null);

    const handleOpenPanel = (role?: EnterpriseRole) => {
        setEditingRole(role ? JSON.parse(JSON.stringify(role)) : { title: '', description: '', requiredSkills: [] });
        setIsPanelOpen(true);
    };

    const handleSaveRole = () => {
        if (!editingRole?.title) return;
        const roleToSave: EnterpriseRole = {
            ...editingRole,
            id: editingRole.id || generateId('ER'),
            requiredSkills: editingRole.requiredSkills || []
        } as EnterpriseRole;

        dispatch({ type: editingRole.id ? 'UPDATE_ROLE' : 'ADD_ROLE', payload: roleToSave });
        setIsPanelOpen(false);
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="bg-slate-50 border-b border-slate-200 px-6 pt-4">
                <nav className="-mb-px flex space-x-8">
                    {[ { id: 'roles', label: 'Enterprise Roles', icon: Users }, { id: 'leveling', label: 'Leveling Logic', icon: Sliders }, { id: 'rates', label: 'Global Rate Tables', icon: Landmark } ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 py-4 px-1 border-b-2 font-bold text-xs uppercase tracking-widest transition-all ${activeTab === tab.id ? 'border-nexus-600 text-nexus-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>
                            <tab.icon size={14} /> {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-white">
                {activeTab === 'roles' && <RoleSettings handleOpenPanel={handleOpenPanel} />}
                {activeTab === 'leveling' && <LevelingSettings />}
                {activeTab === 'rates' && <RateSettings />}
            </div>
            <SidePanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} title={editingRole?.id ? "Update Role Definition" : "Define Enterprise Role"} width="md:w-[450px]" footer={<><Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button><Button onClick={handleSaveRole} icon={Save}>Commit Taxonomy</Button></>}>
                <div className="space-y-6">
                    <div><label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest">Role Title</label><Input value={editingRole?.title} onChange={e => setEditingRole({...editingRole!, title: e.target.value})} placeholder="e.g. Lead Electrical Engineer" /></div>
                    <div><label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest">Description</label><textarea className="w-full p-3 border border-slate-300 rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none" value={editingRole?.description} onChange={e => setEditingRole({...editingRole!, description: e.target.value})} /></div>
                    <div><label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Associated Skills</label><div className="p-4 border border-slate-200 rounded-xl bg-white space-y-2">{['AutoCAD', 'Structural Analysis', 'PMP', 'Primavera P6'].map(skill => (<label key={skill} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer"><input type="checkbox" className="rounded text-nexus-600" />{skill}</label>))}</div></div>
                </div>
            </SidePanel>
        </div>
    );
};

export default EnterpriseResourceSettings;