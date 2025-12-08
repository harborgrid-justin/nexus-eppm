import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectGantt from './components/ProjectGantt';
import ProjectList from './components/ProjectList';
import AiAssistant from './components/AiAssistant';
import ResourceManagement from './components/ResourceManagement';
import Reports from './components/Reports';
import AdminSettings from './components/AdminSettings';
import RiskRegister from './components/RiskRegister';
import IntegrationHub from './components/IntegrationHub';
import { Sparkles } from 'lucide-react';
import { DataProvider, useData } from './context/DataContext';

// Inner App component that consumes the Data Context
const AppContent = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const { state } = useData();

  // Default to first project if none selected but we are in schedule view
  const selectedProject = state.projects.find(p => p.id === selectedProjectId) || state.projects[0];

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
    setActiveTab('schedule');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard projects={state.projects} />;
      case 'projects':
        return <ProjectList projects={state.projects} onSelectProject={handleProjectSelect} />;
      case 'schedule':
        return <ProjectGantt project={selectedProject} />;
      case 'resources':
        return <ResourceManagement />;
      case 'reports':
        return <Reports projects={state.projects} />;
      case 'admin':
        return <AdminSettings />;
      case 'risks':
        return <RiskRegister projectId={selectedProject.id} />;
      case 'integrations':
        return <IntegrationHub />;
      default:
        // Generic placeholder for the "80 other features" in the sidebar
        return (
           <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                 <h2 className="text-xl font-bold mb-2 text-slate-600">Module: {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                 <p className="max-w-md mx-auto">This enterprise module is initialized in the local platform but requires license activation to access full functionality.</p>
              </div>
           </div>
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
         {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex justify-between items-center px-6 flex-shrink-0 z-20 shadow-sm">
           <div className="flex items-center gap-4">
              {/* Only show project dropdown in Schedule and Risk view */}
              {(activeTab === 'schedule' || activeTab === 'risks') && (
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
              )}
              {activeTab === 'dashboard' && <h2 className="text-lg font-semibold text-slate-800">Executive Dashboard</h2>}
              {activeTab === 'projects' && <h2 className="text-lg font-semibold text-slate-800">Portfolio Master List</h2>}
              {activeTab === 'integrations' && <h2 className="text-lg font-semibold text-slate-800">Enterprise Connectors</h2>}
           </div>

           <div className="flex items-center gap-4">
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
              <div className="h-8 w-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden cursor-pointer hover:ring-2 hover:ring-slate-400 transition-all">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="User Profile" />
              </div>
           </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 overflow-hidden p-6 relative">
           {renderContent()}
        </main>
      </div>

      {/* AI Sidebar Overlay */}
      <AiAssistant 
         project={selectedProject} 
         isOpen={isAiOpen} 
         onClose={() => setIsAiOpen(false)} 
      />
    </div>
  );
};

const App = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;
