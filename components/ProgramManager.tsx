
import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { 
  Briefcase, ArrowRight, LayoutDashboard, Gavel, Target, Star, Map, 
  ArrowLeft, Sliders, TrendingUp, Users, ShieldAlert, Flag, ShieldCheck, 
  Server, Scale, AlertOctagon, RefreshCw, Truck, Plus, Layers
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { usePermissions } from '../hooks/usePermissions';
import { PageHeader } from './common/PageHeader';
import { ModuleNavigation, NavGroup } from './common/ModuleNavigation';
import { StatusBadge } from './common/StatusBadge';
import { ProgressBar } from './common/ProgressBar';
import { formatCompactCurrency } from '../utils/formatters';

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
  const [activeGroup, setActiveGroup] = useState<string>('Overview');
  const [activeView, setActiveView] = useState<string>('dashboard');
  const theme = useTheme();
  const { canEditProject } = usePermissions();

  const selectedProgram = state.programs.find(p => p.id === selectedProgramId);

  const navGroups: NavGroup[] = useMemo(() => [
    {
      id: 'Overview',
      label: 'Overview',
      items: [
        { id: 'dashboard', label: 'Program Dashboard', icon: LayoutDashboard },
      ]
    },
    {
      id: 'Strategy',
      label: 'Strategy & Value',
      items: [
        { id: 'strategy', label: 'Strategy Matrix', icon: Target },
        { id: 'benefits', label: 'Benefits Realization', icon: Star },
        { id: 'roadmap', label: 'Master Roadmap', icon: Map },
        { id: 'tradeoff', label: 'Trade-off Analysis', icon: Scale },
      ]
    },
    {
      id: 'Governance',
      label: 'Governance',
      items: [
        { id: 'governance', label: 'Governance Board', icon: Gavel },
        { id: 'gates', label: 'Stage Gates', icon: Flag },
        { id: 'architecture', label: 'Architecture', icon: Server },
      ]
    },
    {
      id: 'Execution',
      label: 'Execution',
      items: [
        { id: 'scope', label: 'Scope & Outcomes', icon: Sliders },
        { id: 'financials', label: 'Financials', icon: TrendingUp },
        { id: 'resources', label: 'Resource Mgmt', icon: Users },
        { id: 'vendors', label: 'Vendors', icon: Truck },
      ]
    },
    {
      id: 'Control',
      label: 'Control',
      items: [
        { id: 'risks', label: 'Risk Management', icon: ShieldAlert },
        { id: 'issues', label: 'Issues & Escalation', icon: AlertOctagon },
        { id: 'change', label: 'Integrated Change', icon: RefreshCw },
        { id: 'quality', label: 'Quality Assurance', icon: ShieldCheck },
      ]
    },
    {
      id: 'Engagement',
      label: 'Engagement',
      items: [
        { id: 'stakeholders', label: 'Stakeholders', icon: Users },
        { id: 'closure', label: 'Transition & Close', icon: Flag },
      ]
    }
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navGroups.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      setActiveGroup(groupId);
      setActiveView(newGroup.items[0].id);
    }
  };

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
            icon={Layers}
            actions={canEditProject() && (
                <button className={`px-4 py-2 ${theme.colors.accentBg} rounded-lg text-sm font-medium text-white hover:bg-nexus-700 flex items-center gap-2 shadow-sm`}>
                    <Plus size={16} /> New Program
                </button>
            )}
         />
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.programs.map(program => {
                // Determine linked projects
                const projects = state.projects.filter(p => p.programId === program.id);
                const totalBudget = program.budget; // simplified, usually sum of projects + program reserve
                const projectCount = projects.length;
                
                // Calculate average health logic or use program prop
                
                return (
                    <div 
                        key={program.id} 
                        onClick={() => setSelectedProgramId(program.id)}
                        className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-nexus-50 flex items-center justify-center text-nexus-600 group-hover:bg-nexus-100 transition-colors">
                                    <Layers size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 group-hover:text-nexus-700 transition-colors">{program.name}</h3>
                                    <p className="text-xs text-slate-500">{program.manager}</p>
                                </div>
                            </div>
                            <StatusBadge status={program.health} variant="health"/>
                        </div>
                        
                        <p className="text-sm text-slate-600 mb-6 line-clamp-2">{program.description}</p>
                        
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-500">Program Budget</span>
                                    <span className="font-medium text-slate-900">{formatCompactCurrency(totalBudget)}</span>
                                </div>
                                <ProgressBar value={65} size="sm" /> 
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Briefcase size={14}/>
                                    <span>{projectCount} Projects</span>
                                </div>
                                <button className="text-xs font-bold text-nexus-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                    Open Workspace <ArrowRight size={12}/>
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
            
            {state.programs.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-400">
                    <Layers size={48} className="mx-auto mb-4 opacity-50"/>
                    <p>No programs found. Create a new program to group projects.</p>
                </div>
            )}
         </div>
      </div>
    );
  }

  // --- PROGRAM WORKSPACE VIEW ---
  return (
    <div className="h-full w-full flex flex-col bg-slate-100 animate-in fade-in duration-300">
        <div className="bg-white border-b border-slate-200 flex-shrink-0">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setSelectedProgramId(null)}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                        title="Back to Program List"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 leading-tight">{selectedProgram.name}</h1>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Program</span>
                            <span>{selectedProgram.manager}</span>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2">
                    <div className="text-right mr-2">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">Health</p>
                        <StatusBadge status={selectedProgram.health} variant="health"/>
                    </div>
                </div>
            </div>
            
            <ModuleNavigation 
                groups={navGroups}
                activeGroup={activeGroup}
                activeItem={activeView}
                onGroupChange={handleGroupChange}
                onItemChange={setActiveView}
            />
        </div>

        <div className="flex-1 overflow-hidden relative">
            {renderContent()}
        </div>
    </div>
  );
};

export default ProgramManager;
