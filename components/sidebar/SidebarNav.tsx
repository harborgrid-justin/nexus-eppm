import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { NavGroup } from '../../types/ui';

interface SidebarNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onClose: () => void;
    isCollapsed?: boolean;
    navStructure: NavGroup[];
}

const SidebarNav: React.FC<SidebarNavProps> = ({ 
    activeTab, setActiveTab, onClose, isCollapsed, navStructure 
}) => {
    const theme = useTheme();

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
                                {item.icon && <item.icon size={18} className={activeTab === item.id ? 'text-nexus-400' : 'opacity-40 group-hover/item:opacity-100 transition-opacity'} />}
                                {!isCollapsed && <span className="truncate">{item.label}</span>}
                                
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:item:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[100] shadow-xl border border-slate-700">
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

export default React.memo(SidebarNav);