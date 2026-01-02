
import React, { useState, useTransition, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import AiAssistant from '../AiAssistant';
import { CommandPalette } from '../common/CommandPalette';
import { ActivitySidecar } from '../common/ActivitySidecar';
import { useData } from '../../context/DataContext';
import { useFeatureFlag } from '../../context/FeatureFlagContext';
import { ErrorBoundary } from '../ErrorBoundary';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import SuspenseFallback from './SuspenseFallback';

const MainLayout: React.FC = () => {
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [isPulseOpen, setIsPulseOpen] = useState(false);
  
  // Pattern 1: startTransition for critical interactions
  const [isPending, startTransition] = useTransition();
  
  const { state } = useData();
  const enableAi = useFeatureFlag('enableAi');
  const navigate = useNavigate();
  const location = useLocation();

  const projectIdFromUrl = location.pathname.startsWith('/projectWorkspace/') ? location.pathname.split('/')[2] : null;
  const selectedProject = state.projects.find(p => p.id === projectIdFromUrl) || state.projects[0];

  const handleQuickNav = (tab: string, projectId?: string) => {
      startTransition(() => {
        if (projectId) {
            navigate(`/projectWorkspace/${projectId}`);
        } else {
            navigate(`/${tab}`);
        }
      });
  };

  const activeTab = location.pathname.split('/')[1] || 'portfolio';

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden relative">
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} onNavigate={handleQuickNav} />
      <ActivitySidecar isOpen={isPulseOpen} onClose={() => setIsPulseOpen(false)} />

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => startTransition(() => navigate(`/${tab}`))} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader 
          activeTab={activeTab} 
          projectId={projectIdFromUrl}
          isPulseOpen={isPulseOpen}
          isAiOpen={isAiOpen}
          onSidebarOpen={() => setIsSidebarOpen(true)}
          onPaletteOpen={() => setIsPaletteOpen(true)}
          onPulseOpen={() => setIsPulseOpen(true)}
          onAiToggle={() => setIsAiOpen(!isAiOpen)}
          onNavigate={handleQuickNav}
        />
        <main className="flex-1 overflow-hidden relative">
           <ErrorBoundary name="Main Content">
             <div className="h-full w-full relative flex flex-col">
                 {/* Visual indicator for background transitions */}
                 {isPending && (
                    <div className="absolute top-0 left-0 right-0 h-1 z-[100] overflow-hidden bg-nexus-100">
                        <div className="h-full bg-nexus-600 animate-progress origin-left"></div>
                    </div>
                 )}
                 <Suspense fallback={<SuspenseFallback />}>
                   <div className={`h-full w-full transition-opacity duration-300 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
                      <Outlet />
                   </div>
                 </Suspense>
             </div>
           </ErrorBoundary>
        </main>
        <AppFooter />
      </div>

      {selectedProject && enableAi && (
        <AiAssistant project={selectedProject} isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />
      )}
    </div>
  );
};
export default MainLayout;
