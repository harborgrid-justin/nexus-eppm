
import { DataState } from '../types/actions';
import { MOCK_PROJECTS, MOCK_STAKEHOLDERS, MOCK_UDFS, MOCK_DATA_JOBS, MOCK_COMM_LOGS, MOCK_QUALITY_REPORTS, MOCK_DEFECTS } from '../constants/mocks/projects';
import { MOCK_RESOURCES, MOCK_TIMESHEETS } from '../constants/mocks/resources';
import { 
    MOCK_EXPENSES, MOCK_EXPENSE_CATEGORIES, MOCK_BUDGET_ITEMS, 
    MOCK_COST_REPORTS, MOCK_COST_MEETINGS, MOCK_COST_ALERTS, 
    MOCK_COST_BOOK, MOCK_INVOICES, MOCK_FUNDING_SOURCES,
    MOCK_CHANGE_ORDERS
} from '../constants/mocks/finance';
import { 
    MOCK_PROCUREMENT_PACKAGES, MOCK_PROCUREMENT_PLANS, MOCK_SOLICITATIONS, 
    MOCK_CONTRACTS, MOCK_VENDORS, MOCK_SUPPLIER_REVIEWS, MOCK_CLAIMS,
    MOCK_PURCHASE_ORDERS
} from '../constants/mocks/procurement';
import {
    MOCK_RISKS, MOCK_ISSUES, MOCK_RBS, MOCK_PORTFOLIO_RISKS, MOCK_ISSUE_CODES
} from '../constants/mocks/risks';
import {
    MOCK_PROGRAMS, MOCK_BENEFITS, MOCK_PROGRAM_STAKEHOLDERS, MOCK_COMMUNICATION_PLAN,
    MOCK_INTEGRATED_CHANGES, MOCK_PROGRAM_STAGE_GATES, MOCK_PROGRAM_DEPENDENCIES,
    MOCK_PROGRAM_OUTCOMES, MOCK_PROGRAM_CHANGE_REQUESTS, MOCK_PROGRAM_QUALITY_STANDARDS,
    MOCK_PROGRAM_ASSURANCE_REVIEWS, MOCK_PROGRAM_TRANSITION_ITEMS, MOCK_PROGRAM_ARCHITECTURE_STANDARDS,
    MOCK_PROGRAM_ARCHITECTURE_REVIEWS, MOCK_TRADEOFF_SCENARIOS
} from '../constants/mocks/programs';
import {
    MOCK_PORTFOLIO_SCENARIOS, MOCK_GOVERNANCE_DECISIONS, MOCK_STRATEGIC_DRIVERS, MOCK_ESG_METRICS
} from '../constants/mocks/governance';
import {
    MOCK_INTEGRATIONS, MOCK_GOVERNANCE_ROLES, MOCK_GOVERNANCE_EVENTS
} from '../constants/mocks/business';
import {
    MOCK_EPS, MOCK_OBS, MOCK_LOCATIONS
} from '../constants/mocks/structure';
import { MOCK_CALENDARS } from '../constants/mocks/calendars';
import { MOCK_ACTIVITY_CODES } from '../constants/mocks/activityCodes';
import { MOCK_USERS } from '../constants/auth';
import { EXTENSIONS_REGISTRY, MOCK_QUALITY_STANDARDS, MOCK_ENTERPRISE_ROLES, MOCK_ENTERPRISE_SKILLS, MOCK_DOCUMENTS, MOCK_TEMPLATES } from '../constants/mocks/common';

export const initialState: DataState = {
  // Projects & Core
  projects: MOCK_PROJECTS,
  resources: MOCK_RESOURCES,
  users: MOCK_USERS,
  
  // Structure
  eps: MOCK_EPS,
  obs: MOCK_OBS,
  locations: MOCK_LOCATIONS,
  calendars: MOCK_CALENDARS as any,
  
  // Config
  activityCodes: MOCK_ACTIVITY_CODES as any,
  userDefinedFields: MOCK_UDFS,
  globalChangeRules: [],
  roles: MOCK_ENTERPRISE_ROLES,
  skills: MOCK_ENTERPRISE_SKILLS,
  standardTemplates: MOCK_TEMPLATES,
  
  // Finance
  budgetItems: MOCK_BUDGET_ITEMS,
  expenses: MOCK_EXPENSES,
  expenseCategories: MOCK_EXPENSE_CATEGORIES,
  invoices: MOCK_INVOICES,
  costReports: MOCK_COST_REPORTS,
  costMeetings: MOCK_COST_MEETINGS,
  costAlerts: MOCK_COST_ALERTS,
  costBook: MOCK_COST_BOOK,
  fundingSources: MOCK_FUNDING_SOURCES,
  changeOrders: MOCK_CHANGE_ORDERS,
  
  // Procurement
  procurementPackages: MOCK_PROCUREMENT_PACKAGES,
  procurementPlans: MOCK_PROCUREMENT_PLANS,
  solicitations: MOCK_SOLICITATIONS,
  contracts: MOCK_CONTRACTS,
  purchaseOrders: MOCK_PURCHASE_ORDERS,
  vendors: MOCK_VENDORS,
  supplierReviews: MOCK_SUPPLIER_REVIEWS,
  claims: MOCK_CLAIMS,
  makeOrBuyAnalysis: [],

  // Risk
  risks: MOCK_RISKS,
  issues: MOCK_ISSUES,
  issueCodes: MOCK_ISSUE_CODES,
  rbs: MOCK_RBS,
  portfolioRisks: MOCK_PORTFOLIO_RISKS,
  
  // Quality & Artifacts
  qualityReports: MOCK_QUALITY_REPORTS,
  nonConformanceReports: MOCK_DEFECTS,
  qualityStandards: MOCK_QUALITY_STANDARDS,
  documents: MOCK_DOCUMENTS,
  communicationLogs: MOCK_COMM_LOGS,
  stakeholders: MOCK_STAKEHOLDERS,
  
  // Program & Strategy
  programs: MOCK_PROGRAMS,
  benefits: MOCK_BENEFITS,
  strategicGoals: [], 
  strategicDrivers: MOCK_STRATEGIC_DRIVERS,
  portfolioScenarios: MOCK_PORTFOLIO_SCENARIOS,
  esgMetrics: MOCK_ESG_METRICS,
  
  // Program Sub-Entities
  programObjectives: [],
  programDependencies: MOCK_PROGRAM_DEPENDENCIES,
  programOutcomes: MOCK_PROGRAM_OUTCOMES,
  programRisks: [],
  programIssues: [],
  programChangeRequests: MOCK_PROGRAM_CHANGE_REQUESTS,
  programQualityStandards: MOCK_PROGRAM_QUALITY_STANDARDS,
  programAssuranceReviews: MOCK_PROGRAM_ASSURANCE_REVIEWS,
  programTransitionItems: MOCK_PROGRAM_TRANSITION_ITEMS,
  programArchitectureStandards: MOCK_PROGRAM_ARCHITECTURE_STANDARDS,
  programArchitectureReviews: MOCK_PROGRAM_ARCHITECTURE_REVIEWS,
  tradeoffScenarios: MOCK_TRADEOFF_SCENARIOS,
  programAllocations: [],
  programFundingGates: [],
  programStageGates: MOCK_PROGRAM_STAGE_GATES,
  integratedChanges: MOCK_INTEGRATED_CHANGES,
  programStakeholders: MOCK_PROGRAM_STAKEHOLDERS,
  programCommunicationPlan: MOCK_COMMUNICATION_PLAN,
  
  // Governance
  governanceRoles: MOCK_GOVERNANCE_ROLES,
  governanceEvents: MOCK_GOVERNANCE_EVENTS,
  governanceDecisions: MOCK_GOVERNANCE_DECISIONS,
  governance: {
    alerts: [],
    auditLog: [],
    exchangeRates: { 'USD': 1.0, 'EUR': 0.92, 'GBP': 0.79, 'JPY': 151.5, 'CAD': 1.36 },
    inflationRate: 0.03,
    riskTolerance: 'Moderate',
    strategicWeights: { 'Financial': 0.4, 'Strategic': 0.4, 'Risk': 0.2 },
    vendorBlacklist: [],
    scheduling: { 
        retainedLogic: true, 
        calculateCriticalPathUsing: 'Longest Path',
        computeMultipleFloatPaths: false,
        floatPathTaskCount: 0,
        autoSaveOnSchedule: true,
        defaultTaskType: 'Fixed Duration'
    },
    resourceDefaults: {
        defaultWorkHoursPerDay: 8,
        autoLevelingThreshold: 100,
        usePricePerUnitForCost: true,
        allowOvertimeInPlanning: false
    },
    security: {
        mfa: true,
        passwordComplexity: 'High',
        sessionLimit: 30,
        ipLock: false,
        allowPublicLinks: false,
        enforceHttps: true,
        loginRetries: 5
    }
  },
  
  // System
  integrations: MOCK_INTEGRATIONS,
  extensions: EXTENSIONS_REGISTRY,
  dataJobs: MOCK_DATA_JOBS,
  workflows: [],
  timesheets: MOCK_TIMESHEETS,
  errors: []
};
