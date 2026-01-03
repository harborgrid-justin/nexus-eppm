
import { useState, useMemo, useEffect, useTransition } from 'react';
import { useData } from '../../context/DataContext';
import { 
    LayoutDashboard, Target, Star, Map, 
    Sliders, TrendingUp, Users, Truck, ShieldAlert, AlertOctagon, 
    RefreshCw, ShieldCheck, Gavel, Flag, Server, Scale 
} from 'lucide-react';
import { NavGroup } from '../../components/common/ModuleNavigation';

export const useProgramManagerLogic = (forcedProgramId?: string) => {
  const { state } = useData();
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(forcedProgramId || null);
  const [activeGroup, setActiveGroup] = useState<string>('Overview');
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [isPending, startTransition] = useTransition();

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

  const handleSelectProgram = (id: string | null) => {
      setSelectedProgramId(id);
  };

  return {
      selectedProgramId,
      selectedProgram,
      activeGroup,
      activeView,
      isPending,
      navGroups,
      handleSelectProgram,
      handleGroupChange,
      handleItemChange
  };
};
