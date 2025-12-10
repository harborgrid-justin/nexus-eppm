import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  LayoutDashboard, Users, Settings, Briefcase, Network, ChevronDown, ChevronRight, FileText, Layers, LayoutGrid, Package, Box, Radio, Calculator, Receipt, 
  Banknote, TrendingUp, ShoppingCart, Truck, Clipboard, CheckSquare, MessageSquare, FileInput, Shield, Leaf, Award, ScatterChart, BarChart2, PieChart, Camera, BookOpen, Umbrella, Scale, Watch, CloudRain, AlertOctagon, PenTool, Database
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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['core', 'extensions']));

  const toggleSection = (section: string) => {
    const newSections = new Set(expandedSections);
    if (newSections.has(section)) {
      newSections.delete(section);
    } else {
      newSections.add(section);
    }
    setExpandedSections(newSections);
  };

  const activeExtensions = state.extensions.filter(ext => ext.status === 'Active' || ext.status === 'Installed');

  const navGroups = [
    {
      id: 'core',
      label: 'Core Modules',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Portfolio Dashboard' },
        { id: 'projectList', icon: Briefcase, label: 'Project List' },
        { id: 'projectWorkspace', icon: Layers, label: 'Project Workspace' },
      ]
    },
    {
      id: 'extensions',
      label: 'Installed Engines',
      items: activeExtensions.map(ext => ({
        id: ext.id,
        icon: iconMap[ext.icon] || Layers,
        label: ext.name
      }))
    },
    {
      id: 'admin',
      label: 'Administration',
      items: [
        { id: 'dataExchange', icon: Database, label: 'Data Exchange' },
        { id: 'marketplace', icon: LayoutGrid, label: 'App Marketplace' },
        { id: 'integrations', icon: Network, label: 'Integration Hub' },
        { id: 'admin', icon: Settings, label: 'Settings' },
      ]
    }
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full border-r border-slate-800 flex-shrink-0 select-none">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-nexus-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-nexus-500/30">N</div>
          <span className="text-xl font-bold text-white tracking-tight">Nexus PPM</span>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
        {navGroups.map((group) => {
           if (group.items.length === 0) return null; 

           return (
            <div key={group.id} className="mb-2">
              <button 
                onClick={() => toggleSection(group.id)}
                className="w-full flex items-center justify-between px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-slate-400"
              >
                {group.label}
                {expandedSections.has(group.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              
              {expandedSections.has(group.id) && (
                <div className="mt-1 space-y-0.5">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all border-l-4 ${
                        activeTab === item.id 
                          ? 'bg-slate-800 text-nexus-400 border-nexus-500' 
                          : 'border-transparent hover:bg-slate-800/50 hover:text-white text-slate-400'
                      }`}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
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
          <Settings size={16} className="text-slate-500 hover:text-white cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;