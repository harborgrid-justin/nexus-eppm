
import { useMemo, useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutDashboard, FileText, List, Layers } from 'lucide-react';
import { NavGroup } from '../../components/common/ModuleNavigation';

export const useScopeManagementLogic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeGroup = searchParams.get('scopeGroup') || 'overview';
  const activeView = searchParams.get('view') || 'dashboard';

  const navStructure: NavGroup[] = useMemo(() => [
    { id: 'overview', label: 'Overview', items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]},
    { id: 'definition', label: 'Definition', items: [
      { id: 'statement', label: 'Scope Statement', icon: FileText },
      { id: 'requirements', label: 'Requirements (RTM)', icon: List },
    ]},
    { id: 'breakdown', label: 'Breakdown', items: [
      { id: 'wbs', label: 'Work Breakdown Structure', icon: Layers },
    ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navStructure.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      startTransition(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('scopeGroup', groupId);
        newParams.set('view', newGroup.items[0].id);
        setSearchParams(newParams);
      });
    }
  };

  const handleViewChange = (viewId: string) => {
      startTransition(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('view', viewId);
        setSearchParams(newParams);
      });
  };

  return {
      activeGroup, activeView, isPending, navStructure,
      handleGroupChange, handleViewChange
  };
};
