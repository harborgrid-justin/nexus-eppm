
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Briefcase, ArrowRight, LayoutDashboard, Gavel, Target, Star, Map, ArrowLeft, Sliders, TrendingUp, Users, ShieldAlert, Flag, ShieldCheck, MessageSquare, Server, Scale, AlertOctagon, CheckCircle, RefreshCw, Truck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getHealthColorClass } from '../utils/formatters';
import ProgramDashboard from './program/ProgramDashboard';
import ProgramGovernance from './program/ProgramGovernance';
import ProgramStrategy from './program/ProgramStrategy';
import ProgramBenefits from './program/ProgramBenefits';
import ProgramRoadmap from './program/ProgramRoadmap';
import ProgramScope from './program/ProgramScope';
import ProgramFinancials from './program/ProgramFinancials';
import ProgramResources from './program/ProgramResources';
import ProgramRisks from './program/ProgramRisks';
import ProgramStakeholders from './program/ProgramStakeholders';
import ProgramQuality from './program/ProgramQuality';
import ProgramClosure from './program/ProgramClosure';
import ProgramArchitecture from './program/ProgramArchitecture';
import ProgramTradeoff from './program/ProgramTradeoff';
import ProgramIssues from './program/ProgramIssues';
import ProgramStageGates from './program/ProgramStageGates';
import ProgramIntegratedChange from './program/ProgramIntegratedChange';
import ProgramVendors from './program/ProgramVendors';

const ProgramManager: React.FC = () => {
  const { state } = useData();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'dashboard' | 'governance' | 'strategy' | 'scope' | 'financials' | 'resources' | 'risks' | 'benefits' | 'roadmap' | 'stakeholders' | 'quality' | 'closure' | 'architecture' | 'tradeoff' | 'issues' | 'gates' | 'change' | 'vendors'>('dashboard');
  const theme = useTheme();

  const selectedProgram = state.programs.find(p => p.id === selectedProgramId);

  // Render List of Programs (Portfolio View)
  if (!selectedProgram) {
    return (
      <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
         <div className={theme.layout.header}>
            <div>
                <h1 className={theme.typography.h1}>
                <Briefcase className="text-nexus-600" /> Program Management
                </h1>
                <p className={theme.typography.small}>Manage coordinated groups of related projects to obtain benefits not available from managing them individually.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.programs.map(program => (
               <div 
                  key={program.id} 
                  onClick={() => { setSelectedProgramId(program.id); setActiveView('dashboard'); }}
                  className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group`}
               >
                  <div className="flex justify-between items-start mb-4">
                     <div className="w-10 h-10 bg-nexus-50 text-nexus-600 rounded-lg flex items-center justify-center">
                        <Briefcase size={20} />
                     </div>
                     <span className={`px-2 py-1 rounded text-xs font-bold ${getHealthColorClass(program.health)}`}>
                        {program.health}
                     </span>
                  </div>
                  <h3 className={`${theme.typography.h3} group-hover:text-nexus-600 transition-colors mb-2`}>{program.name}</h3>
                  <p className={`${theme.typography.body} text-slate-500 mb-4 line-clamp-2`}>{program.description}</p>
                  
                  <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-100 pt-4">
                     <span>{state.projects.filter(p => p.programId === program.id).length} Projects</span>
                     <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-nexus-600 font-medium">
                        Open Workspace <ArrowRight size={14} />
                     </span>
                  </div>
               </div>
            ))}
         </div>
      </div>
    );
  }

  // Render Program Workspace
  return (
    <div className={theme.layout.pageContainer}>
       {/* Workspace Header */}
       <div className={`${theme.colors.surface} border-b border-slate-200 shadow-sm flex-shrink-0 z-10`}>
          <div className="px-6 py-4 flex justify-between items-center">
             <div className="flex items-center gap-4">
                <button 
                    onClick={() => setSelectedProgramId(null)} 
                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    title="Back to Program List"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className={theme.typography.h1}>{selectedProgram.name}</h1>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="bg-slate-100 px-2 py-0.5 rounded font-mono">ID: {selectedProgram.id}</span>
                        <span className="flex items-center gap-1">Manager: <span className="font-semibold text-slate-700">{selectedProgram.manager}</span></span>
                        <span className={`px-2 py-0.5 rounded font-bold ${getHealthColorClass(selectedProgram.health)}`}>{selectedProgram.health}</span>
                    </div>
                </div>
             </div>
             <div className="flex gap-2">
                <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Settings</button>
                <button className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium hover:bg-nexus-700`}>New Report</button>
             </div>
          </div>
          
          {/* Workspace Navigation Tabs */}
          <div className="flex px-6 space-x-1 overflow-x-auto scrollbar-hide border-t border-slate-100">
             {[
                 { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
                 { id: 'governance', label: 'Governance', icon: Gavel },
                 { id: 'strategy', label: 'Strategy', icon: Target },
                 { id: 'roadmap', label: 'Roadmap', icon: Map },
                 { id: 'scope', label: 'Scope', icon: Sliders },
                 { id: 'financials', label: 'Financials', icon: TrendingUp },
                 { id: 'resources', label: 'Resources', icon: Users },
                 { id: 'risks', label: 'Risks', icon: ShieldAlert },
                 { id: 'benefits', label: 'Benefits', icon: Star },
                 { id: 'issues', label: 'Issues', icon: AlertOctagon }, 
                 { id: 'gates', label: 'Gates', icon: CheckCircle }, 
                 { id: 'change', label: 'Change', icon: RefreshCw }, 
                 { id: 'vendors', label: 'Vendors', icon: Truck }, 
                 { id: 'tradeoff', label: 'Tradeoff', icon: Scale }, 
                 { id: 'architecture', label: 'Standards', icon: Server }, 
                 { id: 'stakeholders', label: 'Stakeholders', icon: MessageSquare },
                 { id: 'quality', label: 'Quality', icon: ShieldCheck },
                 { id: 'closure', label: 'Closure', icon: Flag },
             ].map((tab) => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveView(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap focus:outline-none focus:text-nexus-700 ${
                        activeView === tab.id 
                        ? 'border-nexus-600 text-nexus-600 bg-slate-50' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                 >
                    <tab.icon size={16} />
                    {tab.label}
                 </button>
             ))}
          </div>
       </div>

       {/* Content Area */}
       <div className="flex-1 overflow-hidden bg-slate-100">
          {activeView === 'dashboard' && <ProgramDashboard programId={selectedProgram.id} />}
          {activeView === 'governance' && <ProgramGovernance programId={selectedProgram.id} />}
          {activeView === 'strategy' && <ProgramStrategy programId={selectedProgram.id} />}
          {activeView === 'scope' && <ProgramScope programId={selectedProgram.id} />}
          {activeView === 'financials' && <ProgramFinancials programId={selectedProgram.id} />}
          {activeView === 'resources' && <ProgramResources programId={selectedProgram.id} />}
          {activeView === 'risks' && <ProgramRisks programId={selectedProgram.id} />}
          {activeView === 'benefits' && <ProgramBenefits programId={selectedProgram.id} />}
          {activeView === 'roadmap' && <ProgramRoadmap programId={selectedProgram.id} />}
          {activeView === 'stakeholders' && <ProgramStakeholders programId={selectedProgram.id} />}
          {activeView === 'quality' && <ProgramQuality programId={selectedProgram.id} />}
          {activeView === 'closure' && <ProgramClosure programId={selectedProgram.id} />}
          {activeView === 'architecture' && <ProgramArchitecture programId={selectedProgram.id} />}
          {activeView === 'tradeoff' && <ProgramTradeoff programId={selectedProgram.id} />}
          {activeView === 'issues' && <ProgramIssues programId={selectedProgram.id} />}
          {activeView === 'gates' && <ProgramStageGates programId={selectedProgram.id} />}
          {activeView === 'change' && <ProgramIntegratedChange programId={selectedProgram.id} />}
          {activeView === 'vendors' && <ProgramVendors programId={selectedProgram.id} />}
       </div>
    </div>
  );
};

export default ProgramManager;
