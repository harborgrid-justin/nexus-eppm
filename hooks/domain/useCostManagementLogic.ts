
import { useMemo, useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
    LayoutDashboard, FileText, Calculator, BarChart2, ShieldAlert, 
    Landmark, Banknote, ShoppingCart, Receipt, FileDiff, MessageSquare 
} from 'lucide-react';
import { NavGroup } from '../../components/common/ModuleNavigation';

export const useCostManagementLogic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const activeGroup = searchParams.get('costGroup') || 'overview';
  const activeView = searchParams.get('view') || 'dashboard';

  const navGroups: NavGroup[] = useMemo(() => [
    { id: 'overview', label: 'Overview', items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]},
    { id: 'planning', label: 'Planning & Setup', items: [
        { id: 'plan', label: 'Cost Plan', icon: FileText },
        { id: 'estimating', label: 'Estimating', icon: Calculator },
        { id: 'cbs', label: 'Budget View', icon: BarChart2 },
        { id: 'reserves', label: 'Reserve Analysis', icon: ShieldAlert },
    ]},
    { id: 'control', label: 'Control & Execution', items: [
        { id: 'budgetLog', label: 'Budget Log', icon: Landmark },
        { id: 'funding', label: 'Funding & Reconciliation', icon: Banknote },
        { id: 'procurement', label: 'Procurement (Fin)', icon: ShoppingCart },
        { id: 'expenses', label: 'Expenses', icon: Receipt },
        { id: 'changes', label: 'Change Orders', icon: FileDiff },
    ]},
    { id: 'monitoring', label: 'Monitoring', items: [
        { id: 'evm', label: 'Earned Value', icon: BarChart2 },
        { id: 'communications', label: 'Communications', icon: MessageSquare },
    ]},
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navGroups.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      startTransition(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('costGroup', groupId);
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
