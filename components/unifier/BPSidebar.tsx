
import React from 'react';
import { BPDefinition } from '../../types/unifier';
import { FieldPlaceholder } from '../common/FieldPlaceholder';
import { Settings, Layers, Shuffle, DollarSign, FileText } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';

interface Props {
  definitions: BPDefinition[];
  selectedId: string;
  onSelect: (id: string) => void;
  onProvision?: () => void;
}

export const BPSidebar: React.FC<Props> = ({ definitions, selectedId, onSelect, onProvision }) => {
    const theme = useTheme();
    const { t } = useI18n();

    const getIcon = (type: string) => {
        switch(type) {
            case 'Cost': return <DollarSign size={14}/>;
            case 'LineItem': return <Layers size={14}/>;
            default: return <FileText size={14}/>;
        }
    };

    return (
        <div className={`w-72 border-r border-slate-200 flex flex-col overflow-hidden h-full bg-slate-50/50`}>
            <div className={`p-5 border-b border-slate-200 font-black text-[10px] uppercase text-slate-400 tracking-[0.2em] bg-white flex items-center gap-2`}>
                <Shuffle size={14} className="text-nexus-600"/> {t('unifier.sidebar_title', 'Workflow Orchestration')}
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
                {definitions.length > 0 ? (
                    definitions.map(def => (
                        <button 
                            key={def.id} 
                            onClick={() => onSelect(def.id)} 
                            className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-tight flex items-center gap-3 transition-all duration-300 group ${
                                selectedId === def.id 
                                ? `bg-white shadow-xl ring-1 ring-nexus-50 border border-nexus-200 text-nexus-700` 
                                : `text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-md border border-transparent`
                            }`}
                        >
                            <div className={`p-1.5 rounded-lg transition-all ${selectedId === def.id ? 'bg-nexus-50 text-nexus-600' : 'bg-slate-100 text-slate-400 group-hover:bg-nexus-50 group-hover:text-nexus-600'}`}>
                                {getIcon(def.type)}
                            </div>
                            <span className="truncate">{String(def.name)}</span>
                        </button>
                    ))
                ) : (
                    <div className="p-2 py-8">
                        <FieldPlaceholder 
                            label={t('unifier.no_processes', "Registry Isolated")} 
                            onAdd={onProvision} 
                            icon={Settings}
                            placeholderLabel="Provision BP Schema"
                        />
                    </div>
                )}
            </div>
            <div className="p-5 bg-slate-900 text-white rounded-t-3xl mx-2 shadow-2xl relative overflow-hidden border border-white/5">
                <div className="relative z-10">
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-nexus-400 mb-1.5">Logic Node Active</p>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium uppercase tracking-tight">Business processes drive the immutable project ledger across all tenants.</p>
                </div>
                <Settings size={100} className="absolute -right-10 -bottom-10 opacity-5 text-white rotate-12" />
            </div>
        </div>
    );
};
