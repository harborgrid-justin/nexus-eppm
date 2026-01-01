
import { ActivityCode } from '../../../types';

export const MOCK_AC_PRIORITY: ActivityCode = {
    id: 'AC-05',
    name: 'Priority',
    scope: 'Global',
    values: [
        { id: 'PRI-1', value: 'Critical', color: '#ef4444' },
        { id: 'PRI-2', value: 'High', color: '#f97316' },
        { id: 'PRI-3', value: 'Medium', color: '#eab308' },
        { id: 'PRI-4', value: 'Low', color: '#3b82f6' },
    ]
};
