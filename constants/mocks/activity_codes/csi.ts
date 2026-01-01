
import { ActivityCode } from '../../../types';

export const MOCK_AC_CSI: ActivityCode = {
    id: 'AC-04',
    name: 'CSI MasterFormat',
    scope: 'Global',
    values: [
        { id: 'CSI-03', value: '03 - Concrete' },
        { id: 'CSI-05', value: '05 - Metals' },
        { id: 'CSI-26', value: '26 - Electrical' },
    ]
};
