
import { EPSNode, OBSNode, Location } from '../../types';

export const MOCK_EPS: EPSNode[] = [
  { id: 'EPS-ROOT', parentId: null, name: 'Nexus Enterprise', code: 'NEX' },
  { id: 'EPS-ENG', parentId: 'EPS-ROOT', name: 'Engineering & Construction', code: 'E&C' },
  { id: 'EPS-IT', parentId: 'EPS-ROOT', name: 'Information Technology', code: 'IT' },
  { id: 'EPS-INFRA', parentId: 'EPS-ENG', name: 'Infrastructure', code: 'INFRA' },
  { id: 'EPS-COMM', parentId: 'EPS-ENG', name: 'Commercial', code: 'COMM' },
];

export const MOCK_OBS: OBSNode[] = [
  { id: 'OBS-ROOT', parentId: null, name: 'Executive Board', managerId: 'R-001' },
  { id: 'OBS-PMO', parentId: 'OBS-ROOT', name: 'Global PMO', managerId: 'R-001' },
  { id: 'OBS-NA', parentId: 'OBS-PMO', name: 'North America Operations', managerId: 'R-002' },
  { id: 'OBS-EMEA', parentId: 'OBS-PMO', name: 'EMEA Operations', managerId: 'R-003' },
];

export const MOCK_LOCATIONS: Location[] = [
  { id: 'LOC-NY', name: 'New York HQ', country: 'USA', city: 'New York', coordinates: { lat: 40.7128, lng: -74.0060 } },
  { id: 'LOC-LON', name: 'London Office', country: 'UK', city: 'London', coordinates: { lat: 51.5074, lng: -0.1278 } },
];
