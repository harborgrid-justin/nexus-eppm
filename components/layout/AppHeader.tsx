
import React, { useEffect } from 'react';
import { Menu, Search, Sparkles, History } from 'lucide-react';
import { GlobalBreadcrumbs } from '../common/GlobalBreadcrumbs';
import { NotificationCenter } from '../common/NotificationCenter';
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
    const enableAi = useFeatureFlag('enableAi');
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                onNavigate('search');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        // CRITICAL: Memory leak prevention
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onNavigate]);

    return (
        <header className="sticky top-0 h-12 bg-surface border-b border-border flex justify-between items-center px-3 md:px-4 flex-shrink-0 z-50 shadow-sm transition-colors duration-300">
           <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
              <button onClick={onSidebarOpen} className="md:hidden p-1.5 -ml-1 text-text-secondary hover:bg-background rounded-md flex-shrink-0"><Menu size={18} /></button>
              <div className="min-w-0 overflow-hidden">
                <GlobalBreadcrumbs activeTab={activeTab} projectId={activeTab === 'projectWorkspace' ? projectId || undefined : undefined} onNavigate={onNavigate} />
              </div>
           </div>

           <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
              <div 
                  className="hidden md:flex items-center bg-background rounded-md px-2 py-1 border border-border hover:border-slate-300 transition-colors w-56 cursor-pointer group"
                  onClick={() => onNavigate('search')}
              >
                  <Search size={12} className="text-text-tertiary mr-2 group-hover:text-nexus-500 transition-colors"/>
                  <span className="text-[11px] text-text-secondary font-medium">Search (Cmd+K)</span>
              </div>

              <div className="h-4 w-px bg-border hidden md:block"></div>

              <div className="flex items-center gap-0.5">
                <button onClick={onPulseOpen} className={`p-1.5 rounded-md transition-all ${isPulseOpen ? 'bg-nexus-50 text-nexus-600' : 'text-text-secondary hover:text-nexus-600 hover:bg-background'}`} title="Activity Stream">
                    <History size={16} />
                </button>
                <NotificationCenter />
              </div>

              {enableAi && (
                <button 
                    onClick={() => onNavigate('ai')} 
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${activeTab === 'ai' ? 'bg-nexus-50 border-nexus-200 text-nexus-700 shadow-inner' : 'bg-surface border-border text-text-secondary hover:bg-background shadow-sm hover:shadow'}`}
                >
                    <Sparkles size={12} className={activeTab === 'ai' ? 'text-nexus-600' : 'text-purple-500'} />
                    <span className="hidden sm:inline">Advisor</span>
                </button>
              )}
           </div>
        </header>
    );
};
