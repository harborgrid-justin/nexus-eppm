import React, { useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { Layers, ListChecks, FileWarning, CheckCircle, Target, Activity } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { CustomBarChart } from '../charts/CustomBarChart';
import { useTheme } from '../../context/ThemeContext';
import { formatPercentage } from '../../utils/formatters';

const ScopeDashboard: React.FC = () => {
  const { project, summary, changeOrders } = useProjectWorkspace();
  const theme = useTheme();

  const metrics = useMemo(() => {
      const requirements = project?.requirements || [];
      const wbsNodes = project?.wbs || [];
      
      // Calculate Verification Match
      const verifiedCount = requirements.filter(r => r.status === 'Verified').length;
      const reqCoverage = requirements.length > 0 ? (verifiedCount / requirements.length) * 100 : 0;
      
      // Calculate WBS Depth
      const getDepth = (nodes: any[], currentDepth = 0): number => {
          if (!nodes || nodes.length === 0) return currentDepth;
          return Math.max(...nodes.map(n => getDepth(n.children, currentDepth + 1)));
      };
      const wbsDepth = getDepth(wbsNodes);
      
      // Count total WBS elements (flat count)
      const countNodes = (nodes: any[]): number => {
          if (!nodes) return 0;
          return nodes.reduce((acc, n) => acc + 1 + countNodes(n.children), 0);
      };
      const totalWbsElements = countNodes(wbsNodes);

      // Requirement Status Distribution
      const reqStatusData = [
          { name: 'Verified', count: verifiedCount },
          { name: 'Active', count: requirements.filter(r => r.status === 'Active').length },
          { name: 'Draft', count: requirements.filter(r => r.status === 'Draft').length },
      ];

      // Definition Quality: % of WBS nodes with descriptions
      const nodesWithDesc = (nodes: any[]): number => {
          if (!nodes) return 0;
          return nodes.reduce((acc, n) => {
              const currentHasDesc = n.description && n.description.length > 5 ? 1 : 0;
              return acc + currentHasDesc + nodesWithDesc(n.children);
          }, 0);
      };
      const completeness = totalWbsElements > 0 ? (nodesWithDesc(wbsNodes) / totalWbsElements) * 100 : 0;

      // Unapproved Scope (Pending Change Orders)
      const pendingCOs = changeOrders.filter(co => co.status === 'Pending Approval').length;

      return {
          totalWbsElements,
          reqCoverage,
          wbsDepth,
          totalRequirements: requirements.length,
          reqStatusData,
          completeness,
          pendingCOs
      };
  }, [project, changeOrders]);

  if (!project) return null;

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-nexus-in`}>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
            <StatCard 
                title="WBS Elements" 
                value={metrics.totalWbsElements} 
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
                value={metrics.pendingCOs} 
                subtext="Pending Change Orders" 
                icon={FileWarning} 
                trend={metrics.pendingCOs > 0 ? 'down' : 'up'}
            />
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            <div className={`${theme.components.card} ${theme.layout.cardPadding} flex flex-col h-[400px]`}>
                <h3 className={`${theme.typography.h3} mb-6 flex items-center gap-2 font-black uppercase tracking-tighter`}>
                    <Target size={18} className="text-nexus-600"/> Requirements Traceability
                </h3>
                <div className="flex-1">
                    {metrics.totalRequirements > 0 ? (
                        <CustomBarChart 
                            data={metrics.reqStatusData}
                            xAxisKey="name"
                            dataKey="count"
                            height={250}
                            barColor={theme.charts.palette[1]}
                        />
                    ) : (
                        <div className="h-full nexus-empty-pattern rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                            <ListChecks size={32} className="opacity-20 mb-2"/>
                            <p className="text-xs font-bold uppercase tracking-widest">Registry Null</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className={`${theme.components.card} ${theme.layout.cardPadding}`}>
                <h3 className={`${theme.typography.h3} mb-6 flex items-center gap-2 font-black uppercase tracking-tighter`}>
                    <Activity size={18} className="text-blue-500"/> Definition Quality Metrics
                </h3>
                <div className="space-y-6">
                    <div className={`p-5 ${theme.colors.background} rounded-xl border ${theme.colors.border} flex justify-between items-center group hover:border-nexus-300 transition-all`}>
                        <div>
                            <p className={`${theme.typography.label} font-black`}>WBS Dictionary Completeness</p>
                            <p className={`${theme.typography.small} mt-0.5`}>Physical scope description coverage</p>
                        </div>
                        <span className="text-2xl font-black text-nexus-700 font-mono">{metrics.completeness.toFixed(0)}%</span>
                    </div>
                    <div className={`p-5 ${theme.colors.background} rounded-xl border ${theme.colors.border} flex justify-between items-center group hover:border-nexus-300 transition-all`}>
                        <div>
                            <p className={`${theme.typography.label} font-black`}>RTM Mapping</p>
                            <p className={`${theme.typography.small} mt-0.5`}>Requirements linked to deliverables</p>
                        </div>
                        <span className="text-2xl font-black text-green-600 font-mono">
                            {metrics.totalRequirements > 0 ? '100%' : '0%'}
                        </span>
                    </div>
                    <div className={`p-5 ${theme.colors.background} rounded-xl border ${theme.colors.border} flex justify-between items-center group hover:border-nexus-300 transition-all`}>
                        <div>
                            <p className={`${theme.typography.label} font-black`}>Configuration Status</p>
                            <p className={`${theme.typography.small} mt-0.5`}>Latest baseline alignment</p>
                        </div>
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${metrics.pendingCOs > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                            {metrics.pendingCOs > 0 ? 'Variance Detected' : 'Compliant'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ScopeDashboard;