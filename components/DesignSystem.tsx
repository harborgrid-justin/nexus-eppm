import React, { useState } from 'react';
import { 
  Palette, Box, LayoutTemplate, Scale, Zap, Type, 
  Table, List, Move, FileText, Folder, PenTool, 
  Calendar, Clock, ClipboardList, GitBranch, Map, 
  Database, AlertTriangle, DollarSign, BarChart3, Sparkles,
  Menu, X, ChevronRight
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
  { id: 'intro', label: 'Framework Overview', icon: Sparkles, component: DesignIntro },
  { id: 'colors', label: 'Color Variables', icon: Palette, component: DesignColors },
  { id: 'typography', label: 'Typography', icon: Type, component: DesignTypography },
  { id: 'layouts', label: 'Structural Layouts', icon: LayoutTemplate, component: DesignLayouts },
  { id: 'cards', label: 'Container Patterns', icon: Box, component: DesignCards },
  { id: 'inputs', label: 'Data Input Controls', icon: FileText, component: DesignInputs },
  { id: 'controls', label: 'Buttons & Triggers', icon: Zap, component: DesignControls },
  { id: 'datagrid', label: 'Grids & Tables', icon: Table, component: DesignDataGrid },
  { id: 'feedback', label: 'State & Feedback', icon: AlertTriangle, component: DesignFeedback },
  { id: 'navigation', label: 'Global Navigation', icon: Map, component: DesignNavigation },
  { id: 'documents', label: 'DMS Interface', icon: Folder, component: DesignDocuments },
  { id: 'docediting', label: 'Rich Text Editor', icon: PenTool, component: DesignDocEditing },
  { id: 'datamgmt', label: 'ETL & Ingestion', icon: Database, component: DesignDataManagement },
  { id: 'dragdrop', label: 'Gestures & Drag', icon: Move, component: DesignDragDrop },
  { id: 'visuals', label: 'Chart Foundations', icon: BarChart3, component: DesignVisualizations },
  { id: 'calendar', label: 'Planning Calendar', icon: Calendar, component: DesignCalendar },
  { id: 'timeline', label: 'History & Feeds', icon: Clock, component: DesignTimeline },
  { id: 'pm', label: 'CPM & Scheduling', icon: ClipboardList, component: DesignProjectManagement },
  { id: 'workflow', label: 'Automation Engine', icon: GitBranch, component: DesignWorkflow },
  { id: 'finance', label: 'Fiscal Patterns', icon: DollarSign, component: DesignFinance },
  { id: 'legal', label: 'Regulatory Layouts', icon: Scale, component: DesignLegal },
];

const DesignSystem: React.FC = () => {
  const theme = useTheme();
  const [activeComponentId, setActiveComponentId] = useState('intro');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const ActiveComponent = CATEGORIES.find(c => c.id === activeComponentId)?.component || DesignIntro;

  return (
    <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} h-full flex flex-col`}>
      <PageHeader 
        title="Nexus Design System" 
        subtitle="Foundational atomic components and enterprise patterns for the PPM workspace."
        icon={Palette}
        actions={
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 shadow-sm"
            aria-label="Toggle Design Menu"
          >
            <Menu size={20} />
          </button>
        }
      />
      
      <div className={`${theme.layout.panelContainer} relative flex-1 min-h-0`}>
        <div className="flex h-full bg-white overflow-hidden">
          
          {/* Mobile Overlay */}
          {isMobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-slate-900/60 z-[60] md:hidden backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Component Sidebar */}
          <aside 
            className={`
              absolute inset-y-0 left-0 z-[70] w-72 bg-slate-50 border-r border-slate-200 flex flex-col h-full shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out
              md:relative md:translate-x-0 flex-shrink-0
              ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            <div className="p-5 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
              <h2 className="font-black text-slate-800 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Box size={14} className="text-nexus-600" /> Pattern Library
              </h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="md:hidden p-1 hover:bg-slate-100 rounded-md text-slate-400"
              >
                <X size={18} />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-thin">
              {CATEGORIES.map(category => {
                const isActive = activeComponentId === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setActiveComponentId(category.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all
                      ${isActive 
                        ? `bg-white text-nexus-700 shadow-sm border border-slate-200 ring-4 ring-nexus-500/5` 
                        : `text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent`
                      }
                    `}
                  >
                    <category.icon size={18} className={`shrink-0 ${isActive ? 'text-nexus-600' : 'opacity-40'}`} />
                    <span className="truncate flex-1 text-left">{category.label}</span>
                    {isActive && <ChevronRight size={14} className="text-nexus-400" />}
                  </button>
                );
              })}
            </nav>
            
            <div className="p-4 bg-slate-100/50 border-t border-slate-200">
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>BUILD: 2024.10.12</span>
                    <span className="text-green-600 font-bold">STABLE</span>
                </div>
            </div>
          </aside>

          {/* Canvas */}
          <main className="flex-1 flex flex-col min-w-0 bg-white h-full relative overflow-hidden">
             <div className="flex-1 h-full overflow-y-auto scrollbar-thin p-6 md:p-10 lg:p-16">
                <div className="max-w-7xl mx-auto w-full">
                    <ActiveComponent onNavigate={(id: string) => {
                      setActiveComponentId(id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }} />
                </div>
             </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DesignSystem;