
import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Star } from 'lucide-react';

interface SidebarPinnedProps {
    setActiveTab: (tab: string) => void;
    onClose: () => void;
}

export const SidebarPinned: React.FC<SidebarPinnedProps> = ({ setActiveTab, onClose }) => {
    const { state } = useData();
    const pinnedProjects = useMemo(() => state.projects.slice(0, 3), [state.projects]);

    return (
        <div className="px-6 pt-4 border-t border-slate-800">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2 truncate">
                <Star size={10} className="text-yellow-500 fill-yellow-500"/> Pinned Workspaces
            </h4>
            <ul className="space-y-2">
            {pinnedProjects.map(proj => (
                <li key={proj.id}>
                <button 
                    onClick={() => { setActiveTab('projectWorkspace'); if (window.innerWidth < 768) onClose(); }}
                    className="w-full flex items-center gap-3 text-xs font-medium text-slate-400 hover:text-white group rounded"
                    title={proj.name}
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-nexus-500"></div>
                    <span className="truncate">{proj.name}</span>
                </button>
                </li>
            ))}
            </ul>
        </div>
    );
};
