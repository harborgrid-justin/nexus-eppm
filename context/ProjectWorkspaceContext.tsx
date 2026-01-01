import React, { createContext, useContext, ReactNode } from 'react';
// FIX: Import missing types for the context data shape
import { Project, Risk, BudgetLineItem, ChangeOrder, Stakeholder, RiskManagementPlan, PurchaseOrder, QualityReport, NonConformanceReport, CommunicationLog, Resource } from '../types/index';

// Define a comprehensive type for all data related to a project workspace
export interface ProjectWorkspaceData {
    project: Project;
    risks: Risk[];
    issues: any[];
    // FIX: Corrected type from BudgetLogItem to BudgetLineItem
    budgetItems: BudgetLineItem[];
    changeOrders: ChangeOrder[];
    purchaseOrders: PurchaseOrder[];
    qualityReports: QualityReport[];
    nonConformanceReports: NonConformanceReport[];
    communicationLogs: CommunicationLog[];
    assignedResources: Resource[];
    summary: any;
    financials: any;
    riskProfile: any;
    qualityProfile: any;
    // FIX: Added missing stakeholders property
    stakeholders: Stakeholder[];
    // FIX: Added missing riskPlan property
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