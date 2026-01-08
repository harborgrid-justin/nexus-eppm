
import React from 'react';
import { Project } from '../../types';
import { formatCompactCurrency, formatCurrency, formatDate } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ZAxis, ReferenceLine } from 'recharts';
import { DollarSign, TrendingUp, Lock, Unlock, AlertCircle } from 'lucide-react';
import { usePortfolioFinancialsLogic } from '../../hooks/domain/usePortfolioFinancialsLogic';
import { EmptyGrid } from '../common/EmptyGrid';
import { useNavigate } from 'react-router-dom';

interface PortfolioFinancialsProps {
  projects: Project[];
}

const PortfolioFinancials: React.FC<PortfolioFinancialsProps> = ({ projects }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { 
      scatterData, 
      annualData, 
      stats, 
      fundingGates, 
      hasData 
  } = usePortfolioFinancialsLogic(projects);

  if (!hasData) {
      return (
          <div className="h-full flex items-center justify-center p-12">
              <EmptyGrid 
                title="Financial Ledger Empty"
                description="The portfolio has no active projects to track for financial realization or ROI benchmarking. Initialize a project to begin."
                icon={DollarSign}
                actionLabel="Create First Initiative"
                onAdd={() => navigate('/projectList?action=create')}
              />
          </div>
      );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
      {/* Header and Actions */}
      <div className="flex justify-between items-center">
         <div>
            <h2 className={theme.typography.h2}>Financial Management</h2>
            <p className={theme.typography.small}>Annual budgeting, forecast tracking, and cost-value optimization.</p>
         </div>
         <div className="flex gap-2">
            <button className={`px-3 py-2 ${theme.colors.surface} border ${theme.colors.border} rounded-lg text-sm font-medium ${theme.colors.text.secondary} hover:${theme.colors.background}`}>Export Report</button>
            <button className={`px-3 py-2 ${theme.colors.semantic.info.bg} ${theme.colors.semantic.info.text} rounded-lg text-sm font-medium hover:brightness-95`}>Budget Request</button>
         </div>
      </div>

      {/* KPI Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
        <div className={`${theme.components.card} p-6 relative overflow-hidden group hover:border-nexus-300 transition-all`}>
            <div className="absolute right-4 top-4 text-slate-100 group-hover:text-nexus-50 transition-colors"><DollarSign size={48} /></div>
            <h3 className={`text-sm font-bold ${theme.colors.text.secondary} uppercase tracking-wider mb-2 relative z-10`}>Total Portfolio Budget</h3>
            <p className={`text-3xl font-bold ${theme.colors.text.primary} relative z-10`}>{formatCompactCurrency(stats.totalBudget)}</p>
            <p className="text-xs text-green-600 mt-2 font-medium relative z-10 flex items-center gap-1"><TrendingUp size={12}/> +12% vs Last Year</p>
        </div>
        <div className={`${theme.components.card} p-6 relative overflow-hidden group hover:border-blue-300 transition-all`}>
            <div className="absolute right-4 top-4 text-slate-100 group-hover:text-blue-50 transition-colors"><TrendingUp size={48} /></div>
            <h3 className={`text-sm font-bold ${theme.colors.text.secondary} uppercase tracking-wider mb-2 relative z-10`}>YTD Actuals</h3>
            <p className={`text-3xl font-bold ${theme.colors.text.primary} relative z-10`}>{formatCompactCurrency(stats.totalSpent)}</p>
            <p className={`text-xs ${theme.colors.text.secondary} mt-2 relative z-10`}>{stats.totalBudget > 0 ? ((stats.totalSpent/stats.totalBudget)*100).toFixed(0) : 0}% of Annual CapEx</p>
        </div>
        <div className={`${theme.components.card} p-6 relative overflow-hidden group hover:border-green-300 transition-all`}>
            <div className="absolute right-4 top-4 text-slate-100 group-hover:text-green-50 transition-colors"><Lock size={48} /></div>
            <h3 className={`text-sm font-bold ${theme.colors.text.secondary} uppercase tracking-wider mb-2 relative z-10`}>Funding Available</h3>
            <p className="text-3xl font-bold text-green-600 relative z-10">{formatCompactCurrency(stats.remaining)}</p>
            <p className={`text-xs ${theme.colors.text.secondary} mt-2 relative z-10`}>Allocated to {projects.length} Projects</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
          {/* Cost-Value Analysis */}
          <div className={`${theme.components.card} ${theme.layout.cardPadding} h-[400px] flex flex-col`}>
            <h3 className={`text-lg font-bold ${theme.colors.text.primary} mb-2`}>Cost-Value Analysis</h3>
            <p className={`text-xs ${theme.colors.text.secondary} mb-6`}>Bubble Size = Risk Exposure. Identify High Cost / Low Value projects.</p>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
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
          </div>

          {/* Multi-Year Budget */}
          <div className={`${theme.components.card} ${theme.layout.cardPadding} h-[400px] flex flex-col`}>
            <h3 className={`text-lg font-bold ${theme.colors.text.primary} mb-6`}>Multi-Year Forecast</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={annualData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" />
                    <YAxis tickFormatter={(val) => formatCompactCurrency(val)} />
                    <Tooltip formatter={(val: number) => formatCompactCurrency(val)} />
                    <Legend />
                    <Bar dataKey="Budget" fill="#94a3b8" name="Baseline" radius={[4,4,0,0]} />
                    <Bar dataKey="Actuals" fill="#0ea5e9" name="Actuals" radius={[4,4,0,0]} />
                    <Bar dataKey="Forecast" fill="#f59e0b" name="Forecast (EAC)" radius={[4,4,0,0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
          </div>
      </div>

      {/* Funding Gates Timeline */}
      <div className={`${theme.components.card} ${theme.layout.cardPadding}`}>
          <h3 className={`text-lg font-bold ${theme.colors.text.primary} mb-6 flex items-center gap-2`}><Lock size={20} className="text-nexus-600"/> Upcoming Funding Gates</h3>
          <div className="overflow-x-auto">
              {fundingGates.length > 0 ? (
                  <div className="flex gap-8 min-w-[800px] relative pb-4">
                      {/* Timeline Line */}
                      <div className={`absolute top-6 left-0 right-0 h-1 ${theme.colors.background} z-0`}></div>
                      
                      {fundingGates.map((gate, idx) => (
                          <div key={idx} className="flex-1 relative z-10 flex flex-col items-center text-center group">
                              <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center ${theme.colors.surface} mb-3 shadow-sm transition-transform group-hover:scale-110 ${
                                  gate.status === 'Approved' ? 'border-green-500 text-green-600' :
                                  gate.status === 'Conditional' ? 'border-yellow-500 text-yellow-600' :
                                  gate.status === 'Rejected' ? 'border-red-500 text-red-500' :
                                  'border-slate-300 text-slate-400'
                              }`}>
                                  {gate.status === 'Approved' ? <Unlock size={18}/> : gate.status === 'Rejected' ? <AlertCircle size={18}/> : <Lock size={18}/>}
                              </div>
                              <h4 className={`font-bold ${theme.colors.text.primary} text-sm line-clamp-1 w-32`}>{gate.name}</h4>
                              <p className={`text-xs ${theme.colors.text.secondary} mb-1`}>{formatDate(gate.date)}</p>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                  gate.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                  gate.status === 'Conditional' ? 'bg-yellow-100 text-yellow-700' :
                                  gate.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                  'bg-slate-100 text-slate-500'
                              }`}>
                                  {gate.amount} • {gate.status}
                              </span>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="p-8 text-center text-slate-400 italic nexus-empty-pattern rounded-lg border-2 border-dashed border-slate-200">
                      No funding gates scheduled for this fiscal period.
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default PortfolioFinancials;
