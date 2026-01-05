
import { DataState } from '../types/index';
import { 
    MOCK_PROJECTS, MOCK_RESOURCES, MOCK_RISKS, MOCK_ISSUES, MOCK_BUDGET_ITEMS, 
    MOCK_EXPENSES, MOCK_CHANGE_ORDERS, MOCK_PURCHASE_ORDERS, MOCK_QUALITY_REPORTS, 
    MOCK_DEFECTS, MOCK_COMM_LOGS, MOCK_STAKEHOLDERS, MOCK_DOCUMENTS, MOCK_ACTIVITY_CODES,
    MOCK_UDFS, MOCK_FUNDING_SOURCES, MOCK_CALENDARS, MOCK_USERS, MOCK_ENTERPRISE_ROLES,
    MOCK_EPS, MOCK_OBS, MOCK_LOCATIONS, MOCK_DATA_JOBS, MOCK_INTEGRATIONS, 
    EXTENSIONS_REGISTRY, MOCK_EXPENSE_CATEGORIES, MOCK_ISSUE_CODES, MOCK_COST_BOOK,
    MOCK_TEMPLATES, MOCK_PROGRAMS, MOCK_BENEFITS, MOCK_STRATEGIC_DRIVERS, 
    MOCK_PORTFOLIO_SCENARIOS, MOCK_GOVERNANCE_DECISIONS, MOCK_ESG_METRICS, 
    MOCK_PORTFOLIO_RISKS, MOCK_PROGRAM_OBJECTIVES, MOCK_PROGRAM_OUTCOMES, 
    MOCK_PROGRAM_DEPENDENCIES, MOCK_PROGRAM_CHANGE_REQUESTS, MOCK_PROGRAM_RISKS, 
    MOCK_PROGRAM_ISSUES, MOCK_PROGRAM_STAKEHOLDERS, MOCK_COMMUNICATION_PLAN, 
    MOCK_PROGRAM_STAGE_GATES, MOCK_PROGRAM_TRANSITION_ITEMS, MOCK_INTEGRATED_CHANGES,
    MOCK_GOVERNANCE_ROLES, MOCK_GOVERNANCE_EVENTS, MOCK_PROGRAM_QUALITY_STANDARDS,
    MOCK_PROGRAM_ASSURANCE_REVIEWS, MOCK_PROGRAM_ARCHITECTURE_STANDARDS,
    MOCK_PROGRAM_ARCHITECTURE_REVIEWS, MOCK_TRADEOFF_SCENARIOS, MOCK_CONTRACTS,
    MOCK_SOLICITATIONS, MOCK_PROCUREMENT_PLANS, MOCK_PROCUREMENT_PACKAGES,
    MOCK_SUPPLIER_REVIEWS, MOCK_CLAIMS, MOCK_INVOICES, MOCK_TIMESHEETS,
    MOCK_ENTERPRISE_SKILLS, MOCK_RBS, MOCK_QUALITY_STANDARDS,
    MOCK_VENDORS,
    MOCK_BP_DEFS, MOCK_BP_RECORDS, COST_SHEET_COLUMNS, COST_SHEET_DATA,
    DEFAULT_NOTIFICATION_PREFERENCES,
    MOCK_STRATEGIC_GOALS,
    MOCK_COST_REPORTS, MOCK_COST_MEETINGS, MOCK_COST_ALERTS
} from '../constants/index';

import { ResourceRequest } from '../types/resource';
import { RoadmapLane, RoadmapItem, KanbanTask, StandardTemplate, EtlMapping, MaterialReceipt, PortfolioCommunicationItem, ActivityItem, TeamEvent, PipelineStage, KnowledgeArticle } from '../types';

// ... (Rest of file content is unchanged, just updating import) ...
// To save space and adhere to constraints, including full file content below with corrected import.

const MOCK_RESOURCE_REQUESTS: ResourceRequest[] = [
    { id: 'REQ-101', projectId: 'P1001', projectName: 'Downtown Metro Hub', requesterName: 'Mike Ross', role: 'Senior Engineer', quantity: 2, startDate: '2024-07-01', endDate: '2024-12-31', status: 'Pending' },
    { id: 'REQ-102', projectId: 'P1002', projectName: 'Global ERP Migration', requesterName: 'Jessica Pearson', role: 'Solution Architect', quantity: 1, startDate: '2024-08-01', endDate: '2024-10-30', status: 'Pending' },
    { id: 'REQ-103', projectId: 'P1003', projectName: 'Solar Farm Alpha', requesterName: 'Mike Ross', role: 'Civil Engineer', quantity: 4, startDate: '2024-06-15', endDate: '2024-09-15', status: 'Approved' },
];

const MOCK_ROADMAP_LANES: RoadmapLane[] = [
    { id: 'lane1', title: 'Market Expansion', owner: 'Sales & Marketing', milestones: [ { id: 'm1', name: 'Go/No-Go Decision', date: '2024-04-01', type: 'decision' } ] },
    { id: 'lane2', title: 'Operational Efficiency', owner: 'Operations', milestones: [ { id: 'm2', name: 'System Go-Live', date: '2024-08-25', type: 'release' } ] },
    { id: 'lane3', title: 'Digital Transformation', owner: 'IT & Engineering', milestones: [] }
];

const MOCK_ROADMAP_ITEMS: RoadmapItem[] = [
    { id: 'item1', laneId: 'lane1', name: 'APAC Launch Campaign', start: '2024-02-15', end: '2024-05-30', type: 'product', status: 'On Track', owner: 'J. Doe' },
    { id: 'item2', laneId: 'lane1', name: 'LATAM Market Research', start: '2024-01-10', end: '2024-03-20', type: 'strategic', status: 'Complete', owner: 'S. Smith' },
    { id: 'item3', laneId: 'lane1', name: 'EU Partnership Finalized', start: '2024-07-01', end: '2024-09-15', type: 'strategic', status: 'At Risk', owner: 'A. Wong' },
    { id: 'item4', laneId: 'lane2', name: 'Automated Reporting System', start: '2024-03-01', end: '2024-08-30', type: 'platform', status: 'On Track', owner: 'M. Ross' },
    { id: 'item5', laneId: 'lane2', name: 'Warehouse Logistics Upgrade', start: '2024-09-01', end: '2024-12-20', type: 'platform', status: 'Planned', owner: 'L. Litt' },
    { id: 'item6', laneId: 'lane3', name: 'Cloud Migration Phase 2', start: '2024-05-10', end: '2024-11-15', type: 'tech', status: 'On Track', owner: 'C. Build' },
    { id: 'item7', laneId: 'lane3', name: 'Mobile App Rearchitecture', start: '2024-01-20', end: '2024-06-10', type: 'product', status: 'Complete', owner: 'D. Staff' },
];

const MOCK_KANBAN_TASKS: KanbanTask[] = [
    { id: '1', title: 'Implement API caching', status: 'todo', priority: 'Medium' },
    { id: '2', title: 'Refactor Auth', status: 'todo', priority: 'High' },
    { id: '3', title: 'Design System Update', status: 'progress', priority: 'Low' },
    { id: '4', title: 'User Testing', status: 'review', priority: 'Medium' },
    { id: '5', title: 'Deploy v2', status: 'done', priority: 'High' }
];

const INITIAL_TEMPLATES: StandardTemplate[] = [
    ...MOCK_TEMPLATES,
    { id: 'pmi_standard', category: 'Risk', name: 'PMI Standard Risk Plan', description: 'Aligns with PMBOK Guide 7th Edition.', content: {} },
    { id: 'agile_risk', category: 'Risk', name: 'Agile Risk Management', description: 'Lightweight, iterative risk handling.', content: {} },
    { id: 'construction_heavy', category: 'Risk', name: 'Construction (Heavy Civil)', description: 'Emphasis on safety and environmental risks.', content: {} },
    { id: 'gov_standard', category: 'Cost', name: 'Government Standard (EVM)', description: 'ANSI/EIA-748 EVMS guidelines.', content: {} },
    { id: 'agile_lean', category: 'Cost', name: 'Agile / Lean Costing', description: 'Focus on burn rate and throughput.', content: {} },
    { id: 'construction_fixed', category: 'Cost', name: 'Construction (Fixed Price)', description: 'Emphasis on committed costs.', content: {} },
    { id: 'iso_9001', category: 'Quality', name: 'ISO 9001:2015 Compliant', description: 'Standard QMS structure with rigorous documentation.', content: {} },
    { id: 'lean_six_sigma', category: 'Quality', name: 'Lean / Six Sigma', description: 'Focus on defect reduction and process capability.', content: {} },
    { id: 'usace_cqc', category: 'Quality', name: 'USACE CQC Plan', description: 'Contractor Quality Control for federal projects.', content: {} },
];

const INITIAL_MAPPINGS: EtlMapping[] = [
    { id: 1, source: 'EXTERNAL_ID', target: 'id', transform: 'Direct', type: 'String' },
    { id: 2, source: 'PROJ_NAME', target: 'name', transform: 'Trim Whitespace', type: 'String' },
    { id: 3, source: 'BUDGET_AMT', target: 'budget', transform: 'Currency(USD)', type: 'Number' },
    { id: 4, source: 'START_DT', target: 'startDate', transform: 'Date(ISO8601)', type: 'Date' },
];

const MOCK_MATERIAL_RECEIPTS: MaterialReceipt[] = [
    { id: 'MRR-1024', projectId: 'P1001', itemId: 'I-01', itemName: 'Steel Beams (W12x40)', vendorId: 'V-01', quantity: 50, rejectedQuantity: 0, status: 'Accepted', dateReceived: '2024-06-15', inspectorId: 'R-005' },
    { id: 'MRR-1025', projectId: 'P1001', itemId: 'I-02', itemName: 'Pre-cast Panels', vendorId: 'V-02', quantity: 12, rejectedQuantity: 1, status: 'Conditional', dateReceived: '2024-06-12', inspectorId: 'R-005' },
    { id: 'MRR-1026', projectId: 'P1003', itemId: 'I-03', itemName: 'HVAC Units', vendorId: 'V-03', quantity: 4, rejectedQuantity: 0, status: 'Accepted', dateReceived: '2024-06-10', inspectorId: 'R-006' },
];

const MOCK_PORTFOLIO_COMM_PLAN: PortfolioCommunicationItem[] = [
    { id: '1', item: 'Performance Report', audience: 'Executive', frequency: 'Monthly', channel: 'Dashboard', owner: 'Portfolio Mgr' },
    { id: '2', item: 'Resource Review', audience: 'PMO', frequency: 'Bi-Weekly', channel: 'Meeting', owner: 'Resource Mgr' },
    { id: '3', item: 'Benefits Update', audience: 'Executive', frequency: 'Quarterly', channel: 'Report', owner: 'Sponsor' },
    { id: '4', item: 'Risk Sync', audience: 'Team', frequency: 'Weekly', channel: 'Workshop', owner: 'Program Mgr' },
];

const MOCK_ACTIVITIES: ActivityItem[] = [
    {
        id: 1,
        userId: 'U-003',
        userName: 'Jessica Pearson',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica',
        action: 'approved the budget baseline',
        target: 'FY24 CapEx Plan',
        type: 'approval',
        content: 'Looks good. Proceed with Phase 1 procurement immediately to lock in material rates.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        likes: 4,
        comments: 1
    },
    {
        id: 2,
        userId: 'SYSTEM',
        userName: 'System',
        userAvatar: '',
        action: 'detected a schedule variance',
        target: 'Foundation Pour',
        type: 'alert',
        content: 'SPI dropped below 0.85. Critical path impact estimated at +4 days.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        likes: 0,
        comments: 2
    },
    {
        id: 3,
        userId: 'U-002',
        userName: 'Mike Ross',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        action: 'uploaded a document',
        target: 'Site_Survey_v2.pdf',
        type: 'upload',
        content: '',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        likes: 2,
        comments: 0
    }
];

const MOCK_TEAM_EVENTS: TeamEvent[] = [
    { id: 1, date: new Date().toISOString(), title: 'Sprint Review', type: 'Meeting', duration: 1 },
    { id: 2, date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), title: 'Code Freeze', type: 'Milestone', duration: 1 },
    { id: 3, date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), title: 'Mike PTO', type: 'Leave', duration: 3 },
    { id: 4, date: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000).toISOString(), title: 'Client Demo', type: 'Meeting', duration: 1 },
    { id: 5, date: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(), title: 'Phase 2 Go-Live', type: 'Milestone', duration: 1 },
];

const MOCK_PIPELINE_STAGES: PipelineStage[] = [
    { id: '1', name: 'Build', status: 'success', duration: '2m 14s', logs: ['Compiling assets...', 'Minifying JS...', 'Build successful'] },
    { id: '2', name: 'Unit Test', status: 'success', duration: '45s', logs: ['Running Jest...', '142 tests passed'] },
    { id: '3', name: 'Integration', status: 'running', duration: '1m 20s', logs: ['Connecting to DB...', 'Seeding data...'] },
    { id: '4', name: 'Deploy Staging', status: 'pending', duration: '-', logs: [] },
    { id: '5', name: 'Deploy Prod', status: 'pending', duration: '-', logs: [] }
];

const MOCK_KNOWLEDGE_ARTICLES: KnowledgeArticle[] = [
    { 
        id: 'SOP-2024-001', 
        title: 'Change Order Approval Process', 
        category: 'Finance', 
        content: '<p>Standard procedure for financial variances...</p>', 
        authorId: 'U-001',
        lastUpdated: '2024-10-12',
        views: 1204,
        tags: ['Finance', 'Process', 'Compliance', 'Audit'],
        sopNumber: 'SOP-2024-001'
    }
];

export const initialState: DataState = {
  projects: MOCK_PROJECTS,
  programs: MOCK_PROGRAMS,
  resources: MOCK_RESOURCES,
  resourceRequests: MOCK_RESOURCE_REQUESTS,
  risks: MOCK_RISKS,
  issues: MOCK_ISSUES,
  budgetItems: MOCK_BUDGET_ITEMS,
  expenses: MOCK_EXPENSES,
  changeOrders: MOCK_CHANGE_ORDERS,
  purchaseOrders: MOCK_PURCHASE_ORDERS,
  qualityReports: MOCK_QUALITY_REPORTS,
  nonConformanceReports: MOCK_DEFECTS,
  communicationLogs: MOCK_COMM_LOGS,
  stakeholders: MOCK_STAKEHOLDERS,
  documents: MOCK_DOCUMENTS,
  activityCodes: MOCK_ACTIVITY_CODES,
  userDefinedFields: MOCK_UDFS,
  fundingSources: MOCK_FUNDING_SOURCES,
  calendars: MOCK_CALENDARS,
  users: MOCK_USERS,
  roles: MOCK_ENTERPRISE_ROLES,
  eps: MOCK_EPS,
  obs: MOCK_OBS,
  locations: MOCK_LOCATIONS,
  workflows: [],
  dataJobs: MOCK_DATA_JOBS,
  integrations: MOCK_INTEGRATIONS,
  extensions: EXTENSIONS_REGISTRY,
  expenseCategories: MOCK_EXPENSE_CATEGORIES,
  issueCodes: MOCK_ISSUE_CODES,
  costBook: MOCK_COST_BOOK,
  standardTemplates: INITIAL_TEMPLATES,
  governance: {
      alerts: [],
      auditLog: [],
      exchangeRates: { 'USD': 1.0, 'EUR': 0.92, 'GBP': 0.79, 'CAD': 1.36, 'AUD': 1.52, 'JPY': 151.4 },
      inflationRate: 0.03,
      riskTolerance: 'Moderate',
      strategicWeights: {},
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
      },
      organization: {
          name: 'Acme Corp Construction',
          shortName: 'ACME',
          taxId: 'XX-XXXXXXX',
          fiscalYearStart: 'January',
          timezone: 'UTC -5 (Eastern Time)',
          language: 'English (US)',
          currency: 'USD ($)'
      },
      notificationPreferences: DEFAULT_NOTIFICATION_PREFERENCES,
      billing: {
          licenseType: 'Enterprise Plus',
          renewalDate: '2024-12-31',
          seatLimit: 250,
          storageLimitGB: 1000,
          history: [
              { id: 'INV-4021', date: '2024-06-01', description: 'Enterprise Portfolio Plan (Annual)', amount: 12500, status: 'Paid' },
              { id: 'INV-3982', date: '2024-05-12', description: 'Add-on: AI Insights Pack', amount: 2500, status: 'Paid' },
              { id: 'INV-3810', date: '2024-04-01', description: 'Seat Expansion Pack (+100)', amount: 4500, status: 'Paid' },
          ]
      }
  },
  strategicGoals: MOCK_STRATEGIC_GOALS,
  strategicDrivers: MOCK_STRATEGIC_DRIVERS,
  portfolioScenarios: MOCK_PORTFOLIO_SCENARIOS,
  governanceDecisions: MOCK_GOVERNANCE_DECISIONS,
  esgMetrics: MOCK_ESG_METRICS,
  portfolioRisks: MOCK_PORTFOLIO_RISKS,
  programObjectives: MOCK_PROGRAM_OBJECTIVES,
  programOutcomes: MOCK_PROGRAM_OUTCOMES,
  programDependencies: MOCK_PROGRAM_DEPENDENCIES,
  programChangeRequests: MOCK_PROGRAM_CHANGE_REQUESTS,
  programRisks: MOCK_PROGRAM_RISKS,
  programIssues: MOCK_PROGRAM_ISSUES,
  programStakeholders: MOCK_PROGRAM_STAKEHOLDERS,
  programCommunicationPlan: MOCK_COMMUNICATION_PLAN,
  programAllocations: [],
  programFundingGates: [],
  programStageGates: MOCK_PROGRAM_STAGE_GATES,
  programTransitionItems: MOCK_PROGRAM_TRANSITION_ITEMS,
  integratedChanges: MOCK_INTEGRATED_CHANGES,
  governanceRoles: MOCK_GOVERNANCE_ROLES,
  governanceEvents: MOCK_GOVERNANCE_EVENTS,
  programQualityStandards: MOCK_PROGRAM_QUALITY_STANDARDS,
  programAssuranceReviews: MOCK_PROGRAM_ASSURANCE_REVIEWS,
  programArchitectureStandards: MOCK_PROGRAM_ARCHITECTURE_STANDARDS,
  programArchitectureReviews: MOCK_PROGRAM_ARCHITECTURE_REVIEWS,
  tradeoffScenarios: MOCK_TRADEOFF_SCENARIOS,
  contracts: MOCK_CONTRACTS,
  solicitations: MOCK_SOLICITATIONS,
  procurementPlans: MOCK_PROCUREMENT_PLANS,
  procurementPackages: MOCK_PROCUREMENT_PACKAGES,
  supplierReviews: MOCK_SUPPLIER_REVIEWS,
  claims: MOCK_CLAIMS,
  makeOrBuyAnalysis: [],
  globalChangeRules: [],
  invoices: MOCK_INVOICES,
  timesheets: MOCK_TIMESHEETS,
  skills: MOCK_ENTERPRISE_SKILLS,
  benefits: MOCK_BENEFITS,
  rbs: MOCK_RBS,
  vendors: MOCK_VENDORS,
  qualityStandards: MOCK_QUALITY_STANDARDS,
  unifier: {
      definitions: MOCK_BP_DEFS,
      records: MOCK_BP_RECORDS,
      costSheet: {
          columns: COST_SHEET_COLUMNS,
          rows: COST_SHEET_DATA
      },
      cashFlowCurves: [],
      fundAllocations: []
  },
  dailyLogs: [],
  safetyIncidents: [],
  punchList: [],
  roadmapLanes: MOCK_ROADMAP_LANES,
  roadmapItems: MOCK_ROADMAP_ITEMS,
  kanbanTasks: MOCK_KANBAN_TASKS,
  portfolioCommunicationPlan: MOCK_PORTFOLIO_COMM_PLAN,
  materialReceipts: MOCK_MATERIAL_RECEIPTS,
  activities: MOCK_ACTIVITIES,
  teamEvents: MOCK_TEAM_EVENTS,
  pipelineStages: MOCK_PIPELINE_STAGES,
  knowledgeBase: MOCK_KNOWLEDGE_ARTICLES,
  etlMappings: INITIAL_MAPPINGS,
  // Initializing new cost collections
  costReports: MOCK_COST_REPORTS,
  costMeetings: MOCK_COST_MEETINGS,
  costAlerts: MOCK_COST_ALERTS,
  systemMonitoring: {
      metrics: [],
      services: [],
      throughput: Array.from({length: 24}, (_, i) => ({ time: `${i}:00`, records: Math.floor(Math.random() * 5000) + 1000 }))
  },
  staging: {
      activeImportId: null,
      entityType: 'Project',
      records: [],
      isProcessing: false,
      summary: { total: 0, valid: 0, error: 0 }
  },
  // Extension Mock Data
  extensionData: {
      financial: {
          allocation: [
              { name: 'Growth', size: 450, color: '#0ea5e9' },
              { name: 'Run', size: 320, color: '#22c55e' },
              { name: 'Transform', size: 210, color: '#eab308' },
              { name: 'Regulatory', size: 120, color: '#64748b' }
          ],
          cashFlow: [
              { month: 'Jan', Operating: 120, Investing: -45, Financing: 30 },
              { month: 'Feb', Operating: 115, Investing: -50, Financing: 20 },
              { month: 'Mar', Operating: 130, Investing: -60, Financing: 10 },
              { month: 'Apr', Operating: 125, Investing: -30, Financing: 50 },
          ],
          regulatoryAudits: [
              { id: 'AUD-001', control: 'SOX 404', status: 'Pass', date: '2024-03-15' },
              { id: 'AUD-002', control: 'GDPR Data', status: 'Fail', date: '2024-02-10' },
          ],
          initiatives: [
              { name: 'AI Modernization', budget: 15000000, npv: 25000000 },
              { name: 'Cloud Migration', budget: 8500000, npv: 12000000 },
          ]
      },
      construction: {
          submittals: [
              { status: 'Open', count: 12 },
              { status: 'Approved', count: 45 },
              { status: 'Rejected', count: 3 },
              { status: 'Pending', count: 8 },
          ]
      },
      government: {
          fundsFlow: [
              { name: 'Appropriated', value: 50000000 },
              { name: 'Apportioned', value: 48000000 },
              { name: 'Allotted', value: 45000000 },
              { name: 'Committed', value: 42000000 },
              { name: 'Obligated', value: 38000000 },
              { name: 'Expended', value: 25000000 },
          ],
          fiscalYears: [
              { year: 'FY2023', phase: 'Execution', status: 'Active', color: 'bg-green-500' },
              { year: 'FY2024', phase: 'Enactment', status: 'Pending', color: 'bg-blue-500' },
              { year: 'FY2025', phase: 'Formulation', status: 'Draft', color: 'bg-purple-500' },
              { year: 'FY2026', phase: 'Planning', status: 'Future', color: 'bg-slate-400' },
          ],
          appropriations: [
              { type: 'O&M', years: '1 Year', exp: 'Sep 30', available: 12500000 },
              { type: 'RDT&E', years: '2 Years', exp: 'Sep 30 (Next)', available: 25000000 },
              { type: 'Procurement', years: '3 Years', exp: 'Sep 30 (+2)', available: 45000000 },
          ],
          treasuryStats: [
              { year: '2021', revenue: 3.8, outlay: 6.8 },
              { year: '2022', revenue: 4.9, outlay: 6.2 },
              { year: '2023', revenue: 4.4, outlay: 6.1 },
          ],
          acquisitionPrograms: [
              { name: 'Next Gen Fighter', milestone: 'MS-B', costVariance: 12 },
              { name: 'Cyber Defense Net', milestone: 'MS-C', costVariance: -5 },
              { name: 'Logistics ERP', milestone: 'IOC', costVariance: 2 },
          ],
          defenseStats: {
              readiness: '92%',
              personnel: '1.3M',
              budget: '$842B',
              cyberStatus: 'Secure',
              logisticsStatus: 'Warning'
          },
          energyStats: {
              gridLoad: '450 GW',
              capacity: '1200 GW',
              reserve: '650M BBL',
              renewablePercent: 24,
              renewableTarget: 40,
              mix: [
                  { source: 'Nuclear', output: 18, target: 20 },
                  { source: 'Coal', output: 19, target: 5 },
                  { source: 'Renewable', output: 24, target: 45 },
                  { source: 'Gas', output: 38, target: 30 },
              ]
          }
      },
      dod: {
          milestones: [
              { id: 'A', name: 'Material Solution', date: '2022-01-15', status: 'Complete', desc: 'Need identified' },
              { id: 'B', name: 'Engineering Dev', date: '2023-06-01', status: 'Complete', desc: 'Contract awarded' },
              { id: 'C', name: 'Production', date: '2025-01-01', status: 'Pending', desc: 'Low rate init' },
          ],
          phases: [
              { name: 'Materiel Solution Analysis', duration: '12mo', status: 'Complete' },
              { name: 'Tech Maturation (TMRR)', duration: '24mo', status: 'Complete' },
              { name: 'Engineering & Mfg (EMD)', duration: '36mo', status: 'In Progress' },
              { name: 'Production & Deployment', duration: '48mo', status: 'Planned' },
              { name: 'Operations & Support', duration: '20yr', status: 'Planned' },
          ],
          evmsData: [
              { period: 'Jan', BCWS: 100, BCWP: 95, ACWP: 98 },
              { period: 'Feb', BCWS: 200, BCWP: 190, ACWP: 205 },
              { period: 'Mar', BCWS: 300, BCWP: 280, ACWP: 310 },
              { period: 'Apr', BCWS: 400, BCWP: 350, ACWP: 420 },
              { period: 'May', BCWS: 500, BCWP: 420, ACWP: 530 },
          ],
          quadChart: {
              performance: [],
              schedule: [],
              cost: [],
              technical: []
          }
      },
      erpTransactions: [
          { id: 'TX-1001', type: 'PO Requisition', amount: 12500, status: 'Success', response: 'PO #4021 created' },
          { id: 'TX-1002', type: 'Invoice Payment', amount: 4500, status: 'Success', response: 'Payment cleared' },
          { id: 'TX-1003', type: 'Budget Transfer', amount: 5000, status: 'Failed', response: 'Insufficient funds in source cost center' },
      ],
      bim: {
          tree: [
              { id: '1', name: 'Architecture', visible: true, children: [
                  { id: '1.1', name: 'Walls', visible: true, children: [] },
                  { id: '1.2', name: 'Floors', visible: true, children: [] }
              ]},
              { id: '2', name: 'Structure', visible: true, children: [
                  { id: '2.1', name: 'Beams', visible: true, children: [] },
                  { id: '2.2', name: 'Columns', visible: true, children: [] }
              ]},
              { id: '3', name: 'MEP', visible: false, children: [] }
          ]
      },
      gis: {
          features: [
              { id: 'f1', name: 'Site Boundary', type: 'Polygon', coordinates: '10,10 100,10 100,100 10,100', properties: { fill: 'rgba(0,0,255,0.1)', stroke: 'blue' } },
              { id: 'f2', name: 'Exclusion Zone', type: 'Polygon', coordinates: '40,40 60,40 60,60 40,60', properties: { fill: 'rgba(255,0,0,0.2)', stroke: 'red' } }
          ]
      }
  }
};
