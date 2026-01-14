import React from 'react';
import { BPDefinition } from '../../types/unifier';
import { FieldPlaceholder } from '../common/FieldPlaceholder';
import { Settings, Plus } from 'lucide-react';
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
        <div className={`w-72 border-r ${theme.colors.border} flex flex-col overflow-hidden h-full ${theme.colors.background}/50`}>
            <div className={`p-4 border-b ${theme.colors.border} font-bold text-[10px] uppercase ${theme.colors.text.tertiary} tracking-wider ${theme.colors.surface}`}>
                {t('unifier.sidebar_title', 'Business Automation Catalog')}
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
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
                            label={t('unifier.no_processes', "No Processes Registered")} 
                            onAdd={onProvision} 
                            icon={Settings}
                            placeholderLabel={t('unifier.provision_bp', "Configure uDesigner")}
                        />
                    </div>
                )}
            </div>
            <div className={`p-4 ${theme.colors.surface} border-t ${theme.colors.border}`}>
                <p className={`text-[9px] ${theme.colors.text.tertiary} leading-relaxed font-medium uppercase tracking-tight`}>
                    {t('unifier.sidebar_note', 'Business Processes (BPs) drive financial and document workflows across the enterprise.')}
                </p>
            </div>
        </div>
    );
};