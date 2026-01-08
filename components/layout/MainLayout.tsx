
import React, { useState, useTransition, Suspense } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Sidebar';
import { ActivitySidecar } from '../common/ActivitySidecar';
import { ErrorBoundary } from '../ErrorBoundary';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import SuspenseFallback from './SuspenseFallback';

const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPulseOpen, setIsPulseOpen] = useState(false);
  
  const [isPending, startTransition] = useTransition();
  
  const navigate = useNavigate();
  const location = useLocation();

  const projectIdFromUrl = location.pathname.startsWith('/projectWorkspace/') ? location.pathname.split('/')[2] : null;

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
  const isScheduleMode = activeTab === 'schedule';

  return (
    <div className="flex h-screen w-full font-sans overflow-hidden relative bg-background text-text-primary">
      <ActivitySidecar isOpen={isPulseOpen} onClose={() => setIsPulseOpen(false)} />

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => startTransition(() => navigate(`/${tab}`))} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className={`flex-1 flex flex-col min-w-0 bg-background relative z-0 transition-all duration-300`}>
        <AppHeader 
          activeTab={activeTab} 
          projectId={projectIdFromUrl}
          isPulseOpen={isPulseOpen}
          isAiOpen={activeTab === 'ai'}
          onSidebarOpen={() => setIsSidebarOpen(true)}
          onPaletteOpen={() => navigate('/search')}
          onPulseOpen={() => setIsPulseOpen(true)}
          onAiToggle={() => navigate('/ai')}
          onNavigate={handleQuickNav}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main className="flex-1 overflow-hidden relative z-0">
           <ErrorBoundary name="Main Content">
             <div className="h-full w-full relative flex flex-col">
                 {isPending && (
                    <div className="absolute top-0 left-0 right-0 h-1 z-[60] overflow-hidden bg-nexus-100">
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
    </div>
  );
};
export default MainLayout;
