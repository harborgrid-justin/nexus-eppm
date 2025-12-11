import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Users, Settings, Briefcase, Network, LayoutGrid, Package, Box, Radio, Calculator, Receipt, 
  Banknote, TrendingUp, ShoppingCart, Truck, Clipboard, CheckSquare, MessageSquare, FileInput, Shield, Leaf, Award, ScatterChart, BarChart2, PieChart, Camera, BookOpen, Umbrella, Scale, Watch, CloudRain, AlertOctagon, PenTool, Database, Globe, Layers3
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const iconMap: Record<string, any> = {
  Box, Radio, Calculator, Receipt, Banknote, TrendingUp, ShoppingCart, 
  Package: Package, Truck, Clipboard, CheckSquare, MessageSquare, FileInput, 
  Shield, FileBadge: FileInput, Leaf, Award, ScatterChart, BarChart2, PieChart, 
  Users, Camera, BookOpen, Umbrella, Scale, Watch, CloudRain, AlertOctagon, PenTool
};

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { state } = useData();
  const [activeGroup, setActiveGroup] = useState<string>('core');

  const activeExtensions = state.extensions.filter(ext => ext.status === 'Active' || ext.status === 'Installed');

  const navGroups = [
    {
      id: 'core',
      label: 'Core Modules',
      icon: Globe,
      items: [
        { id: 'portfolio', icon: Globe, label: 'Portfolio' },
        { id: 'programs', icon: Layers3, label: 'Programs' },
        { id: 'projectList', icon: Briefcase, label: 'Projects' },
      ]
    },
    {
      id: 'extensions',
      label: 'Installed Engines',
      icon: Package,
      items: activeExtensions.map(ext => ({
        id: ext.id,
        icon: iconMap[ext.icon] || Layers3,
        label: ext.name
      }))
    },
    {
      id: 'admin',
      label: 'Administration',
      icon: Settings,
      items: [
        { id: 'dataExchange', icon: Database, label: 'Data Exchange' },
        { id: 'marketplace', icon: LayoutGrid, label: 'App Marketplace' },
        { id: 'integrations', icon: Network, label: 'Integration Hub' },
        { id: 'admin', icon: Settings, label: 'Settings' },
      ]
    }
  ];

  const activeGroupItems = navGroups.find(g => g.id === activeGroup)?.items || [];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 flex-shrink-0 select-none">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-nexus-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-nexus-500/30">N</div>
          <span className="text-xl font-bold text-white tracking-tight">Nexus PPM</span>
        </div>
      </div>

      {/* Pill Navigation */}
      <div className="p-4 space-y-2 border-b border-slate-800">
        {navGroups.map((group) => {
           if (group.items.length === 0) return null;
           const GroupIcon = group.icon;

           return (
            <button
              key={group.id}
              onClick={() => setActiveGroup(group.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-3 transition-colors ${
                activeGroup === group.id
                  ? 'bg-nexus-600/20 text-nexus-300'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <GroupIcon size={18} />
              {group.label}
            </button>
          );
        })}
      </div>

      {/* Sub-menu Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
        <div className="space-y-0.5 px-4">
          {activeGroupItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-all ${
                activeTab === item.id || (activeTab === 'projectWorkspace' && item.id === 'projectList')
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white border border-slate-600">
            SC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Sarah Chen</p>
            <p className="text-xs text-slate-500 truncate">Global Admin</p>
          </div>
          <button aria-label="User Settings" className="text-slate-500 hover:text-white cursor-pointer">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
