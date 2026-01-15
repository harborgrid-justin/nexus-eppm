import React, { useEffect, useState } from 'react';
import { Menu, Search, Sparkles, History, Command, Maximize2, Minimize2 } from 'lucide-react';
import { GlobalBreadcrumbs } from '../common/GlobalBreadcrumbs';
import { NotificationCenter } from '../common/NotificationCenter';
import { useFeatureFlag } from '../../context/FeatureFlagContext';
import { useTheme } from '../../context/ThemeContext';
import { CommandPalette } from '../common/CommandPalette';

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
    isSidebarCollapsed?: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
    activeTab, projectId, isPulseOpen, onSidebarOpen, onPulseOpen, onNavigate, onPaletteOpen
}) => {
    const enableAi = useFeatureFlag('enableAi');
    const theme = useTheme();
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsCommandOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <header className={`sticky top-0 h-16 ${theme.colors.surface} border-b ${theme.colors.border} flex justify-between items-center px-6 flex-shrink-0 z-40 shadow-sm transition-all duration-300 bg-white/80 backdrop-blur-md`}>
           <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} onNavigate={onNavigate} />
           
           <div className="flex items-center gap-6 min-w-0 flex-1 mr-6">
              <button onClick={onSidebarOpen} className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-all active:scale-95"><Menu size={22} /></button>
              <div className="min-w-0 overflow-hidden hidden sm:block">
                <GlobalBreadcrumbs activeTab={activeTab} projectId={activeTab === 'projectWorkspace' ? projectId || undefined : undefined} onNavigate={onNavigate} />
              </div>
           </div>

           <div className="flex items-center gap-3 md:gap-5 flex-shrink-0">
              <div 
                  className={`hidden md:flex items-center ${theme.colors.background} rounded-2xl px-4 py-2 border ${theme.colors.border} hover:border-nexus-300 hover:bg-white transition-all w-72 cursor-pointer group shadow-inner`}
                  onClick={() => setIsCommandOpen(true)}
              >
                  <Search size={16} className="text-slate-400 mr-3 group-hover:text-nexus-600 transition-colors"/>
                  <span className={`text-xs ${theme.colors.text.tertiary} font-bold group-hover:${theme.colors.text.secondary} uppercase tracking-widest`}>Search Nexus Graph...</span>
                  <div className={`ml-auto flex items-center gap-1.5 text-[10px] font-black text-slate-400 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm`}>
                      <Command size={10} strokeWidth={3} /> K
                  </div>
              </div>

              <div className={`h-6 w-px ${theme.colors.border} hidden md:block opacity-50`}></div>

              <div className="flex items-center gap-2">
                <button 
                    onClick={onPulseOpen} 
                    className={`p-2.5 rounded-xl transition-all relative group ${isPulseOpen ? 'bg-nexus-900 text-white shadow-xl shadow-slate-900/20' : `${theme.colors.text.tertiary} hover:text-nexus-600 hover:${theme.colors.background} bg-white/50 border border-transparent hover:border-slate-100 shadow-sm`}`} 
                    title="Enterprise Pulse Feed"
                >
                    <History size={20} className="group-hover:rotate-12 transition-transform"/>
                </button>
                <NotificationCenter />
              </div>

              {enableAi && (
                <button 
                    onClick={() => onNavigate('ai')} 
                    className={`flex items-center gap-3 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border shadow-xl active:scale-95 hover:-translate-y-0.5 ${activeTab === 'ai' ? 'bg-nexus-900 text-white border-slate-800' : `bg-white ${theme.colors.border} text-slate-500 hover:text-nexus-700 hover:border-nexus-200`}`}
                >
                    <Sparkles size={16} className={activeTab === 'ai' ? 'text-nexus-400 animate-pulse' : 'text-purple-500'} />
                    <span className="hidden sm:inline">AI Advisor</span>
                </button>
              )}
           </div>
        </header>
    );
};