
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
    const endDate = new Date(project.endDate);
    const bac = project.originalBudget;
    const totalDays = getDaysDiff(startDate, endDate);
    if (totalDays <= 0) return [];

    const data = [];
    
    // Generate S-Curve Points
    for (let i = 0; i <= totalDays; i += 30) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const percentTime = i / totalDays;
      
      // S-Curve Approximation for PV
      const curveFactor = percentTime < 0.5 ? 2 * percentTime * percentTime : -1 + (4 - 2 * percentTime) * percentTime;
      const pv = bac * curveFactor;
      
      const point: any = { 
          date: date.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}),
          pv,
          bac: project.originalBudget 
      };

      if (date <= today) {
          const timeRatio = i / getDaysDiff(startDate, today);
          point.ev = evm.ev * timeRatio; 
          point.ac = evm.ac * timeRatio; 
      }

      data.push(point);
    }
    return data;
  }, [project, evm, today]);

  // FIX: Replaced simple text fallback with professional EmptyGrid component when EVM data is unavailable
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
            trend={evm.spi >= 1 ? 'up' : 'down'} 
            icon={evm.spi >= 1 ? CheckCircle : AlertTriangle}
          />
          <StatCard 
            title="Cost Performance (CPI)" 
            value={evm.cpi.toFixed(2)} 
            subtext={evm.costStatus} 
            trend={evm.cpi >= 1 ? 'up' : 'down'} 
            icon={evm.cpi >= 1 ? CheckCircle : AlertTriangle}
          />
          <StatCard 
            title="Schedule Variance (SV)" 
            value={formatCompactCurrency(evm.sv)} 
            subtext="Earned - Planned" 
            trend={evm.sv >= 0 ? 'up' : 'down'} 
            icon={BarChart2}
          />
          <StatCard 
            title="Cost Variance (CV)" 
            value={formatCompactCurrency(evm.cv)} 
            subtext="Earned - Actual" 
            trend={evm.cv >= 0 ? 'up' : 'down'} 
            icon={BarChart2}
          />
       </div>

       {/* Main S-Curve Chart */}
       <div className={`${theme.components.card} ${theme.layout.cardPadding}`}>
         <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-nexus-600"/> Performance Measurement Baseline (PMB)
            </h3>
            <div className="flex gap-4 text-sm text-slate-600">
                <span><strong>BAC:</strong> {formatCompactCurrency(evm.bac)}</span>
                <span><strong>EAC:</strong> {formatCompactCurrency(evm.eac)}</span>
            </div>
         </div>
         <CustomLineChart 
            data={chartData}
            xAxisKey="date"
            dataKeys={[
                { key: 'pv', color: '#94a3b8' },
                { key: 'ev', color: '#22c55e' },
                { key: 'ac', color: '#ef4444' }
            ]}
            height={300}
         />
       </div>

       {/* Forecasting Panel */}
       <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
           <div className={`${theme.components.card} ${theme.layout.cardPadding}`}>
              <h3 className="font-bold text-slate-800 mb-4">Forecasting (EAC)</h3>
              <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-600">Estimate at Completion</span>
                      <span className="font-mono font-bold text-slate-900">{formatCurrency(evm.eac)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-600">Estimate to Complete</span>
                      <span className="font-mono font-bold text-nexus-700">{formatCurrency(evm.etc)}</span>
                  </div>
                  <div className={`flex justify-between items-center p-3 rounded-lg ${evm.vac >= 0 ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                      <span className="text-sm font-bold">Variance at Completion (VAC)</span>
                      <span className={`font-mono font-bold ${evm.vac >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                          {evm.vac > 0 ? '+' : ''}{formatCurrency(evm.vac)}
                      </span>
                  </div>
              </div>
           </div>

           <div className={`${theme.components.card} ${theme.layout.cardPadding}`}>
              <h3 className="font-bold text-slate-800 mb-4">Performance Index Trends</h3>
              <div className="h-40 flex items-end gap-2 px-4 pb-2 border-b border-slate-200">
                  <div className="w-1/2 flex flex-col items-center gap-2">
                      <div className="relative w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`absolute top-0 left-0 h-full ${evm.spi >= 1 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{width: `${Math.min(evm.spi * 100, 100)}%`}}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">SPI: {evm.spi.toFixed(2)}</span>
                  </div>
                  <div className="w-1/2 flex flex-col items-center gap-2">
                      <div className="relative w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className={`absolute top-0 left-0 h-full ${evm.cpi >= 1 ? 'bg-green-500' : 'bg-red-500'}`} style={{width: `${Math.min(evm.cpi * 100, 100)}%`}}></div>
                      </div>
                      <span className="text-xs font-bold text-slate-600">CPI: {evm.cpi.toFixed(2)}</span>
                  </div>
              </div>
              <div className="mt-4 text-xs text-slate-500 text-center">
                  TCPI (Required Efficiency): <strong>{evm.tcpi.toFixed(2)}</strong>
                  <p className="mt-1 opacity-70">
                      {evm.tcpi > 1 ? "Performance must improve to meet budget." : "Project can perform less efficiently and still meet budget."}
                  </p>
              </div>
           </div>
       </div>
    </div>
  );
};

export default EarnedValue;
