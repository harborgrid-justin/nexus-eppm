
import React from 'react';
import { 
  Globe, PieChart, ShieldAlert, LayoutTemplate, Briefcase, 
  Users, Settings, Database, Grid, Box, CheckSquare, FileText
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SidebarNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onClose: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ activeTab, setActiveTab, onClose }) => {
    const theme = useTheme();

    const navStructure = [
        { 
            id: 'strategy', 
            label: 'Portfolio & Strategy', 
            items: [
                { id: 'portfolio', label: 'Portfolio Management', icon: Globe }, 
                { id: 'programs', label: 'Program Management', icon: PieChart },
                { id: 'unifier', label: 'Unifier Controls', icon: LayoutTemplate },
                { id: 'enterpriseRisks', label: 'Enterprise Risk', icon: ShieldAlert },
            ]
        },
        {
            id: 'execution',
            label: 'Project Execution',
            items: [
                { id: 'projectList', label: 'Projects', icon: Briefcase },
                { id: 'resources', label: 'Resources', icon: Users },
                { id: 'myWork', label: 'My Work', icon: CheckSquare },
                { id: 'reports', label: 'Reports', icon: FileText },
            ]
        },
        {
            id: 'config',
            label: 'System & Admin',
            items: [
                { id: 'dataExchange', label: 'Data Exchange', icon: Database },
                { id: 'admin', label: 'Administration', icon: Settings },
                { id: 'workbench', label: 'UI Workbench', icon: Box },
                { id: 'templates', label: 'Template Gallery', icon: Grid },
            ]
        }
    ];

    return (
        <div className="space-y-8 px-0">
            {navStructure.map(group => (
                <div key={group.id}>
                    <h3 className="px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">{group.label}</h3>
                    <div className="space-y-1">
                        {group.items.map(item => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); if(window.innerWidth < 768) onClose(); }}
                                className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium border-l-[3px] transition-all ${
                                    activeTab === item.id 
                                    ? `border-nexus-500 text-white bg-white/5` 
                                    : `border-transparent text-slate-400 hover:text-white hover:bg-white/5`
                                }`}
                            >
                                <item.icon size={18} className={activeTab === item.id ? 'text-nexus-400' : 'text-slate-500'} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
