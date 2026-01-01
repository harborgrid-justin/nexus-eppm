
import React from 'react';
import ProgramDashboard from './ProgramDashboard';
import ProgramStrategy from './ProgramStrategy';
import ProgramBenefits from './ProgramBenefits';
import ProgramRoadmap from './ProgramRoadmap';
import ProgramTradeoff from './ProgramTradeoff';
import ProgramGovernance from './ProgramGovernance';
import ProgramStageGates from './ProgramStageGates';
import ProgramArchitecture from './ProgramArchitecture';
import ProgramScope from './ProgramScope';
import ProgramFinancials from './ProgramFinancials';
import ProgramResources from './ProgramResources';
import ProgramVendors from './ProgramVendors';
import ProgramRisks from './ProgramRisks';
import ProgramIssues from './ProgramIssues';
import ProgramIntegratedChange from './ProgramIntegratedChange';
import ProgramQuality from './ProgramQuality';
import ProgramStakeholders from './ProgramStakeholders';
import ProgramClosure from './ProgramClosure';

export const getProgramModule = (view: string): React.FC<{ programId: string }> => {
    switch (view) {
        case 'dashboard': return ProgramDashboard;
        case 'strategy': return ProgramStrategy;
        case 'benefits': return ProgramBenefits;
        case 'roadmap': return ProgramRoadmap;
        case 'tradeoff': return ProgramTradeoff;
        case 'governance': return ProgramGovernance;
        case 'gates': return ProgramStageGates;
        case 'architecture': return ProgramArchitecture;
        case 'scope': return ProgramScope;
        case 'financials': return ProgramFinancials;
        case 'resources': return ProgramResources;
        case 'vendors': return ProgramVendors;
        case 'risks': return ProgramRisks;
        case 'issues': return ProgramIssues;
        case 'change': return ProgramIntegratedChange;
        case 'quality': return ProgramQuality;
        case 'stakeholders': return ProgramStakeholders;
        case 'closure': return ProgramClosure;
        default: return ProgramDashboard;
    }
};
