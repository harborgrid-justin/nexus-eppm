
import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { 
  Users, Settings, Briefcase, Network, LayoutGrid, Package, Box, Radio, Calculator, Receipt, 
  Banknote, TrendingUp, ShoppingCart, Truck, Clipboard, CheckSquare, MessageSquare, FileInput, Shield, Leaf, Award, ScatterChart, BarChart2, PieChart, Camera, BookOpen, Umbrella, Scale, Watch, CloudRain, AlertOctagon, PenTool, Database, Globe, Layers3, TestTube
} from 'lucide-react';
import { useI18n } from '../context/I18nContext';
import { useFeatureFlag } from '../context/FeatureFlagContext';
import { Logger } from '../services/Logger';

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
  const { t } = useI18n();
  // Example feature flag usage: Hide workbench in production if flag is off
  const showWorkbench = useFeatureFlag('enableAdvancedAnalytics'); 

  useEffect(() => {
    Logger.debug('Sidebar Mounted', { activeGroup, activeTab });
  }, []); // Log only on mount

  const activeExtensions = useMemo(() => 
    state.extensions.filter(ext => ext.status === 'Active' || ext.status === 'Installed'), 
  [state.extensions]);

  const navGroups = useMemo(() => [
    {
      id: 'core',
      label: t('nav.core_modules', 'Core Modules'),
      icon: Globe,
      items: [
        { id: 'portfolio', icon: Globe, label: t('nav.portfolio', 'Portfolio') },
        { id: 'programs', icon: Layers3, label: t('nav.programs', 'Programs') },
        { id: 'projectList', icon: Briefcase, label: t('nav.projects', 'Projects') },
      ]
    },
    {
      id: 'extensions',
      label: t('nav.installed_engines', 'Installed Engines'),
      icon: Package,
      items: activeExtensions.map(ext => ({
        id: ext.id,
        icon: iconMap[ext.icon] || Layers3,
        label: ext.name
      }))
    },
    {
      id: 'admin',
      label: t('nav.administration', 'Administration'),
      icon: Settings,
      items: [
        { id: 'dataExchange', icon: Database, label: t('nav.data_exchange', 'Data Exchange') },
        { id: 'marketplace', icon: LayoutGrid, label: t('nav.marketplace', 'App Marketplace') },
        { id: 'integrations', icon: Network, label: t('nav.integrations', 'Integration Hub') },
        { id: 'admin', icon: Settings, label: t('nav.settings', 'Settings') },
        // Conditionally render Workbench based on flag/environment
        ...(showWorkbench ? [{ id: 'workbench', icon: TestTube, label: t('nav.workbench', 'Component Workbench') }] : [])
      ]
    }
  ], [activeExtensions, t, showWorkbench]);

  const activeGroupItems = useMemo(() => 
    navGroups.find(g => g.id === activeGroup)?.items || [], 
  [navGroups, activeGroup]);

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 flex-shrink-0 select-none" aria-label="Main Navigation">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-nexus-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-nexus-500/30" aria-hidden="true">N</div>
          <span className="text-xl font-bold text-white tracking-tight">Nexus PPM</span>
        </div>
      </div>

      {/* Module Group Switching */}
      <nav className="p-4 border-b border-slate-800" aria-label="Module Groups">
        <ul className="space-y-2">
          {navGroups.map((group) => {
             if (group.items.length === 0) return null;
             const GroupIcon = group.icon;
             const isActive = activeGroup === group.id;

             return (
              <li key={group.id}>
                <button
                  onClick={() => {
                    setActiveGroup(group.id);
                    Logger.info(`Nav Group Switched: ${group.id}`);
                  }}
                  aria-current={isActive ? 'true' : undefined}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-3 transition-colors focus:outline-none focus:ring-2 focus:ring-nexus-500 ${
                    isActive
                      ? 'bg-nexus-600/20 text-nexus-300'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <GroupIcon size={18} aria-hidden="true" />
                  {group.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Feature Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700" aria-label="Features">
        <ul className="space-y-0.5 px-4">
          {activeGroupItems.map((item) => {
            const isActive = activeTab === item.id || (activeTab === 'projectWorkspace' && item.id === 'projectList');
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-nexus-500 ${
                    isActive
                      ? 'bg-slate-800 text-white' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <item.icon size={18} aria-hidden="true" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white border border-slate-600" aria-hidden="true">
            SC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Sarah Chen</p>
            <p className="text-xs text-slate-500 truncate">Global Admin</p>
          </div>
          <button aria-label="User Settings" className="text-slate-500 hover:text-white cursor-pointer focus:outline-none focus:text-white">
            <Settings size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
