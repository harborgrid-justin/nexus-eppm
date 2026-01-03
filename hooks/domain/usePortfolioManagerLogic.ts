
import { useState, useTransition, useMemo } from 'react';
import { NavGroup } from '../../components/common/ModuleNavigation';
import { 
    LayoutDashboard, Layers, Leaf, BookOpen, Map as MapIcon, 
    ListOrdered, PieChart, TrendingUp, Star, BarChart2, 
    MessageSquare, Gavel, RefreshCw, ShieldAlert 
} from 'lucide-react';

export const usePortfolioManagerLogic = () => {
  const [activeGroup, setActiveGroup] = useState('dashboards');
  const [activeTab, setActiveTab] = useState('overview');
  const [drilledProgramId, setDrilledProgramId] = useState<string | null>(null);
  
  const [isPending, startTransition] = useTransition();

  const navGroups: NavGroup[] = useMemo(() => [
    { id: 'dashboards', label: 'Dashboards', items: [
      { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard },
      { id: 'programs', label: 'Program Portfolio', icon: Layers },
      { id: 'esg', label: 'ESG & Compliance', icon: Leaf }
    ]},
    { id: 'strategy', label: 'Strategy & Selection', items: [
      { id: 'framework', label: 'Strategic Framework', icon: BookOpen },
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
        setActiveGroup(groupId);
        setActiveTab(newGroup.items[0].id);
        setDrilledProgramId(null); 
      });
    }
  };

  const handleItemChange = (tabId: string) => {
    startTransition(() => {
        setActiveTab(tabId);
        setDrilledProgramId(null);
    });
  };

  const handleProgramDrillDown = (programId: string) => {
    startTransition(() => {
      setDrilledProgramId(programId);
    });
  };

  const clearDrillDown = () => {
    startTransition(() => {
        setDrilledProgramId(null);
    });
  };

  return {
    activeGroup,
    activeTab,
    drilledProgramId,
    isPending,
    navGroups,
    handleGroupChange,
    handleItemChange,
    handleProgramDrillDown,
    clearDrillDown
  };
};
