
import React from 'react';
import { useData } from '../../../context/DataContext';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { EnterpriseRole } from '../../../types';

interface RoleSettingsProps {
    handleOpenPanel: (role?: EnterpriseRole) => void;
}

export const RoleSettings: React.FC<RoleSettingsProps> = ({ handleOpenPanel }) => {
    const { state } = useData();

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                    <h4 className="font-bold text-slate-900">Role Taxonomy</h4>
                    <p className="text-xs text-slate-500">Standardized roles drive automated resource-loading and cross-project staffing.</p>
                </div>
                <Button size="sm" icon={Plus} onClick={() => handleOpenPanel()}>Define Role</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {state.roles.map(role => (
                    <div key={role.id} className="p-4 border border-slate-200 rounded-xl hover:border-nexus-400 transition-all group bg-white shadow-sm flex flex-col justify-between h-40">
                        <div className="flex justify-between items-start">
                            <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-slate-900 group-hover:text-nexus-700 truncate">{role.title}</h4>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{role.description}</p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                <button onClick={() => handleOpenPanel(role)} className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-nexus-600"><Edit2 size={14}/></button>
                                <button className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-50 flex flex-wrap gap-1">
                            {role.requiredSkills.map(sk => (
                                <span key={sk} className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                                    {sk}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
