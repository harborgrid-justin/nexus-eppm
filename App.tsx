import React, { useState, lazy, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import AiAssistant from './components/AiAssistant';
import { Sparkles, Loader2 } from 'lucide-react';
import { DataProvider, useData } from './context/DataContext';
import { IndustryProvider } from './context/IndustryContext';
import { ThemeProvider } from './context/ThemeContext';
import IndustrySelector from './components/IndustrySelector';

// Lazy load major components
const AdminSettings = lazy(() => import('./components/AdminSettings'));
const IntegrationHub = lazy(() => import('./components/IntegrationHub'));
const ExtensionMarketplace = lazy(() => import('./components/ExtensionMarketplace'));
const ExtensionEngine = lazy(() => import('./components/ExtensionEngine'));
const ProjectWorkspace = lazy(() => import('./components/ProjectWorkspace'));
const DataExchange = lazy(() => import('./components/DataExchange'));
const PortfolioManager = lazy(() => import('./components/PortfolioManager'));
const ProgramManager = lazy(() => import('./components/ProgramManager'));
const ProjectList = lazy(() => import('./components/ProjectList'));


const SuspenseFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-500">
    <Loader2 className="animate-spin mr-2" />
    Loading Module...
  </div>
);

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>('P1001'); // Default to a project for workspace
  const [isAiOpen, setIsAiOpen] = useState(false);
  const { state } = useData();

  const selectedProject = state.projects.find(p => p.id === selectedProjectId) || state.projects[0];

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
    setActiveTab('projectWorkspace');
  };

  const renderContent = () => {
    const activeExtension = state.extensions.find(ext => ext.id === activeTab);
    if (activeExtension) {
      return <ExtensionEngine extension={activeExtension} />;
    }

    switch (activeTab) {
      case 'portfolio':
        return <PortfolioManager />;
      case 'programs':
        return <ProgramManager />;
      case 'projectList':
        return <ProjectList onSelectProject={handleProjectSelect} />;
      case 'projectWorkspace':
        if (!selectedProjectId) {
            return <div className="text-center p-8">Please select a project from the Project List to view its workspace.</div>
        }
        return <ProjectWorkspace projectId={selectedProjectId} />;
      case 'marketplace':
        return <ExtensionMarketplace />;
      case 'dataExchange':
        return <DataExchange />;
      case 'admin':
        return <AdminSettings />;
      case 'integrations':
        return <IntegrationHub />;
      default:
        return <PortfolioManager />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
         {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 flex-shrink-0 z-20 shadow-sm">
           <div className="flex items-center gap-4">
              {activeTab === 'projectWorkspace' ? (
                 <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
                   <span className="text-sm text-slate-500 font-medium">Project:</span>
                   <select 
                     className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-nexus-500 min-w-[200px]"
                     value={selectedProject.id}
                     onChange={(e) => setSelectedProjectId(e.target.value)}
                     aria-label="Select Project"
                   >
                      {state.projects.map(p => (
                         <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                      ))}
                   </select>
                 </div>
              ) : (
                <h2 className="text-lg font-semibold text-slate-800">
                  {
                    {
                      'portfolio': 'Enterprise Portfolio',
                      'programs': 'Program Management',
                      'projectList': 'Project Master List',
                      'dataExchange': 'Data Exchange Center',
                      'marketplace': 'App Marketplace',
                      'integrations': 'Integration Hub',
                      'admin': 'Administration'
                    }[activeTab] || 'Nexus PPM'
                  }
                </h2>
              )}
           </div>

           <div className="flex items-center gap-4">
              <IndustrySelector />
              <button 
                onClick={() => setIsAiOpen(!isAiOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isAiOpen 
                    ? 'bg-nexus-100 text-nexus-700 ring-2 ring-nexus-500 ring-offset-1' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                aria-expanded={isAiOpen}
                aria-controls="ai-assistant-panel"
              >
                 <Sparkles size={16} className={isAiOpen ? 'text-nexus-600' : 'text-yellow-500'} />
                 AI Assistant
              </button>
              <button aria-label="Open User Profile Menu" className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden cursor-pointer hover:ring-2 hover:ring-slate-400 transition-all">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="User Profile" />
              </button>
           </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 overflow-hidden relative bg-slate-100">
           <div className="h-full w-full overflow-hidden">
             <Suspense fallback={<SuspenseFallback />}>
               {renderContent()}
             </Suspense>
           </div>
        </main>
      </div>

      {/* AI Sidebar Overlay */}
      {selectedProject && (
        <AiAssistant 
          project={selectedProject} 
          isOpen={isAiOpen} 
          onClose={() => setIsAiOpen(false)} 
        />
      )}
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <DataProvider>
        <IndustryProvider>
          <AppContent />
        </IndustryProvider>
      </DataProvider>
    </ThemeProvider>
  );
};

export default App;
