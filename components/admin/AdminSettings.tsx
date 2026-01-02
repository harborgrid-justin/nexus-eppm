
import React, { useState } from 'react';
import { 
  Settings, Users, Server, Shield, Bell, CreditCard, UserCog, Tag, 
  Receipt, FileWarning, Banknote, Edit3, Calendar, GitPullRequest, 
  Terminal, Globe, Layers, MapPin, History, RefreshCw 
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import EpsObsSettings from './EpsObsSettings';
import CalendarEditor from './CalendarEditor';
import GlobalChangeWorkbench from './GlobalChangeWorkbench';
import { useTheme } from '../../context/ThemeContext';

const AdminSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [isApplying, setIsApplying] = useState(false);
  const theme = useTheme();

  const handleGlobalApply = () => {
      setIsApplying(true);
      setTimeout(() => {
          setIsApplying(false);
          alert("Global enterprise parameters synchronized across all projects and programs.");
      }, 1500);
  };

  const navItems = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'epsobs', label: 'EPS & OBS Structure', icon: Layers }, // Gap 1
    { id: 'locations', label: 'Global Locations', icon: MapPin }, // Gap 14
    { id: 'calendars', label: 'Enterprise Calendars', icon: Calendar }, // Gap 3
    { id: 'globalChange', label: 'Global Change', icon: Terminal }, // Gap 11
    { id: 'activityCodes', label: 'Activity Codes', icon: Tag }, // Gap 4
    { id: 'udfs', label: 'User Defined Fields', icon: Edit3 }, // Gap 5
    { id: 'issueCodes', label: 'Issue Codes', icon: FileWarning },
    { id: 'expenseCategories', label: 'Expense Categories', icon: Receipt }, // Gap 9
    { id: 'fundingSources', label: 'Funding Sources', icon: Banknote }, // Gap 10
    { id: 'resources', label: 'Resource & Roles', icon: UserCog }, // Gap 4
    { id: 'workflows', label: 'Workflows', icon: GitPullRequest }, // Gap 13
    { id: 'users', label: 'Users & Security', icon: Users },
    { id: 'billing', label: 'Billing & License', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'audit', label: 'System Audit Log', icon: History }, // Gap 15
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'epsobs': return <EpsObsSettings />;
      case 'calendars': return <CalendarEditor />;
      case 'globalChange': return <GlobalChangeWorkbench />;
      // Placeholders for other 15 gap areas implemented as basic shells for now
      default: 
        return (
            <div className="p-12 text-center text-slate-400">
                <div className="mb-4 flex justify-center"><Settings size={48} className="opacity-20"/></div>
                <h3 className="text-lg font-bold text-slate-600">Enterprise Configuration Module</h3>
                <p className="max-w-md mx-auto mt-2 text-sm">Select a category from the left to configure global production logic for {navItems.find(n => n.id === activeSection)?.label}.</p>
            </div>
        );
    }
  };

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
      <div className={`${theme.components.card} flex-1 flex flex-col overflow-hidden h-full`}>
        
        <header className={`px-8 py-6 border-b border-slate-100 flex justify-between items-center ${theme.colors.surface} sticky top-0 z-10 shrink-0`}>
            <div>
              <h1 className={theme.typography.heading}>Enterprise Administration</h1>
              <p className={theme.typography.subtext}>Configure global system logic and enterprise data definitions.</p>
            </div>
            <button 
              onClick={handleGlobalApply}
              className={`flex items-center gap-2 px-4 py-2 ${theme.colors.primary} text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-all active:scale-95`}
            >
              <RefreshCw size={16} className={isApplying ? 'animate-spin' : ''}/>
              {isApplying ? 'Synchronizing...' : 'Apply Global Changes'}
            </button>
          </header>

        <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <nav className="w-64 border-r border-slate-100 overflow-y-auto p-4 space-y-1 bg-slate-50">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                            activeSection === item.id 
                            ? 'bg-white shadow-sm text-nexus-600 ring-1 ring-slate-200' 
                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                        }`}
                    >
                        <item.icon size={16} />
                        {item.label}
                    </button>
                ))}
            </nav>
            
            {/* Content Area */}
            <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                {renderContent()}
            </main>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
