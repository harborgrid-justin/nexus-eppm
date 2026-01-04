
import React, { createContext, useContext, ReactNode } from 'react';
import { Project, Risk, BudgetLineItem, ChangeOrder, Stakeholder, RiskManagementPlan, PurchaseOrder, QualityReport, NonConformanceReport, CommunicationLog, Resource, EVMMetrics, Issue } from '../types/index';

// Define a comprehensive type for all data related to a project workspace
export interface ProjectWorkspaceData {
    project: Project;
    risks: Risk[];
    issues: Issue[];
    budgetItems: BudgetLineItem[];
    changeOrders: ChangeOrder[];
    purchaseOrders: PurchaseOrder[];
    qualityReports: QualityReport[];
    nonConformanceReports: NonConformanceReport[];
    communicationLogs: CommunicationLog[];
    assignedResources: Resource[];
    summary: { totalTasks: number; completedTasks: number; overallProgress: number; delayedTasks?: number } | null;
    financials: { totalPlanned: number; revisedBudget: number; totalActual: number; totalCommitted: number; approvedCOAmount: number; pendingCOAmount: number; variance: number; budgetUtilization: number; evm: EVMMetrics; solvency: string } | null;
    riskProfile: { totalRisks: number; highImpactRisks: number; openRisks: number; exposure: number };
    qualityProfile: { totalReports: number; failedReports: number; passRate: number; openDefects: number; totalDefects: number };
    stakeholders: Stakeholder[];
    riskPlan: RiskManagementPlan;
}

const ProjectWorkspaceContext = createContext<ProjectWorkspaceData | null>(null);

export const ProjectWorkspaceProvider: React.FC<{ children: ReactNode, value: ProjectWorkspaceData }> = ({ children, value }) => {
  return (
    <ProjectWorkspaceContext.Provider value={value}>
      {children}
    </ProjectWorkspaceContext.Provider>
  );
};

export const useProjectWorkspace = (): ProjectWorkspaceData => {
  const context = useContext(ProjectWorkspaceContext);
  if (!context) {
    throw new Error('useProjectWorkspace must be used within a ProjectWorkspaceProvider');
  }
  return context;
};
