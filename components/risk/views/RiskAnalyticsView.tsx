
import React, { useMemo } from 'react';
import { Risk } from '../../../types/index';
import { Layers, CheckSquare, ShieldAlert, Target, Activity, TrendingDown } from 'lucide-react';
import { CustomPieChart } from '../../charts/CustomPieChart';
import { formatCompactCurrency } from '../../../utils/formatters';
import { Badge } from '../../ui/Badge';
import { useTheme } from '../../../context/ThemeContext';
import { EmptyGrid } from '../../common/EmptyGrid';

interface RiskAnalyticsViewProps {
  risks: Risk[];
  onSelectRisk: (id: string) => void;
}

export const RiskAnalyticsView: React.FC<RiskAnalyticsViewProps> = ({ risks, onSelectRisk }) => {
  const theme = useTheme();

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    risks.forEach(r => counts[r.category] = (counts[r.category] || 0) + 1);
    const colors = theme.charts.palette;
    return Object.entries(counts).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));
  }, [risks, theme.charts.palette]);

  const topRisks = useMemo(() => 
    [...risks].sort((a,b) => (b.emv || 0) - (a.emv || 0)).slice(0, 8)
  , [risks]);

  if (risks.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-12">
               <EmptyGrid title="Inference Lake Neutral" description="Analytics requires identified risk artifacts to calculate organizational exposure trends and systemic heat profiles." icon={ShieldAlert} />
          </div>
      );
  }

  return (
    <div className={`h-full p-8 overflow-y-auto ${theme.colors.background}/50 scrollbar-thin animate-nexus-in`}>
        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            <div className={`${theme.components.card} p-10 rounded-[3rem] h-[500px] flex flex-col bg-white shadow-xl border-slate-100`}>
                <h3 className={`font-black text-slate-900 text-sm uppercase tracking-[0.2em] mb-12 flex items-center gap-3 border-b border-slate-50 pb-4`}>
                    <Layers size={18} className="text-nexus-600"/> Risk Topology Mix
                </h3>
                <div className="flex-1 min-h-0">
                    <CustomPieChart data={categoryData} height={320} />
                </div>
            </div>

            <div className={`${theme.components.card} p-10 rounded-[3rem] h-[500px] flex flex-col bg-white shadow-xl border-slate-100`}>
                <div className="flex justify-between items-start mb-10 border-b border-slate-50 pb-4">
                    <div>
                        <h3 className={`font-black text-slate-900 text-sm uppercase tracking-[0.2em] flex items-center gap-3`}>
                            <Target size={18} className="text-red-500"/> Critical Exposure Nodes
                        </h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Highest EMV Impact Profiles</p>
                    </div>
                    <div className="p-2 bg-slate-100 rounded-xl text-slate-400"><TrendingDown size={16}/></div>
                </div>
                <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin">
                    {topRisks.map(r => (
                        <div 
                            key={r.id} 
                            className={`flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:bg-white hover:border-nexus-300 hover:shadow-lg transition-all active:scale-95 group`} 
                            onClick={() => onSelectRisk(r.id)}
                        >
                            <div className="min-w-0 flex-1 pr-6">
                                <div className={`font-black text-sm text-slate-800 uppercase tracking-tight truncate group-hover:text-nexus-700 transition-colors`}>{r.description}</div>
                                <div className={`text-[9px] font-mono font-black text-slate-400 mt-1 uppercase tracking-tighter`}>{r.id} • {r.category}</div>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="font-mono font-black text-red-600 text-base tabular-nums">{formatCompactCurrency(r.emv || 0)}</div>
                                <Badge variant={r.score >= 15 ? 'danger' : r.score >= 8 ? 'warning' : 'success'} className="scale-75 origin-right px-3 py-1">Score: {r.score}</Badge>
                            </div>
                        </div>
                    ))}
                    {[...Array(2)].map((_, i) => (
                        <div key={`s-${i}`} className="h-16 nexus-empty-pattern opacity-10 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};
