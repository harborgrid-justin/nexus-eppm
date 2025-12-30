
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

export interface GovernanceState {
  alerts: SystemAlert[];
  auditLog: any[];
  exchangeRates: Record<string, number>;
  inflationRate: number; // New Hook 36
  riskTolerance: 'Aggressive' | 'Moderate' | 'Conservative';
  strategicWeights: Record<string, number>;
  vendorBlacklist: string[];
}