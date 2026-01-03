
import { Integration, GovernanceRole, GovernanceEvent } from '../../types/index';
import React from 'react';
import { Database, Server, Globe, Link } from 'lucide-react';

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

export const MOCK_CONNECTORS = [
    { id: 1, name: 'SAP S/4HANA Finance', type: 'ERP', status: 'Active', protocol: 'OData v4', lastSync: '2m ago', icon: Database, health: 'Good', endpoint: 'https://api.sap.corp/odata/v4' },
    { id: 2, name: 'Oracle Primavera P6', type: 'Schedule', status: 'Active', protocol: 'SOAP/Web Services', lastSync: '1h ago', icon: Server, health: 'Good', endpoint: 'https://p6.oraclecloud.com/ws' },
    { id: 3, name: 'Microsoft Project Online', type: 'Schedule', status: 'Error', protocol: 'REST API', lastSync: '1d ago', icon: Globe, health: 'Critical', endpoint: 'https://graph.microsoft.com/v1.0' },
    { id: 4, name: 'Autodesk Construction Cloud', type: 'Docs', status: 'Inactive', protocol: 'Forge API', lastSync: '-', icon: Link, health: 'Unknown', endpoint: 'https://developer.api.autodesk.com' },
    { id: 5, name: 'Legacy Mainframe', type: 'Data', status: 'Active', protocol: 'JDBC', lastSync: '4h ago', icon: Server, health: 'Warning', endpoint: 'jdbc:db2://mainframe:50000/DATA' },
];
