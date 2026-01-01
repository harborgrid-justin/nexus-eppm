
import { ActivityCode } from '../../types/index';
import { MOCK_AC_PHASES } from './activity_codes/phases';
import { MOCK_AC_DISCIPLINES } from './activity_codes/disciplines';
import { MOCK_AC_RESPONSIBILITY } from './activity_codes/responsibility';
import { MOCK_AC_CSI } from './activity_codes/csi';
import { MOCK_AC_PROJECT_SPECIFIC } from './activity_codes/project_specific';
import { MOCK_AC_PRIORITY } from './activity_codes/priority';
import { MOCK_AC_COST } from './activity_codes/cost';

export const MOCK_ACTIVITY_CODES: ActivityCode[] = [
  MOCK_AC_PHASES,
  MOCK_AC_DISCIPLINES,
  MOCK_AC_RESPONSIBILITY,
  MOCK_AC_CSI,
  ...MOCK_AC_PROJECT_SPECIFIC,
  MOCK_AC_PRIORITY,
  MOCK_AC_COST,
];
