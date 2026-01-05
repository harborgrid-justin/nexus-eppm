
import { useMemo, useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutDashboard, List, Sigma, FileText, BarChart2, GitBranch } from 'lucide-react';
import { NavGroup } from '../../components/common/ModuleNavigation';

export const useProjectRiskManagerLogic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeGroup = searchParams.get('riskGroup') || 'monitoring';
  const activeView = searchParams.get('view') || 'dashboard';

  const navGroups: NavGroup[] = useMemo(() => [
    { id: 'monitoring', label: 'Monitoring & Control', items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'register', label: 'Risk Register', icon: List },
    ]},
    { id: 'analysis', label: 'Analysis', items: [
      { id: 'matrix', label: 'P-I Matrix', icon: Sigma },
      { id: 'quantitative', label: 'Quantitative', icon: BarChart2 },
    ]},
    { id: 'planning', label: 'Planning', items: [
        { id: 'plan', label: 'Risk Plan', icon: FileText },
        { id: 'rbs', label: 'RBS', icon: GitBranch },
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
