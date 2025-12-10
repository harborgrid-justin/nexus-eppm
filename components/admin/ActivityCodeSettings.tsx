import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { ActivityCode, ActivityCodeScope, ActivityCodeValue } from '../../types';
import { Tag, Plus, Edit2, Trash2, Save, X, Globe, Building, Briefcase } from 'lucide-react';

const ActivityCodeSettings: React.FC = () => {
    const { state, dispatch } = useData();
    const [activeScope, setActiveScope] = useState<ActivityCodeScope>('Global');
    const [selectedCodeId, setSelectedCodeId] = useState<string | null>(null);

    const filteredCodes = useMemo(() => {
        // In a real app, EPS scope would filter by an EPS ID
        return state.activityCodes.filter(ac => ac.scope === activeScope);
    }, [state.activityCodes, activeScope]);

    const selectedCode = useMemo(() => {
        return state.activityCodes.find(ac => ac.id === selectedCodeId) || null;
    }, [state.activityCodes, selectedCodeId]);

    const scopeTabs: { id: ActivityCodeScope, label: string, icon: React.ElementType }[] = [
        { id: 'Global', label: 'Global', icon: Globe },
        { id: 'EPS', label: 'EPS', icon: Building },
        { id: 'Project', label: 'Project', icon: Briefcase },
    ];

    return (
        <div className="flex h-full">
            {/* Code List Panel */}
            <div className="w-[400px] border-r border-slate-200 flex flex-col bg-slate-50">
                <div className="p-2 border-b border-slate-200">
                    <div className="flex bg-slate-200 p-1 rounded-lg">
                       {scopeTabs.map(tab => (
                         <button 
                            key={tab.id}
                            onClick={() => setActiveScope(tab.id)}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md ${activeScope === tab.id ? 'bg-white shadow-sm text-nexus-600' : 'text-slate-600 hover:bg-white/50'}`}
                         >
                            <tab.icon size={14} /> {tab.label}
                         </button>
                       ))}
                    </div>
                </div>
                 <div className="p-2 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-xs font-semibold text-slate-500 uppercase px-2">Codes ({filteredCodes.length})</h3>
                    <button className="flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-300 rounded-md text-xs text-slate-600 hover:bg-slate-100">
                       <Plus size={14} /> Add Code
                    </button>
                 </div>
                <div className="flex-1 overflow-y-auto p-2">
                    {filteredCodes.map(code => (
                        <div 
                           key={code.id} 
                           onClick={() => setSelectedCodeId(code.id)}
                           className={`p-3 rounded-lg cursor-pointer mb-1 ${selectedCodeId === code.id ? 'bg-nexus-100 text-nexus-800' : 'hover:bg-white'}`}
                        >
                            <p className="font-semibold text-sm">{code.name}</p>
                            <p className="text-xs text-slate-500">{code.values.length} values</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* Details Panel */}
            <div className="flex-1 flex flex-col">
                {selectedCode ? (
                    <>
                        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">{selectedCode.name}</h2>
                                <p className="text-sm text-slate-500">Manage values for this activity code.</p>
                            </div>
                             <button className="flex items-center gap-1.5 px-3 py-2 bg-nexus-600 text-white rounded-md text-sm font-medium hover:bg-nexus-700">
                               <Plus size={14} /> Add Value
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                           <table className="min-w-full">
                             <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
                               <tr>
                                 <th className="px-6 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-12">Color</th>
                                 <th className="px-6 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Value</th>
                                 <th className="px-6 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                                 <th className="px-6 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-24">Actions</th>
                               </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                               {selectedCode.values.map(val => (
                                 <tr key={val.id} className="hover:bg-slate-50">
                                   <td className="px-6 py-3"><div className="w-5 h-5 rounded border border-slate-200" style={{ backgroundColor: val.color || '#e2e8f0' }}></div></td>
                                   <td className="px-6 py-3 text-sm font-medium text-slate-800">{val.value}</td>
                                   <td className="px-6 py-3 text-sm text-slate-500">{val.description || <span className="italic text-slate-400">No description</span>}</td>
                                   <td className="px-6 py-3 text-slate-500">
                                      <div className="flex gap-2">
                                         <button className="hover:text-nexus-600"><Edit2 size={14}/></button>
                                         <button className="hover:text-red-600"><Trash2 size={14}/></button>
                                      </div>
                                   </td>
                                 </tr>
                               ))}
                             </tbody>
                           </table>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                        <div className="text-center">
                            <Tag size={32} className="mx-auto mb-2 opacity-50"/>
                            <p>Select an Activity Code to view its values.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivityCodeSettings;