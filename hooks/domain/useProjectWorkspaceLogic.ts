
import { useMemo, useTransition } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useProjectState } from '../useProjectState';
import { 
  Briefcase, Sliders, GanttChartSquare, DollarSign, AlertTriangle, Users,
  MessageSquare, ShoppingCart, ShieldCheck, FileWarning, Folder, Activity,
  HardHat, History
} from 'lucide-react';
import { NavGroup } from '../../components/common/ModuleNavigation';

export const useProjectWorkspaceLogic = () => {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const projectData = useProjectState(projectId || null);
  
  const activeGroup = searchParams.get('group') || 'overview';
  const activeArea = searchParams.get('tab') || 'integration';
  const scheduleView = (searchParams.get('view') as 'gantt' | 'network') || 'gantt';
  
  const [isPending, startTransition] = useTransition();

  const navGroups: NavGroup[] = useMemo(() => [
    { id: 'overview', label: 'Overview', items: [
        { id: 'integration', label: 'Dashboard', icon: Briefcase }
    ] },
    { id: 'planning', label: 'Planning', items: [
        { id: 'scope', label: 'Scope', icon: Sliders },
        { id: 'schedule', label: 'Schedule', icon: GanttChartSquare },
        { id: 'cost', label: 'Cost', icon: DollarSign },
        { id: 'quality', label: 'Quality', icon: ShieldCheck },
    ]},
    { id: 'advanced', label: 'Advanced Tools', items: [
        { id: 'baseline', label: 'Baseline Manager', icon: History },
        { id: 'health', label: 'Logic Health', icon: Activity },
    ]},
    { id: 'execution', label: 'Execution', items: [
        { id: 'resources', label: 'Resources', icon: Users },
        { id: 'procurement', label: 'Procurement', icon: ShoppingCart },
        { id: 'documents', label: 'Docs', icon: Folder },
        { id: 'field', label: 'Field', icon: HardHat },
    ]},
    { id: 'monitoring', label: 'Control', items: [
        { id: 'risk', label: 'Risk', icon: AlertTriangle },
        { id: 'issues', label: 'Issues', icon: FileWarning },
        { id: 'stakeholder', label: 'Stakeholders', icon: Users },
        { id: 'communications', label: 'Comms', icon: MessageSquare },
    ]}
  ], []);
  
  const handleGroupChange = (groupId: string) => {
    const newGroup = navGroups.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      startTransition(() => {
        setSearchParams({ group: groupId, tab: newGroup.items[0].id });
      });
    }
  };

  const handleItemChange = (itemId: string) => {
      startTransition(() => {
          setSearchParams({ group: activeGroup, tab: itemId });
      });
  };

  const setScheduleView = (view: 'gantt' | 'network') => {
      startTransition(() => {
          const newParams = new URLSearchParams(searchParams);
          newParams.set('view', view);
          setSearchParams(newParams);
      });
  };

  return {
      projectData,
      activeGroup,
      activeArea,
      scheduleView,
      setScheduleView,
      isPending,
      navGroups,
      handleGroupChange,
      handleItemChange
  };
};
