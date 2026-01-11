
import React, { useMemo } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Star, TrendingUp, DollarSign, Target, Plus, BarChart2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import StatCard from '../shared/StatCard';
import { formatCurrency, formatPercentage } from '../../utils/formatters';
import { ResponsiveContainer, XAxis, YAxis, ZAxis, Tooltip, Scatter, CartesianGrid, ScatterChart, Cell } from 'recharts';
import { EmptyGrid } from '../common/EmptyGrid';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';

const PortfolioValue: React.FC = () => {
  const { projects } = usePortfolioData();
  const theme = useTheme();
  const navigate = useNavigate();

  const valueData = useMemo(() => projects.map(p => {
      const riskFactor = p.riskScore > 0 ? (100 - p.riskScore) / 100 : 1; 
      return {
          name: p.code,
          fullName: p.name,
          roi: (p.financialValue * 10 * riskFactor), 
          npv: p.budget * (p.financialValue / 5),
          cost: p.budget,
          category: p.category,
          risk: p.riskScore
      };
  }), [projects]);

  const avgROI = valueData.length > 0 ? valueData.reduce((sum, d) => sum + d.roi, 0) / valueData.length : 0;
  const totalNPV = valueData.reduce((sum, d) => sum + d.npv, 0);
  const totalBenefits = valueData.filter(d => d.npv > d.cost).reduce((sum, d) => sum + (d.npv - d.cost), 0);

  if (projects.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-12">
              <EmptyGrid 
                title="Investment Logic Isolated"
                description="The portfolio has no active initiatives to track for financial realization or ROI benchmarking. Initialize a project to activate valuation models."
                icon={Target}
                actionLabel="Establish Investment Case"
                onAdd={() => navigate('/projectList?action=create')}
              />
          </div>
      );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <Star className="text-nexus-600" size={24}/>
                <h2 className={theme.typography.h2}>Portfolio Value & Realization Analytics</h2>
            </div>
            <Button size="sm" icon={Plus} onClick={() => {}}>Define Benefit Tracker</Button>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 ${theme.layout.gridGap}`}>
            <StatCard title="Portfolio Net Present Value" value={formatCurrency(totalNPV)} subtext="Discounted Cash Flow Sum" icon={DollarSign} />
            <StatCard title="Weighted Portfolio ROI" value={formatPercentage(avgROI, 1)} subtext="Risk-Adjusted Expectancy" icon={TrendingUp} trend="up" />
            <StatCard title="Realized Benefits" value={formatCurrency(totalBenefits)} subtext="Cumulative Value Harvest" icon={Star} />
        </div>

        <Card className={`p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-[550px] flex flex-col relative`}>
            <div className="flex justify-between items-start mb-8 border-b pb-6">
                <div>
                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Investment Efficiency Grid</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Bubble Size: Budget Exposure | Color: Strategic ROI Category</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-nexus-600 rounded-full"></div> <span className="text-[10px] font-black uppercase text-slate-500">Innovation</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div> <span className="text-[10px] font-black uppercase text-slate-500">Efficiency</span></div>
                </div>
            </div>
            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme.charts.grid} />
                        <XAxis type="number" dataKey="roi" name="ROI" unit="%" tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} label={{ value: 'Projected ROI (%)', position: 'bottom', offset: 20, fontSize: 10, fontWeight: 'black', fill: '#94a3b8' }} />
                        <YAxis type="number" dataKey="npv" name="NPV" unit="$" tick={{fontSize: 10, fontWeight: 'bold', fill: '#64748b'}} tickFormatter={(val) => `$${(val/1000000).toFixed(1)}M`} label={{ value: 'Net Present Value', angle: -90, position: 'insideLeft', fontSize: 10, fontWeight: 'black', fill: '#94a3b8' }} />
                        <ZAxis type="number" dataKey="cost" range={[150, 1500]} name="Capital Cost" unit="$" />
                        <Tooltip 
                            cursor={{ strokeDasharray: '3 3', stroke: '#3b82f6' }} 
                            content={({ payload }) => {
                                if (payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-white/10 animate-in zoom-in-95 duration-100">
                                            <p className="font-black text-xs uppercase tracking-tighter text-nexus-400 mb-1">{data.name}</p>
                                            <p className="font-bold text-sm mb-3 border-b border-white/10 pb-2">{data.fullName}</p>
                                            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                                <span>ROI:</span> <span className="text-white text-right">{data.roi.toFixed(1)}%</span>
                                                <span>NPV:</span> <span className="text-white text-right">{formatCurrency(data.npv)}</span>
                                                <span>Risk:</span> <span className="text-red-400 text-right">{data.risk} Pts</span>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Scatter name="Active Projects" data={valueData}>
                             {valueData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.roi > 30 ? '#22c55e' : entry.roi > 15 ? '#3b82f6' : '#ef4444'} 
                                    className="cursor-pointer hover:opacity-80 transition-all filter drop-shadow-md"
                                    onClick={() => navigate(`/projectWorkspace/${projects[index].id}`)}
                                />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-5">
                <BarChart2 size={300} />
            </div>
        </Card>
    </div>
  );
};
export default PortfolioValue;
