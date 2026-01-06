import React from 'react';
import { BPDefinition } from '../../types/unifier';

interface Props {
  definitions: BPDefinition[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const BPSidebar: React.FC<Props> = ({ definitions, selectedId, onSelect }) => (
    <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col overflow-hidden h-full">
        <div className="p-4 border-b border-slate-200 font-bold text-[10px] uppercase text-slate-500 tracking-wider">Business Automation Catalog</div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {definitions.map(def => (
                <button 
                    key={def.id} 
                    onClick={() => onSelect(def.id)} 
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-3 transition-all duration-200 ${selectedId === def.id ? 'bg-white shadow-sm ring-1 ring-slate-200 text-nexus-700 font-bold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
                    aria-pressed={selectedId === def.id}
                >
                    <div className={`w-2.5 h-2.5 rounded-full transition-colors ${selectedId === def.id ? 'bg-nexus-600' : 'bg-slate-300'}`}></div>
                    <span className="truncate">{String(def.name)}</span>
                </button>
            ))}
            
            {definitions.length === 0 && (
                <div className="p-4 text-center text-[10px] text-slate-400 italic bg-slate-100/50 rounded-lg border border-dashed border-slate-200 m-2 animate-pulse">
                    Registry Empty
                </div>
            )}
        </div>
    </div>
);