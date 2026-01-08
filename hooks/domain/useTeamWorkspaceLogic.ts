
import { useState } from 'react';

export const useTeamWorkspaceLogic = () => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'timesheet' | 'board'>('tasks');

  return {
    activeTab,
    setActiveTab
  };
};
