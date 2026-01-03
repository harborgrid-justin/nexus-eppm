
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { FileWarning, Plus, Globe, Briefcase, Edit2, Trash2, Save, X, Settings } from 'lucide-react';
import { ActivityCodeScope, IssueCode } from '../../types/index';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';

export const IssueCodeSettings: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const [activeScope, setActiveScope] = useState<ActivityCodeScope>('Global');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingCode, setEditingCode] = useState<Partial<IssueCode> | null>(null);

    const filteredCodes = useMemo(() => {
        return state.issueCodes.filter(ic => ic.scope === activeScope);
    }, [state.issueCodes, activeScope]);

    const handleOpenPanel = (code?: IssueCode) => {
        setEditingCode(code || { name: '', scope: activeScope, values: [] });
        setIsPanelOpen(true);
    };

    const handleSave = () => {
        if (!editingCode?.name) return;
        const codeToSave: IssueCode = {
            id: editingCode.id || generateId('IC'),
            name: editingCode.name,
            scope: editingCode.scope || 'Global',
            values: editingCode.values || []
        };
        dispatch({
            type: editingCode.id ? 'UPDATE_ISSUE_CODE' : 'ADD_ISSUE_CODE',
            payload: codeToSave
        });
        setIsPanelOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this issue code? Existing issue classifications using this code will be cleared.")) {
            dispatch({ type: 'DELETE_ISSUE_CODE', payload: id });
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${theme.colors.surface} p-4 rounded-xl border ${theme.colors.border} shadow-sm shrink-0`}>
                <div>
                    <h3 className={`font-bold ${theme.colors.text.primary} text-lg`}>Issue Code Registry</h3>
                    <p className={`text-sm ${theme.colors.text.secondary}`}>Standardize issue classification for root-cause and trend analysis.</p>
                </div>
                <Button size="sm" icon={Plus} onClick={() => handleOpenPanel()} className="w-full sm:w-auto">Add Issue Code</Button>
            </div>

            <div className={`flex ${theme.colors.background} p-1 rounded-lg w-full sm:w-min shadow-inner border ${theme.colors.border} shrink-0`}>
                <button
                    onClick={() => setActiveScope('Global')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeScope === 'Global' ? `${theme.colors.surface} shadow-sm text-nexus-600` : `${theme.colors.text.secondary}`}`}
                >
                    <Globe size={14} /> Global
                </button>
                <button
                    onClick={() => setActiveScope('Project')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeScope === 'Project' ? `${theme.colors.surface} shadow-sm text-nexus-600` : `${theme.colors.text.secondary}`}`}
                >
                    <Briefcase size={14} /> Project
                </button>
            </div>

            <div className={`border ${theme.colors.border} rounded-xl overflow-hidden shadow-sm ${theme.colors.surface} flex-1 overflow-y-auto`}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className={`${theme.colors.background} sticky top-0`}>
                            <tr>
                                <th className={theme.components.table.header + " whitespace-nowrap"}>Code Name</th>
                                <th className={theme.components.table.header + " min-w-[200px]"}>Allowed Values</th>
                                <th className={theme.components.table.header + " text-right whitespace-nowrap"}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                            {filteredCodes.map(code => (
                                <tr key={code.id} className={theme.components.table.row + " group"}>
                                    <td className={`${theme.components.table.cell} text-sm font-bold whitespace-nowrap`}>{code.name}</td>
                                    <td className={theme.components.table.cell + " text-sm"}>
                                        <div className="flex flex-wrap gap-1">
                                            {code.values.map(v => (
                                                <span key={v.id} className={`px-2 py-0.5 ${theme.colors.background} rounded text-[10px] font-mono border ${theme.colors.border}`}>{v.value}</span>
                                            ))}
                                            {code.values.length === 0 && <span className={`italic ${theme.colors.text.tertiary}`}>No values defined</span>}
                                        </div>
                                    </td>
                                    <td className={theme.components.table.cell + " text-right"}>
                                        <div className="flex justify-end gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleOpenPanel(code)} className={`p-1.5 hover:${theme.colors.background} rounded ${theme.colors.text.secondary}`}><Edit2 size={14}/></button>
                                            <button onClick={() => handleDelete(code.id)} className={`p-1.5 hover:bg-red-50 rounded ${theme.colors.text.secondary} hover:text-red-500`}><Trash2 size={14}/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredCodes.length === 0 && (
                                <tr><td colSpan={3} className={`p-8 text-center ${theme.colors.text.tertiary} text-sm italic`}>No codes defined for this scope.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingCode?.id ? "Edit Issue Code" : "Create Issue Code"}
                width="md:w-[450px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} icon={Save}>Commit Code</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div>
                        <label className={theme.typography.label + " block mb-1"}>Code Label</label>
                        <Input value={editingCode?.name} onChange={e => setEditingCode({...editingCode, name: e.target.value})} placeholder="e.g. Root Cause Category" />
                    </div>
                    <div>
                         <label className={theme.typography.label + " block mb-3"}>Dictionary Values</label>
                         <div className="space-y-2">
                             {editingCode?.values?.map((val, idx) => (
                                 <div key={val.id} className="flex gap-2 items-center">
                                     <Input 
                                        className="flex-1"
                                        value={val.value}
                                        onChange={(e) => {
                                            const newVals = [...editingCode.values!];
                                            newVals[idx].value = e.target.value;
                                            setEditingCode({...editingCode, values: newVals});
                                        }}
                                     />
                                     <button onClick={() => {
                                         const newVals = editingCode.values!.filter((_, i) => i !== idx);
                                         setEditingCode({...editingCode, values: newVals});
                                     }} className={`p-1.5 ${theme.colors.text.tertiary} hover:text-red-500`}><X size={14}/></button>
                                 </div>
                             ))}
                             <button onClick={() => setEditingCode({...editingCode, values: [...(editingCode?.values || []), { id: Date.now().toString(), value: '', description: '' }]})} 
                                className={`w-full py-2 border-2 border-dashed ${theme.colors.border} rounded-lg text-xs font-bold ${theme.colors.text.tertiary} hover:border-nexus-300 hover:text-nexus-600 transition-all flex items-center justify-center gap-2`}>
                                <Plus size={14}/> Add Selection Value
                             </button>
                         </div>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};
