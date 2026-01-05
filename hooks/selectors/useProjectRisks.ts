
import { useMemo } from 'react';
import { Risk } from '../../types/index';
import { calculateRiskExposure } from '../../utils/integrations/risk';

export const useProjectRisks = (risks: Risk[]) => {
  return useMemo(() => {
    const highImpactRisks = risks.filter(r => r.impact === 'High' || r.probability === 'High').length;
    const openRisks = risks.filter(r => r.status === 'Open').length;
    const exposure = calculateRiskExposure(risks);

    return { totalRisks: risks.length, highImpactRisks, openRisks, exposure };
  }, [risks]);
};
