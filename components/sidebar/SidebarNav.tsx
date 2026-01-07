import React from 'react';
import { 
  Globe, PieChart, ShieldAlert, LayoutTemplate, Briefcase, 
  Users, Settings, Database, CheckSquare, FileText, HardDrive, Rocket, Calendar, CornerDownRight, Palette
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
            id: 'start',
            label: 'Onboarding',
            items: [
                { id: 'getting-started', label: 'Getting Started', icon: Rocket }
            ]
        },
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
                { id: 'schedule', label: 'Master Schedule', icon: Calendar, isSubItem: true },
                { id: 'resources', label: 'Resources', icon: Users },
                { id: 'myWork', label: 'My Work', icon: CheckSquare },
                { id: 'reports', label: 'Reports', icon: FileText },
            ]
        },
        {
            id: 'config',
            label: 'System & Admin',
            items: [
                { id: 'warehouse', label: 'Data Warehouse', icon: HardDrive },
                { id: 'dataExchange', label: 'Data Exchange', icon: Database },
                { id: 'admin', label: 'Administration', icon: Settings },
                { id: 'design-system', label: 'Design System', icon: Palette },
            ]
        }
    ];

    return (
        <div className="space-y-8 px-0">
            {navStructure.map(group => (
                <div key={group.id}>
                    <h3 className={`${theme.typography.label} px-6 text-[10px] ${theme.colors.text.tertiary} mb-3`}>{group.label}</h3>
                    <div className="space-y-1">
                        {group.items.map((item: any) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); if(window.innerWidth < 768) onClose(); }}
                                className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-bold border-l-[3px] transition-all ${
                                    activeTab === item.id 
                                    ? `border-nexus-500 text-white bg-white/10` 
                                    : `border-transparent ${theme.colors.text.tertiary} hover:text-white hover:bg-white/5`
                                } ${item.isSubItem ? 'pl-10' : ''}`}
                            >
                                {item.isSubItem && <CornerDownRight size={14} className="opacity-20 -ml-2" />}
                                <item.icon size={item.isSubItem ? 16 : 18} className={activeTab === item.id ? 'text-nexus-400' : 'opacity-40'} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};