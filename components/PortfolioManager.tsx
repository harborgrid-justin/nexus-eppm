import React, { useState, useMemo } from 'react';
import { LayoutDashboard, TrendingUp, BarChart2, Layers } from 'lucide-react';
import Dashboard from './Dashboard';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatCompactCurrency } from '../utils/formatters';
import { Project } from '../types';

// --- Sub-Components ---

const PortfolioFinancials: React.FC<{ projects: Project[] }> = ({ projects }) => {
  const financialData = useMemo(() => projects.map(p => ({
    name: p.code,
    Budget: p.budget,
    Actuals: p.spent,
    Variance: p.budget - p.spent
  })), [projects]);

  const stats = useMemo(() => {
    const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
    const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
    const remaining = totalBudget - totalSpent;
    return { totalBudget, totalSpent, remaining };
  }, [projects]);

  return (
    <div className="p-6 h-full overflow-y-auto space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Portfolio Budget</h3>
            <p className="text-3xl font-bold text-slate-900">{formatCompactCurrency(stats.totalBudget)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Actuals</h3>
            <p className="text-3xl font-bold text-slate-900">{formatCompactCurrency(stats.totalSpent)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Remaining</h3>
            <p className="text-3xl font-bold text-green-600">{formatCompactCurrency(stats.remaining)}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-96">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Budget vs Actuals by Project</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={financialData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(val) => formatCompactCurrency(val)} />
            <Tooltip formatter={(val: number) => formatCompactCurrency(val)} />
            <Legend />
            <Bar dataKey="Budget" fill="#94a3b8" />
            <Bar dataKey="Actuals" fill="#0ea5e9" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const PortfolioRoadmap: React.FC<{ projects: Project[] }> = ({ projects }) => {
  return (
    <div className="p-6 h-full overflow-y-auto animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Strategic Timeline</h3>
          <div className="space-y-4 min-w-[800px]">
            {projects.map(p => (
                <div key={p.id} className="flex items-center gap-4">
                  <div className="w-48 text-sm font-medium text-slate-700 truncate">{p.name}</div>
                  <div className="flex-1 h-8 bg-slate-100 rounded-full relative">
                      {/* Mock logic for timeline bars to show visual variation */}
                      <div 
                        className={`absolute top-1 bottom-1 rounded-full ${p.health === 'Critical' ? 'bg-red-400' : p.health === 'Warning' ? 'bg-yellow-400' : 'bg-nexus-400'}`}
                        style={{ left: `${(Math.random() * 20)}%`, width: `${30 + (Math.random() * 40)}%` }}
                      >
                        <span className="absolute left-2 text-xs text-white font-bold leading-6 truncate px-1">{p.code}</span>
                      </div>
                  </div>
                </div>
            ))}
          </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const PortfolioManager: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState('dashboards');
  const [activeTab, setActiveTab] = useState('overview');
  const { state } = useData();

  const navStructure = useMemo(() => [
    { id: 'dashboards', label: 'Dashboards', items: [
      { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard }
    ]},
    { id: 'performance', label: 'Performance', items: [
      { id: 'financials', label: 'Financial Performance', icon: TrendingUp },
      { id: 'capacity', label: 'Resource Capacity', icon: BarChart2 }
    ]},
    { id: 'strategy', label: 'Strategy', items: [
      { id: 'roadmap', label: 'Strategic Roadmap', icon: Layers }
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
      case 'overview':
        return <Dashboard />;
      case 'financials':
        return <PortfolioFinancials projects={state.projects} />;
      case 'roadmap':
        return <PortfolioRoadmap projects={state.projects} />;
      default:
        return <div className="p-6 text-slate-500">Module under construction</div>;
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