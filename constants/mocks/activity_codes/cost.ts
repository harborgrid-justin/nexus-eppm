
import { ActivityCode } from '../../../types';

export const MOCK_AC_COST: ActivityCode = {
    id: 'AC-06',
    name: 'Cost Code',
    scope: 'Global',
    values: [
        { id: 'CC-01', value: 'Direct Labor' },
        { id: 'CC-02', value: 'Materials' },
        { id: 'CC-03', value: 'Equipment' },
        { id: 'CC-04', value: 'Overhead' },
    ]
};
