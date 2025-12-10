
import React, { useState } from 'react';
import { LayoutDashboard, TrendingUp, BarChart2, PieChart, Layers } from 'lucide-react';
import Dashboard from './Dashboard';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { formatCompactCurrency } from '../utils/formatters';

const PortfolioManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const theme = useTheme();
  const { state } = useData();

  const navItems = [
    { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'financials', label: 'Financial Performance', icon: TrendingUp },
    { id: 'capacity', label: 'Resource Capacity', icon: BarChart2 },
    { id: 'roadmap', label: 'Strategic Roadmap', icon: Layers },
  ];

  // Financial Data Aggregation
  const financialData = state.projects.map(p => ({
    name: p.code,
    Budget: p.budget,
    Actuals: p.spent,
    Variance: p.budget - p.spent
  }));

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return <Dashboard />;
      case 'financials':
        return (
          <div className="p-6 h-full overflow-y-auto space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Portfolio Budget</h3>
                   <p className="text-3xl font-bold text-slate-900">{formatCompactCurrency(state.projects.reduce((acc, p) => acc + p.budget, 0))}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Actuals</h3>
                   <p className="text-3xl font-bold text-slate-900">{formatCompactCurrency(state.projects.reduce((acc, p) => acc + p.spent, 0))}</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                   <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Remaining</h3>
                   <p className="text-3xl font-bold text-green-600">{formatCompactCurrency(state.projects.reduce((acc, p) => acc + p.budget, 0) - state.projects.reduce((acc, p) => acc + p.spent, 0))}</p>
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
      case 'roadmap':
        return (
           <div className="p-6 h-full overflow-y-auto">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                 <h3 className="text-lg font-bold text-slate-800 mb-6">Strategic Timeline</h3>
                 <div className="space-y-4 min-w-[800px]">
                    {state.projects.map(p => {
                       return (
                          <div key={p.id} className="flex items-center gap-4">
                             <div className="w-48 text-sm font-medium text-slate-700 truncate">{p.name}</div>
                             <div className="flex-1 h-8 bg-slate-100 rounded-full relative">
                                <div 
                                   className={`absolute top-1 bottom-1 rounded-full ${p.health === 'Critical' ? 'bg-red-400' : 'bg-nexus-400'}`}
                                   style={{ left: '10%', width: '40%' }} // Mock width
                                >
                                   <span className="absolute left-2 text-xs text-white font-bold leading-6">{p.code}</span>
                                </div>
                             </div>
                          </div>
                       )
                    })}
                 </div>
              </div>
           </div>
        );
      default:
        return <div className="p-6 text-slate-500">Module under construction</div>;
    }
  };

  return (
    <div className={`${theme.layout.pageContainer}`}>
      {/* Header */}
      <div className={`flex-shrink-0 border-b border-slate-200 bg-white px-6 py-4 flex justify-between items-center`}>
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Portfolio Management</h1>
            <p className="text-slate-500 text-sm">Enterprise-wide visibility and strategic alignment.</p>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50 px-6">
        <nav className="flex space-x-6">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors ${
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
      <div className="flex-1 overflow-hidden bg-slate-100">
         {renderContent()}
      </div>
    </div>
  );
};

export default PortfolioManager;
