import React from 'react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const ProjectControls: React.FC<Props> = ({ activeTab, onTabChange }) => (
    <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm mb-6 w-fit">
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