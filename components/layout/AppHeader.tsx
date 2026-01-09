
import React, { useEffect } from 'react';
import { Menu, Search, Sparkles, History, Command } from 'lucide-react';
import { GlobalBreadcrumbs } from '../common/GlobalBreadcrumbs';
import { NotificationCenter } from '../common/NotificationCenter';
import { useFeatureFlag } from '../../context/FeatureFlagContext';
import { useTheme } from '../../context/ThemeContext';

interface AppHeaderProps {
    activeTab: string;
    projectId: string | null;
    isPulseOpen: boolean;
    isAiOpen: boolean;
    onSidebarOpen: () => void;
    onPaletteOpen: () => void;
    onPulseOpen: () => void;
    onAiToggle: () => void;
    onNavigate: (tab: string, id?: string) => void;
    isSidebarCollapsed: boolean;
    onToggleCollapse: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    activeTab, projectId, isPulseOpen, onSidebarOpen, onPulseOpen, onNavigate, onPaletteOpen
}) => {
    const enableAi = useFeatureFlag('enableAi');
    const theme = useTheme();
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                onPaletteOpen();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onPaletteOpen]);

    return (
        <header className={`sticky top-0 h-14 ${theme.colors.surface} border-b ${theme.colors.border} flex justify-between items-center px-4 flex-shrink-0 z-40 shadow-sm transition-colors duration-300`}>
           <div className="flex items-center gap-4 min-w-0 flex-1 mr-4">
              <button onClick={onSidebarOpen} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md flex-shrink-0"><Menu size={20} /></button>
              <div className="min-w-0 overflow-hidden hidden sm:block">
                <GlobalBreadcrumbs activeTab={activeTab} projectId={activeTab === 'projectWorkspace' ? projectId || undefined : undefined} onNavigate={onNavigate} />
              </div>
           </div>

           <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
              <div 
                  className={`hidden md:flex items-center bg-slate-50/50 rounded-lg px-3 py-1.5 border ${theme.colors.border} hover:border-nexus-300 hover:bg-white transition-all w-64 cursor-pointer group`}
                  onClick={onPaletteOpen}
              >
                  <Search size={14} className="text-slate-400 mr-2 group-hover:text-nexus-500 transition-colors"/>
                  <span className="text-xs text-slate-500 font-medium group-hover:text-slate-700">Search...</span>
                  <div className="ml-auto flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-sm">
                      <Command size={10} /> K
                  </div>
              </div>

              <div className="h-5 w-px bg-slate-200 hidden md:block"></div>

              <div className="flex items-center gap-1">
                <button 
                    onClick={onPulseOpen} 
                    className={`p-2 rounded-lg transition-all relative group ${isPulseOpen ? 'bg-nexus-50 text-nexus-600' : 'text-slate-500 hover:text-nexus-600 hover:bg-slate-50'}`} 
                    title="System Pulse"
                >
                    <History size={18} className="group-hover:scale-105 transition-transform"/>
                </button>
                <NotificationCenter />
              </div>

              {enableAi && (
                <button 
                    onClick={() => onNavigate('ai')} 
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border shadow-sm active:scale-95 hover:shadow-md ${activeTab === 'ai' ? 'bg-nexus-50 border-nexus-200 text-nexus-700' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 text-slate-600 hover:text-nexus-600'}`}
                >
                    <Sparkles size={14} className={activeTab === 'ai' ? 'text-nexus-600' : 'text-purple-500'} />
                    <span className="hidden sm:inline">Advisor</span>
                </button>
              )}
           </div>
        </header>
    );
};
