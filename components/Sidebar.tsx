
import React from 'react';
import { useAuth } from '../context/AuthContext';
import UserProfile from './user/UserProfile';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarNav } from './sidebar/SidebarNav';
import { SidebarPinned } from './sidebar/SidebarPinned';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { useTheme } from '../context/ThemeContext';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

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
  const theme = useTheme();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-64';

  return (
    <>
      <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
      <div 
        className={`fixed inset-y-0 left-0 z-50 ${theme.colors.primary} text-slate-300 flex flex-col h-full border-r border-slate-800 flex-shrink-0 select-none md:relative md:translate-x-0 transition-all duration-300 ease-in-out ${sidebarWidth} shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarHeader isCollapsed={isCollapsed} />

        {/* Collapse Trigger (Desktop Only) */}
        <button 
            onClick={onToggleCollapse}
            className="hidden md:flex absolute top-3.5 -right-3.5 w-7 h-7 bg-slate-800 border border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-white z-50 transition-all hover:bg-slate-700 shadow-lg"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
            {isCollapsed ? <PanelLeftOpen size={14}/> : <PanelLeftClose size={14}/>}
        </button>

        <div className="flex-1 overflow-y-auto py-2 space-y-4 scrollbar-hide">
            <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} onClose={onClose} isCollapsed={isCollapsed} />
        </div>

        <div className="flex-shrink-0 bg-slate-950/30">
             {!isCollapsed && <SidebarPinned setActiveTab={setActiveTab} onClose={onClose} />}
             <SidebarFooter user={user} onProfileOpen={() => setIsProfileOpen(true)} onLogout={logout} isCollapsed={isCollapsed} />
        </div>
      </div>
      
      {/* Mobile Backdrop */}
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
