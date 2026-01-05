
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
    activeTab, projectId, isPulseOpen, onSidebarOpen, onPulseOpen, onNavigate
}) => {
    const theme = useTheme();
    const enableAi = useFeatureFlag('enableAi');
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                onNavigate('search');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNavigate]);

    return (
        <header className={`${theme.layout.headerHeight} ${theme.colors.surface} ${theme.colors.border} border-b flex justify-between items-center px-4 md:px-6 flex-shrink-0 z-20 shadow-sm transition-colors duration-300`}>
           <div className="flex items-center gap-4">
              <button onClick={onSidebarOpen} className={`md:hidden p-2 -ml-2 ${theme.colors.text.secondary} hover:${theme.colors.background} rounded-md`}><Menu size={20} /></button>
              <GlobalBreadcrumbs activeTab={activeTab} projectId={activeTab === 'projectWorkspace' ? projectId || undefined : undefined} onNavigate={onNavigate} />
           </div>

           <div className="flex items-center gap-3 md:gap-5">
              <div 
                  className={`hidden md:flex items-center ${theme.colors.background} rounded-lg px-3 py-1.5 border border-transparent hover:${theme.colors.border} transition-colors w-64 cursor-pointer`}
                  onClick={() => onNavigate('search')}
              >
                  <Search size={14} className={`${theme.colors.text.tertiary} mr-2`}/>
                  <span className={`text-xs ${theme.colors.text.secondary}`}>Search (Cmd+K)</span>
              </div>

              <div className={`h-6 w-px ${theme.colors.border} hidden md:block`}></div>

              <div className="flex items-center gap-2">
                <button onClick={onPulseOpen} className={`p-2 rounded-lg transition-all ${isPulseOpen ? 'bg-nexus-50 text-nexus-600' : `${theme.colors.text.secondary} hover:text-nexus-600 hover:${theme.colors.background}`}`} title="Activity Stream">
                    <History size={18} />
                </button>
                <NotificationCenter />
              </div>

              {enableAi && (
                <button 
                    onClick={() => onNavigate('ai')} 
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${activeTab === 'ai' ? 'bg-nexus-50 border-nexus-200 text-nexus-700 shadow-inner' : `${theme.colors.surface} ${theme.colors.border} ${theme.colors.text.secondary} hover:${theme.colors.background} shadow-sm`}`}
                >
                    <Sparkles size={14} className={activeTab === 'ai' ? 'text-nexus-600' : 'text-yellow-500'} />
                    <span className="hidden sm:inline">AI Advisor</span>
                </button>
              )}
           </div>
        </header>
    );
};
