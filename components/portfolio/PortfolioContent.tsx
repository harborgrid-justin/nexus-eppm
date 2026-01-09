
import React from 'react';
import Dashboard from '../dashboard/Dashboard';
import PortfolioStrategyFramework from './PortfolioStrategyFramework';
import PortfolioPrioritization from './PortfolioPrioritization';
import PortfolioBalancing from './PortfolioBalancing';
import PortfolioBenefits from './PortfolioBenefits';
import PortfolioRisks from './PortfolioRisks';
import PortfolioCapacity from './PortfolioCapacity';
import PortfolioFinancials from './PortfolioFinancials';
import PortfolioCommunications from './PortfolioCommunications';
import PortfolioOptimization from './PortfolioOptimization';
import PortfolioRoadmap from './PortfolioRoadmap';
import PortfolioScenarios from './PortfolioScenarios';
import PortfolioValue from './PortfolioValue';
import PortfolioGovernance from './PortfolioGovernance';
import PortfolioESG from './PortfolioESG';
import PortfolioPrograms from './PortfolioPrograms';
import StrategicAlignmentBoard from './StrategicAlignmentBoard';
import { PortfolioMap } from './PortfolioMap';
import { Project } from '../../types';

interface PortfolioContentProps {
    activeTab: string;
    projects: Project[];
    onSelectProgram: (id: string) => void;
}

export const PortfolioContent: React.FC<PortfolioContentProps> = ({ activeTab, projects, onSelectProgram }) => {
    switch(activeTab) {
        case 'overview': return <Dashboard />;
        case 'map': return <PortfolioMap />;
        case 'programs': return <PortfolioPrograms onSelectProgram={onSelectProgram} />;
        case 'esg': return <PortfolioESG />;
        case 'financials': return <PortfolioFinancials projects={projects} />;
        case 'capacity': return <PortfolioCapacity />;
        case 'communications': return <PortfolioCommunications />;
        case 'optimization': return <PortfolioOptimization />;
        case 'roadmap': return <PortfolioRoadmap />;
        case 'scenarios': return <PortfolioScenarios />;
        case 'framework': return <PortfolioStrategyFramework />;
        case 'alignment': return <StrategicAlignmentBoard />;
        case 'prioritization': return <PortfolioPrioritization />;
        case 'balancing': return <PortfolioBalancing />;
        case 'benefits': return <PortfolioBenefits />;
        case 'value': return <PortfolioValue />;
        case 'governance': return <PortfolioGovernance />;
        case 'risks': return <PortfolioRisks />;
        default: return <Dashboard />;
    }
};
