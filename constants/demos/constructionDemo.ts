import { DataState } from '../../types/index';
import { initialState } from '../../context/initialState';

// Import all available mock data from the barrel file
import { 
    MOCK_PROJECT_1, MOCK_PROJECT_3, MOCK_SCI_PROJECTS,
    MOCK_STAKEHOLDERS, MOCK_UDFS, MOCK_DATA_JOBS, MOCK_COMM_LOGS,
    MOCK_QUALITY_REPORTS, MOCK_DEFECTS,
    MOCK_RESOURCES, MOCK_TIMESHEETS,
    MOCK_EXPENSES, MOCK_EXPENSE_CATEGORIES, MOCK_BUDGET_LOG, MOCK_FUNDING_SOURCES,
    MOCK_PROJECT_FUNDING, MOCK_COST_ESTIMATES, MOCK_BUDGET_ITEMS,
    MOCK_CHANGE_ORDERS, MOCK_INVOICES, MOCK_COST_BOOK,
    MOCK_RISKS, MOCK_ISSUES, MOCK_RBS, MOCK_PORTFOLIO_RISKS, MOCK_ISSUE_CODES,
    MOCK_VENDORS, MOCK_CONTRACTS, MOCK_PURCHASE_ORDERS, MOCK_PROCUREMENT_PLANS,
    MOCK_SOLICITATIONS, MOCK_SUPPLIER_REVIEWS, MOCK_CLAIMS,
    MOCK_PROGRAMS, MOCK_BENEFITS, MOCK_PROGRAM_STAKEHOLDERS, MOCK_COMMUNICATION_PLAN,
    MOCK_INTEGRATED_CHANGES, MOCK_PROGRAM_STAGE_GATES, MOCK_PROGRAM_OBJECTIVES,
    MOCK_PROGRAM_RISKS, MOCK_PROGRAM_ISSUES,
    MOCK_EPS, MOCK_OBS, MOCK_LOCATIONS,
    MOCK_CALENDARS,
    MOCK_USERS,
    MOCK_ENTERPRISE_ROLES, MOCK_DOCUMENTS, MOCK_QUALITY_STANDARDS,
    MOCK_ENTERPRISE_SKILLS, MOCK_TEMPLATES, EXTENSIONS_REGISTRY,
    MOCK_ACTIVITY_CODES,
    MOCK_STRATEGIC_GOALS,
    MOCK_STRATEGIC_DRIVERS, MOCK_PORTFOLIO_SCENARIOS, MOCK_GOVERNANCE_DECISIONS, MOCK_ESG_METRICS,
    MOCK_INTEGRATIONS,
    MOCK_BP_DEFS, MOCK_BP_RECORDS, COST_SHEET_COLUMNS, COST_SHEET_DATA
} from '../index';

const project1WithData = {
  ...MOCK_PROJECT_1,
  funding: MOCK_PROJECT_FUNDING.filter(f => f.projectId === 'P1001'),
  costEstimates: MOCK_COST_ESTIMATES.filter(e => e.projectId === 'P1001'),
  budgetLog: MOCK_BUDGET_LOG.filter(l => l.projectId === 'P1001'),
};
const project3WithData = {
  ...MOCK_PROJECT_3,
  funding: MOCK_PROJECT_FUNDING.filter(f => f.projectId === 'P1003'),
  budgetLog: MOCK_BUDGET_LOG.filter(l => l.projectId === 'P1003'),
};

export const constructionDemoData: Partial<DataState> = {
  ...initialState,
  
  projects: [project1WithData, project3WithData, MOCK_SCI_PROJECTS[0]],
  programs: MOCK_PROGRAMS,
  resources: MOCK_RESOURCES,
  timesheets: MOCK_TIMESHEETS,
  budgetItems: MOCK_BUDGET_ITEMS,
  expenses: MOCK_EXPENSES,
  changeOrders: MOCK_CHANGE_ORDERS,
  invoices: MOCK_INVOICES,
  fundingSources: MOCK_FUNDING_SOURCES,
  risks: MOCK_RISKS,
  issues: MOCK_ISSUES,
  portfolioRisks: MOCK_PORTFOLIO_RISKS,
  qualityReports: MOCK_QUALITY_REPORTS,
  nonConformanceReports: MOCK_DEFECTS,
  communicationLogs: MOCK_COMM_LOGS,
  documents: MOCK_DOCUMENTS,
  vendors: MOCK_VENDORS,
  contracts: MOCK_CONTRACTS,
  purchaseOrders: MOCK_PURCHASE_ORDERS,
  procurementPlans: MOCK_PROCUREMENT_PLANS,
  solicitations: MOCK_SOLICITATIONS,
  supplierReviews: MOCK_SUPPLIER_REVIEWS,
  claims: MOCK_CLAIMS,
  stakeholders: MOCK_STAKEHOLDERS,
  eps: MOCK_EPS,
  obs: MOCK_OBS,
  locations: MOCK_LOCATIONS,
  calendars: MOCK_CALENDARS,
  users: MOCK_USERS,
  roles: MOCK_ENTERPRISE_ROLES,
  skills: MOCK_ENTERPRISE_SKILLS,
  rbs: MOCK_RBS,
  issueCodes: MOCK_ISSUE_CODES,
  expenseCategories: MOCK_EXPENSE_CATEGORIES,
  activityCodes: MOCK_ACTIVITY_CODES,
  userDefinedFields: MOCK_UDFS,
  costBook: MOCK_COST_BOOK,
  qualityStandards: MOCK_QUALITY_STANDARDS,
  standardTemplates: MOCK_TEMPLATES,
  integrations: MOCK_INTEGRATIONS,
  extensions: EXTENSIONS_REGISTRY,
  dataJobs: MOCK_DATA_JOBS,
  governance: {
      ...initialState.governance,
  },
  strategicGoals: MOCK_STRATEGIC_GOALS,
  strategicDrivers: MOCK_STRATEGIC_DRIVERS,
  portfolioScenarios: MOCK_PORTFOLIO_SCENARIOS,
  governanceDecisions: MOCK_GOVERNANCE_DECISIONS,
  esgMetrics: MOCK_ESG_METRICS,
  benefits: MOCK_BENEFITS,
  programStakeholders: MOCK_PROGRAM_STAKEHOLDERS,
  portfolioCommunicationPlan: MOCK_COMMUNICATION_PLAN,
  integratedChanges: MOCK_INTEGRATED_CHANGES,
  programStageGates: MOCK_PROGRAM_STAGE_GATES,
  programObjectives: MOCK_PROGRAM_OBJECTIVES,
  programRisks: MOCK_PROGRAM_RISKS,
  programIssues: MOCK_PROGRAM_ISSUES,
  unifier: {
      definitions: MOCK_BP_DEFS,
      records: MOCK_BP_RECORDS,
      costSheet: {
          columns: COST_SHEET_COLUMNS,
          rows: COST_SHEET_DATA
      },
      cashFlowCurves: [],
      fundAllocations: []
  }
};