
import React from 'react';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ProjectControls: React.FC<Props> = ({ activeTab, onTabChange }) => {
    const theme = useTheme();
    return (
        <div className={`flex bg-white border ${theme.colors.border} rounded-xl p-1 shadow-sm mb-6 w-fit`}>
            {['dashboard', 'charter', 'logs'].map(tab => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`px-5 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${activeTab === tab ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-900'}`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};
