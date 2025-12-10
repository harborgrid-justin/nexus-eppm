
import { useMemo } from 'react';
import { useData } from '../context/DataContext';
import { TaskStatus } from '../types';

export const useProjectState = (projectId: string | null) => {
  const { state, getRiskPlan } = useData();

  const project = useMemo(() => {
    return state.projects.find(p => p.id === projectId);
  }, [state.projects, projectId]);

  const riskPlan = useMemo(() => {
    return projectId ? getRiskPlan(projectId) : undefined;
  }, [getRiskPlan, projectId]);

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

  const qualityReports = useMemo(() => {
    return state.qualityReports.filter(q => q.projectId === projectId);
  }, [state.qualityReports, projectId]);

  const communicationLogs = useMemo(() => {
    return state.communicationLogs.filter(c => c.projectId === projectId);
  }, [state.communicationLogs, projectId]);

  const assignedResources = useMemo(() => {
    if (!project) return [];
    const resourceIds = new Set(project.tasks.flatMap(t => t.assignments.map(a => a.resourceId)));
    return state.resources.filter(r => resourceIds.has(r.id));
  }, [project, state.resources]);

  const nonConformanceReports = useMemo(() => {
    return state.nonConformanceReports.filter(n => n.projectId === projectId);
  }, [state.nonConformanceReports, projectId]);


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

    const revisedBudget = (project?.originalBudget || 0) + approvedCOAmount;
    const budgetUtilization = revisedBudget > 0 ? (totalActual / revisedBudget) * 100 : 0;

    return {
      totalPlanned,
      totalActual,
      variance: revisedBudget - totalActual,
      approvedCOAmount,
      pendingCOAmount,
      revisedBudget,
      budgetUtilization,
    };
  }, [budgetItems, changeOrders, project?.originalBudget]);
  
  const riskProfile = useMemo(() => {
    const highImpactRisks = risks.filter(r => r.impact === 'High' || r.probability === 'High').length;
    const openRisks = risks.filter(r => r.status === 'Open').length;
    
    return {
      totalRisks: risks.length,
      highImpactRisks,
      openRisks,
    };
  }, [risks]);
  
  const qualityProfile = useMemo(() => {
    const totalReports = qualityReports.length;
    const failedReports = qualityReports.filter(r => r.status === 'Fail').length;
    const passRate = totalReports > 0 ? ((totalReports - failedReports) / totalReports) * 100 : 100;
    
    // Derived defects from non-conformance reports
    const openDefects = nonConformanceReports.filter(d => d.status === 'Open' || d.status === 'In Progress').length;
    const totalDefects = nonConformanceReports.length;

    return {
      totalReports,
      failedReports,
      passRate,
      openDefects,
      totalDefects
    };
  }, [qualityReports, nonConformanceReports]);


  return {
    project,
    summary,
    financials,
    riskProfile,
    qualityProfile,
    riskPlan,
    budgetItems, 
    changeOrders,
    risks,
    stakeholders,
    procurement,
    qualityReports,
    communicationLogs,
    assignedResources,
    nonConformanceReports,
  };
};
