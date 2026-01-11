
import React, { useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { Layers, ListChecks, FileWarning, CheckCircle, Target, Activity, Plus } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { CustomBarChart } from '../charts/CustomBarChart';
import { useTheme } from '../../context/ThemeContext';
import { formatPercentage } from '../../utils/formatters';
import { EmptyGrid } from '../common/EmptyGrid';
import { useSearchParams } from 'react-router-dom';

const ScopeDashboard: React.FC = () => {
  const { project, summary, changeOrders } = useProjectWorkspace();
  const theme = useTheme();
  const [, setSearchParams] = useSearchParams();

  const handleNavigateToView = (view: string) => {
      setSearchParams(prev => {
          const params = new URLSearchParams(prev);
          params.set('view', view);
          return params;
      });
  };

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
      const wbsDepth = wbsNodes.length > 0 ? getDepth(wbsNodes) : 0;
      
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
    <div className={`h-full overflow-y-auto p-8 space-y-8 animate-nexus-in scrollbar-thin`}>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${theme.layout.gridGap}`}>
            <StatCard 
                title="WBS Elements" 
                value={metrics.totalWbsElements} 
                subtext={metrics.totalWbsElements > 0 ? `Maximum Depth: Level ${metrics.wbsDepth}` : 'Registry Empty'} 
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
            <div className={`${theme.components.card} p-8 flex flex-col h-[400px]`}>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <Target size={16} className="text-nexus-600"/> Requirements Traceability
                </h3>
                <div className="flex-1">
                    {metrics.totalRequirements > 0 ? (
                        <CustomBarChart 
                            data={metrics.reqStatusData}
                            xAxisKey="name"
                            dataKey="count"
                            height={250}
                            barColor="#3b82f6"
                        />
                    ) : (
                        <div className="h-full border-2 border-dashed border-slate-100 rounded-2xl">
                            <EmptyGrid 
                                title="Requirements Registry Null"
                                description="No functional or technical requirements have been mapped to the current scope baseline."
                                icon={ListChecks}
                                actionLabel="Provision Requirements"
                                onAdd={() => handleNavigateToView('requirements')}
                            />
                        </div>
                    )}
                </div>
            </div>
            
            <div className={`${theme.components.card} p-8 flex flex-col h-[400px]`}>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <Activity size={16} className="text-blue-500"/> Definition Quality Metrics
                </h3>
                <div className="space-y-4 flex-1">
                    <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border} flex justify-between items-center group hover:border-nexus-300 transition-all ${metrics.totalWbsElements === 0 ? 'nexus-empty-pattern' : ''}`}>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">WBS Dictionary Completeness</p>
                            <p className="text-xs text-slate-400 mt-0.5">Physical scope description coverage</p>
                        </div>
                        <div className="text-right">
                            <span className={`text-2xl font-black font-mono ${metrics.completeness < 50 ? 'text-orange-500' : 'text-nexus-700'}`}>{metrics.completeness.toFixed(0)}%</span>
                            {metrics.totalWbsElements === 0 && (
                                <button onClick={() => handleNavigateToView('wbs')} className="block text-[10px] font-black text-nexus-600 uppercase mt-1 hover:underline">+ Define</button>
                            )}
                        </div>
                    </div>
                    <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border} flex justify-between items-center group hover:border-nexus-300 transition-all ${metrics.totalRequirements === 0 ? 'nexus-empty-pattern' : ''}`}>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">RTM Mapping</p>
                            <p className="text-xs text-slate-400 mt-0.5">Requirements linked to deliverables</p>
                        </div>
                        <div className="text-right">
                            <span className={`text-2xl font-black font-mono ${metrics.totalRequirements > 0 ? 'text-green-600' : 'text-slate-300'}`}>
                                {metrics.totalRequirements > 0 ? '100%' : '0%'}
                            </span>
                            {metrics.totalRequirements === 0 && (
                                <button onClick={() => handleNavigateToView('requirements')} className="block text-[10px] font-black text-nexus-600 uppercase mt-1 hover:underline">+ Map</button>
                            )}
                        </div>
                    </div>
                    <div className={`p-4 ${theme.colors.background} rounded-xl border ${theme.colors.border} flex justify-between items-center group hover:border-nexus-300 transition-all`}>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Configuration Status</p>
                            <p className="text-xs text-slate-400 mt-0.5">Latest baseline alignment</p>
                        </div>
                        <div className="text-right">
                            <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${metrics.pendingCOs > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                {metrics.pendingCOs > 0 ? 'Variance Detected' : 'Compliant'}
                            </span>
                             {metrics.pendingCOs > 0 && (
                                <button onClick={() => handleNavigateToView('integration')} className="block text-[10px] font-black text-nexus-600 uppercase mt-1 hover:underline">View COs</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ScopeDashboard;
