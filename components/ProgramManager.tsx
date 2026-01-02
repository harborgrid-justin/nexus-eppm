
import React, { useState, useMemo, useEffect, useTransition } from 'react';
import { useData } from '../context/DataContext';
import { 
  LayoutDashboard, Target, Star, Map, 
  Sliders, TrendingUp, Users, ShieldAlert, Flag, ShieldCheck, 
  Server, Scale, AlertOctagon, RefreshCw, Truck, Layers, Loader2, Gavel, Briefcase
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ModuleNavigation, NavGroup } from './common/ModuleNavigation';
import { StatusBadge } from './common/StatusBadge';
import { PageHeader } from './common/PageHeader';
import ProgramsRootDashboard from './program/ProgramsRootDashboard';
import { getProgramModule } from './program/programModuleHelper';
import { ErrorBoundary } from './ErrorBoundary';

interface ProgramManagerProps {
    forcedProgramId?: string;
}

const ProgramManager: React.FC<ProgramManagerProps> = ({ forcedProgramId }) => {
  const { state } = useData();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(forcedProgramId || null);
  const [activeGroup, setActiveGroup] = useState<string>('Overview');
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isPending, startTransition] = useTransition();
  const theme = useTheme();

  useEffect(() => {
    if (forcedProgramId) setSelectedProgramId(forcedProgramId);
  }, [forcedProgramId]);

  const selectedProgram = state.programs.find(p => p.id === selectedProgramId);

  const navGroups: NavGroup[] = useMemo(() => [
    { id: 'Overview', label: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
    { id: 'Strategy', label: 'Strategy & Value', items: [
        { id: 'strategy', label: 'Strategy', icon: Target }, { id: 'benefits', label: 'Benefits', icon: Star },
        { id: 'roadmap', label: 'Roadmap', icon: Map }, { id: 'tradeoff', label: 'Trade-offs', icon: Scale },
    ]},
    { id: 'Governance', label: 'Governance', items: [
        { id: 'governance', label: 'Board', icon: Gavel }, { id: 'gates', label: 'Stage Gates', icon: Flag },
        { id: 'architecture', label: 'Architecture', icon: Server },
    ]},
    { id: 'Execution', label: 'Execution', items: [
        { id: 'scope', label: 'Scope', icon: Sliders }, { id: 'financials', label: 'Financials', icon: TrendingUp },
        { id: 'resources', label: 'Resources', icon: Users }, { id: 'vendors', label: 'Vendors', icon: Truck },
    ]},
    { id: 'Control', label: 'Control', items: [
        { id: 'risks', label: 'Risks', icon: ShieldAlert }, { id: 'issues', label: 'Issues', icon: AlertOctagon },
        { id: 'change', label: 'Change', icon: RefreshCw }, { id: 'quality', label: 'Quality', icon: ShieldCheck },
    ]},
    { id: 'Engagement', label: 'Engagement', items: [
        { id: 'stakeholders', label: 'Stakeholders', icon: Users }, { id: 'closure', label: 'Closure', icon: Flag },
    ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navGroups.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      startTransition(() => {
        setActiveGroup(groupId);
        setActiveView(newGroup.items[0].id);
      });
    }
  };

  const handleItemChange = (viewId: string) => {
      startTransition(() => {
          setActiveView(viewId);
      });
  };

  // If no program selected, show list view
  if (!selectedProgram) {
    return (
        <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} flex flex-col h-full`}>
            <PageHeader 
                title="Program Portfolio" 
                subtitle="Strategic oversight of cross-functional initiatives."
                icon={Briefcase}
            />
            <div className={theme.layout.panelContainer}>
                <div className="flex-1 overflow-hidden">
                    <ProgramsRootDashboard onSelectProgram={setSelectedProgramId} />
                </div>
            </div>
        </div>
    );
  }

  // If used as a sub-component (forcedId), we skip the outer PageContainer to avoid nesting padding
  // If used as a standalone page (user clicked from root list), we wrap it
  
  const ModuleComponent = getProgramModule(activeView);
  
  const content = (
    <div className={`h-full flex flex-col ${theme.colors.background}`}>
         {/* Internal Header for Program Context if standalone */}
         {!forcedProgramId && (
             <div className="px-6 pt-6 pb-2">
                <PageHeader 
                    title={selectedProgram.name} 
                    subtitle={`Program Manager: ${selectedProgram.managerId} • ${selectedProgram.category}`}
                    icon={Layers}
                    actions={
                        <div className="flex items-center gap-2">
                             <StatusBadge status={selectedProgram.health} variant="health"/>
                             <button onClick={() => setSelectedProgramId(null)} className="text-sm text-slate-500 hover:text-slate-800 underline ml-4">Back to List</button>
                        </div>
                    }
                />
             </div>
         )}
         
         {/* Navigation Panel */}
         <div className={theme.layout.panelContainer}>
            <div className={`flex-shrink-0 z-10 rounded-t-xl overflow-hidden ${theme.layout.headerBorder} bg-slate-50/50`}>
                <ModuleNavigation 
                    groups={navGroups} 
                    activeGroup={activeGroup} 
                    activeItem={activeView} 
                    onGroupChange={handleGroupChange} 
                    onItemChange={handleItemChange} 
                    className="bg-transparent border-0 shadow-none"
                />
            </div>
            <div className={`flex-1 overflow-hidden relative transition-opacity duration-200 ${isPending ? 'opacity-70' : 'opacity-100'}`}>
                {isPending && <div className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center"><Loader2 className="animate-spin text-nexus-500" /></div>}
                <ErrorBoundary name={`Program: ${activeView}`}>
                    <ModuleComponent programId={selectedProgram.id} />
                </ErrorBoundary>
            </div>
         </div>
    </div>
  );

  if (forcedProgramId) return content;

  return (
      <div className={`${theme.layout.pageContainer} ${theme.layout.pagePadding} flex flex-col h-full`}>
          {content}
      </div>
  );
};
export default ProgramManager;
