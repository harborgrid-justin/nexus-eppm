
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { 
  Briefcase, ArrowRight, LayoutDashboard, Gavel, Target, Star, Map, 
  ArrowLeft, Sliders, TrendingUp, Users, ShieldAlert, Flag, ShieldCheck, 
  Server, Scale, AlertOctagon, RefreshCw, Truck, Plus 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getHealthColorClass } from '../utils/formatters';
import { usePermissions } from '../hooks/usePermissions';
import { PageHeader } from './common/PageHeader';

// Sub-components
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
  const [activeView, setActiveView] = useState<string>('dashboard');
  const theme = useTheme();
  const { canEditProject } = usePermissions(); // Inherit permissions

  const selectedProgram = state.programs.find(p => p.id === selectedProgramId);

  // Navigation Configuration
  const navGroups = [
    {
      label: 'Overview',
      items: [
        { id: 'dashboard', label: 'Program Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      label: 'Strategy & Value',
      items: [
        { id: 'strategy', label: 'Strategy Matrix', icon: Target },
        { id: 'benefits', label: 'Benefits Realization', icon: Star },
        { id: 'roadmap', label: 'Master Roadmap', icon: Map },
        { id: 'tradeoff', label: 'Trade-off Analysis', icon: Scale },
      ]
    },
    {
      label: 'Governance',
      items: [
        { id: 'governance', label: 'Governance Board', icon: Gavel },
        { id: 'gates', label: 'Stage Gates', icon: Flag },
        { id: 'architecture', label: 'Architecture', icon: Server },
      ]
    },
    {
      label: 'Execution',
      items: [
        { id: 'scope', label: 'Scope & Outcomes', icon: Sliders },
        { id: 'financials', label: 'Financials', icon: TrendingUp },
        { id: 'resources', label: 'Resource Mgmt', icon: Users },
        { id: 'vendors', label: 'Vendors', icon: Truck },
      ]
    },
    {
      label: 'Control',
      items: [
        { id: 'risks', label: 'Risk Management', icon: ShieldAlert },
        { id: 'issues', label: 'Issues & Escalation', icon: AlertOctagon },
        { id: 'change', label: 'Integrated Change', icon: RefreshCw },
        { id: 'quality', label: 'Quality Assurance', icon: ShieldCheck },
      ]
    },
    {
      label: 'Engagement',
      items: [
        { id: 'stakeholders', label: 'Stakeholders', icon: Users },
        { id: 'closure', label: 'Transition & Close', icon: Flag },
      ]
    }
  ];

  const renderContent = () => {
    if (!selectedProgram) return null;
    switch (activeView) {
      case 'dashboard': return <ProgramDashboard programId={selectedProgram.id} />;
      case 'governance': return <ProgramGovernance programId={selectedProgram.id} />;
      case 'strategy': return <ProgramStrategy programId={selectedProgram.id} />;
      case 'benefits': return <ProgramBenefits programId={selectedProgram.id} />;
      case 'roadmap': return <ProgramRoadmap programId={selectedProgram.id} />;
      case 'tradeoff': return <ProgramTradeoff programId={selectedProgram.id} />;
      case 'gates': return <ProgramStageGates programId={selectedProgram.id} />;
      case 'architecture': return <ProgramArchitecture programId={selectedProgram.id} />;
      case 'scope': return <ProgramScope programId={selectedProgram.id} />;
      case 'financials': return <ProgramFinancials programId={selectedProgram.id} />;
      case 'resources': return <ProgramResources programId={selectedProgram.id} />;
      case 'vendors': return <ProgramVendors programId={selectedProgram.id} />;
      case 'risks': return <ProgramRisks programId={selectedProgram.id} />;
      case 'issues': return <ProgramIssues programId={selectedProgram.id} />;
      case 'change': return <ProgramIntegratedChange programId={selectedProgram.id} />;
      case 'quality': return <ProgramQuality programId={selectedProgram.id} />;
      case 'stakeholders': return <ProgramStakeholders programId={selectedProgram.id} />;
      case 'closure': return <ProgramClosure programId={selectedProgram.id} />;
      default: return <ProgramDashboard programId={selectedProgram.id} />;
    }
  };

  // --- PROGRAM LIST VIEW ---
  if (!selectedProgram) {
    return (
      <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
         <PageHeader
            title="Program Management"
            subtitle="Manage coordinated groups of related projects to obtain benefits not available from managing them individually."
            icon={Briefcase}
            actions={canEditProject() && (
                <button className={`px-4 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium hover:bg-nexus-700 flex items-center gap-2 shadow-sm`}>
                    <Plus size={16}/> New Program
                </button>
            )}
         />

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
            {state.programs.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center p-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                    <Briefcase size={48} className="mb-4 opacity-50"/>
                    <p>No programs defined.</p>
                </div>
            )}
         </div>
      </div>
    );
  }

  // --- PROGRAM WORKSPACE VIEW ---
  return (
    <div className={theme.layout.pageContainer}>
       {/* Workspace Header */}
       <div className={`${theme.colors.surface} border-b border-slate-200 shadow-sm flex-shrink-0 z-10`}>
          <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-4 w-full md:w-auto">
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
             <div className="flex gap-2 w-full md:w-auto justify-end">
                <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Settings</button>
             </div>
          </div>

          {/* Nav Tabs */}
          <div className="px-6 flex overflow-x-auto scrollbar-hide gap-6">
              {navGroups.map((group, gIdx) => (
                  <div key={gIdx} className="flex gap-1 py-2">
                      {group.items.map(item => (
                          <button
                              key={item.id}
                              onClick={() => setActiveView(item.id)}
                              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                                  activeView === item.id 
                                  ? 'bg-nexus-50 text-nexus-700' 
                                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                              }`}
                          >
                              <item.icon size={16} />
                              {item.label}
                          </button>
                      ))}
                      {/* Divider between groups */}
                      {gIdx < navGroups.length - 1 && <div className="w-px bg-slate-200 mx-2 my-2"></div>}
                  </div>
              ))}
          </div>
       </div>

       {/* Content Area */}
       <div className="flex-1 overflow-hidden bg-slate-50/50">
          {renderContent()}
       </div>
    </div>
  );
};

export default ProgramManager;
