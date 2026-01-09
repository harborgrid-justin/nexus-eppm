
import { EPSNode, OBSNode, Location } from '../../types';

export const MOCK_EPS: EPSNode[] = [
  { id: 'EPS-ROOT', parentId: null, name: 'Nexus Enterprise', code: 'NEX' },
  { id: 'EPS-ENG', parentId: 'EPS-ROOT', name: 'Engineering & Construction', code: 'E&C' },
  { id: 'EPS-IT', parentId: 'EPS-ROOT', name: 'Information Technology', code: 'IT' },
  
  // E&C Sub-nodes
  { id: 'EPS-INFRA', parentId: 'EPS-ENG', name: 'Infrastructure', code: 'INFRA' },
  { id: 'EPS-COMM', parentId: 'EPS-ENG', name: 'Commercial', code: 'COMM' },
  { id: 'EPS-RES', parentId: 'EPS-ENG', name: 'Residential', code: 'RES' },
  { id: 'EPS-IND', parentId: 'EPS-ENG', name: 'Industrial', code: 'IND' },

  // IT Sub-nodes
  { id: 'EPS-APP', parentId: 'EPS-IT', name: 'Application Development', code: 'APP' },
  { id: 'EPS-SEC', parentId: 'EPS-IT', name: 'Cybersecurity', code: 'SEC' },
  { id: 'EPS-OPS', parentId: 'EPS-IT', name: 'IT Operations', code: 'OPS' },
];

export const MOCK_OBS: OBSNode[] = [
  { id: 'OBS-ROOT', parentId: null, name: 'Executive Board', managerId: 'R-001' },
  { id: 'OBS-PMO', parentId: 'OBS-ROOT', name: 'Global PMO', managerId: 'R-001' },
  
  // Regions
  { id: 'OBS-NA', parentId: 'OBS-PMO', name: 'North America Operations', managerId: 'R-002' },
  { id: 'OBS-EMEA', parentId: 'OBS-PMO', name: 'EMEA Operations', managerId: 'R-003' },
  { id: 'OBS-APAC', parentId: 'OBS-PMO', name: 'APAC Operations', managerId: 'R-001' },

  // Departments
  { id: 'OBS-ENG', parentId: 'OBS-NA', name: 'Engineering Dept', managerId: 'R-CON-01' },
  { id: 'OBS-FIN', parentId: 'OBS-NA', name: 'Finance Dept', managerId: 'R-003' },
];

export const MOCK_LOCATIONS: Location[] = [
  { id: 'LOC-NY', name: 'New York HQ', country: 'USA', city: 'New York', coordinates: { lat: 40.7128, lng: -74.0060 } },
  { id: 'LOC-LON', name: 'London Office', country: 'UK', city: 'London', coordinates: { lat: 51.5074, lng: -0.1278 } },
  { id: 'LOC-SF', name: 'San Francisco Tech Hub', country: 'USA', city: 'San Francisco', coordinates: { lat: 37.7749, lng: -122.4194 } },
  { id: 'LOC-DXB', name: 'Dubai Regional', country: 'UAE', city: 'Dubai', coordinates: { lat: 25.2048, lng: 55.2708 } },
];
