

import { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
// FIX: Corrected import path
import { Task, TaskStatus, Project } from '../../types/index';

export interface EnrichedTask extends Task {
  projectName: string;
  projectCode: string;
  projectId: string;
}

export const useMyTasksLogic = () => {
  const { state } = useData();
  const { user } = useAuth();

  const myTasks = useMemo(() => {
    if (!user) return [];

    const tasks: EnrichedTask[] = [];
    state.projects.forEach(project => {
        project.tasks.forEach(task => {
            // Match assignments to the logged-in user's ID
            const isAssigned = task.assignments.some(a => a.resourceId === user.id);
            // Also include if the user is the project manager and the task is critical/delayed (optional business rule)
            const isManager = project.managerId === user.id;
            
            if ((isAssigned || (isManager && task.critical)) && task.status !== TaskStatus.COMPLETED) { 
                tasks.push({
                    ...task,
                    projectName: project.name,
                    projectCode: project.code,
                    projectId: project.id
                });
            }
        });
    });
    return tasks;
  }, [state.projects, user]);

  return {
    myTasks,
    isEmpty: myTasks.length === 0,
    user
  };
};