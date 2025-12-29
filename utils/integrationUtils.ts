
import { 
    Project, BudgetLineItem, Task, PurchaseOrder, Risk, ChangeOrder, 
    CommunicationLog, NonConformanceReport, Resource, Issue, 
    Stakeholder, ProgramDependency, Benefit, Vendor, QualityReport,
    TaskStatus, Document
} from '../types';
import { getDaysDiff } from './dateUtils';

// ============================================================================
// 1. Schedule & Cost (EVM)
// Calculate Earned Value Management metrics by merging Task Progress with Budget
// ============================================================================
export const calculateEVM = (project: Project, budgetItems: BudgetLineItem[]) => {
    if (!project || budgetItems.length === 0) return { pv: 0, ev: 0, ac: 0, spi: 0, cpi: 0 };

    const totalBudget = budgetItems.reduce((acc, b) => acc + b.planned, 0);
    const totalActuals = budgetItems.reduce((acc, b) => acc + b.actual, 0);
    
    // Calculate Project Completion % based on Task Duration weighting
    const totalDuration = project.tasks.reduce((acc, t) => acc + t.duration, 0);
    const earnedDuration = project.tasks.reduce((acc, t) => acc + (t.duration * (t.progress / 100)), 0);
    const percentComplete = totalDuration > 0 ? earnedDuration / totalDuration : 0;

    // Planned Value (PV): Assuming linear distribution for simplicity relative to today vs project duration
    const projectLength = getDaysDiff(project.startDate, project.endDate);
    const daysElapsed = getDaysDiff(project.startDate, new Date().toISOString());
    const schedulePercent = projectLength > 0 ? Math.min(1, Math.max(0, daysElapsed / projectLength)) : 0;
    
    const pv = totalBudget * schedulePercent;
    const ev = totalBudget * percentComplete;
    const ac = totalActuals;

    return {
        pv,
        ev,
        ac,
        spi: pv > 0 ? ev / pv : 1,
        cpi: ac > 0 ? ev / ac : 1
    };
};

// ============================================================================
// 2. Procurement & Cost (Commitments)
// Sum up issued POs linked to a budget item to determine Committed Cost
// ============================================================================
export const calculateCommittedCost = (purchaseOrders: PurchaseOrder[], budgetLineItemId: string): number => {
    return purchaseOrders
        .filter(po => po.linkedBudgetLineItemId === budgetLineItemId && po.status !== 'Draft' && po.status !== 'Closed')
        .reduce((sum, po) => sum + po.amount, 0);
};

// ============================================================================
// 3. Quality & Schedule (Gating)
// Check if a task has open critical Non-Conformance Reports (NCRs)
// ============================================================================
export const canCompleteTask = (taskId: string, ncrs: NonConformanceReport[]): { canComplete: boolean, blockingNCRs: NonConformanceReport[] } => {
    const blockingNCRs = ncrs.filter(ncr => 
        ncr.linkedDeliverable === taskId && 
        (ncr.status === 'Open' || ncr.status === 'In Progress') &&
        (ncr.severity === 'Critical' || ncr.severity === 'Major')
    );
    return { canComplete: blockingNCRs.length === 0, blockingNCRs };
};

// ============================================================================
// 4. Risk & Finance (Contingency)
// Calculate Monetary Risk Exposure (EMV)
// ============================================================================
export const calculateRiskExposure = (risks: Risk[]): number => {
    const impactScaleMap: Record<string, number> = { 'Low': 10000, 'Medium': 50000, 'High': 150000 }; // Mock financial values
    const probScaleMap: Record<string, number> = { 'Low': 0.1, 'Medium': 0.5, 'High': 0.9 };

    return risks
        .filter(r => r.status === 'Open')
        .reduce((acc, r) => {
            const impactVal = impactScaleMap[r.impact] || 0;
            const probVal = probScaleMap[r.probability] || 0;
            return acc + (impactVal * probVal);
        }, 0);
};

// ============================================================================
// 5. Procurement & Schedule (Material Constraints)
// Check if material delivery dates (PO) conflict with Task Start dates
// ============================================================================
export const checkMaterialAvailability = (task: Task, purchaseOrders: PurchaseOrder[]): { hasShortfall: boolean, delayDays: number } => {
    // Find POs linked to this task via some logic (e.g. Activity Codes or direct link if we added it)
    // For this integration, we'll assume we look up POs that reference this task ID in their description or custom field
    // Simplified: Checking if any PO is late for this task based on a hypothetical link
    const relatedPOs = purchaseOrders.filter(po => po.description.includes(task.wbsCode)); // Weak link for demo
    
    if (relatedPOs.length === 0) return { hasShortfall: false, delayDays: 0 };

    const taskStart = new Date(task.startDate).getTime();
    let maxDelay = 0;

    relatedPOs.forEach(po => {
        if (po.expectedDeliveryDate) {
            const delivery = new Date(po.expectedDeliveryDate).getTime();
            if (delivery > taskStart) {
                const diffTime = Math.abs(delivery - taskStart);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                if (diffDays > maxDelay) maxDelay = diffDays;
            }
        }
    });

    return { hasShortfall: maxDelay > 0, delayDays: maxDelay };
};

// ============================================================================
// 6. Resource & Schedule (Forecasting)
// Estimate to Complete (Labor Cost)
// ============================================================================
export const calculateResourceETC = (task: Task, resource: Resource): number => {
    const assignment = task.assignments.find(a => a.resourceId === resource.id);
    if (!assignment) return 0;
    
    // Remaining Units * Hourly Rate
    // If remaining units not tracked, assume (100 - progress)% of original work
    const remainingPercent = (100 - task.progress) / 100;
    const estimatedRemainingHours = (task.work || 0) * (assignment.units / 100) * remainingPercent;
    
    return estimatedRemainingHours * (resource.hourlyRate || 0);
};

// ============================================================================
// 7. Change & Scope (Creep)
// Ratio of Unapproved Changes to Original Budget
// ============================================================================
export const calculateScopeCreep = (originalBudget: number, changeOrders: ChangeOrder[]): number => {
    if (originalBudget === 0) return 0;
    const unapprovedAmount = changeOrders
        .filter(co => co.status === 'Pending Approval')
        .reduce((sum, co) => sum + co.amount, 0);
    
    return (unapprovedAmount / originalBudget) * 100;
};

// ============================================================================
// 8. Stakeholder & Risk (Engagement)
// Auto-identify risks from disengaged high-influence stakeholders
// ============================================================================
export const identifyStakeholderRisks = (stakeholders: Stakeholder[]): string[] => {
    return stakeholders
        .filter(s => s.influence === 'High' && s.interest === 'Low') // "Keep Satisfied" quadrant
        .map(s => `Risk: Low engagement from high-influence stakeholder ${s.name}`);
};

// ============================================================================
// 9. Issues & Resources (Load)
// Administrative load on resources based on issue assignment
// ============================================================================
export const calculateResourceIssueLoad = (resourceId: string, issues: Issue[]): number => {
    return issues.filter(i => i.assignedTo === resourceId && i.status !== 'Closed').length;
};

// ============================================================================
// 10. Schedule & Risk (Critical Path)
// Weight risks higher if they are linked to critical path tasks
// ============================================================================
export const calculateCriticalPathRiskScore = (risk: Risk, tasks: Task[]): number => {
    const linkedTask = tasks.find(t => t.id === risk.linkedTaskId);
    let multiplier = 1;
    if (linkedTask && linkedTask.critical) {
        multiplier = 2.0; // Double severity for critical path risks
    }
    return risk.score * multiplier;
};

// ============================================================================
// 11. Cost & Funding (Solvency)
// Check if funds released cover actuals + commitments
// ============================================================================
export const checkFundingSolvency = (totalActuals: number, totalCommitted: number, totalFundingReleased: number): 'Solvent' | 'At Risk' | 'Insolvent' => {
    const exposure = totalActuals + totalCommitted;
    if (exposure > totalFundingReleased) return 'Insolvent';
    if (exposure > totalFundingReleased * 0.9) return 'At Risk';
    return 'Solvent';
};

// ============================================================================
// 12. Program & Project (Dependency)
// Check status of cross-project dependencies
// ============================================================================
export const checkProgramDependencies = (dependencies: ProgramDependency[], projects: Project[]): { id: string, status: 'OK' | 'Broken' }[] => {
    return dependencies.map(dep => {
        const source = projects.find(p => p.id === dep.sourceProjectId);
        const target = projects.find(p => p.id === dep.targetProjectId);
        
        if (!source || !target) return { id: dep.id, status: 'OK' }; // Cannot validate

        // Simple validation: If source is Critical/Warning, dependency is at risk
        const isBroken = source.health === 'Critical';
        return { id: dep.id, status: isBroken ? 'Broken' : 'OK' };
    });
};

// ============================================================================
// 13. Benefit & Status (Probability)
// Adjust expected benefit value based on project health
// ============================================================================
export const calculateBenefitProbability = (benefit: Benefit, projectHealth: string): number => {
    let probabilityFactor = 1.0;
    if (projectHealth === 'Warning') probabilityFactor = 0.8;
    if (projectHealth === 'Critical') probabilityFactor = 0.5;
    
    return benefit.value * probabilityFactor;
};

// ============================================================================
// 14. Vendors & Risk (Supply Chain)
// Vendor performance impacting risk
// ============================================================================
export const calculateSupplyChainRisk = (vendor: Vendor): 'Low' | 'Medium' | 'High' => {
    if (vendor.status === 'Blacklisted') return 'High';
    if (vendor.performanceScore < 70) return 'High';
    if (vendor.performanceScore < 85) return 'Medium';
    return 'Low';
};

// ============================================================================
// 15. Quality & Cost (CoQ)
// Cost of Quality: Rework costs (estimated via Issues/NCRs)
// ============================================================================
export const calculateCostOfQuality = (ncrs: NonConformanceReport[]): number => {
    // Assumption: Average cost of rework per severity
    const costMap = { 'Critical': 5000, 'Major': 1000, 'Minor': 200 };
    return ncrs.reduce((acc, ncr) => acc + (costMap[ncr.severity] || 0), 0);
};

// ============================================================================
// 16. Documents & Schedule (Readiness)
// Check if "Final" documents exist for a task (simulated)
// ============================================================================
export const checkDocumentReadiness = (task: Task, documents: Document[]): boolean => {
    // If task is construction, check for drawings
    if (task.activityCodeAssignments?.['Discipline'] === 'Construction') {
        const hasDrawings = documents.some(d => d.type === 'DWG' && d.status === 'Final');
        return hasDrawings;
    }
    return true; // Default ready
};

// ============================================================================
// 17. Communication & Issues (RFI)
// Blocking: Open RFIs linked to a task
// ============================================================================
export const checkOpenRFIsForTask = (taskId: string, commLogs: CommunicationLog[]): { blocked: boolean, count: number } => {
    const openRFIs = commLogs.filter(c => 
        c.type === 'RFI' && 
        c.linkedIssueId === taskId && // Assuming linking via ID for simplicity
        c.status === 'Open'
    );
    return { blocked: openRFIs.length > 0, count: openRFIs.length };
};

// ============================================================================
// 18. Safety & Schedule (Incidents)
// Mock function to simulate safety stops
// ============================================================================
export const checkSafetyIncidents = (location: string): boolean => {
    // In a real system, query Safety module by location
    return false; 
};

// ============================================================================
// 19. Architecture & Scope (Tech Debt)
// Failed architecture reviews creating new scope
// ============================================================================
export const calculateTechDebtImpact = (architectureReviews: any[]): number => {
    // Count failed or conditional reviews
    return architectureReviews.filter(r => r.status !== 'Completed').length;
};

// ============================================================================
// 20. Portfolio & Strategy (Alignment)
// Weighted investment score
// ============================================================================
export const calculateStrategicInvestmentWeight = (project: Project): number => {
    return project.budget * (project.strategicImportance / 10);
};

// Helper for UI
export const calculateUnmitigatedRiskExposure = (risks: Risk[]) => {
    return risks.reduce((acc, r) => acc + (r.score * 1000), 0); // Mock scalar
};

export const checkTaskStagnation = (task: Task): boolean => {
    if (task.status !== 'In Progress') return false;
    // Mock check: if updated date > 14 days ago (needs updated field on Task)
    return false;
}