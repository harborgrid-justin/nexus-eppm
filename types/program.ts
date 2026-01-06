

export interface Program {
  id: string;
  name: string;
  managerId: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  benefits: string;
  status: 'Active' | 'Planned' | 'Closed';
  health: 'Good' | 'Warning' | 'Critical';
  strategicImportance: number;
  financialValue: number;
  riskScore: number;
  calculatedPriorityScore: number;
  category: string;
  businessCase: string;
}

export interface ProgramVendorSummary {
  vendorId: string;
  name: string;
  totalContractValue: number;
  activeContractsCount: number;
  avgPerformanceScore: number;
  criticalIssuesCount: number;
  strategicAlignment: 'High' | 'Medium' | 'Low';
}

export interface GovernanceRole {
  id: string;
  programId: string;
  role: string;
  assigneeId: string;
  authorityLevel: 'High' | 'Medium' | 'Low';
  responsibilities: string;
}

export interface StrategicGoal {
  id: string;
  name: string;
  description: string;
  programs: string[];
}

export interface ProgramObjective {
  id: string;
  description: string;
  linkedStrategicGoalId: string;
  linkedProjectIds: string[];
}

export interface ProgramIssue {
  id: string;
  programId: string;
  title: string;
  description: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Escalated' | 'Resolved';
  ownerId: string;
  resolutionPath: string;
  impactedProjectIds: string[];
}

export interface ProgramRisk {
  id: string;
  programId: string;
  description: string;
  category: string;
  probability: 'High' | 'Medium' | 'Low';
  impact: 'High' | 'Medium' | 'Low';
  score: number;
  ownerId: string;
  status: 'Open' | 'Mitigated' | 'Closed';
  mitigationPlan: string;
  probabilityValue?: number;
  impactValue?: number;
  financialImpact?: number;
  strategy?: string;
  responseActions?: any[];
  isEscalated?: boolean;
}

export interface ProgramBudgetAllocation {
  id: string;
  programId: string;
  projectId: string;
  allocated: number;
  spent: number;
  forecast: number;
}

export interface IntegratedChangeRequest {
    id: string;
    programId: string;
    title: string;
    description: string;
    type: 'Technology' | 'Process' | 'Organization';
    impactAreas: ('Systems' | 'Data' | 'Roles' | 'Process')[];
    severity: 'High' | 'Medium' | 'Low';
    status: 'Draft' | 'In Review' | 'Approved' | 'In Progress' | 'Complete';
    readinessImpact: {
        stakeholderGroup: string;
        awareness: number;
        desire: number;
        knowledge: number;
        ability: number;
        reinforcement: number;
    }[];
}

export interface ProgramStakeholder {
    id: string;
    programId: string;
    name: string;
    role: string;
    category: 'Strategic' | 'Operational' | 'External';
    engagementLevel: 'Leading' | 'Supportive' | 'Neutral' | 'Resistant';
    influence: 'High' | 'Medium' | 'Low';
    interest: 'High' | 'Medium' | 'Low';
    engagementStrategy: string;
}

export interface ProgramCommunicationItem {
  id: string;
  programId: string;
  audience: string;
  content: string;
  frequency: string;
  channel: string;
  ownerId: string;
}

export interface Benefit {
  id: string;
  componentId: string;
  description: string;
  type: 'Financial' | 'Non-Financial';
  value: number;
  realizedValue?: number;
  metric?: string;
  targetDate: string;
  status: 'Planned' | 'In Progress' | 'Realized';
}

export interface ProgramStageGate {
    id: string;
    programId: string;
    name: string;
    type: 'Funding' | 'Technical' | 'Business';
    plannedDate: string;
    actualDate?: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'Conditional';
    approverIds: string[];
    decisionNotes: string;
    criteria: { id: string, description: string, status: 'Met' | 'Not Met' | 'Waived', notes: string }[];
}

export interface ProgramDependency {
    id: string;
    sourceProjectId: string;
    targetProjectId: string;
    description: string;
    type: 'Technical' | 'Resource' | 'Market';
    status: 'Active' | 'Resolved' | 'Critical';
}

export interface ProgramOutcome {
    id: string;
    programId: string;
    description: string;
    status: 'On Track' | 'At Risk' | 'Achieved';
    targetDate: string;
    linkedProjectIds: string[];
}

export interface ProgramChangeRequest {
    id: string;
    title: string;
    description: string;
    submittedDate: string;
    submitterId: string;
    status: 'Pending PCCB' | 'Approved' | 'Rejected';
    impact: {
        cost: number;
        schedule: number;
        risk: 'High' | 'Medium' | 'Low';
    };
}

export interface ProgramQualityStandard {
    id: string;
    category: string;
    description: string;
    enforcementLevel: 'Mandatory' | 'Guideline';
}

export interface ProgramAssuranceReview {
    id: string;
    date: string;
    type: 'Gate Review' | 'Health Check' | 'Audit';
    scope: string;
    status: 'Pass' | 'Pass with Conditions' | 'Fail';
    findings: string;
}

export interface ProgramTransitionItem {
    id: string;
    category: 'Operational' | 'Technical' | 'Knowledge';
    description: string;
    ownerId: string;
    dueDate: string;
    status: 'Pending' | 'In Progress' | 'Complete';
}

export interface ProgramArchitectureStandard {
    id: string;
    title: string;
    category: 'Data' | 'Application' | 'Technology' | 'Security';
    description: string;
    status: 'Baseline' | 'Proposed' | 'Retired';
}

export interface ProgramArchitectureReview {
    id: string;
    gate: 'Conceptual' | 'Logical' | 'Physical';
    date: string;
    status: 'Pending' | 'Completed';
    notes: string;
}

export interface TradeoffScenario {
    id: string;
    name: string;
    description: string;
    benefitValue: number;
    costImpact: number;
    riskScore: number;
    recommendation: 'Proceed' | 'Hold' | 'Reject';
}

export interface PortfolioScenario {
    id: string;
    name: string;
    description: string;
    selectedComponentIds: string[];
    metrics: {
        totalCost: number;
        totalROI: number;
        strategicAlignmentScore: number;
        riskExposure: number;
    };
}

export interface GovernanceDecision {
    id: string;
    date: string;
    title: string;
    authorityId: string;
    decision: 'Approved' | 'Rejected' | 'Deferred';
    notes: string;
}

export interface GovernanceEvent {
    id: string;
    programId: string;
    name: string;
    type: 'Steering Committee' | 'Technical Review' | 'Budget Council';
    frequency: 'Weekly' | 'Monthly' | 'Quarterly';
    nextDate: string;
}

export interface StrategicDriver {
    id: string;
    name: string;
    description: string;
}

export interface ESGMetric {
    componentId: string;
    environmentalScore: number;
    socialScore: number;
    governanceScore: number;
    complianceStatus: 'Compliant' | 'Non-Compliant' | 'At Risk';
}

export interface ProgramFundingGate {
  id: string;
  programId: string;
  name: string;
  milestoneTrigger: string;
  amount: number;
  releaseDate: string;
  status: 'Planned' | 'Released';
}
