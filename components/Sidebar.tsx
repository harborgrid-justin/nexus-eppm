import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import UserProfile from './user/UserProfile';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarNav } from './sidebar/SidebarNav';
import { SidebarPinned } from './sidebar/SidebarPinned';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { useTheme } from '../context/ThemeContext';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ROLE_DEFINITIONS } from '../constants/auth';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    activeTab, setActiveTab, isOpen, onClose, isCollapsed, onToggleCollapse 
}) => {
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();
  const theme = useTheme();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

  // Production Hardening: Permission-based Nav Filtering
  const filteredNavStructure = useMemo(() => {
    const structure = [
        {
            id: 'strategy', 
            label: 'Strategy', 
            items: [
                { id: 'portfolio', label: 'Portfolio', icon: 'Globe', permission: 'project:read' }, 
                { id: 'programs', label: 'Programs', icon: 'PieChart', permission: 'project:read' },
                { id: 'unifier', label: 'Unifier', icon: 'LayoutTemplate', permission: 'financials:read' },
                { id: 'enterpriseRisks', label: 'Global Risk', icon: 'ShieldAlert', permission: 'project:read' },
            ]
        },
        {
            id: 'execution',
            label: 'Execution',
            items: [
                { id: 'projectList', label: 'Projects', icon: 'Briefcase', permission: 'project:read' },
                { id: 'resources', label: 'Resources', icon: 'Users', permission: 'resource:read' },
                { id: 'myWork', label: 'Work', icon: 'CheckSquare', permission: 'app:access' },
                { id: 'reports', label: 'Reports', icon: 'FileText', permission: 'project:read' },
            ]
        },
        {
            id: 'config',
            label: 'System',
            items: [
                { id: 'dataExchange', label: 'Exchange', icon: 'Database', permission: 'system:configure' },
                { id: 'admin', label: 'Admin', icon: 'Settings', permission: 'admin:access' },
            ]
        }
    ];

    return structure.map(group => ({
        ...group,
        items: group.items.filter(item => hasPermission(item.permission as any))
    })).filter(group => group.items.length > 0);
  }, [user, hasPermission]);

  const handleNavClick = (tab: string) => {
    if ((document as any).startViewTransition) {
        (document as any).startViewTransition(() => {
            setActiveTab(tab);
        });
    } else {
        setActiveTab(tab);
    }
  };

  return (
    <>
      <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
      <div 
        className={`fixed inset-y-0 left-0 z-50 ${theme.colors.primary} text-slate-300 flex flex-col h-full border-r border-slate-800 flex-shrink-0 select-none md:relative md:translate-x-0 transition-all duration-300 ease-in-out ${sidebarWidth} shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarHeader isCollapsed={isCollapsed} />

        <button 
            onClick={onToggleCollapse}
            className="hidden md:flex absolute top-3.5 -right-3.5 w-7 h-7 bg-slate-800 border border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-white z-50 transition-all hover:bg-slate-700 shadow-lg"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
            {isCollapsed ? <PanelLeftOpen size={14}/> : <PanelLeftClose size={14}/>}
        </button>

        <div className="flex-1 overflow-y-auto py-2 space-y-4 scrollbar-hide">
            <SidebarNav 
                activeTab={activeTab} 
                setActiveTab={handleNavClick} 
                onClose={onClose} 
                isCollapsed={isCollapsed}
                navStructure={filteredNavStructure} 
            />
        </div>

        <div className="flex-shrink-0 bg-slate-950/30">
             {!isCollapsed && <SidebarPinned setActiveTab={handleNavClick} onClose={onClose} />}
             <SidebarFooter user={user} onProfileOpen={() => setIsProfileOpen(true)} onLogout={logout} isCollapsed={isCollapsed} />
        </div>
      </div>
      
      {isOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
            onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
