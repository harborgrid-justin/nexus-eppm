import { useState, useMemo } from 'react';
import { useProjectState } from './useProjectState';
import { useData } from '../context/DataContext';
import { Users, FileText, BarChart2, Sliders } from 'lucide-react';

export const useResourceData = (projectId: string) => {
  const { state } = useData();
  const { project } = useProjectState(projectId);
  const [activeView, setActiveView] = useState('pool');

  const navItems = useMemo(() => [
    { id: 'plan', label: 'Resource Plan', icon: FileText },
    { id: 'pool', label: 'Resource Pool', icon: Users },
    { id: 'capacity', label: 'Capacity Planning', icon: BarChart2 },
    { id: 'leveling', label: 'Leveling', icon: Sliders },
  ], []);

  const projectResources = useMemo(() => {
    if (!project) return [];
    const resourceIds = new Set(project.tasks.flatMap(t => t.assignments.map(a => a.resourceId)));
    return state.resources.filter(r => resourceIds.has(r.id));
  }, [project, state.resources]);

  const overAllocatedResources = useMemo(() => {
    return projectResources.filter(r => r.allocated > r.capacity);
  }, [projectResources]);

  return {
    project,
    activeView,
    projectResources,
    overAllocatedResources,
    setActiveView,
    navItems,
  };
};
