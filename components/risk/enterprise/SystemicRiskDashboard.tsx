import React from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { ShieldAlert, TrendingUp, Activity, Layers, AlertTriangle, PieChart } from 'lucide-react';
import StatCard from '../../shared/StatCard';
import { CustomBarChart } from '../../charts/CustomBarChart';
import { CustomPieChart } from '../../charts/CustomPieChart';
import { formatCompactCurrency } from '../../../utils/formatters';
import { useSystemicRiskLogic } from '../../../hooks/domain/useSystemicRiskLogic';
import { EmptyGrid } from '../../common/EmptyGrid';
import { useNavigate } from 'react-router-dom';

export const SystemicRiskDashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { metrics, projects } = useSystemicRiskLogic();

  if (metrics.totalRisks === 0) {
      return (
          <div className="h-full flex items-center justify-center p-12">
              <EmptyGrid 
                title="Organizational Risk Matrix Null"
                description="No systemic or escalated project risks have been registered. Executive risk monitoring requires a populated strategic ledger."
                icon={ShieldAlert}
                actionLabel="Establish Corporate Risk"
                onAdd={() => navigate('/enterpriseRisks?view=register')}
              />
          </div>
      );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300 scrollbar-thin`}>
        <div className={`grid grid-cols-1 md:grid-cols-4 ${theme.layout.gridGap}`}>
            <StatCard title="Global Exposure" value={formatCompactCurrency(metrics.totalExposure)} icon={ShieldAlert} trend="down" />
            <StatCard title="Critical Nodes" value={metrics.criticalRisks} icon={AlertTriangle} trend={metrics.criticalRisks > 5 ? 'down' : 'up'} />
            <StatCard title="Tracked Risks" value={metrics.totalRisks} icon={Activity} subtext="Total lifecycle count" />
            <StatCard title="Portfolio Heat" value={metrics.avgScore.toFixed(1)} icon={TrendingUp} trend="down" />
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            <div className={`${theme.components.card} p-10 rounded-[2.5rem] h-[450px] flex flex-col shadow-sm`}>
                <h3 className={`font-black text-slate-900 text-sm uppercase tracking-widest mb-10 flex items-center gap-2 border-b border-slate-50 pb-4`}>
                    <Layers size={18} className="text-nexus-600"/> Contextual Distribution
                </h3>
                <div className="flex-1">
                    <CustomBarChart 
                        data={metrics.byContext}
                        xAxisKey="name"
                        dataKey="value"
                        barColor={theme.charts.palette[0]} 
                        height={300}
                    />
                </div>
            </div>

            <div className={`${theme.components.card} p-10 rounded-[2.5rem] h-[450px] flex flex-col shadow-sm`}>
                <h3 className={`font-black text-slate-900 text-sm uppercase tracking-widest mb-10 flex items-center gap-2 border-b border-slate-50 pb-4`}>
                    <PieChart size={18} className="text-blue-500"/> Systemic Classifications
                </h3>
                <div className="flex-1">
                    <CustomPieChart data={metrics.categoryData} height={300} />
                </div>
            </div>
        </div>

        <div className={`${theme.components.card} rounded-[2rem] overflow-hidden shadow-md`}>
            <div className={`p-6 border-b ${theme.colors.border} bg-slate-900 flex justify-between items-center`}>
                <h3 className={`font-black text-white text-xs uppercase tracking-widest flex items-center gap-2`}>
                    <AlertTriangle size={18} className="text-red-500 animate-pulse"/> Escalated Critical Threats
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Ledger Integrity: VERIFIED</span>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                    <thead className="bg-slate-50/50">
                        <tr>
                            <th className={theme.components.table.header + " pl-10"}>Partition Context</th>
                            <th className={theme.components.table.header}>Risk Narrative</th>
                            <th className={theme.components.table.header + " text-center"}>Heat</th>
                            <th className={theme.components.table.header + " text-right pr-10"}>EMV Impact</th>
                        </tr>
                    </thead>
                    <tbody className={`bg-white divide-y divide-slate-50`}>
                        {metrics.topRisks.map((risk: any) => (
                            <tr key={risk.id} className="nexus-table-row transition-all group">
                                <td className={`px-6 py-5 pl-10 text-[10px] font-black uppercase text-slate-400 group-hover:text-nexus-600 transition-colors`}>
                                    {risk.projectId ? `PRJ: ${projects.find(p => p.id === risk.projectId)?.code || '---'}` : 'Global Portfolio'}
                                </td>
                                <td className="px-6 py-5">
                                    <div className={`font-bold text-sm text-slate-800 uppercase tracking-tight truncate max-w-lg`} title={risk.description}>{risk.description}</div>
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-black bg-red-50 text-red-700 border border-red-100 shadow-sm">
                                        {risk.score}
                                    </span>
                                </td>
                                <td className={`px-6 py-5 text-right pr-10 font-mono font-black text-slate-900`}>
                                    {formatCompactCurrency(risk.financialImpact || 0)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};