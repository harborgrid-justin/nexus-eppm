
import React, { useState, useMemo } from 'react';
import { LayoutDashboard, TrendingUp, BarChart2, Layers, BookOpen, ListOrdered, PieChart, Star, ShieldAlert, MessageCircle, RefreshCw, Map as MapIcon, Gavel, Leaf, Scale, Globe } from 'lucide-react';
import Dashboard from './Dashboard';
import PortfolioStrategyFramework from './portfolio/PortfolioStrategyFramework';
import PortfolioPrioritization from './portfolio/PortfolioPrioritization';
import PortfolioBalancing from './portfolio/PortfolioBalancing';
import PortfolioBenefits from './portfolio/PortfolioBenefits';
import PortfolioRisks from './portfolio/PortfolioRisks';
import PortfolioCapacity from './portfolio/PortfolioCapacity';
import PortfolioFinancials from './portfolio/PortfolioFinancials';
import PortfolioCommunications from './portfolio/PortfolioCommunications';
import PortfolioOptimization from './portfolio/PortfolioOptimization';
import PortfolioRoadmap from './portfolio/PortfolioRoadmap';
import PortfolioScenarios from './portfolio/PortfolioScenarios';
import PortfolioValue from './portfolio/PortfolioValue';
import PortfolioGovernance from './portfolio/PortfolioGovernance';
import PortfolioESG from './portfolio/PortfolioESG';
import { useData } from '../context/DataContext';
import { PageHeader } from './common/PageHeader';

const PortfolioManager: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState('dashboards');
  const [activeTab, setActiveTab] = useState('overview');
  const { state } = useData();

  const navStructure = useMemo(() => [
    { id: 'dashboards', label: 'Dashboards', items: [
      { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard },
      { id: 'esg', label: 'ESG & Compliance', icon: Leaf }
    ]},
    { id: 'strategy', label: 'Strategy & Selection', items: [
      { id: 'framework', label: 'Strategic Framework', icon: BookOpen },
      { id: 'roadmap', label: 'Strategic Roadmap', icon: MapIcon },
      { id: 'prioritization', label: 'Prioritization', icon: ListOrdered },
      { id: 'scenarios', label: 'Scenario Planning', icon: Layers },
      { id: 'balancing', label: 'Balancing', icon: PieChart },
    ]},
    { id: 'performance', label: 'Performance', items: [
      { id: 'financials', label: 'Financial Management', icon: TrendingUp },
      { id: 'value', label: 'Value & Benefits', icon: Star },
      { id: 'capacity', label: 'Resource Capacity', icon: BarChart2 },
      { id: 'communications', label: 'Communications', icon: MessageCircle },
      { id: 'governance', label: 'Governance Board', icon: Gavel },
      { id: 'optimization', label: 'Review & Optimize', icon: RefreshCw },
    ]},
    { id: 'monitoring', label: 'Monitoring & Control', items: [
      { id: 'risks', label: 'Portfolio Risks', icon: ShieldAlert },
    ]}
  ], []);

  const handleGroupChange = (groupId: string) => {
    const newGroup = navStructure.find(g => g.id === groupId);
    if (newGroup?.items.length) {
      setActiveGroup(groupId);
      setActiveTab(newGroup.items[0].id);
    }
  };

  const activeGroupItems = useMemo(() => {
    return navStructure.find(g => g.id === activeGroup)?.items || [];
  }, [activeGroup, navStructure]);

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <Dashboard />;
      case 'esg': return <PortfolioESG />;
      case 'financials': return <PortfolioFinancials projects={state.projects} />;
      case 'capacity': return <PortfolioCapacity />;
      case 'communications': return <PortfolioCommunications />;
      case 'optimization': return <PortfolioOptimization />;
      case 'roadmap': return <PortfolioRoadmap />;
      case 'scenarios': return <PortfolioScenarios />;
      case 'framework': return <PortfolioStrategyFramework />;
      case 'prioritization': return <PortfolioPrioritization />;
      case 'balancing': return <PortfolioBalancing />;
      case 'benefits': return <PortfolioBenefits />; // Keeping original simple view as option, but 'value' is advanced
      case 'value': return <PortfolioValue />;
      case 'governance': return <PortfolioGovernance />;
      case 'risks': return <PortfolioRisks />;
      default: return <div className="p-6 text-slate-500">Module under construction</div>;
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-100">
      {/* Horizontal Tab Navigation */}
      <div className="flex-shrink-0 border-b border-slate-200 bg-white shadow-sm z-10">
        <div className="px-4 pt-3 pb-2 space-x-2 border-b border-slate-200">
            {navStructure.map(group => (
                <button
                    key={group.id}
                    onClick={() => handleGroupChange(group.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        activeGroup === group.id
                        ? 'bg-nexus-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                    {group.label}
                </button>
            ))}
        </div>
        <nav className="flex space-x-2 px-4 overflow-x-auto scrollbar-hide">
          {activeGroupItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === item.id 
                  ? 'border-nexus-600 text-nexus-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
         {renderContent()}
      </div>
    </div>
  );
};

export default PortfolioManager;
