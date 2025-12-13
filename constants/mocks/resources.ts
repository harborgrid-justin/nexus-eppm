
import { Resource } from '../../types';

export const MOCK_RESOURCES: Resource[] = [
  { id: 'R-001', name: 'Sarah Chen', role: 'Project Manager', type: 'Human', status: 'Active', capacity: 160, allocated: 120, hourlyRate: 150, skills: ['PM', 'Agile'], costRates: [], calendarId: 'CAL-STD' },
  { id: 'R-002', name: 'Mike Ross', role: 'Civil Engineer', type: 'Human', status: 'Active', capacity: 160, allocated: 160, hourlyRate: 120, skills: ['Engineering', 'CAD'], costRates: [], calendarId: 'CAL-STD' },
  { id: 'R-003', name: 'Excavator EX-250', role: 'Heavy Equipment', type: 'Equipment', status: 'Active', capacity: 160, allocated: 80, hourlyRate: 500, skills: [], costRates: [], calendarId: 'CAL-247' }
];
