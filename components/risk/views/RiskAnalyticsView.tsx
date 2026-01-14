import React from 'react';
import { Risk } from '../../../types/index';
import { Layers, CheckSquare, ShieldAlert } from 'lucide-react';
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

  const categoryData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    risks.forEach(r => counts[r.category] = (counts[r.category] || 0) + 1);
    const colors = theme.charts.palette;
    return Object.entries(counts).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));
  }, [risks, theme]);

  const topRisks = React.useMemo(() => 
    [...risks].sort((a,b) => (b.emv || 0) - (a.emv || 0)).slice(0, 5)
  , [risks]);

  if (risks.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-12">
               <EmptyGrid title="Inference Engine Idle" description="Analytics require identified risk records to calculate multi-vector exposure trends." icon={ShieldAlert} />
          </div>
      );
  }

  return (
    <div className={`h-full p-8 overflow-auto ${theme.colors.background} scrollbar-thin`}>
        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            <div className={`${theme.components.card} p-10 rounded-[2.5rem] h-[450px] flex flex-col shadow-sm`}>
                <h3 className={`font-black text-slate-900 text-sm uppercase tracking-widest mb-10 flex items-center gap-2`}>
                    <Layers size={18} className="text-nexus-600"/> Exposure Topology
                </h3>
                <div className="flex-1 min-h-0">
                    <CustomPieChart data={categoryData} height={300} />
                </div>
            </div>

            <div className={`${theme.components.card} p-10 rounded-[2.5rem] h-[450px] flex flex-col shadow-sm`}>
                <h3 className={`font-black text-slate-900 text-sm uppercase tracking-widest mb-10 flex items-center gap-2`}>
                    <CheckSquare size={18} className="text-red-500"/> Critical Exposure Vectors
                </h3>
                <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin">
                    {topRisks.map(r => (
                        <div 
                            key={r.id} 
                            className={`flex items-center justify-between p-4 ${theme.colors.background} border border-slate-100 rounded-2xl cursor-pointer hover:border-nexus-300 transition-all shadow-sm active:scale-95`} 
                            onClick={() => onSelectRisk(r.id)}
                        >
                            <div className="min-w-0 flex-1 pr-4">
                                <div className={`font-black text-sm text-slate-800 uppercase tracking-tight truncate`}>{r.description}</div>
                                <div className={`text-[10px] font-mono font-bold text-slate-400 mt-0.5 uppercase tracking-tighter`}>{r.id} • {r.category}</div>
                            </div>
                            <div className="text-right shrink-0">
                                <div className="font-mono font-black text-red-600 text-base">{formatCompactCurrency(r.emv || 0)}</div>
                                <Badge variant={r.score >= 15 ? 'danger' : r.score >= 8 ? 'warning' : 'success'} className="scale-75 origin-right">Score: {r.score}</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};