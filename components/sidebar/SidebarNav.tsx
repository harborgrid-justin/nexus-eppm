
import React, { useState, useMemo } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';
import { 
  LayoutDashboard, CheckSquare, Globe, Layers, Users, ShieldAlert, FileText, Settings, 
  Network, Package, ChevronDown, ChevronRight, PieChart, FolderOpen, Palette, Server, MapPin, 
  Terminal, Calendar, GitPullRequest, Tag, Edit3, FileWarning, Receipt, Banknote, UserCog, 
  Shield, CreditCard, Bell, History, Share2, Database, Briefcase, LayoutTemplate
} from 'lucide-react';

interface SidebarNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onClose: () => void;
}

interface NavGroup {
  id: string;
  label: string;
  items: { id: string; label: string; icon: React.ElementType; count?: number }[];
}

export const SidebarNav: React.FC<SidebarNavProps> = ({ activeTab, setActiveTab, onClose }) => {
    const { hasPermission } = usePermissions();
    const theme = useTheme();
    
    // Default open states for better discovery
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        workspace: true, 
        strategy: true, 
        execution: true, 
        data: false, 
        design: false,
        admin: false
    });

    const toggleGroup = (id: string) => setOpenGroups(prev => ({ ...prev, [id]: !prev[id] }));

    const menuStructure: NavGroup[] = useMemo(() => [
        { 
            id: 'workspace', 
            label: 'My Workspace', 
            items: [
                { id: 'myWork', label: 'Command Center', icon: Briefcase, count: 5 },
            ] 
        },
        { 
            id: 'strategy', 
            label: 'Portfolio & Strategy', 
            items: [
                { id: 'portfolio', label: 'Executive Dashboard', icon: Globe }, 
                { id: 'programs', label: 'Program Management', icon: PieChart },
                { id: 'enterpriseRisks', label: 'Enterprise Risk', icon: ShieldAlert },
            ]
        },
        { 
            id: 'execution', 
            label: 'Project Execution', 
            items: [
                { id: 'projectList', label: 'Projects (EPS)', icon: Layers }, 
                { id: 'resources', label: 'Resource Pool', icon: Users },
                { id: 'reports', label: 'Analytics & Reports', icon: FileText },
            ]
        },
        { 
            id: 'data', 
            label: 'Connectivity', 
            items: [
                { id: 'integrations', label: 'Integration Hub', icon: Share2 },
                { id: 'dataExchange', label: 'Data Exchange', icon: Database },
                { id: 'marketplace', label: 'Extension Market', icon: Package },
            ]
        },
        { 
            id: 'design', 
            label: 'System Design', 
            items: [
                { id: 'templates', label: 'UI Template Gallery', icon: LayoutTemplate },
            ]
        },
        { 
            id: 'admin', 
            label: 'Administration', 
            items: [
                ...(hasPermission('system:configure') ? [
                    { id: 'admin/general', label: 'General Settings', icon: Settings },
                    { id: 'admin/users', label: 'Users & Roles', icon: Users },
                    { id: 'admin/system', label: 'System Config', icon: Server },
                    { id: 'admin/epsobs', label: 'EPS & OBS', icon: FolderOpen },
                    { id: 'admin/locations', label: 'Global Locations', icon: MapPin },
                    { id: 'admin/currencies', label: 'Currencies', icon: Globe },
                    { id: 'admin/globalChange', label: 'Global Change', icon: Terminal },
                    { id: 'admin/calendars', label: 'Calendars', icon: Calendar },
                    { id: 'admin/workflows', label: 'Workflows', icon: GitPullRequest },
                    { id: 'admin/activityCodes', label: 'Activity Codes', icon: Tag },
                    { id: 'admin/udfs', label: 'User-Defined Fields', icon: Edit3 },
                    { id: 'admin/issueCodes', label: 'Issue Codes', icon: FileWarning },
                    { id: 'admin/expenseCategories', label: 'Expense Categories', icon: Receipt },
                    { id: 'admin/fundingSources', label: 'Funding Sources', icon: Banknote },
                    { id: 'admin/resources', label: 'Resource Settings', icon: UserCog },
                    { id: 'admin/security', label: 'Security', icon: Shield },
                    { id: 'admin/billing', label: 'Billing', icon: CreditCard },
                    { id: 'admin/notifications', label: 'Notifications', icon: Bell },
                    { id: 'admin/audit', label: 'Audit Log', icon: History },
                ] : [])
            ]
        }
    ], [hasPermission]);

    return (
        <div className="px-3 space-y-1 pb-20">
            {menuStructure.map(group => (
            <div key={group.id} className="mb-2">
                <button 
                    onClick={() => toggleGroup(group.id)} 
                    className="flex items-center justify-between w-full px-3 py-2 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest hover:text-slate-300 rounded transition-colors"
                >
                    <span className="truncate">{group.label}</span>
                    {openGroups[group.id] ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                </button>
                
                {openGroups[group.id] && (
                    <div className="mt-1 space-y-0.5 animate-in slide-in-from-top-1 duration-200">
                    {group.items.map(item => {
                        // Check if active tab matches item ID or matches sub-routes (e.g. admin/users)
                        const isActive = activeTab === item.id || 
                                       (activeTab === 'projectWorkspace' && item.id === 'projectList') || 
                                       (activeTab.startsWith('admin') && item.id.startsWith('admin') && activeTab.split('/')[1] === item.id.split('/')[1]);
                        
                        return (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) onClose(); }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium group transition-all duration-200 ${
                                isActive 
                                ? `${theme.colors.primary} text-white shadow-md shadow-slate-900/20` 
                                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                            }`}
                            title={item.label}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <item.icon size={18} className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                <span className="truncate">{item.label}</span>
                            </div>
                            {item.count && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-500'
                                }`}>
                                    {item.count}
                                </span>
                            )}
                        </button>
                        );
                    })}
                    </div>
                )}
            </div>
            ))}
        </div>
    );
};
