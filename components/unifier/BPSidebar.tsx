
import React from 'react';
import { BPDefinition } from '../../types/unifier';
import { FieldPlaceholder } from '../common/FieldPlaceholder';
import { Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  definitions: BPDefinition[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const BPSidebar: React.FC<Props> = ({ definitions, selectedId, onSelect }) => {
    const theme = useTheme();

    return (
        <div className={`w-72 border-r ${theme.colors.border} flex flex-col overflow-hidden h-full ${theme.colors.background}/50`}>
            <div className={`p-4 border-b ${theme.colors.border} font-bold text-[10px] uppercase ${theme.colors.text.tertiary} tracking-wider ${theme.colors.surface}`}>Business Automation Catalog</div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {definitions.length > 0 ? (
                    definitions.map(def => (
                        <button 
                            key={def.id} 
                            onClick={() => onSelect(def.id)} 
                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3 transition-all duration-200 ${
                                selectedId === def.id 
                                ? `${theme.colors.surface} shadow-sm ring-1 ring-nexus-100 border border-nexus-200 text-nexus-700 font-bold` 
                                : `text-slate-500 hover:${theme.colors.surface} hover:text-slate-900 hover:shadow-sm border border-transparent`
                            }`}
                            aria-pressed={selectedId === def.id}
                        >
                            <div className={`w-2.5 h-2.5 rounded-full transition-colors ${selectedId === def.id ? 'bg-nexus-600' : 'bg-slate-300'}`}></div>
                            <span className="truncate">{String(def.name)}</span>
                        </button>
                    ))
                ) : (
                    <div className="p-2">
                        <FieldPlaceholder 
                            label="No Processes Registered" 
                            onAdd={() => {}} 
                            icon={Settings}
                        />
                    </div>
                )}
            </div>
            <div className={`p-4 ${theme.colors.surface} border-t ${theme.colors.border}`}>
                <p className={`text-[9px] ${theme.colors.text.tertiary} leading-relaxed font-medium uppercase tracking-tight`}>
                    Business Processes (BPs) drive financial and document workflows across the enterprise.
                </p>
            </div>
        </div>
    );
};
