import React from 'react';
import { Project } from '../../types';
import { formatCompactCurrency, formatCurrency, formatDate } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ScatterChart, Scatter, ZAxis, ReferenceLine, Cell } from 'recharts';
import { DollarSign, TrendingUp, Lock, Unlock, AlertCircle, Calendar } from 'lucide-react';
import { usePortfolioFinancialsLogic } from '../../hooks/domain/usePortfolioFinancialsLogic';
import { EmptyGrid } from '../common/EmptyGrid';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
// Added missing Button and Badge imports from common UI library
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface PortfolioFinancialsProps {
  projects: Project[];
}

const PortfolioFinancials: React.FC<PortfolioFinancialsProps> = ({ projects }) => {
  const theme = useTheme();
  const { state } = useData();
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
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-500 scrollbar-thin`}>
      <div className="flex justify-between items-center mb-4">
         <div>
            <h2 className={theme.typography.h2}>Portfolio Financial Management</h2>
            <p className={theme.typography.small}>Annual budgeting, forecast tracking, and cost-value optimization.</p>
         </div>
         <div className="flex gap-3">
            <button className={`px-4 py-2 ${theme.colors.surface} border ${theme.colors.border} rounded-xl text-xs font-black uppercase tracking-widest ${theme.colors.text.secondary} hover:bg-slate-50 transition-all shadow-sm`}>Export Master Ledger</button>
            <button className={`px-4 py-2 bg-nexus-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-nexus-700 transition-all shadow-lg shadow-nexus-500/20`}>Appropriate Funds</button>
         </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
        <div className={`${theme.components.card} p-8 rounded-[2rem] relative overflow-hidden group hover:border-nexus-300 transition-all shadow-sm`}>
            <div className="absolute right-4 top-4 text-slate-100 group-hover:text-nexus-50 transition-colors"><DollarSign size={64} /></div>
            <h3 className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest mb-2 relative z-10`}>Portfolio CapEx Baseline</h3>
            <p className={`text-3xl font-black ${theme.colors.text.primary} relative z-10 tabular-nums`}>{formatCompactCurrency(stats.totalBudget)}</p>
            <p className="text-[10px] text-green-600 mt-4 font-black uppercase tracking-widest relative z-10 flex items-center gap-1"><TrendingUp size={12}/> Aligned to 2024 Strategy</p>
        </div>
        <div className={`${theme.components.card} p-8 rounded-[2rem] relative overflow-hidden group hover:border-blue-300 transition-all shadow-sm`}>
            <div className="absolute right-4 top-4 text-slate-100 group-hover:text-blue-50 transition-colors"><TrendingUp size={64} /></div>
            <h3 className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest mb-2 relative z-10`}>Consolidated Actuals</h3>
            <p className={`text-3xl font-black ${theme.colors.text.primary} relative z-10 tabular-nums`}>{formatCompactCurrency(stats.totalSpent)}</p>
            <p className={`text-[10px] ${theme.colors.text.tertiary} mt-4 relative z-10 font-bold uppercase`}>{stats.totalBudget > 0 ? ((stats.totalSpent/stats.totalBudget)*100).toFixed(0) : 0}% Utilization Rate</p>
        </div>
        <div className={`${theme.components.card} p-8 rounded-[2rem] relative overflow-hidden group hover:border-green-300 transition-all shadow-sm`}>
            <div className="absolute right-4 top-4 text-slate-100 group-hover:text-green-50 transition-colors"><Lock size={64} /></div>
            <h3 className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-widest mb-2 relative z-10`}>Available Liquidity</h3>
            <p className="text-3xl font-black text-green-600 relative z-10 tabular-nums">{formatCompactCurrency(stats.remaining)}</p>
            <p className={`text-[10px] ${theme.colors.text.tertiary} mt-4 relative z-10 font-bold uppercase`}>Allocated to {projects.length} Components</p>
        </div>
      </div>
      
      <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
          <div className={`${theme.components.card} p-10 rounded-[2.5rem] h-[450px] flex flex-col shadow-sm`}>
            <h3 className={`text-sm font-black uppercase tracking-widest text-slate-400 mb-2`}>Value-Risk Matrix</h3>
            <p className={`text-[10px] font-bold text-slate-400 mb-8 uppercase`}>Bubble Size: Financial Exposure ($)</p>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                    <XAxis type="number" dataKey="budget" name="Budget" unit="$" tick={{fontSize: 10, fontWeight: 'bold'}} tickFormatter={(val) => formatCompactCurrency(val)} label={{ value: 'Negative Exposure (Cost)', position: 'bottom', offset: 0, style: {fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'} }} />
                    <YAxis type="number" dataKey="value" name="Strategic Score" tick={{fontSize: 10, fontWeight: 'bold'}} label={{ value: 'Strategic Return', angle: -90, position: 'insideLeft', style: {fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'} }} />
                    <ZAxis type="number" dataKey="risk" range={[100, 1000]} name="Risk Index" />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={theme.charts.tooltip} formatter={(value, name) => {
                        if(name === 'Budget') return formatCurrency(value as number);
                        return value;
                    }} />
                    <ReferenceLine y={100} stroke="#cbd5e1" strokeDasharray="5 5" label={{value: 'TARGET', position: 'right', fontSize: 9, fill: '#94a3b8'}} />
                    <Scatter name="Projects" data={scatterData}>
                        {scatterData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={theme.charts.palette[index % theme.charts.palette.length]} />
                        ))}
                    </Scatter>
                </ScatterChart>
                </ResponsiveContainer>
            </div>
          </div>

          <div className={`${theme.components.card} p-10 rounded-[2.5rem] h-[450px] flex flex-col shadow-sm`}>
            <h3 className={`text-sm font-black uppercase tracking-widest text-slate-400 mb-8`}>Fiscal Burn Horizon</h3>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={annualData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                    <XAxis dataKey="year" tick={{fontSize: 11, fontWeight: 'bold'}} />
                    <YAxis tickFormatter={(val) => formatCompactCurrency(val)} tick={{fontSize: 11, fontWeight: 'bold'}} />
                    <Tooltip formatter={(val: number) => formatCompactCurrency(val)} contentStyle={theme.charts.tooltip} />
                    <Legend wrapperStyle={{paddingTop: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold'}} />
                    <Bar dataKey="Budget" fill="#e2e8f0" name="Initial Baseline" radius={[4,4,0,0]} />
                    <Bar dataKey="Actuals" fill="#3b82f6" name="Committed Spend" radius={[4,4,0,0]} />
                    <Bar dataKey="Forecast" fill="#f59e0b" name="EAC Projection" radius={[4,4,0,0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
          </div>
      </div>

      <div className={`${theme.components.card} p-10 rounded-[2.5rem] shadow-sm`}>
          <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-6">
              <div>
                 <h3 className={`text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2`}><Lock size={18} className="text-nexus-600"/> Multi-Year Funding Pipeline</h3>
                 <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Authorized capital release milestones</p>
              </div>
              <Button size="sm" variant="ghost" icon={Calendar}>View Full Schedule</Button>
          </div>
          <div className="overflow-x-auto pb-4 scrollbar-hide">
              {fundingGates.length > 0 ? (
                  <div className="flex gap-12 min-w-[1000px] relative px-6">
                      <div className={`absolute top-6 left-12 right-12 h-1 bg-slate-100 -z-0 rounded-full`}></div>
                      
                      {fundingGates.map((gate, idx) => (
                          <div key={idx} className="flex-1 relative z-10 flex flex-col items-center text-center group cursor-pointer">
                              <div className={`w-14 h-14 rounded-2xl border-4 flex items-center justify-center bg-white mb-4 shadow-xl transition-all group-hover:scale-110 group-hover:-translate-y-1 ${
                                  gate.status === 'Approved' || gate.status === 'Released' ? 'border-green-500 text-green-600' :
                                  gate.status === 'Conditional' || gate.status === 'Pending' ? 'border-amber-400 text-amber-500 shadow-amber-500/10' :
                                  gate.status === 'Rejected' ? 'border-red-500 text-red-500 shadow-red-500/10' :
                                  'border-slate-200 text-slate-300'
                              }`}>
                                  {gate.status === 'Approved' || gate.status === 'Released' ? <Unlock size={24}/> : <Lock size={24}/>}
                              </div>
                              <h4 className={`font-black text-slate-800 text-xs uppercase tracking-tight line-clamp-1 w-32`}>{gate.name}</h4>
                              <p className={`text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase tracking-widest`}>{formatDate(gate.date)}</p>
                              <div className="mt-4">
                                  <Badge variant={
                                      gate.status === 'Approved' || gate.status === 'Released' ? 'success' :
                                      gate.status === 'Conditional' || gate.status === 'Pending' ? 'warning' : 'neutral'
                                  }>
                                      {gate.status}
                                  </Badge>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="h-40">
                      <EmptyGrid 
                        title="Funding Gates Undefined" 
                        description="Establish multi-year funding release points in the Program Configuration module."
                        icon={Lock}
                      />
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default PortfolioFinancials;
