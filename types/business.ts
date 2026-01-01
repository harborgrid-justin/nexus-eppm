
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

// Added SecurityPolicy interface to support governance security settings
export interface SecurityPolicy {
  mfa: boolean;
  passwordComplexity: string;
  sessionLimit: number;
  ipLock: boolean;
  allowPublicLinks: boolean;
  enforceHttps: boolean;
  loginRetries: number;
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
  // Added security property to resolve errors in DataContext and rootReducer
  security: SecurityPolicy;
}
