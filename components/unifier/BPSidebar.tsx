import React from 'react';
import { BPDefinition } from '../../types/unifier';
import { FieldPlaceholder } from '../common/FieldPlaceholder';
import { Settings, Layers, Shuffle, DollarSign, FileText, Activity } from 'lucide-react';
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
        <div className={`w-80 border-r ${theme.colors.border} flex flex-col overflow-hidden h-full bg-slate-50/50 shrink-0`}>
            <div className={`p-6 border-b ${theme.colors.border} font-black text-[10px] uppercase text-slate-400 tracking-[0.2em] bg-white flex items-center gap-3`}>
                <Shuffle size={14} className="text-nexus-600"/> {t('unifier.sidebar_title', 'Logical Orchestrator')}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
                {definitions.length > 0 ? (
                    definitions.map(def => (
                        <button 
                            key={def.id} 
                            onClick={() => onSelect(def.id)} 
                            className={`w-full text-left px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-4 transition-all duration-300 group ${
                                selectedId === def.id 
                                ? `bg-white shadow-xl ring-1 ring-nexus-50 border border-nexus-200 text-nexus-700 scale-[1.02] z-10` 
                                : `text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-md border border-transparent`
                            }`}
                        >
                            <div className={`p-2 rounded-xl transition-all ${selectedId === def.id ? 'bg-nexus-50 text-nexus-600' : 'bg-slate-100 text-slate-400 group-hover:bg-nexus-50 group-hover:text-nexus-600'} shadow-inner`}>
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
                            placeholderLabel="Establish BP Schema"
                        />
                    </div>
                )}
            </div>
            <div className="p-6 bg-slate-900 text-white rounded-t-[2.5rem] mx-3 shadow-2xl relative overflow-hidden border border-white/5 group">
                <div className="absolute top-0 right-0 p-16 bg-nexus-500/10 rounded-full blur-2xl group-hover:bg-nexus-500/20 transition-colors"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Activity size={14} className="text-nexus-400 animate-pulse" />
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-nexus-400">Handshake Active</p>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium uppercase tracking-tight">Business processes enforce immutable cross-tenant data governance.</p>
                </div>
                <Settings size={120} className="absolute -right-12 -bottom-12 opacity-[0.03] text-white rotate-12" />
            </div>
        </div>
    );
};