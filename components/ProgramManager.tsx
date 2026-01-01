
import React, { useState, useMemo, useEffect, useTransition } from 'react';
import { useData } from '../context/DataContext';
import { 
  Briefcase, ArrowLeft, LayoutDashboard, Gavel, Target, Star, Map, 
  Sliders, TrendingUp, Users, ShieldAlert, Flag, ShieldCheck, 
  Server, Scale, AlertOctagon, RefreshCw, Truck, Layers, Loader2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { ModuleNavigation, NavGroup } from './common/ModuleNavigation';
import { StatusBadge } from './common/StatusBadge';
import ProgramsRootDashboard from './program/ProgramsRootDashboard';
import { getProgramModule } from './program/programModuleHelper';

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

  if (!selectedProgram) {
    return <ProgramsRootDashboard onSelectProgram={setSelectedProgramId} />;
  }

  const ModuleComponent = getProgramModule(activeView);

  return (
    <div className={`h-full w-full flex flex-col ${theme.colors.background} animate-in fade-in duration-300`}>
        <div className={`${theme.colors.surface} border-b ${theme.colors.border} flex-shrink-0`}>
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                    {!forcedProgramId && (
                        <button onClick={() => setSelectedProgramId(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><ArrowLeft size={20} /></button>
                    )}
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">{selectedProgram.name}</h1>
                        <div className="flex items-center gap-2 text-xs text-slate-500"><span className="bg-slate-100 px-1.5 py-0.5 rounded border">Program</span><span>{selectedProgram.managerId}</span></div>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2">
                    <div className="text-right mr-2"><p className="text-[10px] uppercase font-bold">Health</p><StatusBadge status={selectedProgram.health} variant="health"/></div>
                </div>
            </div>
            <ModuleNavigation groups={navGroups} activeGroup={activeGroup} activeItem={activeView} onGroupChange={handleGroupChange} onItemChange={(view) => startTransition(() => setActiveView(view))} />
        </div>
        <div className="flex-1 overflow-hidden relative">
            {isPending && <div className="absolute inset-0 z-10 bg-white/50 flex items-center justify-center"><Loader2 className="animate-spin text-nexus-500" /></div>}
            <ModuleComponent programId={selectedProgram.id} />
        </div>
    </div>
  );
};

export default ProgramManager;
