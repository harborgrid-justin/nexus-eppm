import React, { useMemo, useState, useEffect } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useEVM } from '../../hooks/useEVM';
import { getDaysDiff } from '../../utils/dateUtils';
import { BarChart2, TrendingUp, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';
import { CustomLineChart } from '../charts/CustomLineChart';
import { EmptyGrid } from '../common/EmptyGrid';
import { useTheme } from '../../context/ThemeContext';

const EarnedValue: React.FC = () => {
  const { project, budgetItems } = useProjectWorkspace();
  const evm = useEVM(project, budgetItems);
  const theme = useTheme();
  
  // Rule 38: Hydration safety
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    setToday(new Date());
  }, []);

  const chartData = useMemo(() => {
    if (!project || !evm || !today) return [];

    const startDate = new Date(project.startDate);
    const totalDays = getDaysDiff(startDate, new Date(project.endDate));
    if (totalDays <= 0) return [];

    const data = [];
    const bac = project.originalBudget;
    
    // Generate 12 data points for the S-Curve
    for (let i = 0; i <= 10; i++) {
      const percentTime = i / 10;
      const date = new Date(startDate);
      date.setDate(date.getDate() + (totalDays * percentTime));
      
      // S-Curve Approximation for PV
      // Ease-in-out cubic function for realistic project burn
      const t = percentTime;
      const curveFactor = t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      const pv = bac * curveFactor;
      
      const point: any = { 
          date: date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
          pv,
          bac: project.originalBudget 
      };

      // Only plot EV and AC for past dates
      if (date <= today) {
          // Interpolate current EV/AC to fit the curve up to today
          // This creates a smooth line from start to current status
          const currentProgressRatio = (i / 10) / (getDaysDiff(startDate, today) / totalDays);
          // Simple clamping for visualization demo
          if (percentTime <= (getDaysDiff(startDate, today) / totalDays)) {
              point.ev = evm.ev * (percentTime / (getDaysDiff(startDate, today) / totalDays));
              point.ac = evm.ac * (percentTime / (getDaysDiff(startDate, today) / totalDays));
          } else {
             // For the specific 'Today' point
             point.ev = evm.ev;
             point.ac = evm.ac;
          }
      }

      data.push(point);
    }
    return data;
  }, [project, evm, today]);

  if (!project || !today || !evm || evm.bac === 0) {
      return (
          <EmptyGrid 
            title="EVM Metrics Isolated"
            description="Earned Value Management (EVM) requires an approved budget baseline and physical progress updates to calculate performance indices."
            icon={Activity}
          />
      );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6`}>
       {/* Top Level Status */}
       <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
          <StatCard 
            title="Schedule Performance (SPI)"
            value={evm.spi.toFixed(2)}
            subtext={evm.status}
            icon={TrendingUp}
            trend={evm.spi >= 1 ? 'up' : 'down'}
          />
          <StatCard 
            title="Cost Performance (CPI)"
            value={evm.cpi.toFixed(2)}
            subtext={evm.costStatus}
            icon={BarChart2}
            trend={evm.cpi >= 1 ? 'up' : 'down'}
          />
          <StatCard 
            title="Cost Variance (CV)"
            value={formatCompactCurrency(evm.cv)}
            subtext="EV - AC"
            icon={evm.cv >= 0 ? CheckCircle : AlertTriangle}
            trend={evm.cv >= 0 ? 'up' : 'down'}
          />
          <StatCard 
            title="Estimate at Completion (EAC)"
            value={formatCompactCurrency(evm.eac)}
            subtext={`Variance: ${formatCompactCurrency(evm.vac)}`}
            icon={Activity}
          />
       </div>

       {/* S-Curve Chart */}
       <div className={`${theme.components.card} ${theme.layout.cardPadding} h-96 flex flex-col`}>
          <h3 className={`${theme.typography.h3} mb-6`}>Performance S-Curve</h3>
          <div className="flex-1 min-h-0">
             <CustomLineChart 
                data={chartData}
                xAxisKey="date"
                dataKeys={[
                    { key: 'pv', color: '#94a3b8' }, // Gray
                    { key: 'ev', color: '#22c55e' }, // Green
                    { key: 'ac', color: '#ef4444' }, // Red
                ]}
                height={300}
             />
          </div>
          <div className="flex justify-center gap-6 mt-4 text-xs font-medium text-slate-500">
             <div className="flex items-center gap-2"><div className="w-3 h-1 bg-slate-400"></div> Planned Value (PV)</div>
             <div className="flex items-center gap-2"><div className="w-3 h-1 bg-green-500"></div> Earned Value (EV)</div>
             <div className="flex items-center gap-2"><div className="w-3 h-1 bg-red-500"></div> Actual Cost (AC)</div>
          </div>
       </div>

       {/* Indices Details */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className={`${theme.components.card} ${theme.layout.cardPadding}`}>
               <h3 className={`${theme.typography.h3} mb-4`}>Performance Indices</h3>
               <div className="space-y-4">
                   <div>
                       <div className="flex justify-between text-sm mb-1">
                           <span>Schedule Efficiency (SPI)</span>
                           <span className="font-bold">{evm.spi.toFixed(2)}</span>
                       </div>
                       <div className="w-full bg-slate-100 rounded-full h-2">
                           <div className={`h-2 rounded-full ${evm.spi >= 1 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(evm.spi * 100, 100)}%` }}></div>
                       </div>
                   </div>
                   <div>
                       <div className="flex justify-between text-sm mb-1">
                           <span>Cost Efficiency (CPI)</span>
                           <span className="font-bold">{evm.cpi.toFixed(2)}</span>
                       </div>
                       <div className="w-full bg-slate-100 rounded-full h-2">
                           <div className={`h-2 rounded-full ${evm.cpi >= 1 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(evm.cpi * 100, 100)}%` }}></div>
                       </div>
                   </div>
                   <div>
                       <div className="flex justify-between text-sm mb-1">
                           <span>To Complete Efficiency (TCPI)</span>
                           <span className="font-bold">{evm.tcpi.toFixed(2)}</span>
                       </div>
                       <div className="w-full bg-slate-100 rounded-full h-2">
                           <div className={`h-2 rounded-full ${evm.tcpi <= 1 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${Math.min(evm.tcpi * 100, 100)}%` }}></div>
                       </div>
                   </div>
               </div>
           </div>
           
           <div className={`${theme.components.card} ${theme.layout.cardPadding}`}>
               <h3 className={`${theme.typography.h3} mb-4`}>Forecast Values</h3>
               <div className="space-y-4 text-sm">
                   <div className="flex justify-between border-b border-slate-100 pb-2">
                       <span className="text-slate-500">Estimate to Complete (ETC)</span>
                       <span className="font-mono font-bold">{formatCurrency(evm.etc)}</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-100 pb-2">
                       <span className="text-slate-500">Estimate at Completion (EAC)</span>
                       <span className="font-mono font-bold">{formatCurrency(evm.eac)}</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-100 pb-2">
                       <span className="text-slate-500">Variance at Completion (VAC)</span>
                       <span className={`font-mono font-bold ${evm.vac >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(evm.vac)}</span>
                   </div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default EarnedValue;