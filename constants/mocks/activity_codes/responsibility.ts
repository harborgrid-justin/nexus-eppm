
import { ActivityCode } from '../../../types';

export const MOCK_AC_RESPONSIBILITY: ActivityCode = {
    id: 'AC-03',
    name: 'Responsibility',
    scope: 'Global',
    values: [
        { id: 'RES-01', value: 'Internal', description: 'Performed by own staff' },
        { id: 'RES-02', value: 'Subcontractor', description: 'Outsourced to vendor' },
        { id: 'RES-03', value: 'Client', description: 'Client deliverable' },
    ]
};
