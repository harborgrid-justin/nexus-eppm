import React from 'react';
import { Project } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { TrendingDown, TrendingUp, AlertOctagon, DollarSign } from 'lucide-react';

interface DashboardProps {
  projects: Project[];
}

const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
  const budgetUtilization = (totalSpent / totalBudget) * 100;
  
  const healthData = [
    { name: 'Good', value: projects.filter(p => p.health === 'Good').length, color: '#22c55e' },
    { name: 'Warning', value: projects.filter(p => p.health === 'Warning').length, color: '#eab308' },
    { name: 'Critical', value: projects.filter(p => p.health === 'Critical').length, color: '#ef4444' },
  ];

  const budgetData = projects.map(p => ({
    name: p.code,
    Budget: p.budget,
    Spent: p.spent
  }));

  const StatCard = ({ title, value, subtext, icon: Icon, trend }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${trend === 'up' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-xs text-slate-500">{subtext}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portfolio Overview</h1>
          <p className="text-slate-500">Welcome back, Sarah. Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Download Report</button>
           <button className="px-4 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700">New Project</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Total Portfolio Value" 
          value={`$${(totalBudget / 1000000).toFixed(1)}M`}
          subtext="Across 2 active projects"
          icon={DollarSign}
          trend="up"
        />
        <StatCard 
          title="Budget Utilization" 
          value={`${budgetUtilization.toFixed(1)}%`}
          subtext="Within expected variance"
          icon={TrendingUp}
          trend="up"
        />
        <StatCard 
          title="Critical Issues" 
          value="3"
          subtext="Requires immediate attention"
          icon={AlertOctagon}
          trend="down"
        />
        <StatCard 
          title="Schedule Performance" 
          value="SPI 0.92"
          subtext="Slightly behind schedule"
          icon={TrendingDown}
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Budget vs Actuals by Project</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} tickFormatter={(value) => `$${value/1000000}M`} />
                <RechartsTooltip formatter={(value: number) => `$${(value/1000000).toFixed(2)}M`} />
                <Bar dataKey="Budget" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Portfolio Health Distribution</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-[-20px]">
            {healthData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: d.color }}></div>
                <span className="text-sm text-slate-600">{d.name} ({d.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
