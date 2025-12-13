
import { Stakeholder } from './project';
import { PortfolioRisk } from './risk';

export interface Program {
  id: string;
  name: string;
  manager: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  benefits: string;
  status: string;
  health: 'Good' | 'Warning' | 'Critical';
  strategicImportance: number;
  financialValue: number;
  riskScore: number;
  calculatedPriorityScore: number;
  category: string;
  businessCase: string;
}

export interface Benefit {
  id: string;
  componentId: string;
  description: string;
  type: 'Financial' | 'Non-Financial';
  value: number;
  metric: string;
  targetDate: string;
  status: string;
  realizedValue?: number;
}

export interface ProgramDependency {
  id: string;
  sourceProjectId: string;
  targetProjectId: string;
  description: string;
  type: string;
  status: string;
}

export interface ProgramOutcome {
  id: string;
  description: string;
  targetDate: string;
  status: string;
  linkedProjectIds: string[];
}

export interface ProgramChangeRequest {
  id: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedDate: string;
  status: string;
  impact: { benefits: string; cost: number; schedule: number; risk: string };
}

export interface ProgramRisk extends PortfolioRisk {}

export interface ProgramBudgetAllocation {
  projectId: string;
  allocated: number;
  spent: number;
  forecast: number;
}

export interface ProgramFundingGate {
  id: string;
  name: string;
  amount: number;
  releaseDate: string;
  status: string;
  milestoneTrigger: string;
}

export interface ProgramStakeholder extends Stakeholder {
  category: 'Strategic' | 'Operational' | 'Delivery';
  engagementLevel: string;
}

export interface ProgramCommunicationItem {
  id: string;
  audience: string;
  content: string;
  frequency: string;
  channel: string;
  owner: string;
}

export interface ProgramQualityStandard {
  id: string;
  category: string;
  description: string;
  enforcementLevel: string;
}

export interface ProgramAssuranceReview {
  id: string;
  date: string;
  type: string;
  scope: string;
  findings: string;
  status: string;
}

export interface ProgramTransitionItem {
  id: string;
  category: string;
  description: string;
  owner: string;
  status: string;
  dueDate: string;
}

export interface ProgramArchitectureStandard {
  id: string;
  category: string;
  title: string;
  description: string;
  status: string;
}

export interface ProgramArchitectureReview {
  id: string;
  gate: string;
  date: string;
  status: string;
  notes: string;
}

export interface TradeoffScenario {
  id: string;
  name: string;
  description: string;
  benefitValue: number;
  costImpact: number;
  riskScore: number;
  recommendation: string;
}

export interface ProgramIssue {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  impactedProjectIds: string[];
  owner: string;
  resolutionPath: string;
}

export interface ProgramStageGate {
  id: string;
  name: string;
  type: string;
  plannedDate: string;
  actualDate?: string;
  status: string;
  criteria: { id: string; description: string; status: string; notes?: string }[];
  approvers: string[];
  decisionNotes?: string;
}

export interface IntegratedChangeRequest {
  id: string;
  title: string;
  description: string;
  type: string;
  impactAreas: string[];
  severity: string;
  status: string;
  readinessImpact: { stakeholderGroup: string; awareness: number; desire: number; knowledge: number; ability: number; reinforcement: number }[];
}

export interface ProgramVendorSummary {
  vendorId: string;
  name: string;
  totalContractValue: number;
  activeContractsCount: number;
  avgPerformanceScore: number;
  criticalIssuesCount: number;
  strategicAlignment: string;
}

export interface GovernanceRole {
  id: string;
  role: string;
  name: string;
  authorityLevel: string;
  responsibilities: string;
}

export interface GovernanceEvent {
  id: string;
  name: string;
  type: string;
  frequency: string;
  nextDate: string;
  status: string;
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

export interface PortfolioScenario {
  id: string;
  name: string;
  description: string;
  budgetConstraint: number;
  resourceConstraint: number;
  selectedComponentIds: string[];
  metrics: { totalROI: number; strategicAlignmentScore: number; riskProfileScore: number };
}

export interface StrategicDriver {
  id: string;
  name: string;
  weight: number;
  description: string;
}

export interface GovernanceDecision {
  id: string;
  title: string;
  date: string;
  decision: string;
  authority: string;
  notes: string;
  componentId?: string;
}

export interface ESGMetric {
  componentId: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  complianceStatus: string;
  lastAuditDate: string;
}
