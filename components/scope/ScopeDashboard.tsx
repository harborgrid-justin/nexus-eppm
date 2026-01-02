
import React, { useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { Layers, ListChecks, FileWarning, CheckCircle, Target, Activity } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { CustomBarChart } from '../charts/CustomBarChart';
import { useTheme } from '../../context/ThemeContext';
import { formatPercentage } from '../../utils/formatters';

const ScopeDashboard: React.FC = () => {
  const { project, summary } = useProjectWorkspace();
  const theme = useTheme();

  const metrics = useMemo(() => {
      const requirements = project?.requirements || [];
      const wbsNodes = project?.wbs || [];
      const reqCoverage = requirements.length > 0 
        ? (requirements.filter(r => r.status === 'Verified').length / requirements.length) * 100 
        : 0;
      
      const getDepth = (nodes: any[], depth = 1): number => {
          if (!nodes || nodes.length === 0) return depth;
          return Math.max(...nodes.map(n => getDepth(n.children, depth + 1)));
      };
      const wbsDepth = wbsNodes.length > 0 ? getDepth(wbsNodes) - 1 : 0;
      
      const reqStatusData = [
          { name: 'Verified', count: requirements.filter(r => r.status === 'Verified').length },
          { name: 'Active', count: requirements.filter(r => r.status === 'Active').length },
          { name: 'Draft', count: requirements.filter(r => r.status === 'Draft').length },
      ];

      return {
          totalRequirements: requirements.length,
          reqCoverage,
          wbsDepth,
          totalWorkPackages: project?.tasks.filter(t => t.type !== 'Summary').length || 0,
          reqStatusData
      };
  }, [project]);

  if (!project) return null;

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-500`}>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
            <StatCard 
                title="WBS Elements" 
                value={metrics.totalWorkPackages} 
                subtext={`Maximum Depth: Level ${metrics.wbsDepth}`} 
                icon={Layers} 
            />
            <StatCard 
                title="Requirements" 
                value={metrics.totalRequirements} 
                subtext={`${metrics.reqCoverage.toFixed(0)}% Verification Match`} 
                icon={ListChecks} 
            />
            <StatCard 
                title="Deliverable Completion" 
                value={formatPercentage(summary?.overallProgress || 0)} 
                subtext="Cumulative completion" 
                icon={CheckCircle} 
                trend="up"
            />
            <StatCard 
                title="Unapproved Scope" 
                value="0" 
                subtext="Pending Change Orders" 
                icon={FileWarning} 
                trend="up"
            />
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            <div className={`${theme.components.card} ${theme.layout.cardPadding} flex flex-col`}>
                <h3 className={`${theme.typography.h3} mb-6 flex items-center gap-2`}>
                    <Target size={18} className="text-nexus-600"/> Requirements Traceability
                </h3>
                <div className="flex-1">
                    <CustomBarChart 
                        data={metrics.reqStatusData}
                        xAxisKey="name"
                        dataKey="count"
                        height={250}
                        barColor="#10b981"
                    />
                </div>
            </div>
            
            <div className={`${theme.components.card} ${theme.layout.cardPadding}`}>
                <h3 className={`${theme.typography.h3} mb-6 flex items-center gap-2`}>
                    <Activity size={18} className="text-blue-500"/> Definition Quality Metrics
                </h3>
                <div className="space-y-6">
                    <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border} flex justify-between items-center group hover:bg-slate-100 transition-colors`}>
                        <div>
                            <p className={theme.typography.label}>WBS Dictionary Completeness</p>
                            <p className={`${theme.typography.small} mt-0.5`}>Physical scope description coverage</p>
                        </div>
                        <span className="text-xl font-black text-nexus-700 font-mono">85%</span>
                    </div>
                    <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border} flex justify-between items-center group hover:bg-slate-100 transition-colors`}>
                        <div>
                            <p className={theme.typography.label}>RTM Mapping</p>
                            <p className={`${theme.typography.small} mt-0.5`}>Tasks linked to requirements</p>
                        </div>
                        <span className="text-xl font-black text-green-600 font-mono">100%</span>
                    </div>
                    <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border} flex justify-between items-center group hover:bg-slate-100 transition-colors`}>
                        <div>
                            <p className={theme.typography.label}>Configuration Status</p>
                            <p className={`${theme.typography.small} mt-0.5`}>Latest baseline alignment</p>
                        </div>
                        <span className="text-xs font-black uppercase bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-200">Compliant</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ScopeDashboard;
