import { useState, useMemo } from 'react';
import { useProjectState } from './useProjectState';
import { LayoutDashboard, FileText, BadgeCheck, ClipboardList, Bug, Truck } from 'lucide-react';

export const useQualityData = (projectId: string) => {
  const [activeView, setActiveView] = useState('dashboard');
  const { project, qualityProfile, qualityReports } = useProjectState(projectId);

  const navItems = useMemo(() => [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'plan', label: 'Plan', icon: FileText },
    { id: 'standards', label: 'Standards', icon: BadgeCheck },
    { id: 'control', label: 'Control Log', icon: ClipboardList },
    { id: 'defects', label: 'Defects', icon: Bug },
    { id: 'supplier', label: 'Supplier', icon: Truck },
  ], []);

  return {
    project,
    activeView,
    qualityProfile,
    qualityReports,
    setActiveView,
    navItems,
  };
};
