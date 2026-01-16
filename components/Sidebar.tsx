
import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePermissions } from '../hooks/usePermissions';
import UserProfile from './user/UserProfile';
import { SidebarHeader } from './sidebar/SidebarHeader';
import SidebarNav from './sidebar/SidebarNav';
import { SidebarPinned } from './sidebar/SidebarPinned';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { useTheme } from '../context/ThemeContext';
import { 
    PanelLeftClose, PanelLeftOpen, Globe, PieChart, LayoutTemplate, 
    ShieldAlert, Briefcase, Users, CheckSquare, FileText, Database, 
    Settings, Palette, Target, Network, Box, Grid
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';

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
  const { t } = useI18n();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const sidebarWidth = isCollapsed ? 'w-20' : 'w-72';

  const filteredNavStructure = useMemo(() => {
    const structure = [
        {
            id: 'strategy', label: t('nav.strategy', 'Strategic Planning'), 
            items: [
                { id: 'portfolio', label: t('nav.portfolio', 'Investment Board'), icon: Globe, permission: 'project:read' }, 
                { id: 'programs', label: t('nav.programs', 'Program Hub'), icon: PieChart, permission: 'project:read' },
                { id: 'unifier', label: t('nav.unifier', 'Unifier Automation'), icon: LayoutTemplate, permission: 'financials:read' },
                { id: 'enterpriseRisks', label: t('nav.enterpriseRisks', 'Global Heatmap'), icon: ShieldAlert, permission: 'project:read' },
            ]
        },
        {
            id: 'execution', label: t('nav.execution', 'Execution Control'),
            items: [
                { id: 'projectList', label: t('nav.projects', 'Project Ledger'), icon: Briefcase, permission: 'project:read' },
                { id: 'resources', label: t('nav.resources', 'Global Resource Pool'), icon: Users, permission: 'resource:read' },
                { id: 'myWork', label: t('nav.myWork', 'Personal Workspace'), icon: CheckSquare, permission: 'app:access' },
                { id: 'reports', label: t('nav.reports', 'Intelligence Hub'), icon: FileText, permission: 'project:read' },
            ]
        },
        {
            id: 'config', label: t('nav.system', 'Infrastructure'),
            items: [
                { id: 'dataExchange', label: t('nav.data_exchange', 'ETL Orchestrator'), icon: Database, permission: 'system:configure' },
                { id: 'integrations', label: 'Integration Hub', icon: Network, permission: 'system:configure' },
                { id: 'extensions', label: 'Extensions', icon: Box, permission: 'app:access' },
                { id: 'templates', label: 'Template Gallery', icon: Grid, permission: 'app:access' },
                { id: 'admin', label: t('nav.admin', 'Admin Terminal'), icon: Settings, permission: 'admin:access' },
                { id: 'design-system', label: t('nav.design_system', 'Pattern Library'), icon: Palette, permission: 'app:access' },
            ]
        }
    ];

    return structure.map(group => ({
        ...group,
        items: group.items.filter(item => hasPermission(item.permission as any))
    })).filter(group => group.items.length > 0);
  }, [hasPermission, t]);

  return (
    <>
      <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <div className={`fixed inset-y-0 left-0 z-50 bg-slate-900 text-slate-400 flex flex-col h-full border-r border-white/5 flex-shrink-0 select-none md:relative md:translate-x-0 transition-all duration-500 ease-in-out ${sidebarWidth} shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarHeader isCollapsed={isCollapsed} />
        
        <button onClick={onToggleCollapse} className="hidden md:flex absolute top-14 -right-4 w-8 h-8 bg-slate-900 border border-white/10 rounded-full items-center justify-center text-slate-500 hover:text-white z-50 transition-all hover:bg-black shadow-2xl active:scale-90" title={isCollapsed ? "Expand Viewport" : "Maximize Space"}>
            {isCollapsed ? <PanelLeftOpen size={16}/> : <PanelLeftClose size={16}/>}
        </button>

        <div className="flex-1 overflow-y-auto py-6 space-y-8 scrollbar-hide">
            <SidebarNav 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onClose={onClose} 
                isCollapsed={isCollapsed}
                navStructure={filteredNavStructure} 
            />
        </div>

        <div className="flex-shrink-0 bg-black/20 backdrop-blur-md">
             {!isCollapsed && <SidebarPinned setActiveTab={setActiveTab} onClose={onClose} />}
             <SidebarFooter user={user} onProfileOpen={() => setIsProfileOpen(true)} onLogout={logout} isCollapsed={isCollapsed} />
        </div>
      </div>
      {isOpen && <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-40 md:hidden animate-in fade-in duration-300" onClick={onClose} />}
    </>
  );
};
export default Sidebar;
