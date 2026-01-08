
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
    isCollapsed?: boolean;
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ activeTab, setActiveTab, onClose, isCollapsed }) => {
    const theme = useTheme();

    const navStructure = [
        {
            id: 'strategy', 
            label: 'Strategy', 
            items: [
                { id: 'portfolio', label: 'Portfolio', icon: Globe }, 
                { id: 'programs', label: 'Programs', icon: PieChart },
                { id: 'unifier', label: 'Unifier', icon: LayoutTemplate },
                { id: 'enterpriseRisks', label: 'Global Risk', icon: ShieldAlert },
            ]
        },
        {
            id: 'execution',
            label: 'Execution',
            items: [
                { id: 'projectList', label: 'Projects', icon: Briefcase },
                { id: 'schedule', label: 'Schedule', icon: Calendar },
                { id: 'resources', label: 'Resources', icon: Users },
                { id: 'myWork', label: 'Work', icon: CheckSquare },
                { id: 'reports', label: 'Reports', icon: FileText },
            ]
        },
        {
            id: 'config',
            label: 'System',
            items: [
                { id: 'dataExchange', label: 'Exchange', icon: Database },
                { id: 'admin', label: 'Admin', icon: Settings },
                { id: 'design-system', label: 'Design', icon: Palette },
            ]
        }
    ];

    return (
        <div className="space-y-6 px-0">
            {navStructure.map(group => (
                <div key={group.id}>
                    {!isCollapsed && <h3 className={`${theme.typography.label} px-6 text-[10px] ${theme.colors.text.tertiary} mb-2 opacity-50`}>{group.label}</h3>}
                    <div className="space-y-1">
                        {group.items.map((item: any) => (
                            <button
                                key={item.id}
                                onClick={() => { setActiveTab(item.id); if(window.innerWidth < 768) onClose(); }}
                                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-6'} py-2.5 text-sm font-bold border-l-[3px] transition-all relative group/item ${
                                    activeTab === item.id 
                                    ? `border-nexus-500 text-white bg-white/10` 
                                    : `border-transparent ${theme.colors.text.tertiary} hover:text-white hover:bg-white/5`
                                }`}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon size={18} className={activeTab === item.id ? 'text-nexus-400' : 'opacity-40 group-hover/item:opacity-100 transition-opacity'} />
                                {!isCollapsed && <span className="truncate">{item.label}</span>}
                                
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] shadow-xl border border-slate-700">
                                        {item.label}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
