
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ProjectControls: React.FC<Props> = ({ activeTab, onTabChange }) => {
    const theme = useTheme();
    return (
        <div className={`flex bg-slate-100/50 border ${theme.colors.border} rounded-2xl p-1 shadow-inner w-fit overflow-x-auto scrollbar-hide`}>
            {['dashboard', 'charter', 'logs'].map(tab => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`
                        px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300
                        ${activeTab === tab 
                            ? 'bg-slate-900 text-white shadow-xl scale-105' 
                            : 'text-slate-400 hover:text-slate-900'
                        }
                    `}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};
