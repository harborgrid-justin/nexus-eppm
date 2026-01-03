
import { Integration, GovernanceRole, GovernanceEvent } from '../../types/index';
import React from 'react';
import { Database, Server, Globe, Link } from 'lucide-react';

export const MOCK_INTEGRATIONS: Integration[] = [
  { id: 'INT-01', name: 'SAP S/4HANA Finance', type: 'ERP', status: 'Connected', lastSync: '2m ago', logo: 'SAP', protocol: 'OData v4', endpoint: 'https://api.sap.corp/odata/v4', health: 'Good' },
  { id: 'INT-02', name: 'Oracle Primavera P6', type: 'Schedule', status: 'Connected', lastSync: '1h ago', logo: 'P6', protocol: 'SOAP / WSDL', endpoint: 'https://p6.oraclecloud.com/ws', health: 'Good' },
  { id: 'INT-03', name: 'Microsoft Project Online', type: 'Schedule', status: 'Error', lastSync: '1d ago', logo: 'MSP', protocol: 'REST API', endpoint: 'https://graph.microsoft.com/v1.0', health: 'Critical' },
  { id: 'INT-04', name: 'Autodesk Construction Cloud', type: 'Document', status: 'Disconnected', lastSync: '2d ago', logo: 'BIM', protocol: 'REST API', endpoint: 'https://developer.api.autodesk.com', health: 'Unknown' },
  { id: 'INT-05', name: 'Legacy Mainframe', type: 'Data', status: 'Active', lastSync: '4h ago', logo: 'DB2', protocol: 'JDBC', endpoint: 'jdbc:db2://mainframe:50000/DATA', health: 'Warning' },
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

// Deprecated: Use MOCK_INTEGRATIONS instead
export const MOCK_CONNECTORS = [];
