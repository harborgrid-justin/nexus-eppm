import React from 'react';
import { Plus } from 'lucide-react';
import { ActivityCode, ActivityCodeScope } from '../../../types';

interface Props {
    codes: ActivityCode[];
    activeScope: ActivityCodeScope;
    setActiveScope: (s: ActivityCodeScope) => void;
    selectedId: string | null;
    onSelect: (id: string) => void;
    onAdd: () => void;
}

export const ActivityCodeRegistry: React.FC<Props> = ({ codes, activeScope, setActiveScope, selectedId, onSelect, onAdd }) => (
    <div className="w-[350px] border-r border-slate-200 flex flex-col bg-slate-50/30 shrink-0">
        <div className="p-4 border-b bg-white">
            <div className="flex bg-slate-100 p-1 rounded-lg border">
                <button onClick={() => setActiveScope('Global')} className={`flex-1 py-1.5 text-xs font-bold rounded ${activeScope === 'Global' ? 'bg-white shadow text-nexus-600' : 'text-slate-500'}`}>Global</button>
                <button onClick={() => setActiveScope('Project')} className={`flex-1 py-1.5 text-xs font-bold rounded ${activeScope === 'Project' ? 'bg-white shadow text-nexus-600' : 'text-slate-500'}`}>Project</button>
            </div>
        </div>
        <div className="p-4 border-b flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
            <span>Catalog</span>
            <button onClick={onAdd} className="text-nexus-600 hover:text-nexus-700"><Plus size={16}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {codes.length === 0 && <div className="p-8 text-center text-slate-300 italic text-sm">No codes defined</div>}
            {codes.map(code => (
                <div key={code.id} onClick={() => onSelect(code.id)} className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedId === code.id ? 'bg-white border-slate-200 shadow-sm' : 'border-transparent hover:bg-slate-50'}`}>
                    <p className={`font-bold text-sm ${selectedId === code.id ? 'text-nexus-600' : 'text-slate-700'}`}>{code.name}</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-tighter">{code.id}</p>
                </div>
            ))}
        </div>
    </div>
);