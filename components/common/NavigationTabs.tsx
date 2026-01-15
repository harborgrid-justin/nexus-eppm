
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Tab { id: string; label: string; icon?: any; }
interface Props { tabs: Tab[]; active: string; onSelect: (id: string) => void; }

export const NavigationTabs: React.FC<Props> = ({ tabs, active, onSelect }) => {
    const theme = useTheme();
    return (
        <div className={`flex ${theme.colors.background} border ${theme.colors.border} rounded-2xl p-1 shadow-inner w-fit backdrop-blur-sm`}>
            {tabs.map(tab => {
                const isActive = active === tab.id;
                return (
                    <button 
                        key={tab.id} 
                        onClick={() => onSelect(tab.id)} 
                        className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 ${
                            isActive 
                            ? 'bg-slate-900 text-white shadow-xl scale-105 z-10' 
                            : 'text-slate-400 hover:text-slate-900 hover:bg-white/50'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            {tab.icon && <tab.icon size={14} className={isActive ? 'text-nexus-400' : 'opacity-60'} />}
                            {tab.label}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};
