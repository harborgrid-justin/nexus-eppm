
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Tab { id: string; label: string; icon?: any; }
interface Props { tabs: Tab[]; active: string; onSelect: (id: string) => void; }

export const NavigationTabs: React.FC<Props> = ({ tabs, active, onSelect }) => {
    const theme = useTheme();
    return (
        <div className={`flex ${theme.colors.surface} border ${theme.colors.border} rounded-lg p-1 shadow-sm w-fit`}>
            {tabs.map(tab => (
                <button 
                    key={tab.id} 
                    onClick={() => onSelect(tab.id)} 
                    className={`px-4 py-2 text-xs font-bold uppercase rounded-md transition-all ${
                        active === tab.id 
                        ? 'bg-slate-900 text-white' 
                        : `text-slate-400 hover:${theme.colors.text.primary}`
                    }`}
                >
                    {tab.icon && <tab.icon size={14} className="inline mr-2" />}
                    {tab.label}
                </button>
            ))}
        </div>
    );
};
