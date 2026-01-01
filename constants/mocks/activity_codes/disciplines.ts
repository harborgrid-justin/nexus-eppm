
import { ActivityCode } from '../../../types';

export const MOCK_AC_DISCIPLINES: ActivityCode = {
    id: 'AC-02',
    name: 'Discipline',
    scope: 'Global',
    values: [
        { id: 'DIS-01', value: 'Civil', color: '#a855f7', description: 'Civil engineering works' },
        { id: 'DIS-02', value: 'Structural', color: '#ef4444', description: 'Structural steel and concrete' },
        { id: 'DIS-03', value: 'Mechanical', color: '#3b82f6', description: 'HVAC and piping' },
        { id: 'DIS-04', value: 'Electrical', color: '#eab308', description: 'Power and lighting' },
        { id: 'DIS-05', value: 'Software', color: '#ec4899', description: 'Code development' },
    ]
};
