
import React from 'react';
// Added missing ChevronRight import to satisfy usage on line 79
import { Plus, Edit2, Trash2, Tag, Globe, Briefcase, ChevronRight } from 'lucide-react';
import { ActivityCode, ActivityCodeScope } from '../../../types/index';
import { useTheme } from '../../../context/ThemeContext';
import { Badge } from '../../ui/Badge';

interface Props {
    codes: ActivityCode[];
    activeScope: ActivityCodeScope;
    setActiveScope: (s: ActivityCodeScope) => void;
    selectedId: string | null;
    onSelect: (id: string) => void;
    onAdd: () => void;
    onEdit?: (code: ActivityCode) => void;
    onDelete?: (id: string) => void;
}

export const ActivityCodeRegistry: React.FC<Props> = ({ codes, activeScope, setActiveScope, selectedId, onSelect, onAdd, onEdit, onDelete }) => {
    const theme = useTheme();

    return (
        <div className={`w-[350px] border-r ${theme.colors.border} flex flex-col bg-slate-50/50 shrink-0`}>
            <div className="p-6 border-b bg-white shadow-sm">
                <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
                    <button 
                        onClick={() => setActiveScope('Global')} 
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${activeScope === 'Global' ? 'bg-white shadow-md text-nexus-700 ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Globe size={12}/> Global
                    </button>
                    <button 
                        onClick={() => setActiveScope('Project')} 
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${activeScope === 'Project' ? 'bg-white shadow-md text-nexus-700 ring-1 ring-black/5' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Briefcase size={12}/> Project
                    </button>
                </div>
            </div>
            <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center bg-slate-50/80`}>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Tag size={12}/> Dictionary Catalog
                </h4>
                <button 
                    onClick={onAdd} 
                    className="p-1.5 bg-nexus-600 text-white rounded-lg shadow-lg shadow-nexus-500/20 hover:bg-nexus-700 transition-all active:scale-95"
                >
                    <Plus size={16}/>
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin">
                {codes.length === 0 ? (
                    <div className="p-12 text-center text-slate-300 italic flex flex-col items-center justify-center h-full">
                        <Tag size={40} className="mb-4 opacity-10" />
                        <p className="text-xs font-bold uppercase tracking-widest">No Dictionaries Defined</p>
                    </div>
                ) : (
                    codes.map(code => (
                        <div 
                            key={code.id} 
                            onClick={() => onSelect(code.id)} 
                            className={`group p-4 rounded-2xl cursor-pointer transition-all border relative flex flex-col justify-between h-28 ${
                                selectedId === code.id 
                                ? 'bg-white border-nexus-200 shadow-xl ring-4 ring-nexus-500/5' 
                                : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="min-w-0 flex-1">
                                    <p className={`font-black text-sm uppercase tracking-tight truncate ${selectedId === code.id ? 'text-nexus-700' : 'text-slate-700'}`}>{code.name}</p>
                                    <p className="text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase tracking-tighter truncate">{code.id}</p>
                                </div>
                                <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    {onEdit && <button onClick={(e) => { e.stopPropagation(); onEdit(code); }} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-nexus-600"><Edit2 size={12}/></button>}
                                    {onDelete && <button onClick={(e) => { e.stopPropagation(); onDelete(code.id); }} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-500"><Trash2 size={12}/></button>}
                                </div>
                            </div>
                            <div className="flex justify-between items-end mt-4 pt-3 border-t border-slate-50">
                                <Badge variant="neutral" className="scale-75 origin-left">{code.values.length} Values</Badge>
                                {/* ChevronRight is now correctly imported from lucide-react */}
                                <ChevronRight size={14} className={`transition-transform duration-300 ${selectedId === code.id ? 'text-nexus-700 translate-x-1' : 'text-slate-200'}`}/>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
