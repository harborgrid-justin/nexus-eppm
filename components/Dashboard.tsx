import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { TrendingDown, TrendingUp, AlertOctagon, DollarSign } from 'lucide-react';
import { usePortfolioState } from '../hooks';
import StatCard from './shared/StatCard';
import { useTheme } from '../context/ThemeContext';

const Dashboard: React.FC = () => {
  const { summary, healthDataForChart, budgetDataForChart } = usePortfolioState();
  const theme = useTheme();

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing}`}>
      <div className={`${theme.layout.header} mb-6`}>
        <div>
          <h1 className={theme.typography.h1}>Portfolio Overview</h1>
          <p className={theme.typography.small}>Welcome back, Sarah. Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Download Report</button>
           <button className={`px-4 py-2 ${theme.colors.accentBg} rounded-lg text-sm font-medium text-white hover:bg-nexus-700`}>New Project</button>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
        <StatCard 
          title="Total Portfolio Value" 
          value={`$${(summary.totalBudget / 1000000).toFixed(1)}M`}
          subtext={`Across ${summary.totalProjects} active projects`}
          icon={DollarSign}
        />
        <StatCard 
          title="Budget Utilization" 
          value={`${summary.budgetUtilization.toFixed(1)}%`}
          subtext="Within expected variance"
          icon={TrendingUp}
          trend="up"
        />
        <StatCard 
          title="Critical Issues" 
          value={summary.healthCounts.critical}
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

      <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
        <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
          <h3 className={`${theme.typography.h3} mb-6`}>Budget vs Actuals by Project</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetDataForChart}>
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

        <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
          <h3 className={`${theme.typography.h3} mb-6`}>Portfolio Health Distribution</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthDataForChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {healthDataForChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-[-20px]">
            {healthDataForChart.map(d => (
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
