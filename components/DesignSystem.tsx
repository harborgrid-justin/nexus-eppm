import React, { useState } from 'react';
import { 
  Palette, Box, LayoutTemplate, Scale, Zap, Type, 
  Table, List, Move, FileText, Folder, PenTool, 
  Calendar, Clock, ClipboardList, GitBranch, Map, 
  Database, AlertTriangle, DollarSign, BarChart3, Sparkles,
  Menu, X
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { PageHeader } from './common/PageHeader';

import { DesignIntro } from './design/DesignIntro';
import { DesignColors } from './design/DesignColors';
import { DesignTypography } from './design/DesignTypography';
import { DesignLayouts } from './design/DesignLayouts';
import { DesignCards } from './design/DesignCards';
import { DesignInputs } from './design/DesignInputs';
import { DesignControls } from './design/DesignControls';
import { DesignDataGrid } from './design/DesignDataGrid';
import { DesignFeedback } from './design/DesignFeedback';
import { DesignNavigation } from './design/DesignNavigation';
import { DesignDocuments } from './design/DesignDocuments';
import { DesignDocEditing } from './design/DesignDocEditing';
import { DesignDataManagement } from './design/DesignDataManagement';
import { DesignDragDrop } from './design/DesignDragDrop';
import { DesignVisualizations } from './design/DesignVisualizations';
import { DesignCalendar } from './design/DesignCalendar';
import { DesignTimeline } from './design/DesignTimeline';
import { DesignProjectManagement } from './design/DesignProjectManagement';
import { DesignWorkflow } from './design/DesignWorkflow';
import { DesignFinance } from './design/DesignFinance';
import { DesignLegal } from './design/DesignLegal';

const CATEGORIES = [
  { id: 'intro', label: 'Introduction', icon: Palette, component: DesignIntro },
  { id: 'colors', label: 'Color System', icon: Palette, component: DesignColors },
  { id: 'typography', label: 'Typography', icon: Type, component: DesignTypography },
  { id: 'layouts', label: 'Layouts & Grids', icon: LayoutTemplate, component: DesignLayouts },
  { id: 'cards', label: 'Cards & Containers', icon: Box, component: DesignCards },
  { id: 'inputs', label: 'Forms & Inputs', icon: FileText, component: DesignInputs },
  { id: 'controls', label: 'Buttons & Controls', icon: Sparkles, component: DesignControls },
  { id: 'datagrid', label: 'Data Grids & Tables', icon: Table, component: DesignDataGrid },
  { id: 'feedback', label: 'Feedback & States', icon: AlertTriangle, component: DesignFeedback },
  { id: 'navigation', label: 'Navigation', icon: Map, component: DesignNavigation },
  { id: 'documents', label: 'Document Mgmt', icon: Folder, component: DesignDocuments },
  { id: 'docediting', label: 'Document Editor', icon: PenTool, component: DesignDocEditing },
  { id: 'datamgmt', label: 'Data Management', icon: Database, component: DesignDataManagement },
  { id: 'dragdrop', label: 'Drag & Drop', icon: Move, component: DesignDragDrop },
  { id: 'visuals', label: 'Data Visualization', icon: BarChart3, component: DesignVisualizations },
  { id: 'calendar', label: 'Calendar', icon: Calendar, component: DesignCalendar },
  { id: 'timeline', label: 'Timelines & History', icon: Clock, component: DesignTimeline },
  { id: 'pm', label: 'Project Management', icon: ClipboardList, component: DesignProjectManagement },
  { id: 'workflow', label: 'Workflow Engine', icon: GitBranch, component: DesignWorkflow },
  { id: 'finance', label: 'Finance', icon: DollarSign, component: DesignFinance },
  { id: 'legal', label: 'Legal Patterns', icon: Scale, component: DesignLegal },
];

const DesignSystem: React.FC = () => {
  const theme = useTheme();
  const [activeComponentId, setActiveComponentId] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const ActiveComponent = CATEGORIES.find(c => c.id === activeComponentId)?.component || DesignIntro;

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
      <PageHeader 
        title="LexiFlow Design System" 
        subtitle="Foundational components and patterns for enterprise legal applications."
        icon={Palette}
        actions={
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            <Menu size={24} />
          </button>
        }
      />
      
      <div className={theme.layout.panelContainer + " relative"}>
        <div className="flex h-full bg-slate-50 overflow-hidden relative">
          
          {/* Mobile Backdrop */}
          {isMobileMenuOpen && (
            <div 
              className="absolute inset-0 bg-slate-900/50 z-20 md:hidden backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar Navigation */}
          <div 
            className={`
              absolute inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 flex flex-col h-full shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out
              md:relative md:translate-x-0 flex-shrink-0
              ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h2 className="font-bold text-slate-700 flex items-center gap-2">
                <Box className="text-nexus-600" /> Components
              </h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="md:hidden text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
              {CATEGORIES.map(category => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveComponentId(category.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all truncate ${
                    activeComponentId === category.id 
                    ? `bg-nexus-50 text-nexus-700 font-bold` 
                    : `text-slate-600 hover:bg-slate-100 hover:text-slate-900`
                  }`}
                  title={category.label}
                >
                  <category.icon size={16} className="flex-shrink-0" />
                  <span className="truncate">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50/50 relative">
             <div className="flex-1 p-4 md:p-8 overflow-y-auto scrollbar-thin">
                <ActiveComponent onNavigate={(id: string) => {
                  setActiveComponentId(id);
                  // Optional: if navigating from Intro, we don't necessarily need to open the menu on mobile, 
                  // but scrolling to top might be nice.
                }} />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystem;