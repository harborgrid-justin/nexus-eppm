


import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
// FIX: Corrected import path for types to resolve module resolution errors.
import { ActivityCode, ActivityCodeScope, ActivityCodeValue } from '../../types/index';
import { Tag, Plus, Edit2, Trash2, Save, Globe, Building, Briefcase, Settings, Palette, Info } from 'lucide-react';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { generateId } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

export const ActivityCodeSettings: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const [activeScope, setActiveScope] = useState<ActivityCodeScope>('Global');
    const [selectedCodeId, setSelectedCodeId] = useState<string | null>(state.activityCodes[0]?.id || null);

    // SidePanel States
    const [isDefinitionPanelOpen, setIsDefinitionPanelOpen] = useState(false);
    const [editingDefinition, setEditingDefinition] = useState<Partial<ActivityCode> | null>(null);

    const [isValuePanelOpen, setIsValuePanelOpen] = useState(false);
    const [editingValue, setEditingValue] = useState<Partial<ActivityCodeValue> | null>(null);
    const [editingValueIndex, setEditingValueIndex] = useState<number | null>(null);

    const filteredCodes = useMemo(() => {
        return state.activityCodes.filter(ac => ac.scope === activeScope);
    }, [state.activityCodes, activeScope]);

    const selectedCode = useMemo(() => {
        return state.activityCodes.find(ac => ac.id === selectedCodeId) || null;
    }, [state.activityCodes, selectedCodeId]);

    // --- Definition Handlers ---
    const handleOpenDefinitionPanel = (code?: ActivityCode) => {
        setEditingDefinition(code ? JSON.parse(JSON.stringify(code)) : {
            name: '',
            scope: activeScope,
            values: []
        });
        setIsDefinitionPanelOpen(true);
    };

    const handleSaveDefinition = () => {
        if (!editingDefinition?.name) return;
        const codeToSave: ActivityCode = {
            ...editingDefinition,
            id: editingDefinition.id || generateId('AC'),
            values: editingDefinition.values || []
        } as ActivityCode;

        dispatch({
            type: editingDefinition.id ? 'ADMIN_UPDATE_ACTIVITY_CODE' : 'ADMIN_ADD_ACTIVITY_CODE',
            payload: codeToSave
        });
        setIsDefinitionPanelOpen(false);
        setSelectedCodeId(codeToSave.id);
    };

    const handleDeleteDefinition = (id: string) => {
        if (confirm("Permanently delete this activity code definition? This will remove all assigned values from projects and tasks.")) {
            dispatch({ type: 'ADMIN_DELETE_ACTIVITY_CODE', payload: id });
            if (selectedCodeId === id) setSelectedCodeId(null);
        }
    };

    // --- Value Handlers ---
    const handleOpenValuePanel = (val?: ActivityCodeValue, index?: number) => {
        setEditingValue(val ? { ...val } : { value: '', description: '', color: '#e2e8f0' });
        setEditingValueIndex(index !== undefined ? index : null);
        setIsValuePanelOpen(true);
    };

    const handleSaveValue = () => {
        if (!editingValue?.value || !selectedCode) return;

        const updatedValues = [...selectedCode.values];
        const valueToSave = {
            ...editingValue,
            id: editingValue.id || generateId('AV')
        } as ActivityCodeValue;

        if (editingValueIndex !== null) {
            updatedValues[editingValueIndex] = valueToSave;
        } else {
            updatedValues.push(valueToSave);
        }

        dispatch({
            type: 'ADMIN_UPDATE_ACTIVITY_CODE',
            payload: { ...selectedCode, values: updatedValues }
        });
        setIsValuePanelOpen(false);
    };

    const handleDeleteValue = (index: number) => {
        if (!selectedCode) return;
        const updatedValues = selectedCode.values.filter((_, i) => i !== index);
        dispatch({
            type: 'ADMIN_UPDATE_ACTIVITY_CODE',
            payload: { ...selectedCode, values: updatedValues }
        });
    };

    return (
        <div className={`flex flex-col md:flex-row h-full ${theme.colors.surface} rounded-xl border ${theme.colors.border} overflow-hidden shadow-sm`}>
            {/* Left Rail: Definitions */}
            <div className={`w-full md:w-[320px] lg:w-[380px] border-b md:border-b-0 md:border-r ${theme.colors.border} flex flex-col bg-slate-50/50 flex-shrink-0`}>
                <div className={`p-4 border-b ${theme.colors.border} bg-white`}>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                       {[
                           { id: 'Global', icon: Globe },
                           { id: 'Project', icon: Briefcase }
                       ].map(tab => (
                         <button 
                            key={tab.id}
                            onClick={() => { setActiveScope(tab.id as any); setSelectedCodeId(null); }}
                            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-md transition-all ${activeScope === tab.id ? 'bg-white shadow text-nexus-600' : 'text-slate-500 hover:text-slate-800'}`}
                         >
                            <tab.icon size={14} /> {tab.id}
                         </button>
                       ))}
                    </div>
                </div>
                
                 <div className="p-4 flex justify-between items-center border-b border-slate-100">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Code Registry</h3>
                    <button onClick={() => handleOpenDefinitionPanel()} className={`p-1.5 ${theme.colors.primary} text-white rounded-lg ${theme.colors.primaryHover} shadow-sm transition-all`}>
                       <Plus size={16} />
                    </button>
                 </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[300px] md:max-h-full">
                    {filteredCodes.map(code => (
                        <div 
                           key={code.id} 
                           onClick={() => setSelectedCodeId(code.id)}
                           className={`p-4 rounded-xl cursor-pointer transition-all border group ${selectedCodeId === code.id ? 'bg-white border-nexus-200 shadow-sm ring-1 ring-nexus-500/10' : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'}`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className={`font-bold text-sm ${selectedCodeId === code.id ? 'text-nexus-700' : 'text-slate-800'}`}>{code.name}</span>
                                    <p className="text-[10px] text-slate-400 mt-1 font-mono">{code.id}</p>
                                </div>
                                <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <button onClick={(e) => { e.stopPropagation(); handleOpenDefinitionPanel(code); }} className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-nexus-600"><Edit2 size={12}/></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteDefinition(code.id); }} className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500"><Trash2 size={12}/></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredCodes.length === 0 && (
                        <div className="p-12 text-center text-slate-400 text-xs italic">No {activeScope} codes defined.</div>
                    )}
                </div>
            </div>

            {/* Right Panel: Dictionary Values */}
            <div className="flex-1 flex flex-col bg-white min-w-0">
                {selectedCode ? (
                    <>
                        <div className={`p-4 md:p-6 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/30 gap-4`}>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{selectedCode.name}</h2>
                                <p className="text-xs text-slate-500 mt-1 uppercase tracking-tight font-semibold">Scope: <span className="text-nexus-600">{selectedCode.scope}</span> • {selectedCode.values.length} Dictionary Values</p>
                            </div>
                             <div className="flex gap-2 w-full sm:w-auto">
                                <Button size="sm" variant="secondary" icon={Settings} onClick={() => handleOpenDefinitionPanel(selectedCode)} className="flex-1 sm:flex-none">Settings</Button>
                                <Button size="sm" icon={Plus} onClick={() => handleOpenValuePanel()} className="flex-1 sm:flex-none">Add Value</Button>
                             </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                           <table className="min-w-full divide-y divide-slate-100">
                             <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                               <tr>
                                 <th className="px-4 md:px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase w-16 text-center">Swatch</th>
                                 <th className="px-4 md:px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Code Value</th>
                                 <th className="hidden sm:table-cell px-4 md:px-6 py-3 text-left text-[10px] font-black text-slate-400 uppercase">Description</th>
                                 <th className="px-4 md:px-6 py-3 text-right text-[10px] font-black text-slate-400 uppercase">Actions</th>
                               </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-50">
                               {selectedCode.values.map((val, idx) => (
                                 <tr key={val.id} className="hover:bg-slate-50 group">
                                   <td className="px-4 md:px-6 py-4 flex justify-center">
                                       <div 
                                          className="w-5 h-5 rounded-md border border-black/10 shadow-sm transition-transform hover:scale-110" 
                                          style={{ backgroundColor: val.color || '#e2e8f0' }}
                                          title={val.color || 'No color'}
                                       ></div>
                                   </td>
                                   <td className="px-4 md:px-6 py-4">
                                       <span className="text-sm font-bold text-slate-800 font-mono tracking-tight bg-slate-100 px-2 py-1 rounded block w-fit">{val.value}</span>
                                       <span className="sm:hidden text-xs text-slate-500 mt-1 block truncate max-w-[150px]">{val.description}</span>
                                   </td>
                                   <td className="hidden sm:table-cell px-4 md:px-6 py-4 text-sm text-slate-500 max-w-md truncate">{val.description || <span className="italic text-slate-300">No description provided</span>}</td>
                                   <td className="px-4 md:px-6 py-4 text-right">
                                      <div className="flex justify-end gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                         <button onClick={() => handleOpenValuePanel(val, idx)} className="p-1.5 hover:bg-slate-200 rounded text-slate-500 hover:text-nexus-600"><Edit2 size={14}/></button>
                                         <button onClick={() => handleDeleteValue(idx)} className="p-1.5 hover:bg-red-50 rounded text-red-500"><Trash2 size={14}/></button>
                                      </div>
                                   </td>
                                 </tr>
                               ))}
                               {selectedCode.values.length === 0 && (
                                   <tr>
                                       <td colSpan={4} className="py-20 text-center text-slate-400 italic text-sm">No values defined in this dictionary.</td>
                                   </tr>
                               )}
                             </tbody>
                           </table>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400 bg-slate-50/50 p-4">
                        <div className="text-center">
                            <Tag size={64} className="mx-auto mb-4 opacity-10"/>
                            <h3 className="text-lg font-bold text-slate-700">Select Activity Code</h3>
                            <p className="text-sm max-w-xs mt-2 mx-auto">Relational Activity Codes allow complex filtering and visual grouping across the enterprise.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Definition SidePanel */}
            <SidePanel
                isOpen={isDefinitionPanelOpen}
                onClose={() => setIsDefinitionPanelOpen(false)}
                title={editingDefinition?.id ? "Edit Code Definition" : "Register New Activity Code"}
                width="md:w-[450px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsDefinitionPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveDefinition} icon={Save}>Commit Code</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest">Definition Name</label>
                        <Input 
                            value={editingDefinition?.name} 
                            onChange={e => setEditingDefinition({...editingDefinition!, name: e.target.value})} 
                            placeholder="e.g. Region, Work Stream, Criticality"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest">Standard Scope</label>
                        <select 
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white font-medium text-slate-700 outline-none focus:ring-2 focus:ring-nexus-500"
                            value={editingDefinition?.scope}
                            onChange={e => setEditingDefinition({...editingDefinition!, scope: e.target.value as any})}
                        >
                            <option value="Global">Global (All Projects)</option>
                            <option value="Project">Project Specific (Private)</option>
                        </select>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                        <Info size={20} className="text-blue-600 shrink-0 mt-0.5"/>
                        <p className="text-[10px] text-blue-800 leading-relaxed font-bold uppercase tracking-tight">
                            Global codes are standardized across all business units. Project codes are only available for the selected initiative.
                        </p>
                    </div>
                </div>
            </SidePanel>

            {/* Value SidePanel */}
            <SidePanel
                isOpen={isValuePanelOpen}
                onClose={() => setIsValuePanelOpen(false)}
                title={editingValueIndex !== null ? "Edit Dictionary Value" : "Add Value to Dictionary"}
                width="md:w-[450px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsValuePanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveValue} icon={Plus}>Save Value</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest">Code Value (ID)</label>
                        <Input 
                            value={editingValue?.value} 
                            onChange={e => setEditingValue({...editingValue!, value: e.target.value.toUpperCase()})} 
                            placeholder="e.g. NA, EMEA, APAC"
                            className="font-mono"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest">Long Description</label>
                        <Input 
                            value={editingValue?.description} 
                            onChange={e => setEditingValue({...editingValue!, description: e.target.value})} 
                            placeholder="Detailed explanation of this category"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">Visual Marker (Hex Color)</label>
                        <div className="flex gap-4 items-center">
                            <input 
                                type="color" 
                                className="w-12 h-12 rounded cursor-pointer border-none p-0"
                                value={editingValue?.color || '#e2e8f0'}
                                onChange={e => setEditingValue({...editingValue!, color: e.target.value})}
                            />
                            <Input 
                                value={editingValue?.color} 
                                onChange={e => setEditingValue({...editingValue!, color: e.target.value})} 
                                className="font-mono text-sm uppercase flex-1"
                                placeholder="#FFFFFF"
                            />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">This color will be used in Gantt bars and dashboard analytics.</p>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default ActivityCodeSettings;