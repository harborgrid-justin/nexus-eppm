
export type AlertSeverity = 'Info' | 'Warning' | 'Critical' | 'Blocker';
export type AlertCategory = 'Finance' | 'Schedule' | 'Resource' | 'Risk' | 'Strategy' | 'Compliance' | 'Quality' | 'Portfolio' | 'Governance' | 'Supply Chain' | 'ESG' | 'IT' | 'Architecture';

export interface SystemAlert {
  id: string;
  date: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  link?: { type: 'Project' | 'Program' | 'Risk' | 'Task' | 'Vendor'; id: string };
  isRead: boolean;
}

export interface SchedulingLogic {
  retainedLogic: boolean;
  calculateCriticalPathUsing: 'Total Float' | 'Longest Path';
  computeMultipleFloatPaths: boolean;
  floatPathTaskCount: number;
  autoSaveOnSchedule: boolean;
  defaultTaskType: 'Fixed Duration' | 'Fixed Units' | 'Fixed Units/Time';
}

export interface ResourceGlobals {
  defaultWorkHoursPerDay: number;
  autoLevelingThreshold: number;
  usePricePerUnitForCost: boolean;
  allowOvertimeInPlanning: boolean;
}

export interface SecurityPolicy {
  mfa: boolean;
  passwordComplexity: string;
  sessionLimit: number;
  ipLock: boolean;
  allowPublicLinks: boolean;
  enforceHttps: boolean;
  loginRetries: number;
}

export interface OrganizationProfile {
    name: string;
    shortName: string;
    taxId: string;
    fiscalYearStart: string;
    timezone: string;
    language: string;
    currency: string;
    logoUrl?: string;
}

export interface NotificationPreference {
    id: string;
    label: string;
    email: boolean;
    app: boolean;
    sms: boolean;
}

export interface SystemMetric {
    id: string;
    name: string;
    value: number;
    unit: string;
    threshold: number;
    trend: number[];
}

export interface ServiceStatus {
    id: string;
    name: string;
    status: 'Operational' | 'Degraded' | 'Down';
    uptime: string;
    latency: string;
}

export interface BillingRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  invoiceUrl?: string;
}

export interface BillingState {
    licenseType: 'Enterprise' | 'Enterprise Plus' | 'Standard';
    renewalDate: string;
    seatLimit: number;
    storageLimitGB: number;
    history: BillingRecord[];
}

export interface GovernanceState {
  alerts: SystemAlert[];
  auditLog: any[];
  exchangeRates: Record<string, number>;
  inflationRate: number;
  riskTolerance: 'Aggressive' | 'Moderate' | 'Conservative';
  strategicWeights: Record<string, number>;
  vendorBlacklist: string[];
  scheduling: SchedulingLogic;
  resourceDefaults: ResourceGlobals;
  security: SecurityPolicy;
  organization: OrganizationProfile;
  notificationPreferences: NotificationPreference[];
  billing: BillingState;
}

export interface PipelineStage {
    id: string;
    name: string;
    status: 'pending' | 'running' | 'success' | 'failed';
    duration: string;
    logs: string[];
}

export interface KnowledgeArticle {
    id: string;
    title: string;
    category: string;
    content: string; // HTML/Markdown
    authorId: string;
    lastUpdated: string;
    views: number;
    tags: string[];
    sopNumber?: string;
}
