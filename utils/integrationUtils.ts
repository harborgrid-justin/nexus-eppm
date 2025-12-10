import { 
    Project, BudgetLineItem, Risk, PurchaseOrder, 
    NonConformanceReport, Resource, Issue
} from '../types';
import { getDaysDiff, calculateProjectProgress } from './calculations';

/**
 * OPPORTUNITY 1: Schedule & Cost (EVM Integration)
 * Calculates Earned Value Metrics based on Task Progress and assigned Budget.
 */
export const calculateEVM = (
    project: Project, 
    budgetItems: BudgetLineItem[]
): { pv: number, ev: number, ac: number, spi: number, cpi: number } => {
    
    const today = new Date();
    const projectStart = new Date(project.startDate);
    const projectEnd = new Date(project.endDate);

    if(projectStart > today) {
        return { pv: 0, ev: 0, ac: project.spent, spi: 1, cpi: 1 };
    }
    
    // 1. Calculate Planned Value (PV)
    // In a real system, this uses time-phased budget. Here we approximate linearly.
    const totalDuration = getDaysDiff(projectStart, projectEnd);
    const elapsed = getDaysDiff(projectStart, today);
    const percentTime = totalDuration > 0 ? Math.min(1, Math.max(0, elapsed / totalDuration)) : 0;
    
    const totalBudget = project.originalBudget;
    const pv = totalBudget * percentTime;

    // 2. Calculate Earned Value (EV)
    const overallProgress = calculateProjectProgress(project) / 100;
    const ev = totalBudget * overallProgress;

    // 3. Actual Cost (AC) from Project State
    const ac = project.spent;

    // 4. Indexes
    const spi = pv === 0 ? 1 : ev / pv;
    const cpi = ac === 0 ? 1 : ev / ac;

    return { pv, ev, ac, spi, cpi };
};

/**
 * OPPORTUNITY 4: Procurement & Cost (Committed Spend)
 * Aggregates Purchase Orders to calculate 'Committed Cost' for a budget line.
 */
export const calculateCommittedCost = (
    purchaseOrders: PurchaseOrder[], 
    budgetLineId: string | undefined
): number => {
    if(!budgetLineId) return 0;
    return purchaseOrders
        .filter(po => po.linkedBudgetLineItemId === budgetLineId && po.status !== 'Draft' && po.status !== 'Closed')
        .reduce((sum, po) => sum + po.amount, 0);
};

/**
 * OPPORTUNITY 7: Quality & Schedule (Gatekeeping)
 * Checks if a task can be marked as complete based on open NCRs.
 */
export const canCompleteTask = (
    taskId: string, 
    ncrs: NonConformanceReport[]
): { canComplete: boolean, blockingNCRs: NonConformanceReport[] } => {
    const blockingNCRs = ncrs.filter(ncr => 
        ncr.linkedDeliverable === taskId && 
        (ncr.status === 'Open' || ncr.status === 'In Progress') &&
        (ncr.severity === 'Critical' || ncr.severity === 'Major')
    );

    return {
        canComplete: blockingNCRs.length === 0,
        blockingNCRs
    };
};

/**
 * OPPORTUNITY 2: Resource & Cost (Labor Forecasting)
 * Calculates the 'Actual Cost' contribution of a task based on resource assignments and rates.
 */
export const calculateTaskLaborCost = (task: { duration: number, assignments: { resourceId: string, units: number }[] }, resources: Resource[]): number => {
    let cost = 0;
    task.assignments.forEach(assign => {
        const resource = resources.find(r => r.id === assign.resourceId);
        if (resource && resource.hourlyRate) {
            // Formula: (Duration (days) * 8 hours * (Units/100)) * Hourly Rate
            const hours = task.duration * 8 * (assign.units / 100);
            cost += hours * resource.hourlyRate;
        }
    });
    return cost;
};

/**
 * OPPORTUNITY 6: Risk & Cost (Contingency Drawdown)
 * Calculates how much risk exposure exists vs available contingency budget.
 */
export const calculateRiskExposure = (risks: Risk[]): number => {
    return risks
        .filter(r => r.status === 'Open')
        .reduce((total, r) => {
            // Expected Monetary Value (EMV) = Probability % * Impact Cost
            // Mapping 1-5 scale to % approximation for demo purposes
            const probMap = [0, 0.1, 0.3, 0.5, 0.7, 0.9]; 
            const probFactor = probMap[r.probabilityValue] || 0;
            
            const estimatedImpact = (r.responseActions.reduce((sum, act) => sum + (act.costImpact || 0), 0)) || (r.impactValue * 10000); 
            
            return total + (estimatedImpact * probFactor);
        }, 0);
};

/**
 * OPPORTUNITY 15: Funding & Cost (Cash Flow Solvency)
 * Checks if total spending + commitments exceeds available funding.
 */
export const checkFundingSolvency = (
    actualCost: number, 
    committedCost: number, 
    totalFunding: number
): { isSolvent: boolean, remaining: number } => {
    const totalObligation = actualCost + committedCost;
    return {
        isSolvent: totalObligation <= totalFunding,
        remaining: totalFunding - totalObligation
    };
};

/**
 * OPPORTUNITY 5: Risk & Schedule (Buffer Injection)
 * Identifies tasks that need schedule buffers based on risk association.
 */
export const identifyRiskyTasks = (
    tasks: { id: string }[], 
    risks: Risk[]
): { taskId: string, riskScore: number }[] => {
    const taskRiskMap = new Map<string, number>();

    risks.forEach(risk => {
        if (risk.linkedTaskId && risk.status === 'Open') {
            const currentScore = taskRiskMap.get(risk.linkedTaskId) || 0;
            taskRiskMap.set(risk.linkedTaskId, currentScore + risk.score);
        }
    });

    return Array.from(taskRiskMap.entries())
        .map(([taskId, riskScore]) => ({ taskId, riskScore }))
        .sort((a, b) => b.riskScore - a.riskScore);
};

/**
 * OPPORTUNITY 11: Issues & Resources (Capacity Impact)
 * Calculates resource availability reduction due to assigned issues.
 */
export const calculateResourceLoadFromIssues = (
    resourceId: string, 
    issues: Issue[]
): number => {
    // Assumption: An open issue takes ~20% of capacity/day until resolved
    const openIssues = issues.filter(i => i.assignedTo === resourceId && i.status !== 'Closed');
    return openIssues.length * 20; // returns percentage load
};
