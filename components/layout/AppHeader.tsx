
import React, { useEffect } from 'react';
import { Menu, Search, Sparkles, History } from 'lucide-react';
import { GlobalBreadcrumbs } from '../common/GlobalBreadcrumbs';
import { NotificationCenter } from '../common/NotificationCenter';
import { useTheme } from '../../context/ThemeContext';
import { useFeatureFlag } from '../../context/FeatureFlagContext';

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
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    activeTab, projectId, isPulseOpen, isAiOpen, onSidebarOpen, onPaletteOpen, onPulseOpen, onAiToggle, onNavigate
}) => {
    const theme = useTheme();
    const enableAi = useFeatureFlag('enableAi');
    
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
        <header className={`${theme.layout.headerHeight} ${theme.colors.surface} ${theme.colors.border} border-b flex justify-between items-center px-4 md:px-6 flex-shrink-0 z-20 shadow-sm`}>
           <div className="flex items-center gap-4">
              <button onClick={onSidebarOpen} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-md"><Menu size={20} /></button>
              <GlobalBreadcrumbs activeTab={activeTab} projectId={activeTab === 'projectWorkspace' ? projectId || undefined : undefined} onNavigate={onNavigate} />
           </div>

           <div className="flex items-center gap-3 md:gap-5">
              <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 border border-transparent hover:border-slate-300 transition-colors w-64 cursor-text" onClick={onPaletteOpen}>
                  <Search size={14} className="text-slate-400 mr-2"/>
                  <span className="text-xs text-slate-500">Search (Cmd+K)</span>
              </div>

              <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

              <div className="flex items-center gap-2">
                <button onClick={onPulseOpen} className={`p-2 rounded-lg transition-all ${isPulseOpen ? 'bg-nexus-50 text-nexus-600' : 'text-slate-400 hover:text-nexus-600 hover:bg-slate-50'}`} title="Activity Stream">
                    <History size={18} />
                </button>
                <NotificationCenter />
              </div>

              {enableAi && (
                <button onClick={onAiToggle} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${isAiOpen ? 'bg-nexus-50 border-nexus-200 text-nexus-700 shadow-inner' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 shadow-sm'}`}>
                    <Sparkles size={14} className={isAiOpen ? 'text-nexus-600' : 'text-yellow-500'} />
                    <span className="hidden sm:inline">AI Advisor</span>
                </button>
              )}
           </div>
        </header>
    );
};
