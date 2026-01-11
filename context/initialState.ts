
import { DataState } from '../types/index';

export const initialState: DataState = {
  projects: [],
  programs: [],
  resources: [],
  resourceRequests: [],
  risks: [],
  issues: [],
  budgetItems: [],
  expenses: [],
  changeOrders: [],
  purchaseOrders: [],
  qualityReports: [],
  nonConformanceReports: [],
  communicationLogs: [],
  stakeholders: [],
  documents: [],
  activityCodes: [],
  userDefinedFields: [],
  fundingSources: [],
  calendars: [],
  users: [],
  roles: [],
  eps: [],
  obs: [],
  locations: [],
  workflows: [],
  dataJobs: [],
  integrations: [],
  extensions: [],
  expenseCategories: [],
  issueCodes: [],
  costBook: [],
  standardTemplates: [],
  governance: {
      alerts: [],
      auditLog: [],
      exchangeRates: { 'USD': 1.0, 'EUR': 0.92, 'GBP': 0.78 },
      inflationRate: 0.035,
      riskTolerance: 'Moderate',
      strategicWeights: { 'financial': 0.5, 'strategic': 0.3, 'risk': 0.2 },
      vendorBlacklist: [],
      scoringCriteria: [
          { id: 'strategic', name: 'Strategic Alignment', weight: 0.4, description: 'Direct contribution to corporate goals.' },
          { id: 'financial', name: 'NPV / ROI', weight: 0.3, description: 'Projected financial return.' },
          { id: 'risk', name: 'Risk Profile', weight: 0.2, description: 'Inherent execution uncertainty.' },
          { id: 'feasibility', name: 'Resource Availability', weight: 0.1, description: 'Ability to staff without conflict.' }
      ],
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
          allowedIps: [],
          allowPublicLinks: false,
          enforceHttps: true,
          loginRetries: 5
      },
      organization: {
          name: 'Acme Corp Construction',
          shortName: 'ACC',
          taxId: 'TX-99201-B',
          fiscalYearStart: 'January',
          timezone: 'UTC -5 (Eastern Time)',
          language: 'English (US)',
          currency: 'USD'
      },
      notificationPreferences: [],
      billing: {
          licenseType: 'Enterprise',
          renewalDate: '2024-12-31',
          seatLimit: 500,
          storageLimitGB: 1000,
          history: []
      }
  },
  strategicGoals: [],
  strategicDrivers: [],
  portfolioScenarios: [],
  governanceDecisions: [],
  esgMetrics: [],
  portfolioRisks: [],
  programObjectives: [],
  programOutcomes: [],
  programDependencies: [],
  programChangeRequests: [],
  programRisks: [],
  programIssues: [],
  programStakeholders: [],
  programCommunicationPlan: [],
  programAllocations: [],
  programFundingGates: [],
  programStageGates: [],
  programTransitionItems: [],
  integratedChanges: [],
  governanceRoles: [],
  governanceEvents: [],
  programQualityStandards: [],
  programAssuranceReviews: [],
  programArchitectureStandards: [],
  programArchitectureReviews: [],
  tradeoffScenarios: [],
  contracts: [],
  solicitations: [],
  procurementPlans: [],
  procurementPackages: [],
  supplierReviews: [],
  claims: [],
  makeOrBuyAnalysis: [],
  globalChangeRules: [],
  invoices: [],
  timesheets: [],
  skills: [],
  benefits: [],
  rbs: [],
  vendors: [],
  qualityStandards: [],
  unifier: {
      definitions: [],
      records: [],
      costSheet: {
          columns: [],
          rows: []
      },
      cashFlowCurves: [],
      fundAllocations: []
  },
  dailyLogs: [],
  safetyIncidents: [],
  punchList: [],
  roadmapLanes: [],
  roadmapItems: [],
  kanbanTasks: [],
  portfolioCommunicationPlan: [],
  materialReceipts: [],
  activities: [],
  teamEvents: [],
  pipelineStages: [],
  knowledgeBase: [],
  etlMappings: [],
  costReports: [],
  costMeetings: [],
  costAlerts: [],
  reportDefinitions: [],
  systemMonitoring: {
      metrics: [
          { id: 'm-db-size', name: 'Database Size', value: 142.4, unit: 'MB', threshold: 1000, trend: [120, 125, 130, 142] },
          { id: 'm-schema', name: 'Schema Version', value: 2.4, unit: 'v', threshold: 3.0, trend: [] },
          { id: 'm-backup', name: 'Last Backup', value: 4, unit: 'mins ago', threshold: 60, trend: [] }
      ],
      services: [
          { id: 'svc-api', name: 'Core API Gateway', status: 'Operational', uptime: '99.99%', latency: '12ms' },
          { id: 'svc-sched', name: 'CPM Engine', status: 'Operational', uptime: '100%', latency: '45ms' },
          { id: 'svc-erp', name: 'SAP Bridge', status: 'Degraded', uptime: '98.5%', latency: '240ms' }
      ],
      throughput: [
          { time: '10:00', records: 450 },
          { time: '11:00', records: 620 },
          { time: '12:00', records: 890 },
          { time: '13:00', records: 710 }
      ]
  },
  staging: {
      activeImportId: null,
      entityType: 'Project',
      records: [],
      isProcessing: false,
      summary: { total: 0, valid: 0, error: 0 }
  },
  extensionData: {
      financial: { allocation: [], cashFlow: [], regulatoryAudits: [], initiatives: [] },
      construction: { submittals: [ { status: 'Pending', count: 14 }, { status: 'Approved', count: 42 }, { status: 'Rejected', count: 3 } ] },
      government: { fundsFlow: [], fiscalYears: [], appropriations: [], treasuryStats: [], acquisitionPrograms: [], defenseStats: { readiness: 'N/A', personnel: 'N/A', budget: 'N/A', cyberStatus: 'Unknown', logisticsStatus: 'Unknown' }, energyStats: { gridLoad: 'N/A', capacity: 'N/A', reserve: 'N/A', renewablePercent: 0, renewableTarget: 0, mix: [] } },
      dod: { milestones: [], phases: [], evmsData: [], quadChart: { performance: [], schedule: [], cost: [], technical: [] } },
      erpTransactions: [
          { id: 'ERP-TX-001', type: 'Journal Entry', amount: 45000, status: 'Success', response: 'Committed to S/4HANA' },
          { id: 'ERP-TX-002', type: 'AP Invoice', amount: 125000, status: 'Success', response: 'Voucher #99201 generated' },
          { id: 'ERP-TX-003', type: 'PO Release', amount: 8000, status: 'Failed', response: 'Cost center authorization failure' }
      ],
      bim: { 
          tree: [
              { id: 'bim-01', name: 'Substructure', visible: true, children: [ { id: 'bim-01-1', name: 'Pile Caps', visible: true }, { id: 'bim-01-2', name: 'Grade Beams', visible: true } ] },
              { id: 'bim-02', name: 'Superstructure', visible: true, children: [ { id: 'bim-02-1', name: 'Steel Frame', visible: true } ] }
          ]
      },
      gis: { 
          features: [
              { id: 'gis-01', name: 'Site Boundary', type: 'Polygon', coordinates: '100,100 400,100 400,400 100,400', properties: { fill: 'rgba(59, 130, 246, 0.1)', stroke: '#3b82f6' } },
              { id: 'gis-02', name: 'Crane Area', type: 'Polygon', coordinates: '200,200 300,200 300,300 200,300', properties: { fill: 'rgba(239, 68, 68, 0.1)', stroke: '#ef4444' } }
          ]
      }
  }
};
