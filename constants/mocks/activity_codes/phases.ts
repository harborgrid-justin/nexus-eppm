
import { ActivityCode } from '../../../types';

export const MOCK_AC_PHASES: ActivityCode = {
    id: 'AC-01',
    name: 'Phase',
    scope: 'Global',
    values: [
        { id: 'PH-01', value: 'Initiation', color: '#cbd5e1', description: 'Project start-up' },
        { id: 'PH-02', value: 'Planning', color: '#93c5fd', description: 'Detailed design and planning' },
        { id: 'PH-03', value: 'Execution', color: '#10b981', description: 'Construction and implementation' },
        { id: 'PH-04', value: 'Control', color: '#f59e0b', description: 'Monitoring and reporting' },
        { id: 'PH-05', value: 'Closeout', color: '#64748b', description: 'Handover and closure' },
    ]
};
