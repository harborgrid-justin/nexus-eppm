
import { useState, useTransition, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { 
  Settings, Users, Shield, Bell, CreditCard, History, 
  Layers, MapPin, Calendar, UserCog, Tag, Edit3, 
  FileWarning, Receipt, Banknote, GitPullRequest, Terminal 
} from 'lucide-react';
import { NavGroup } from '../../components/common/ModuleNavigation';

export const useAdminSettingsLogic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { dispatch } = useData();

  const activeGroup = searchParams.get('group') || 'system';
  const activeView = searchParams.get('view') || 'general';

  const [isApplying, setIsApplying] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleGlobalApply = () => {
      setIsApplying(true);
      dispatch({ type: 'GOVERNANCE_SYNC_PARAMETERS', payload: {} });
      setTimeout(() => {
          setIsApplying(false);
      }, 1500);
  };
  
  const handleResetSystem = () => {
      if (confirm("DANGER: This will wipe all local data and restore the factory demo dataset. This action cannot be undone. Are you sure?")) {
          dispatch({ type: 'RESET_SYSTEM' });
          alert("System reset complete.");
      }
  };

  const navGroups: NavGroup[] = useMemo(() => [
      { id: 'system', label: 'System & Security', items: [
          { id: 'general', label: 'General Settings', icon: Settings },
          { id: 'users', label: 'Users & Roles', icon: Users },
          { id: 'security', label: 'Security Policy', icon: Shield },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'billing', label: 'Billing & Licensing', icon: CreditCard },
          { id: 'audit', label: 'Audit Log', icon: History },
      ]},
      { id: 'enterprise', label: 'Enterprise Data', items: [
          { id: 'epsobs', label: 'EPS & OBS Structure', icon: Layers },
          { id: 'locations', label: 'Global Locations', icon: MapPin },
          { id: 'calendars', label: 'Enterprise Calendars', icon: Calendar },
          { id: 'resources', label: 'Resource Taxonomy', icon: UserCog },
      ]},
      { id: 'dictionaries', label: 'Dictionaries', items: [
          { id: 'activityCodes', label: 'Activity Codes', icon: Tag },
          { id: 'udfs', label: 'User Defined Fields', icon: Edit3 },
          { id: 'issueCodes', label: 'Issue Codes', icon: FileWarning },
          { id: 'expenseCategories', label: 'Expense Categories', icon: Receipt },
          { id: 'fundingSources', label: 'Funding Sources', icon: Banknote },
      ]},
      { id: 'automation', label: 'Automation', items: [
          { id: 'workflows', label: 'Workflows', icon: GitPullRequest },
          { id: 'globalChange', label: 'Global Change', icon: Terminal },
      ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navGroups.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      startTransition(() => {
        setSearchParams({ group: groupId, view: newGroup.items[0].id });
      });
    }
  };

  const handleItemChange = (viewId: string) => {
    startTransition(() => {
        setSearchParams({ group: activeGroup, view: viewId });
    });
  };

  return {
      activeGroup,
      activeView,
      isApplying,
      isPending,
      navGroups,
      handleGlobalApply,
      handleGroupChange,
      handleItemChange,
      handleResetSystem
  };
};
