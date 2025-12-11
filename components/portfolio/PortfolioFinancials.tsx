
import React, { useMemo } from 'react';
import { Project } from '../../types';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ZAxis, ReferenceLine } from 'recharts';
import { DollarSign, TrendingUp, Lock } from 'lucide-react';

interface PortfolioFinancialsProps {
  projects: Project[];
}

const PortfolioFinancials: React.FC<PortfolioFinancialsProps> = ({ projects }) => {
  const theme = useTheme();

  // --- 1. Cost vs Value Analysis Data ---
  const scatterData = useMemo(() => projects.map(p => ({
    name: p.code,
    budget: p.budget,
    value: (p.financialValue * 10) + (p.strategicImportance * 10), // Normalized score 0-200
    risk: p.riskScore * 50, // Bubble size
    category: p.category
  })), [projects]);

  // --- 2. Multi-Year Budget Data (Simulated) ---
  const annualData = useMemo(() => {
      const years = [2024, 2025, 2026];
      return years.map(year => {
          // Simulate spread based on project dates in real app
          const budget = projects.reduce((sum, p) => sum + (p.budget * (Math.random() * 0.5)), 0);
          const actuals = year === 2024 ? budget * 0.8 : 0;
          const forecast = budget;
          return { year, Budget: budget, Actuals: actuals, Forecast: forecast };
      });
  }, [projects]);

  // --- 3. Aggregate Stats ---
  const stats = useMemo(() => {
    const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
    const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);
    const remaining = totalBudget - totalSpent;
    return { totalBudget, totalSpent, remaining };
  }, [projects]);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
      <div className="flex justify-between items-center">
         <div>
            <h2 className={theme.typography.h2}>Financial Management</h2>
            <p className={theme.typography.small}>Annual budgeting, forecast tracking, and cost-value optimization.</p>
         </div>
         <div className="flex gap-2">
            <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Export Report</button>
            <button className={`px-3 py-2 ${theme.colors.accentBg} text-white rounded-lg text-sm font-medium hover:bg-nexus-700`}>Budget Request</button>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute right-4 top-4 text-slate-100"><DollarSign size={48} /></div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Total Portfolio Budget</h3>
            <p className="text-3xl font-bold text-slate-900 relative z-10">{formatCompactCurrency(stats.totalBudget)}</p>
            <p className="text-xs text-green-600 mt-2 font-medium relative z-10">+12% vs Last Year</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute right-4 top-4 text-slate-100"><TrendingUp size={48} /></div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">YTD Actuals</h3>
            <p className="text-3xl font-bold text-slate-900 relative z-10">{formatCompactCurrency(stats.totalSpent)}</p>
            <p className="text-xs text-slate-500 mt-2 relative z-10">82% of Annual CapEx</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute right-4 top-4 text-slate-100"><Lock size={48} /></div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Funding Available</h3>
            <p className="text-3xl font-bold text-green-600 relative z-10">{formatCompactCurrency(stats.remaining)}</p>
            <p className="text-xs text-slate-500 mt-2 relative z-10">Allocated to 12 Projects</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost-Value Analysis */}
          <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm h-[400px]`}>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Cost-Value Analysis</h3>
            <p className="text-xs text-slate-500 mb-6">Bubble Size = Risk Exposure. Identify High Cost / Low Value projects for review.</p>
            <ResponsiveContainer width="100%" height="300px">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="budget" name="Budget" unit="$" tickFormatter={(val) => formatCompactCurrency(val)} label={{ value: 'Cost (Budget)', position: 'bottom', offset: 0 }} />
                <YAxis type="number" dataKey="value" name="Value Score" label={{ value: 'Strategic Value', angle: -90, position: 'insideLeft' }} />
                <ZAxis type="number" dataKey="risk" range={[50, 400]} name="Risk" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value, name) => {
                    if(name === 'Budget') return formatCurrency(value as number);
                    return value;
                }} />
                <ReferenceLine y={100} stroke="red" strokeDasharray="3 3" label="Value Cutoff" />
                <Scatter name="Projects" data={scatterData} fill="#0ea5e9" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Multi-Year Budget */}
          <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm h-[400px]`}>
            <h3 className="text-lg font-bold text-slate-800 mb-6">Multi-Year Forecast</h3>
            <ResponsiveContainer width="100%" height="300px">
              <BarChart data={annualData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(val) => formatCompactCurrency(val)} />
                <Tooltip formatter={(val: number) => formatCompactCurrency(val)} />
                <Legend />
                <Bar dataKey="Budget" fill="#94a3b8" name="Baseline" />
                <Bar dataKey="Actuals" fill="#0ea5e9" name="Actuals" />
                <Bar dataKey="Forecast" fill="#f59e0b" name="Forecast (EAC)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
      </div>

      {/* Funding Gates */}
      <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2"><Lock size={20} className="text-nexus-600"/> Funding Gates & Approvals</h3>
          <div className="overflow-x-auto">
              <div className="flex gap-8 min-w-[800px] relative">
                  {/* Timeline Line */}
                  <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 z-0"></div>
                  
                  {[
                      { name: 'Initial Proposal', date: 'Q4 2023', status: 'Approved', amount: '$5M' },
                      { name: 'Phase 1: Design', date: 'Q1 2024', status: 'Approved', amount: '$12M' },
                      { name: 'Phase 2: Construction', date: 'Q3 2024', status: 'Pending', amount: '$25M' },
                      { name: 'Phase 3: Closeout', date: 'Q2 2025', status: 'Locked', amount: '$3M' },
                  ].map((gate, idx) => (
                      <div key={idx} className="flex-1 relative z-10 flex flex-col items-center text-center">
                          <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center bg-white mb-3 shadow-sm ${
                              gate.status === 'Approved' ? 'border-green-500 text-green-600' :
                              gate.status === 'Pending' ? 'border-yellow-500 text-yellow-600' :
                              'border-slate-300 text-slate-400'
                          }`}>
                              {gate.status === 'Locked' ? <Lock size={18}/> : <DollarSign size={18}/>}
                          </div>
                          <h4 className="font-bold text-slate-800 text-sm">{gate.name}</h4>
                          <p className="text-xs text-slate-500 mb-1">{gate.date}</p>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              gate.status === 'Approved' ? 'bg-green-100 text-green-700' :
                              gate.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-slate-100 text-slate-500'
                          }`}>
                              {gate.amount} • {gate.status}
                          </span>
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};

export default PortfolioFinancials;
