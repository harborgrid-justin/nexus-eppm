import React from 'react';
import { BPDefinition } from '../../types/unifier';
import { FieldPlaceholder } from '../common/FieldPlaceholder';
import { Settings, Layers } from 'lucide-react';
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

    return (
        <div className={`w-72 border-r ${theme.colors.border} flex flex-col overflow-hidden h-full bg-slate-50/50`}>
            <div className={`p-5 border-b ${theme.colors.border} font-black text-[10px] uppercase ${theme.colors.text.tertiary} tracking-widest ${theme.colors.surface} bg-white flex items-center gap-2`}>
                <Layers size={14} className="text-nexus-600"/> {t('unifier.sidebar_title', 'Automation Catalog')}
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
                {definitions.length > 0 ? (
                    definitions.map(def => (
                        <button 
                            key={def.id} 
                            onClick={() => onSelect(def.id)} 
                            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-black uppercase tracking-tight flex items-center gap-3 transition-all duration-300 group ${
                                selectedId === def.id 
                                ? `${theme.colors.surface} shadow-lg ring-1 ring-nexus-100 border border-nexus-200 text-nexus-700` 
                                : `${theme.colors.text.secondary} hover:${theme.colors.surface} hover:${theme.colors.text.primary} hover:shadow-md border border-transparent`
                            }`}
                        >
                            <div className={`w-2 h-2 rounded-full transition-all group-hover:scale-150 ${selectedId === def.id ? 'bg-nexus-600 shadow-[0_0_8px_#0ea5e9]' : 'bg-slate-300'}`}></div>
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
            <div className="p-4 bg-slate-900 text-white rounded-t-3xl mx-2 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-[9px] font-black uppercase tracking-widest text-nexus-400 mb-1">Platform Note</p>
                    <p className="text-[10px] text-slate-300 leading-relaxed font-medium">Business processes drive the global project ledger across all multi-tenant partitions.</p>
                </div>
                <Settings size={80} className="absolute -right-8 -bottom-8 opacity-5 text-white rotate-12" />
            </div>
        </div>
    );
};