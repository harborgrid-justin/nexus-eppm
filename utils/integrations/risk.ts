
import { Risk } from '../../types';

export const calculateUnmitigatedRiskExposure = (risks: Risk[]): number => {
    return (risks || []).filter(r => r.status === 'Open' && r.strategy === 'Accept').reduce((sum, r) => sum + (r.emv || 0), 0);
};

export const calculateRiskExposure = (risks: Risk[] | undefined): number => {
  if (!risks) return 0;
  return risks.filter(r => r.status === 'Open').reduce((sum, r) => sum + (r.emv || 0), 0);
};
