import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { TaskStatus } from '../types';

export const useProjectState = (projectId: string | null) => {
  const { state } = useData();

  const project = useMemo(() => {
    return state.projects.find(p => p.id === projectId);
  }, [state.projects, projectId]);

  const budgetItems = useMemo(() => {
     return state.budgetItems.filter(b => b.projectId === projectId);
  }, [state.budgetItems, projectId]);

  const changeOrders = useMemo(() => {
    return state.changeOrders.filter(c => c.projectId === projectId);
  }, [state.changeOrders, projectId]);

  const risks = useMemo(() => {
    return state.risks.filter(r => r.projectId === projectId);
  }, [state.risks, projectId]);

  const stakeholders = useMemo(() => {
    return state.stakeholders.filter(s => s.projectId === projectId);
  }, [state.stakeholders, projectId]);
  
  const procurement = useMemo(() => {
    return state.procurementPackages.filter(p => p.projectId === projectId);
  }, [state.procurementPackages, projectId]);

  // --- Derived State Calculations ---

  const summary = useMemo(() => {
    if (!project) return null;
    
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    const delayedTasks = project.tasks.filter(t => t.status === TaskStatus.DELAYED).length;
    
    const totalDuration = project.tasks.reduce((acc, t) => acc + t.duration, 0);
    const completedDuration = project.tasks.reduce((acc, t) => acc + (t.duration * (t.progress / 100)), 0);
    const overallProgress = totalDuration > 0 ? Math.round((completedDuration / totalDuration) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      delayedTasks,
      overallProgress,
    };
  }, [project]);

  const financials = useMemo(() => {
    const totalPlanned = budgetItems.reduce((acc, item) => acc + item.planned, 0);
    const totalActual = budgetItems.reduce((acc, item) => acc + item.actual, 0);
    
    const approvedCOAmount = changeOrders
      .filter(co => co.status === 'Approved')
      .reduce((acc, co) => acc + co.amount, 0);
      
    const pendingCOAmount = changeOrders
      .filter(co => co.status === 'Pending Approval')
      .reduce((acc, co) => acc + co.amount, 0);

    const revisedBudget = totalPlanned + approvedCOAmount;
    const budgetUtilization = revisedBudget > 0 ? (totalActual / revisedBudget) * 100 : 0;

    return {
      totalPlanned,
      totalActual,
      variance: totalPlanned - totalActual,
      approvedCOAmount,
      pendingCOAmount,
      revisedBudget,
      budgetUtilization,
    };
  }, [budgetItems, changeOrders]);
  
  const riskProfile = useMemo(() => {
    const highImpactRisks = risks.filter(r => r.impact === 'High' || r.probability === 'High').length;
    const openRisks = risks.filter(r => r.status === 'Open').length;
    
    return {
      totalRisks: risks.length,
      highImpactRisks,
      openRisks,
    };
  }, [risks]);


  return {
    project,
    summary,
    financials,
    riskProfile,
    budgetItems, 
    changeOrders,
    risks,
    stakeholders,
    procurement,
  };
};