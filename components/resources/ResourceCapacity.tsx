
import React, { useMemo, useState, useEffect, useDeferredValue } from 'react';
import { Resource } from '../../types/index';
import { useData } from '../../context/DataContext';
import { Loader2, Filter } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';

interface ResourceCapacityProps {
  projectResources: Resource[] | undefined;
}

const ResourceCapacity: React.FC<ResourceCapacityProps> = ({ projectResources }) => {
  const { state } = useData();
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  
  // Pattern 18: useDeferredValue for the intensive heatmap computation
  const deferredResources = useDeferredValue(projectResources);
  const isStale = projectResources !== deferredResources;

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const allocationData = useMemo(() => {
      const data: Record<string, number[]> = {};
      // Ensure we operate on the deferred value to keep UI responsive
      if (!deferredResources || !currentYear) return {};

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
    if (percentage === 0) return 'bg-white text-slate-300';
    if (percentage < 80) return 'bg-green-100 text-green-800 hover:bg-green-200';
    if (percentage <= 100) return 'bg-nexus-100 text-nexus-800 hover:bg-nexus-200';
    return 'bg-red-100 text-red-800 hover:bg-red-200';
  };
  
  // Skeleton Loading State (Principle 1: Zero Layout Shift)
  if (!deferredResources || !currentYear) {
      return (
          <div className="h-full flex flex-col">
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                  <Skeleton width={200} height={20} />
                  <Skeleton width={150} height={20} />
              </div>
              <div className="flex-1 p-4 overflow-hidden">
                   {/* Table Header Skeleton */}
                   <div className="flex mb-4 gap-2">
                       <Skeleton width={250} height={32} />
                       {[...Array(12)].map((_, i) => <Skeleton key={i} className="flex-1" height={32} />)}
                   </div>
                   {/* Table Rows Skeleton */}
                   {[...Array(10)].map((_, i) => (
                       <div key={i} className="flex mb-2 gap-2">
                           <Skeleton width={250} height={40} />
                           {[...Array(12)].map((_, j) => <Skeleton key={j} className="flex-1" height={40} variant="rect"/>)}
                       </div>
                   ))}
              </div>
          </div>
      );
  }

  return (
    <div className={`h-full flex flex-col transition-opacity duration-300 ${isStale ? 'opacity-60' : 'opacity-100'}`}>
      <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-700 text-sm">Resource Allocation Index ({currentYear})</h3>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-tighter">
          {isStale && <span className="text-nexus-600 animate-pulse flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Recalculating Matrix...</span>}
          <div className="flex gap-2">
            <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-green-100 border rounded"></div> Under</span>
            <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-nexus-100 border rounded"></div> Optimal</span>
            <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 bg-red-100 border rounded"></div> Over</span>
          </div>
        </div>
      </div>
      <div className="overflow-auto flex-1 scrollbar-thin">
        <div className="min-w-[800px]">
            <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 border-b border-slate-200 sticky left-0 z-20 w-64 shadow-[1px_0_0_0_#e2e8f0]">Entity Identity</th>
                {months.map(m => <th key={m} className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-200">{m}</th>)}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
                {deferredResources.map(res => (
                <tr key={res.id}>
                    <td className="px-6 py-4 whitespace-nowrap bg-white border-r border-slate-100 sticky left-0 z-10 font-bold text-sm text-slate-800 shadow-[1px_0_0_0_#f1f5f9]">
                        {res.name}
                    </td>
                    {months.map((_, idx) => {
                        const alloc = allocationData[res.id]?.[idx] || 0;
                        return (
                            <td key={idx} className="p-1 h-12">
                                <div className={`w-full h-full rounded flex items-center justify-center text-[11px] font-black transition-colors ${getCellColor(alloc)}`}>
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
    </div>
  );
};
export default ResourceCapacity;