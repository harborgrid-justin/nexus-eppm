
import React, { useState } from 'react';
import { Users, Sliders, Landmark, Save } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import { SidePanel } from '../ui/SidePanel';
import { Input } from '../ui/Input';
import { EnterpriseRole } from '../../types/index';
import { generateId } from '../../utils/formatters';
import { RoleSettings } from './settings/RoleSettings';
import { LevelingSettings } from './settings/LevelingSettings';
import { RateSettings } from './settings/RateSettings';
import { useTheme } from '../../context/ThemeContext';

const EnterpriseResourceSettings: React.FC = () => {
    const { dispatch } = useData();
    const theme = useTheme();
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
        <div className={`h-full flex flex-col ${theme.layout.sectionSpacing}`}>
            <div className={`bg-white border ${theme.colors.border} rounded-2xl overflow-hidden shadow-sm flex flex-col flex-1`}>
                <div className={`bg-slate-50 border-b ${theme.colors.border} px-6 pt-4`}>
                    <nav className="-mb-px flex space-x-8">
                        {[ 
                            { id: 'roles', label: 'Resource Taxonomy', icon: Users }, 
                            { id: 'leveling', label: 'Leveling Logic', icon: Sliders }, 
                            { id: 'rates', label: 'Global Rates', icon: Landmark } 
                        ].map(tab => (
                            <button 
                                key={tab.id} 
                                onClick={() => setActiveTab(tab.id as any)} 
                                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                                    activeTab === tab.id 
                                    ? `border-nexus-600 text-nexus-700` 
                                    : `border-transparent text-slate-400 hover:text-slate-600`
                                }`}
                            >
                                <tab.icon size={14} /> {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                    {activeTab === 'roles' && <RoleSettings handleOpenPanel={handleOpenPanel} />}
                    {activeTab === 'leveling' && <LevelingSettings />}
                    {activeTab === 'rates' && <RateSettings />}
                </div>
            </div>

            <SidePanel 
                isOpen={isPanelOpen} 
                onClose={() => setIsPanelOpen(false)} 
                title={editingRole?.id ? "Update Role Definition" : "Define Resource Role"} 
                width="md:w-[450px]" 
                footer={<><Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button><Button onClick={handleSaveRole} icon={Save}>Commit Taxonomy</Button></>}
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Role Designation</label>
                        <Input value={editingRole?.title} onChange={e => setEditingRole({...editingRole!, title: e.target.value})} placeholder="e.g. Lead Electrical Engineer" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest ml-1">Scope of Work</label>
                        <textarea 
                            className="w-full p-4 border border-slate-300 rounded-xl text-sm h-32 focus:ring-2 focus:ring-nexus-500 outline-none transition-all shadow-inner" 
                            value={editingRole?.description} 
                            onChange={e => setEditingRole({...editingRole!, description: e.target.value})} 
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest ml-1">Mandatory Competencies</label>
                        <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50/50 space-y-3 shadow-inner">
                            {['AutoCAD Master', 'Structural Dynamics', 'EVM Certified', 'Master Scheduler'].map(skill => (
                                <label key={skill} className="flex items-center gap-3 text-sm font-bold text-slate-700 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-nexus-600 focus:ring-nexus-500 transition-all" />
                                    <span className="group-hover:text-nexus-600 transition-colors">{skill}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default EnterpriseResourceSettings;
