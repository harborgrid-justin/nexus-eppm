
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
// FIX: Corrected import path
import { UDFSubjectArea, UserDefinedField } from '../../types/index';
import { Edit3, Plus, Trash2, CheckCircle, List, Type, Calendar, Hash, Save, X, Edit2 as EditIcon, Shield } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SidePanel } from '../ui/SidePanel';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';

export const UdfSettings: React.FC = () => {
    const { state, dispatch } = useData();
    const [subjectArea, setSubjectArea] = useState<UDFSubjectArea>('Tasks');
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingUdf, setEditingUdf] = useState<Partial<UserDefinedField> | null>(null);

    const filteredUdfs = state.userDefinedFields.filter(udf => udf.subjectArea === subjectArea);

    const handleOpenPanel = (udf?: UserDefinedField) => {
        setEditingUdf(udf || { title: '', dataType: 'Text', subjectArea: subjectArea });
        setIsPanelOpen(true);
    };

    const handleSave = () => {
        if (!editingUdf?.title) return;
        const udfToSave: UserDefinedField = {
            id: editingUdf.id || generateId('UDF'),
            title: editingUdf.title,
            dataType: editingUdf.dataType || 'Text',
            subjectArea: editingUdf.subjectArea || subjectArea
        };

        dispatch({
            type: editingUdf.id ? 'UPDATE_UDF' : 'ADD_UDF',
            payload: udfToSave
        });
        setIsPanelOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Remove this custom field? Data associated with this field will be permanently deleted from all items.")) {
            dispatch({ type: 'DELETE_UDF', payload: id });
        }
    };

    const getTypeIcon = (type: string) => {
        switch(type) {
            case 'Text': return <Type size={14}/>;
            case 'Number': return <Hash size={14}/>;
            case 'Date': return <Calendar size={14}/>;
            case 'List': return <List size={14}/>;
            default: return <Edit3 size={14}/>;
        }
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="max-w-xl">
                    <p className="text-sm text-slate-600 font-medium">Enterprise Metadata Engine</p>
                    <p className="text-xs text-slate-500 mt-1">Extend the platform's core data model. Fields are instantly available in grid views and AI prompts.</p>
                </div>
                <Button size="sm" icon={Plus} onClick={() => handleOpenPanel()} className="w-full sm:w-auto">New Field Definition</Button>
            </div>
            
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100 overflow-x-auto">
                <div className="flex bg-slate-200/50 p-1 rounded-lg min-w-max">
                    {['Projects', 'Tasks', 'Resources', 'Risks'].map((area) => (
                        <button 
                            key={area}
                            onClick={() => setSubjectArea(area as UDFSubjectArea)}
                            className={`px-5 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${subjectArea === area ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {area}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                {filteredUdfs.map(udf => (
                    <div key={udf.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm group hover:border-nexus-400 transition-all flex flex-col h-40">
                        <div className="flex justify-between items-start mb-auto">
                            <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 group-hover:bg-nexus-50 group-hover:text-nexus-600 transition-colors">
                                {getTypeIcon(udf.dataType)}
                            </div>
                            <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleOpenPanel(udf)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-nexus-600"><EditIcon size={14}/></button>
                                <button onClick={() => handleDelete(udf.id)} className="p-1.5 hover:bg-red-50 rounded text-slate-500 hover:text-red-600"><Trash2 size={14}/></button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 group-hover:text-nexus-700 transition-colors truncate">{udf.title}</h4>
                            <div className="mt-3 flex items-center justify-between">
                                <Badge variant="neutral">{udf.dataType}</Badge>
                                <span className="text-[10px] font-mono text-slate-400 tracking-tighter uppercase">{udf.id}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredUdfs.length === 0 && (
                    <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400 text-sm italic">
                        No user-defined fields registered for the {subjectArea} area.
                    </div>
                )}
            </div>

            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingUdf?.id ? "Edit Metadata Definition" : "Register New Field"}
                width="md:w-[450px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} icon={Save}>Commit Definition</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-widest">Field Display Label</label>
                        <Input value={editingUdf?.title} onChange={e => setEditingUdf({...editingUdf, title: e.target.value})} placeholder="e.g. Quality Inspection Status" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 mb-3 uppercase tracking-widest">Data Architecture Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Text', 'Number', 'Date', 'List'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setEditingUdf({...editingUdf, dataType: type as any})}
                                    className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-bold transition-all ${
                                        editingUdf?.dataType === type 
                                        ? 'bg-nexus-50 border-nexus-500 text-nexus-700 ring-2 ring-nexus-500/20' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    {getTypeIcon(type)} {type}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="bg-slate-900 p-6 rounded-2xl text-white relative overflow-hidden shadow-xl">
                        <CheckCircle size={24} className="text-nexus-400 mb-3 relative z-10"/>
                        <p className="text-xs text-slate-300 leading-relaxed relative z-10">
                            <strong>Note:</strong> Data types cannot be changed once records are entered. Ensure the selected type accurately supports your reporting requirements.
                        </p>
                        <Shield size={120} className="absolute -right-12 -bottom-12 text-white/5 opacity-10" />
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};
