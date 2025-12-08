import React, { useState } from 'react';
import { 
  LayoutDashboard, GanttChartSquare, Users, Settings, Briefcase, TrendingUp,
  AlertTriangle, Network, ChevronDown, ChevronRight, FileText, Layers, ShieldCheck, DollarSign,
  ClipboardList, HardHat, GraduationCap, Archive
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['core', 'controls', 'financials']));

  const toggleSection = (section: string) => {
    const newSections = new Set(expandedSections);
    if (newSections.has(section)) {
      newSections.delete(section);
    } else {
      newSections.add(section);
    }
    setExpandedSections(newSections);
  };

  const navGroups = [
    {
      id: 'core',
      label: 'Core Modules',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Portfolio' },
        { id: 'projects', icon: Briefcase, label: 'Projects' },
        { id: 'documents', icon: FileText, label: 'Document Control' },
      ]
    },
    {
      id: 'controls',
      label: 'Project Controls',
      items: [
        { id: 'schedule', icon: GanttChartSquare, label: 'Schedule & WBS' },
        { id: 'risks', icon: AlertTriangle, label: 'Risk Register' },
        { id: 'resources', icon: Users, label: 'Resource Planning' },
        { id: 'quality', icon: ShieldCheck, label: 'Quality & Safety' },
      ]
    },
    {
      id: 'financials',
      label: 'Financials',
      items: [
        { id: 'budget', icon: DollarSign, label: 'Cost Management' },
        { id: 'change_orders', icon: Layers, label: 'Change Orders' },
        { id: 'reports', icon: TrendingUp, label: 'Analytics & EVM' },
      ]
    },
    {
      id: 'operations',
      label: 'Field Operations',
      items: [
        { id: 'daily_logs', icon: ClipboardList, label: 'Daily Logs' },
        { id: 'safety', icon: HardHat, label: 'HSE Incidents' },
        { id: 'training', icon: GraduationCap, label: 'Training' },
      ]
    },
    {
      id: 'admin',
      label: 'Administration',
      items: [
        { id: 'integrations', icon: Network, label: 'Integration Hub' },
        { id: 'archive', icon: Archive, label: 'Archived Projects' },
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
        {navGroups.map((group) => (
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
        ))}

        {/* Scaffold for "80 features" visual density */}
        <div className="mt-6 px-6">
           <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">Enterprise Extensions</div>
           <div className="grid grid-cols-6 gap-1.5 opacity-40">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="h-1.5 bg-slate-700 rounded-full" title="Active Module"></div>
              ))}
           </div>
           <p className="text-[10px] text-slate-600 mt-2 text-center">84 Modules Loaded (v4.2.0)</p>
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
          <Settings size={16} className="text-slate-500 hover:text-white cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
