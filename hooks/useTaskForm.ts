
import { useState, useMemo, useEffect } from 'react';
import { Task, Project, TaskStatus } from '../types/index';
import { useData } from '../context/DataContext';
import { canCompleteTask } from '../utils/integrations/quality';

export const useTaskForm = (task: Task, project: Project, onClose: () => void) => {
  const { state, dispatch, getActivityCodesForProject } = useData();
  const [localTask, setLocalTask] = useState<Task>(JSON.parse(JSON.stringify(task))); // Deep clone for local edits

  const applicableCodes = useMemo(() => 
    getActivityCodesForProject(project.id), 
  [getActivityCodesForProject, project.id]);

  const linkedIssues = useMemo(() => 
    localTask.issueIds ? state.issues.filter(i => localTask.issueIds?.includes(i.id)) : [], 
  [state.issues, localTask.issueIds]);

  const linkedExpenses = useMemo(() => 
    localTask.expenseIds ? state.expenses.filter(e => localTask.expenseIds?.includes(e.id)) : [], 
  [state.expenses, localTask.expenseIds]);

  const projectNCRs = useMemo(() => 
    state.nonConformanceReports.filter(n => n.projectId === project.id), 
  [state.nonConformanceReports, project.id]);

  const { canComplete, blockingNCRs } = useMemo(() => 
    canCompleteTask(localTask.id, projectNCRs), 
  [localTask.id, projectNCRs]);

  const linkedRisks = useMemo(() => 
    state.risks.filter(r => r.linkedTaskId === localTask.id), 
  [state.risks, localTask.id]);

  const updateField = <K extends keyof Task>(key: K, value: Task[K]) => {
    setLocalTask(prev => ({ ...prev, [key]: value }));
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (newStatus === TaskStatus.COMPLETED && !canComplete) {
        alert(`Cannot complete task. There are ${blockingNCRs.length} blocking Non-Conformance Reports.`);
        return;
    }
    updateField('status', newStatus);
    if (newStatus === TaskStatus.COMPLETED) {
        updateField('progress', 100);
    }
  };

  const saveChanges = () => {
    dispatch({ type: 'TASK_UPDATE', payload: { projectId: project.id, task: localTask } });
    onClose();
  };

  return {
    localTask,
    updateField,
    handleStatusChange,
    saveChanges,
    applicableCodes,
    linkedIssues,
    linkedExpenses,
    linkedRisks,
    canComplete,
    blockingNCRs,
    expenseCategories: state.expenseCategories // expose strictly what is needed
  };
};
