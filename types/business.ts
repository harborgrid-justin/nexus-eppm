
import { ActivityCodeScope } from './common';

export type AlertSeverity = 'Info' | 'Warning' | 'Critical' | 'Blocker';
export type AlertCategory = 'Finance' | 'Schedule' | 'Resource' | 'Risk' | 'Strategy' | 'Compliance';

export interface SystemAlert {
  id: string;
  date: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  link?: { type: 'Project' | 'Program' | 'Risk'; id: string };
  isRead: boolean;
}

export interface GovernanceRule {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  threshold?: number;
}

// Extension to Global State for Governance
export interface GovernanceState {
  alerts: SystemAlert[];
  auditLog: any[];
  exchangeRates: Record<string, number>; // Hook #3
  riskTolerance: 'Aggressive' | 'Moderate' | 'Conservative'; // Hook #14
  strategicWeights: Record<string, number>; // Hook #17
  vendorBlacklist: string[]; // Hook #12
}
