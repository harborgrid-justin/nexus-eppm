
import { ActivityCode } from '../../../types';

export const MOCK_AC_PROJECT_SPECIFIC: ActivityCode[] = [
    {
        id: 'AC-P1-01',
        name: 'Floor Level',
        scope: 'Project',
        projectId: 'P1001',
        values: [
            { id: 'FL-01', value: 'Ground Floor' },
            { id: 'FL-02', value: 'Mezzanine' },
            { id: 'FL-03', value: 'Roof' },
        ]
    }
];
