
import { Project, TaskStatus } from '../types/project';
import { BudgetLineItem, ChangeOrder } from '../types/finance';
import { PurchaseOrder } from '../types/procurement';
import { Risk } from '../types/risk';
import { QualityReport, NonConformanceReport } from '../types/quality';
import { Stakeholder, CommunicationLog } from '../types/project_subtypes';
import { DataState } from '../types/index';
import { MOCK_RISK_PLAN } from '../constants/index';
import { calculateProjectProgress } from './calculations';
import { calculateCommittedCost, checkFundingSolvency, calculateEVM } from './integrations/cost';
import { calculateRiskExposure } from './integrations/risk';

// --- Pure Calculation Functions ---

export const calculateProjectSummary = (project: Project) => {
    if (!project) return null;
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    const overallProgress = calculateProjectProgress(project);
    return { totalTasks, completedTasks, overallProgress };
};

export const calculateProjectFinancials = (
    project: Project, 
    budgetItems: BudgetLineItem[], 
    changeOrders: ChangeOrder[],
    purchaseOrders: PurchaseOrder[]
) => {
    if (!project) return null;
    const totalPlanned = budgetItems.reduce((acc, item) => acc + item.planned, 0);
    const approvedCO = changeOrders.filter(co => co.status === 'Approved').reduce((acc, co) => acc + co.amount, 0);
    const revisedBudget = (project.originalBudget || 0) + approvedCO;
    const totalCommitted = budgetItems.reduce((acc, item) => acc + calculateCommittedCost(purchaseOrders, item.id), 0);
    const totalActual = budgetItems.reduce((acc, item) => acc + item.actual, 0);
    const pendingCO = changeOrders.filter(co => co.status === 'Pending Approval').reduce((acc, co) => acc + co.amount, 0);
    const budgetUtilization = revisedBudget > 0 ? ((totalActual + totalCommitted) / revisedBudget) * 100 : 0;
    const totalFunding = project.funding?.reduce((sum, f) => sum + f.amount, 0) || 0;
    const solvency = checkFundingSolvency(totalActual, totalCommitted, totalFunding);
    const evm = calculateEVM(project, budgetItems);

    return { totalPlanned, revisedBudget, totalActual, totalCommitted, approvedCOAmount: approvedCO, pendingCOAmount: pendingCO, variance: revisedBudget - (totalActual + totalCommitted), budgetUtilization, evm, solvency };
};

export const calculateProjectRisks = (risks: Risk[]) => {
    const highImpactRisks = risks.filter(r => r.impact === 'High').length;
    const openRisks = risks.filter(r => r.status === 'Open').length;
    const exposure = calculateRiskExposure(risks);
    return { totalRisks: risks.length, highImpactRisks, openRisks, exposure };
};

export const calculateProjectQuality = (qualityReports: QualityReport[], ncrs: NonConformanceReport[]) => {
    const passRate = qualityReports.length > 0 ? (qualityReports.filter(r => r.status === 'Pass').length / qualityReports.length) * 100 : 100;
    const openDefects = ncrs.filter(d => d.status === 'Open').length;
    return { passRate, openDefects, totalDefects: ncrs.length, totalReports: qualityReports.length, failedReports: qualityReports.filter(r => r.status === 'Fail').length };
};

// --- Full Data Aggregators ---

export const calculatePortfolioSummary = (projects: Project[]) => {
    const totalProjects = projects.length;
    const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
    const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
    const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
    const healthCounts = {
      good: projects.filter(p => p.health === 'Good').length,
      warning: projects.filter(p => p.health === 'Warning').length,
      critical: projects.filter(p => p.health === 'Critical').length,
    };
    return { totalProjects, totalBudget, totalSpent, budgetUtilization, healthCounts };
};

export const calculateProjectData = (project: Project, state: DataState) => {
    const risks = state.risks.filter(r => r.projectId === project.id);
    const issues = state.issues.filter(i => i.projectId === project.id);
    const budgetItems = state.budgetItems.filter(b => b.projectId === project.id);
    const changeOrders = state.changeOrders.filter(c => c.projectId === project.id);
    const purchaseOrders = state.purchaseOrders.filter(po => po.projectId === project.id);
    const qualityReports = state.qualityReports.filter(q => q.projectId === project.id);
    const nonConformanceReports = state.nonConformanceReports.filter(n => n.projectId === project.id);
    const communicationLogs = state.communicationLogs.filter(c => c.projectId === project.id);
    const stakeholders = state.stakeholders.filter(s => s.projectId === project.id);
    const assignedResources = state.resources.filter(r => 
        project.tasks.some(t => t.assignments.some(a => a.resourceId === r.id))
    );

    return {
        project,
        risks,
        issues,
        budgetItems,
        changeOrders,
        purchaseOrders,
        qualityReports,
        nonConformanceReports,
        communicationLogs,
        assignedResources,
        stakeholders,
        summary: calculateProjectSummary(project),
        financials: calculateProjectFinancials(project, budgetItems, changeOrders, purchaseOrders),
        riskProfile: calculateProjectRisks(risks),
        qualityProfile: calculateProjectQuality(qualityReports, nonConformanceReports),
        riskPlan: MOCK_RISK_PLAN
    };
};
