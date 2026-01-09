
import { useState, useTransition, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { NavGroup } from '../../components/common/ModuleNavigation';
import { 
    LayoutDashboard, Layers, Leaf, BookOpen, Map as MapIcon, 
    ListOrdered, PieChart, TrendingUp, Star, BarChart2, 
    MessageSquare, Gavel, RefreshCw, ShieldAlert, Globe, Target
} from 'lucide-react';

export const usePortfolioManagerLogic = (forcedProgramId?: string) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [internalProgramId, setInternalProgramId] = useState<string | null>(null);
  
  // If forcedProgramId is provided, it's a controlled component. Use that ID.
  const selectedProgramId = forcedProgramId !== undefined ? forcedProgramId : internalProgramId;

  // Use URL params for state if not in forced mode, otherwise default
  const activeGroup = forcedProgramId ? 'Overview' : (searchParams.get('group') || 'dashboards');
  const activeTab = forcedProgramId ? 'dashboard' : (searchParams.get('view') || 'overview');
  
  const [isPending, startTransition] = useTransition();

  const navGroups: NavGroup[] = useMemo(() => [
    { id: 'dashboards', label: 'Dashboards', items: [
      { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard },
      { id: 'map', label: 'Geospatial Map', icon: Globe },
      { id: 'programs', label: 'Program Portfolio', icon: Layers },
      { id: 'esg', label: 'ESG & Compliance', icon: Leaf }
    ]},
    { id: 'strategy', label: 'Strategy & Selection', items: [
      { id: 'framework', label: 'Strategic Framework', icon: BookOpen },
      { id: 'alignment', label: 'Alignment Board', icon: Target },
      { id: 'roadmap', label: 'Strategic Roadmap', icon: MapIcon },
      { id: 'prioritization', label: 'Prioritization', icon: ListOrdered },
      { id: 'scenarios', label: 'Scenario Planning', icon: Layers },
      { id: 'balancing', label: 'Balancing', icon: PieChart },
    ]},
    { id: 'performance', label: 'Performance', items: [
      { id: 'financials', label: 'Financial Management', icon: TrendingUp },
      { id: 'value', label: 'Value & Benefits', icon: Star },
      { id: 'capacity', label: 'Resource Capacity', icon: BarChart2 },
      { id: 'communications', label: 'Communications', icon: MessageSquare },
      { id: 'governance', label: 'Governance Board', icon: Gavel },
      { id: 'optimization', label: 'Review & Optimize', icon: RefreshCw },
    ]},
    { id: 'monitoring', label: 'Monitoring & Control', items: [
      { id: 'risks', label: 'Portfolio Risks', icon: ShieldAlert },
    ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navGroups.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      startTransition(() => {
        if (!forcedProgramId) {
            setSearchParams({ group: groupId, view: newGroup.items[0].id });
            setInternalProgramId(null);
        }
      });
    }
  };

  const handleItemChange = (tabId: string) => {
    startTransition(() => {
        if (!forcedProgramId) {
            setSearchParams({ group: activeGroup, view: tabId });
            setInternalProgramId(null);
        }
    });
  };

  const handleProgramDrillDown = (programId: string) => {
    startTransition(() => {
      setInternalProgramId(programId);
    });
  };

  const clearDrillDown = () => {
    startTransition(() => {
        setInternalProgramId(null);
    });
  };

  return {
    activeGroup,
    activeTab,
    drilledProgramId: selectedProgramId,
    isPending,
    navGroups,
    handleGroupChange,
    handleItemChange,
    handleProgramDrillDown,
    clearDrillDown
  };
};
