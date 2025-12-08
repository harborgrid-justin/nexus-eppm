import { Project, TaskStatus, Resource, Extension, WBSNode, Stakeholder, ProcurementPackage, QualityReport, CommunicationLog } from './types';

export const MOCK_RESOURCES: Resource[] = [
  { id: 'R1', name: 'Sarah Chen', role: 'Project Manager', capacity: 40, allocated: 35, hourlyRate: 150 },
  { id: 'R2', name: 'Mike Ross', role: 'Civil Engineer', capacity: 40, allocated: 42, hourlyRate: 120 },
  { id: 'R3', name: 'Jessica Pearson', role: 'Architect', capacity: 30, allocated: 10, hourlyRate: 180 },
  { id: 'R4', name: 'Harvey Specter', role: 'Legal Counsel', capacity: 20, allocated: 15, hourlyRate: 250 },
  { id: 'R5', name: 'Louis Litt', role: 'Financial Analyst', capacity: 40, allocated: 38, hourlyRate: 110 },
];

export const MOCK_STAKEHOLDERS: Stakeholder[] = [
  { id: 'STK-01', projectId: 'P1001', name: 'City Transit Authority', role: 'Client', interest: 'High', influence: 'High', engagementStrategy: 'Manage Closely - Weekly progress meetings.' },
  { id: 'STK-02', projectId: 'P1001', name: 'State Environmental Dept.', role: 'Regulator', interest: 'Medium', influence: 'High', engagementStrategy: 'Keep Satisfied - Monthly compliance reports.' },
  { id: 'STK-03', projectId: 'P1001', name: 'Local Community Board', role: 'End User Rep', interest: 'High', influence: 'Medium', engagementStrategy: 'Keep Informed - Bi-weekly newsletters.' },
  { id: 'STK-04', projectId: 'P1001', name: 'Steel Suppliers Inc.', role: 'Vendor', interest: 'Low', influence: 'Low', engagementStrategy: 'Monitor - Regular PO follow-ups.' },
];

export const MOCK_PROCUREMENT: ProcurementPackage[] = [
  { id: 'PROC-01', projectId: 'P1001', name: 'Structural Steel Supply', vendor: 'Steel Suppliers Inc.', value: 8500000, status: 'Awarded', deliveryDate: '2024-07-15' },
  { id: 'PROC-02', projectId: 'P1001', name: 'Tunnel Boring Machine Lease', vendor: 'Heavy Equipment Co.', value: 12000000, status: 'Bidding', deliveryDate: '2024-08-01' },
  { id: 'PROC-03', projectId: 'P1001', name: 'Signaling System', vendor: '', value: 4200000, status: 'Draft', deliveryDate: '2025-01-20' },
];

export const MOCK_QUALITY_REPORTS: QualityReport[] = [
  { id: 'QR-01', projectId: 'P1001', date: '2024-05-10', type: 'Test', status: 'Pass', details: { testType: 'Concrete Cylinder Break', reference: 'ASTM C39', value: '4200 PSI', requirement: '4000 PSI' } },
  { id: 'QR-02', projectId: 'P1001', date: '2024-05-15', type: 'Inspection', status: 'Fail', details: { inspectionType: 'Rebar Placement', finding: 'Incorrect spacing at grid line C', correctiveAction: 'Adjust spacing per drawing S-101' } },
  { id: 'QR-03', projectId: 'P1001', date: '2024-05-20', type: 'Audit', status: 'Pass', details: { auditType: 'Safety Compliance', summary: 'All PPE requirements met.' } },
  { id: 'QR-04', projectId: 'P1001', date: '2024-05-25', type: 'Test', status: 'Pass', details: { testType: 'Soil Compaction', reference: 'Proctor Test', value: '98%', requirement: '>95%' } },
];

export const MOCK_COMM_LOGS: CommunicationLog[] = [
  { id: 'CL-01', projectId: 'P1001', date: '2024-06-01', type: 'Meeting', subject: 'Weekly Progress Review', participants: ['Sarah Chen', 'City Transit Authority'], summary: 'Reviewed schedule progress, no major issues. CTA requested update on steel procurement.' },
  { id: 'CL-02', projectId: 'P1001', date: '2024-06-03', type: 'Email', subject: 'RE: Steel Procurement Status', participants: ['Sarah Chen', 'Louis Litt'], summary: 'Confirmed PO issued and delivery date is on track for July 15.' },
  { id: 'CL-03', projectId: 'P1001', date: '2024-06-05', type: 'Official Letter', subject: 'Environmental Compliance Report #5', participants: ['Harvey Specter', 'State Environmental Dept.'], summary: 'Submitted monthly dust control and water runoff report.' },
];

const MOCK_WBS: WBSNode[] = [
  { id: 'WBS-1', wbsCode: '1', name: 'Project Management & Design', description: 'Overall project management, administration, engineering, and design work.', children: [
    { id: 'WBS-1.1', wbsCode: '1.1', name: 'Permitting and Environmental', description: 'All activities related to securing permits and ensuring environmental compliance.', children: [] },
    { id: 'WBS-1.2', wbsCode: '1.2', name: 'Detailed Design', description: 'Finalizing architectural and engineering drawings and specifications.', children: [] },
  ]},
  { id: 'WBS-2', wbsCode: '2', name: 'Site Work', description: 'Preparation of the construction site.', children: [
    { id: 'WBS-2.1', wbsCode: '2.1', name: 'Excavation', description: 'Earthwork and excavation for the new metro line foundations.', children: [] },
    { id: 'WBS-2.2', wbsCode: '2.2', name: 'Utilities', description: 'Relocation and installation of all necessary site utilities.', children: [] },
  ]},
  { id: 'WBS-3', wbsCode: '3', name: 'Construction', description: 'Physical construction of the metro line extension.', children: [
     { id: 'WBS-3.1', wbsCode: '3.1', name: 'Substructure', description: 'Foundation and below-ground structural work.', children: [] },
     { id: 'WBS-3.2', wbsCode: '3.2', name: 'Superstructure', description: 'Above-ground structural work, including stations and track.', children: [] },
  ]},
];


export const MOCK_PROJECTS: Project[] = [
  {
    id: 'P1001',
    name: 'Metro Line Extension - Phase 2',
    code: 'NY-MET-002',
    manager: 'Sarah Chen',
    budget: 45000000,
    spent: 12500000,
    startDate: '2024-01-01',
    endDate: '2025-12-31',
    health: 'Warning',
    wbs: MOCK_WBS,
    calendar: { id: 'CAL1', name: 'Standard', workingDays: [1, 2, 3, 4, 5], holidays: [] },
    baselines: [{
      id: 'BL1',
      name: 'Initial Baseline',
      date: '2024-01-15',
      taskBaselines: {
        'T1': { baselineStartDate: '2024-01-05', baselineEndDate: '2024-02-15' },
        'T2': { baselineStartDate: '2024-02-16', baselineEndDate: '2024-03-30' },
        'T3': { baselineStartDate: '2024-04-01', baselineEndDate: '2024-06-10' }, // Was 10, now 15
        'T4': { baselineStartDate: '2024-04-10', baselineEndDate: '2024-05-15' }, // Was 15, now 20
        'T5': { baselineStartDate: '2024-06-11', baselineEndDate: '2024-09-25' },
        'T6': { baselineStartDate: '2024-08-01', baselineEndDate: '2024-10-15' },
      }
    }],
    tasks: [
      {
        id: 'T1',
        wbsCode: '1.1',
        name: 'Environmental Impact Study',
        startDate: '2024-01-05',
        endDate: '2024-02-15',
        duration: 29, // Working days
        status: TaskStatus.COMPLETED,
        progress: 100,
        assignedResources: ['R2', 'R4'],
        dependencies: [],
        critical: true,
        type: 'Task',
        effortType: 'Fixed Duration',
        work: 240, // hours
      },
      {
        id: 'T2',
        wbsCode: '1.2',
        name: 'Design Approval Milestone',
        startDate: '2024-03-30',
        endDate: '2024-03-30',
        duration: 0,
        status: TaskStatus.COMPLETED,
        progress: 100,
        assignedResources: ['R3', 'R2'],
        dependencies: [{ targetId: 'T1', type: 'FS', lag: 0 }],
        critical: true,
        type: 'Milestone',
        effortType: 'Fixed Duration',
      },
      {
        id: 'T3',
        wbsCode: '2.1',
        name: 'Site Preparation & Excavation',
        startDate: '2024-04-01',
        endDate: '2024-06-15',
        duration: 54, // Working days
        status: TaskStatus.IN_PROGRESS,
        progress: 65,
        assignedResources: ['R2'],
        dependencies: [{ targetId: 'T2', type: 'FS', lag: 0 }],
        critical: true,
        type: 'Task',
        effortType: 'Fixed Work',
        work: 400,
      },
      {
        id: 'T4',
        wbsCode: '2.2',
        name: 'Procurement of Steel',
        startDate: '2024-04-10',
        endDate: '2024-05-20',
        duration: 29, // Working days
        status: TaskStatus.DELAYED,
        progress: 40,
        assignedResources: ['R5'],
        dependencies: [{ targetId: 'T2', type: 'FS', lag: 5 }],
        critical: false,
        type: 'Task',
        effortType: 'Fixed Duration',
        work: 160,
      },
      {
        id: 'T5',
        wbsCode: '3.1',
        name: 'Substructure Construction',
        startDate: '2024-06-16',
        endDate: '2024-09-30',
        duration: 75, // Working days
        status: TaskStatus.NOT_STARTED,
        progress: 0,
        assignedResources: ['R2', 'R3'],
        dependencies: [{ targetId: 'T3', type: 'FS', lag: 0 }],
        critical: true,
        type: 'Task',
        effortType: 'Fixed Work',
        work: 1200,
      },
       {
        id: 'T6',
        wbsCode: '3.2',
        name: 'Electrical Systems Rough-in',
        startDate: '2024-08-01',
        endDate: '2024-10-15',
        duration: 54, // Working days
        status: TaskStatus.NOT_STARTED,
        progress: 0,
        assignedResources: ['R2'],
        dependencies: [{ targetId: 'T3', type: 'FS', lag: 30 }],
        critical: false,
        type: 'Task',
        effortType: 'Fixed Work',
        work: 600
      }
    ]
  },
  {
    id: 'P1002',
    name: 'Downtown Commercial Hub',
    code: 'CHI-COM-088',
    manager: 'David Lee',
    budget: 12000000,
    spent: 500000,
    startDate: '2024-05-01',
    endDate: '2026-02-28',
    health: 'Good',
    tasks: []
  }
];

export const EXTENSIONS_REGISTRY: Extension[] = [
  // Construction Tech
  { id: 'ext_bim', name: 'BIM 360 Viewer', category: 'Construction', description: 'Interactive 3D model viewer and clash detection.', icon: 'Box', status: 'Available', version: '2.1', viewType: 'viewer3d' },
  { id: 'ext_drones', name: 'Drone Deploy', category: 'Construction', description: 'Aerial site surveys and photogrammetry integration.', icon: 'Plane', status: 'Available', version: '1.4', viewType: 'map' },
  { id: 'ext_iot', name: 'IoT Site Sensors', category: 'Operations', description: 'Real-time environmental and equipment telemetry.', icon: 'Radio', status: 'Installed', version: '3.0', installedDate: '2023-11-15', viewType: 'dashboard' },
  
  // Financials
  { id: 'ext_est', name: 'ProEstimator', category: 'Financials', description: 'Detailed quantity takeoff and cost estimation.', icon: 'Calculator', status: 'Available', version: '4.2', viewType: 'grid' },
  { id: 'ext_inv', name: 'Invoice AI', category: 'Financials', description: 'Automated invoice processing and approval workflows.', icon: 'Receipt', status: 'Active', version: '2.0', installedDate: '2023-10-01', viewType: 'grid' },
  { id: 'ext_pay', name: 'Payroll Connect', category: 'Financials', description: 'Sync timesheets with external payroll providers.', icon: 'Banknote', status: 'Available', version: '1.1', viewType: 'grid' },
  { id: 'ext_cash', name: 'Cash Flow Forecast', category: 'Financials', description: 'Predictive cash flow analysis based on schedule.', icon: 'TrendingUp', status: 'Available', version: '1.5', viewType: 'dashboard' },

  // Supply Chain
  { id: 'ext_proc', name: 'Procurement Hub', category: 'Operations', description: 'Manage RFQs, POs, and vendor performance.', icon: 'ShoppingCart', status: 'Available', version: '2.3', viewType: 'grid' },
  { id: 'ext_mat', name: 'Material Track', category: 'Operations', description: 'QR-code based material inventory and tracking.', icon: 'Package', status: 'Available', version: '1.0', viewType: 'grid' },
  { id: 'ext_fleet', name: 'Fleet Command', category: 'Operations', description: 'Heavy equipment GPS tracking and maintenance.', icon: 'Truck', status: 'Available', version: '3.1', viewType: 'map' },
  
  // Field Operations
  { id: 'ext_daily', name: 'Daily Site Log', category: 'Construction', description: 'Digital daily construction reports and weather logs.', icon: 'Clipboard', status: 'Active', version: '5.0', installedDate: '2024-01-10', viewType: 'form' },
  { id: 'ext_punch', name: 'Punch List Pro', category: 'Construction', description: 'Mobile-first deficiency management and closeout.', icon: 'CheckSquare', status: 'Available', version: '2.2', viewType: 'grid' },
  { id: 'ext_rfi', name: 'RFI Manager', category: 'Construction', description: 'Streamlined Request for Information workflows.', icon: 'MessageSquare', status: 'Available', version: '1.8', viewType: 'grid' },
  { id: 'ext_sub', name: 'Submittal Exchange', category: 'Construction', description: 'Manage shop drawing approvals and revisions.', icon: 'FileInput', status: 'Available', version: '1.6', viewType: 'grid' },

  // Compliance & HSE
  { id: 'ext_safe', name: 'Safety First', category: 'Compliance', description: 'Incident reporting, JHAs, and safety audits.', icon: 'Shield', status: 'Active', version: '3.3', installedDate: '2023-09-20', viewType: 'dashboard' },
  { id: 'ext_permit', name: 'Permit Tracker', category: 'Compliance', description: 'Municipal permit statuses and expiration alerts.', icon: 'FileBadge', status: 'Available', version: '1.2', viewType: 'grid' },
  { id: 'ext_green', name: 'LEED Calculator', category: 'Compliance', description: 'Sustainability scoring and carbon footprint tracking.', icon: 'Leaf', status: 'Available', version: '2.0', viewType: 'dashboard' },
  { id: 'ext_qual', name: 'Quality Matrix', category: 'Compliance', description: 'ITP management and non-conformance reports.', icon: 'Award', status: 'Available', version: '1.4', viewType: 'grid' },

  // Analytics & Risk
  { id: 'ext_monte', name: 'Monte Carlo Sim', category: 'Analytics', description: 'Probabilistic schedule and cost risk analysis.', icon: 'ScatterChart', status: 'Available', version: '2.5', viewType: 'dashboard' },
  { id: 'ext_evm', name: 'EVM Engine', category: 'Analytics', description: 'Advanced Earned Value Management metrics.', icon: 'BarChart2', status: 'Available', version: '1.9', viewType: 'dashboard' },
  { id: 'ext_powerbi', name: 'PowerBI Connect', category: 'Analytics', description: 'Embed PowerBI dashboards directly.', icon: 'PieChart', status: 'Installed', version: '4.0', installedDate: '2024-02-15', viewType: 'dashboard' },
  
  // Admin
  { id: 'ext_meet', name: 'Meeting Minutes', category: 'Operations', description: 'Track meeting items and assign action items.', icon: 'Users', status: 'Available', version: '1.1', viewType: 'grid' },
  { id: 'ext_photo', name: 'Photo Gallery', category: 'Construction', description: 'Geo-tagged project photo timeline.', icon: 'Camera', status: 'Available', version: '1.3', viewType: 'grid' },
  { id: 'ext_spec', name: 'Spec Reader', category: 'Design', description: 'AI-assisted specification analysis.', icon: 'BookOpen', status: 'Available', version: '0.9', viewType: 'viewer3d' },
  { id: 'ext_warr', name: 'Warranty Mgr', category: 'Operations', description: 'Post-construction warranty claims tracking.', icon: 'Umbrella', status: 'Available', version: '1.0', viewType: 'grid' },
  { id: 'ext_bid', name: 'Bid Leveler', category: 'Financials', description: 'Compare subcontractor bids side-by-side.', icon: 'Scale', status: 'Available', version: '2.1', viewType: 'grid' },
  { id: 'ext_time', name: 'Time Kiosk', category: 'Operations', description: 'Tablet-based clock-in/out for field labor.', icon: 'Watch', status: 'Available', version: '3.0', viewType: 'form' },
  { id: 'ext_weath', name: 'Weather Log', category: 'Construction', description: 'Historical and forecast weather impact analysis.', icon: 'CloudRain', status: 'Available', version: '1.5', viewType: 'dashboard' },
  { id: 'ext_clash', name: 'Clash Detect', category: 'Design', description: 'Automated geometric conflict resolution.', icon: 'AlertOctagon', status: 'Available', version: '2.2', viewType: 'viewer3d' },
  { id: 'ext_mark', name: 'Draw Markup', category: 'Design', description: 'Redline drawings and PDF overlays.', icon: 'PenTool', status: 'Available', version: '1.7', viewType: 'viewer3d' }
];