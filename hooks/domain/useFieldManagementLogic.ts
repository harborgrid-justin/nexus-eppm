
import { useMemo, useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clipboard, AlertTriangle, CheckSquare } from 'lucide-react';
import { NavGroup } from '../../components/common/ModuleNavigation';

export const useFieldManagementLogic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeGroup = searchParams.get('fieldGroup') || 'daily';
  const activeView = searchParams.get('view') || 'logs';

  const navGroups: NavGroup[] = useMemo(() => [
    { id: 'daily', label: 'Daily Reporting', items: [
      { id: 'logs', label: 'Daily Logs', icon: Clipboard }
    ]},
    { id: 'safety', label: 'Safety (HSE)', items: [
      { id: 'incidents', label: 'Incident Log', icon: AlertTriangle }
    ]},
    { id: 'inspections', label: 'Field QA', items: [
      { id: 'punchlist', label: 'Punch List', icon: CheckSquare }
    ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navGroups.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      startTransition(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('fieldGroup', groupId);
        newParams.set('view', newGroup.items[0].id);
        setSearchParams(newParams);
      });
    }
  };

  const handleItemChange = (itemId: string) => {
      startTransition(() => {
          const newParams = new URLSearchParams(searchParams);
          newParams.set('view', itemId);
          setSearchParams(newParams);
      });
  };

  return {
      activeGroup, activeView, isPending, navGroups,
      handleGroupChange, handleItemChange
  };
};
