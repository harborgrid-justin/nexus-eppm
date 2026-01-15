import { useMemo, useTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Users, BarChart2, Sliders, ScrollText, Box } from 'lucide-react';
import { NavGroup } from '../../components/common/ModuleNavigation';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';

export const useResourceManagementLogic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { assignedResources } = useProjectWorkspace();

  const activeGroup = searchParams.get('resGroup') || 'planning';
  const activeView = searchParams.get('view') || 'plan';
  
  const overAllocatedResources = useMemo(() => {
    return (assignedResources || []).filter(r => r.allocated > r.capacity);
  }, [assignedResources]);


  const navStructure: NavGroup[] = useMemo(() => [
    { id: 'planning', label: 'Planning & Setup', items: [
      { id: 'plan', label: 'Resource Plan', icon: FileText },
      { id: 'charter', label: 'Team Charter', icon: ScrollText },
      { id: 'pool', label: 'Resource Pool', icon: Users },
    ]},
    { id: 'analysis', label: 'Analysis & Optimization', items: [
      { id: 'capacity', label: 'Capacity Planning', icon: BarChart2 },
      { id: 'histogram', label: 'Resource Histogram', icon: BarChart2 },
      { id: 'leveling', label: 'Leveling', icon: Sliders },
    ]},
    { id: 'physical', label: 'Physical Resources', items: [
      { id: 'physical_tracking', label: 'Materials & Equipment', icon: Box }
    ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navStructure.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      startTransition(() => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('resGroup', groupId);
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
      activeGroup,
      activeView,
      isPending,
      navStructure,
      handleGroupChange,
      handleViewChange,
      overAllocatedResources
  };
};