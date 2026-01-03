
import { useState } from 'react';

export const useTeamWorkspaceLogic = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'timesheet'>('tasks');

  return {
    activeTab,
    setActiveTab
  };
};
