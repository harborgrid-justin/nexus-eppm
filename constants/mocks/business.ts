
import { Integration, GovernanceRole, GovernanceEvent } from '../../types/index';
import React from 'react';

export const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'INT-01', name: 'SAP S/4HANA', type: 'ERP', status: 'Connected', lastSync: '15m ago', logo: 'SAP' },
  { id: 'INT-02', name: 'Oracle Primavera', type: 'Scheduling', status: 'Connected', lastSync: '1h ago', logo: 'P6' },
  { id: 'INT-03', name: 'Autodesk BIM 360', type: 'Document', status: 'Disconnected', lastSync: '2d ago', logo: 'BIM' },
];

export const MOCK_GOVERNANCE_ROLES: GovernanceRole[] = [
    { id: 'GR-1', programId: 'PRG-001', role: 'Sponsor', assigneeId: 'Jessica Pearson', authorityLevel: 'High', responsibilities: 'Final say on budget and scope.'},
    { id: 'GR-2', programId: 'PRG-001', role: 'Steering Committee', assigneeId: 'Board', authorityLevel: 'High', responsibilities: 'Oversees strategic alignment.'},
    { id: 'GR-3', programId: 'PRG-001', role: 'Program Manager', assigneeId: 'Justin Saadein', authorityLevel: 'Medium', responsibilities: 'Day-to-day program execution.'}
];

export const MOCK_GOVERNANCE_EVENTS: GovernanceEvent[] = [
    { id: 'GE-1', programId: 'PRG-001', name: 'Monthly Review', type: 'Steering Committee', frequency: 'Monthly', nextDate: '2024-07-15' },
    { id: 'GE-2', programId: 'PRG-001', name: 'Architecture Board', type: 'Technical Review', frequency: 'Quarterly', nextDate: '2024-08-01' }
];
