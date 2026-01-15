import React, { useMemo, useState, useDeferredValue } from 'react';
import { Resource } from '../../types/index';
import { useData } from '../../context/DataContext';
import { Loader2, Calendar, Activity } from 'lucide-react';
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

      deferredResources.forEach(res => { data[res.id] = new Array(12).fill(0); });

      state.projects.forEach(project => {
          project.tasks.forEach(task => {
              if (task.assignments?.length && task.status !== 'Completed') {
                  const startDate = new Date(task.startDate);
                  const endDate = new Date(task.endDate);
                  let iterDate = new Date(startDate);
                  while (iterDate <= endDate) {
                      if (iterDate.getFullYear() === currentYear) {
                          const mIdx = iterDate.getMonth();
                          task.assignments.forEach(assign => {
                              if (data[assign.resourceId]) {
                                  // Simplified monthly aggregation: sum of assignment units
                                  // Normalizing for overlapping project load
                                  data[assign.resourceId][mIdx] += Number(assign.units) || 0; 
                              }
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
    if (percentage === 0) return 'bg-slate-50 text-slate-200';
    if (percentage < 80) return 'bg-green-50 text-green-700 border border-green-100 shadow-sm';
    if (percentage <= 100) return 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm';
    return 'bg-red-100 text-red-700 font-black shadow-lg ring-2 ring-red-200 animate-pulse';
  };

  if (!projectResources) {
      return (
          <div className="h-full flex flex-col p-8 space-y-6 bg-white animate-nexus-in">
              <div className="flex gap-4"><Skeleton height={100} width="25%" className="rounded-3xl"/><Skeleton height={100} width="25%" className="rounded-3xl"/></div>
              <Skeleton height={500} className="rounded-3xl" />
          </div>
      );
  }

  if (projectResources.length === 0) {
      return (
          <div className="h-full flex flex-col justify-center">
              <EmptyGrid 
                title="Capacity Matrix Isolated" 
                description="The global resource loading matrix requires active assignments. Link enterprise resources to project tasks to generate the cross-portfolio demand heatmap."
                icon={Activity}
              />
          </div>
      );
  }

  return (
    <div className={`h-full flex flex-col bg-white overflow-hidden transition-opacity duration-300 ${isStale ? 'opacity-40' : 'opacity-100'}`}>
      <div className={`p-5 border-b border-slate-200 flex-shrink-0 flex flex-col sm:flex-row items-center justify-between bg-slate-50/50 gap-4 shadow-sm`}>
        <div className="flex items-center gap-4">
            <div className="p-2.5 bg-nexus-600 text-white rounded-xl shadow-lg shadow-nexus-500/10">
                <Calendar size={20}/>
            </div>
            <div>
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">Enterprise Capacity Heatmap ({currentYear})</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Aggregated Physical Demand (%) / Partition Period</p>
            </div>
        </div>
        {isStale && <div className="flex items-center gap-2 text-nexus-600 animate-pulse text-[10px] font-black uppercase bg-white px-3 py-1.5 rounded-full border border-nexus-200 shadow-sm"><Loader2 size={12} className="animate-spin"/> Recalculating Matrix...</div>}
      </div>
      <div className="overflow-auto flex-1 scrollbar-thin bg-white" style={{ contain: 'content' }}>
        <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0" role="grid">
            <thead className="bg-slate-50 sticky top-0 z-30">
                <tr>
                    <th className="px-6 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 sticky left-0 z-40 border-b w-72 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Resource Identity</th>
                    {months.map(m => <th key={m} className="px-4 py-5 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest border-b min-w-[80px]">{m}</th>)}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {deferredResources.map(res => (
                <tr key={res.id} className="hover:bg-slate-50/50 group transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap bg-white sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] group-hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 shadow-inner group-hover:bg-white transition-colors uppercase">{String(res.name).charAt(0)}</div>
                            <div className="min-w-0">
                                <div className="font-black text-sm text-slate-800 truncate">{String(res.name)}</div>
                                <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter truncate">{String(res.role)}</div>
                            </div>
                        </div>
                    </td>
                    {months.map((_, idx) => {
                        const alloc = allocationData[res.id]?.[idx] || 0;
                        return (
                            <td key={idx} className="p-1.5 h-16 group/cell">
                                <div className={`w-full h-full rounded-xl flex flex-col items-center justify-center text-[11px] font-black transition-all cursor-help hover:scale-[1.03] ${getCellColor(alloc)}`} title={`${String(res.name)}: ${alloc.toFixed(1)}% Load`}>
                                    {alloc > 0 ? (
                                        <>
                                            <span>{alloc.toFixed(0)}%</span>
                                            <div className="w-8 h-0.5 bg-current opacity-20 rounded-full mt-1 hidden sm:block"></div>
                                        </>
                                    ) : (
                                        <span className="opacity-40">-</span>
                                    )}
                                </div>
                            </td>
                        );
                    })}
                </tr>
                ))}
                {/* Visual filler */}
                {[...Array(5)].map((_, i) => (
                    <tr key={`fill-${i}`} className="nexus-empty-pattern opacity-10 h-12">
                        <td className="sticky left-0 bg-white"></td>
                        <td colSpan={12}></td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      <div className={`p-3 bg-slate-900 text-white flex justify-between items-center px-8 flex-shrink-0 z-40 shadow-2xl border-t border-white/5`}>
          <div className="flex gap-8 text-[9px] font-black uppercase tracking-widest opacity-80">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Nominal (&lt;80%)</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Optimal (80-100%)</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> Saturation (100-115%)</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Overload (&gt;115%)</span>
          </div>
          <div className="text-[10px] font-mono font-bold text-nexus-400 uppercase tracking-tighter">Data Source: ENTERPRISE_LEDGER_PRIMARY</div>
      </div>
    </div>
  );
};

export default ResourceCapacity;