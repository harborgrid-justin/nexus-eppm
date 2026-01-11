
import React, { useMemo, useState, useEffect, useDeferredValue } from 'react';
import { Resource } from '../../types/index';
import { useData } from '../../context/DataContext';
import { Loader2, Plus } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { useTheme } from '../../context/ThemeContext';
import { EmptyGrid } from '../common/EmptyGrid';

interface ResourceCapacityProps {
  projectResources: Resource[] | undefined;
}

const ResourceCapacity: React.FC<ResourceCapacityProps> = ({ projectResources }) => {
  const { state } = useData();
  const theme = useTheme();
  const [currentYear] = useState(() => new Date().getFullYear());
  
  const deferredResources = useDeferredValue(projectResources);
  const isStale = projectResources !== deferredResources;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const allocationData = useMemo(() => {
      const data: Record<string, number[]> = {};
      if (!deferredResources) return {};

      deferredResources.forEach(res => {
          data[res.id] = new Array(12).fill(0);
      });

      state.projects.forEach(project => {
          project.tasks.forEach(task => {
              if (task.assignments?.length) {
                  const startDate = new Date(task.startDate);
                  const endDate = new Date(task.endDate);
                  let iterDate = new Date(startDate);
                  while (iterDate <= endDate) {
                      if (iterDate.getFullYear() === currentYear) {
                          const mIdx = iterDate.getMonth();
                          task.assignments.forEach(assign => {
                              if (data[assign.resourceId]) data[assign.resourceId][mIdx] += assign.units; 
                          });
                      }
                      iterDate.setMonth(iterDate.getMonth() + 1);
                      iterDate.setDate(1);
                  }
              }
          });
      });
      return data;
  }, [deferredResources, state.projects, currentYear]);

  const getCellColor = (percentage: number) => {
    if (percentage === 0) return 'bg-slate-50 text-slate-300';
    if (percentage < 80) return 'bg-green-50 text-green-700';
    if (percentage <= 100) return 'bg-blue-50 text-blue-700';
    return 'bg-red-100 text-red-700 font-bold';
  };

  if (!projectResources) {
      return (
          <div className="h-full flex flex-col p-6 space-y-6">
              <Skeleton height={100} />
              <Skeleton height={400} />
          </div>
      );
  }

  if (projectResources.length === 0) {
      return (
          <EmptyGrid 
            title="Capacity Model Empty" 
            description="No active resources found. Assign resources to project tasks to visualize the demand heatmap."
            icon={Loader2}
            actionLabel="Provision Resource"
            onAdd={() => {}}
          />
      );
  }

  return (
    <div className={`h-full flex flex-col transition-opacity duration-300 ${isStale ? 'opacity-40' : 'opacity-100'}`}>
      <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center justify-between bg-slate-50/50">
        <div>
            <h3 className="font-bold text-slate-800 text-sm">Enterprise Capacity Heatmap ({currentYear})</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Real-time Allocation Matrix</p>
        </div>
        {isStale && <div className="flex items-center gap-2 text-nexus-600 animate-pulse text-xs font-bold uppercase tracking-widest"><Loader2 size={12} className="animate-spin"/> Syncing Ledger...</div>}
      </div>
      <div className="overflow-auto flex-1 scrollbar-thin">
        <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
            <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 sticky left-0 z-20 border-b w-64 shadow-[2px_0_0_0_#e2e8f0]">Identity</th>
                    {months.map(m => <th key={m} className="px-4 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest border-b">{m}</th>)}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
                {deferredResources.map(res => (
                <tr key={res.id} className="hover:bg-slate-50/30">
                    <td className="px-6 py-4 whitespace-nowrap bg-white sticky left-0 z-10 font-bold text-sm text-slate-800 shadow-[2px_0_0_0_#f1f5f9]">
                        {res.name}
                    </td>
                    {months.map((_, idx) => {
                        const alloc = allocationData[res.id]?.[idx] || 0;
                        return (
                            <td key={idx} className="p-1 h-12">
                                <div className={`w-full h-full rounded flex items-center justify-center text-[11px] font-black transition-all ${getCellColor(alloc)}`}>
                                    {alloc > 0 ? `${alloc}%` : '-'}
                                </div>
                            </td>
                        );
                    })}
                </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};
export default ResourceCapacity;
