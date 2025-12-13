
import React, { useMemo } from 'react';
import { useProjectState } from '../../hooks';
import { Layers, ListChecks, FileWarning, CheckCircle } from 'lucide-react';
import StatCard from '../shared/StatCard';
import { CustomBarChart } from '../charts/CustomBarChart';
import { useTheme } from '../../context/ThemeContext';
import { formatPercentage } from '../../utils/formatters';

interface ScopeDashboardProps {
  projectId: string;
}

const ScopeDashboard: React.FC<ScopeDashboardProps> = ({ projectId }) => {
  const { project, summary } = useProjectState(projectId);
  const theme = useTheme();

  // Mock data calculation for dashboard
  const metrics = useMemo(() => {
      const requirements = project?.requirements || [];
      const wbsNodes = project?.wbs || [];
      
      const reqCoverage = requirements.length > 0 
        ? (requirements.filter(r => r.status === 'Verified').length / requirements.length) * 100 
        : 0;
      
      // Calculate depth of WBS
      const getDepth = (nodes: any[], depth = 1): number => {
          if (!nodes || nodes.length === 0) return depth;
          return Math.max(...nodes.map(n => getDepth(n.children, depth + 1)));
      };
      
      const wbsDepth = getDepth(wbsNodes) - 1; // 0-indexed adjustment for root
      
      // Breakdown of requirements status
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
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard 
                title="WBS Elements" 
                value={metrics.totalWorkPackages} 
                subtext={`Depth: Level ${metrics.wbsDepth}`} 
                icon={Layers} 
            />
            <StatCard 
                title="Requirements" 
                value={metrics.totalRequirements} 
                subtext={`${metrics.reqCoverage.toFixed(0)}% Verified`} 
                icon={ListChecks} 
            />
            <StatCard 
                title="Scope Completion" 
                value={formatPercentage(summary?.overallProgress || 0)} 
                subtext="Physical % Complete" 
                icon={CheckCircle} 
                trend="up"
            />
            <StatCard 
                title="Unapproved Scope" 
                value="0" 
                subtext="Pending Change Orders" 
                icon={FileWarning} 
                trend="up" // Up is good here (0 is good)
            />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
                <h3 className="font-bold text-slate-800 mb-4">Requirements Verification Status</h3>
                <CustomBarChart 
                    data={metrics.reqStatusData}
                    xAxisKey="name"
                    dataKey="count"
                    height={250}
                    barColor="#22c55e"
                />
            </div>
            
            <div className={`${theme.colors.surface} ${theme.layout.cardPadding} rounded-xl border ${theme.colors.border} shadow-sm`}>
                <h3 className="font-bold text-slate-800 mb-4">Scope Definition Quality</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-700">WBS Dictionary Completeness</span>
                        <span className="font-bold text-nexus-600">85%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-700">Requirements Traceability</span>
                        <span className="font-bold text-nexus-600">100%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-700">Change Control Compliance</span>
                        <span className="font-bold text-green-600">Compliant</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ScopeDashboard;
