


import React, { useMemo, useState, useEffect } from 'react';
// FIX: Corrected import path for Resource type to resolve module resolution error.
import { Resource } from '../../types/index';
import { useData } from '../../context/DataContext';
import { getDaysDiff, addWorkingDays } from '../../utils/dateUtils';

interface ResourceCapacityProps {
  projectResources: Resource[] | undefined;
}

const ResourceCapacity: React.FC<ResourceCapacityProps> = ({ projectResources }) => {
  const { state } = useData();
  
  // Hydration safety: Define current year after mount
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Calculate allocations dynamically
  const allocationData = useMemo(() => {
      const data: Record<string, number[]> = {};
      
      if (!projectResources || !currentYear) return {};

      // Initialize zero allocation for all resources for 12 months
      projectResources.forEach(res => {
          data[res.id] = new Array(12).fill(0);
      });

      // Iterate over ALL projects to get enterprise-wide view for these resources
      state.projects.forEach(project => {
          project.tasks.forEach(task => {
              if (task.assignments && task.assignments.length > 0) {
                  const startDate = new Date(task.startDate);
                  const endDate = new Date(task.endDate);
                  
                  // Simple monthly bucketing logic
                  // Iterate through months between start and end date
                  let iterDate = new Date(startDate);
                  while (iterDate <= endDate) {
                      if (iterDate.getFullYear() === currentYear) {
                          const monthIndex = iterDate.getMonth();
                          
                          task.assignments.forEach(assignment => {
                              if (data[assignment.resourceId]) {
                                  data[assignment.resourceId][monthIndex] += assignment.units; 
                              }
                          });
                      }
                      // Move to next month
                      iterDate.setMonth(iterDate.getMonth() + 1);
                      iterDate.setDate(1); // Start of next month
                  }
              }
          });
      });
      
      return data;
  }, [projectResources, state.projects, currentYear]);

  const getCellColor = (percentage: number) => {
    if (percentage === 0) return 'bg-white text-slate-300';
    if (percentage < 80) return 'bg-green-100 text-green-800 hover:bg-green-200';
    if (percentage <= 100) return 'bg-nexus-100 text-nexus-800 hover:bg-nexus-200';
    if (percentage <= 120) return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    return 'bg-red-100 text-red-800 hover:bg-red-200';
  };
  
  if (!projectResources || !currentYear) return <div>Loading capacity data...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center justify-between">
        <h3 className="font-semibold text-slate-700 text-sm">Resource Allocation Heatmap ({currentYear})</h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 border border-green-200 rounded"></span> Under</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-nexus-100 border border-nexus-200 rounded"></span> Optimal</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 border border-red-200 rounded"></span> Over</span>
        </div>
      </div>
      <div className="overflow-auto flex-1">
        <div className="min-w-[800px]">
            <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
            <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200 w-64 sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Resource</th>
                {months.map(m => (
                    <th key={m} className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">{m}</th>
                ))}
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
                {projectResources.map(res => (
                <tr key={res.id}>
                    <td className="px-6 py-4 whitespace-nowrap bg-white border-r border-slate-100 sticky left-0 z-10 font-medium text-sm text-slate-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    {res.name}
                    </td>
                    {months.map((_, idx) => {
                    const alloc = allocationData[res.id] ? allocationData[res.id][idx] : 0;
                    return (
                        <td key={idx} className="p-1 h-12">
                        <div className={`w-full h-full rounded flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors ${getCellColor(alloc)}`}>
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