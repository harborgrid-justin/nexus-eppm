
import { useMemo, useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutDashboard, List, Sigma, BarChart2, ShieldAlert } from 'lucide-react';
import { NavGroup } from '../../components/common/ModuleNavigation';

export const useRiskManagementLogic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeGroup = searchParams.get('riskGroup') || 'enterprise';
  const activeView = searchParams.get('view') || 'dashboard';

  const navGroups: NavGroup[] = useMemo(() => [
    { id: 'enterprise', label: 'Enterprise & Portfolio', items: [
      { id: 'dashboard', label: 'Systemic Dashboard', icon: LayoutDashboard },
      { id: 'portfolio', label: 'Portfolio Risks', icon: ShieldAlert },
    ]},
    { id: 'analysis', label: 'Analysis & Aggregation', items: [
      { id: 'register', label: 'Global Risk Register', icon: List },
      { id: 'matrix', label: 'Global Heatmap', icon: Sigma },
      { id: 'quantitative', label: 'Quantitative Model', icon: BarChart2 },
    ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navGroups.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      startTransition(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('riskGroup', groupId);
        newParams.set('view', newGroup.items[0].id);
        setSearchParams(newParams);
      });
    }
  };

  const handleItemChange = (viewId: string) => {
    startTransition(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('view', viewId);
        setSearchParams(newParams);
    });
  };

  return {
    activeGroup,
    activeView,
    isPending,
    navGroups,
    handleGroupChange,
    handleItemChange
  };
};
