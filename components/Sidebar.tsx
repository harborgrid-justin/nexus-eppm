
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import UserProfile from './user/UserProfile';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarNav } from './sidebar/SidebarNav';
import { SidebarPinned } from './sidebar/SidebarPinned';
import { SidebarFooter } from './sidebar/SidebarFooter';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  // Sidebar specific theme overrides to maintain contrast or sync with main theme
  const sidebarBg = theme.mode === 'dark' ? 'bg-slate-950' : 'bg-slate-900';
  const sidebarBorder = theme.mode === 'dark' ? 'border-slate-800' : 'border-slate-700';
  const sidebarText = 'text-slate-300';

  return (
    <>
      <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
      <div 
        className={`fixed inset-y-0 left-0 z-50 ${sidebarBg} ${sidebarText} flex flex-col h-full border-r ${sidebarBorder} flex-shrink-0 select-none md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: 280 }}
      >
        <SidebarHeader />

        <div className="flex-1 overflow-y-auto py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
            <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} onClose={onClose} />
        </div>

        <div className="flex-shrink-0">
             <SidebarPinned setActiveTab={setActiveTab} onClose={onClose} />
             <SidebarFooter user={user} onProfileOpen={() => setIsProfileOpen(true)} onLogout={logout} />
        </div>
      </div>
      
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
            onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
