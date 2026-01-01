
import React from 'react';
import { useAuth } from '../context/AuthContext';
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
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);

  return (
    <>
      <UserProfile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      
      <div 
        className={`fixed inset-y-0 left-0 z-50 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 flex-shrink-0 select-none md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: 260 }}
      >
        <SidebarHeader />

        <div className="flex-1 overflow-y-auto py-4 space-y-6">
            <SidebarNav activeTab={activeTab} setActiveTab={setActiveTab} onClose={onClose} />
            <SidebarPinned setActiveTab={setActiveTab} onClose={onClose} />
        </div>

        <SidebarFooter user={user} onProfileOpen={() => setIsProfileOpen(true)} onLogout={logout} />
      </div>
    </>
  );
};

export default Sidebar;
