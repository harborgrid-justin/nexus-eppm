import React from 'react';
import { Resource } from '../../types';

interface ResourceCapacityProps {
  projectResources: Resource[] | undefined;
}

const ResourceCapacity: React.FC<ResourceCapacityProps> = ({ projectResources }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

  // Mock allocation logic for demonstration
  const getMockAllocation = (resId: string, monthIdx: number) => {
    const base = resId.charCodeAt(0) + resId.charCodeAt(1) + monthIdx * 15;
    return base % 140; 
  };
  const getCellColor = (percentage: number) => {
    if (percentage < 80) return 'bg-green-100 text-green-800 hover:bg-green-200';
    if (percentage <= 100) return 'bg-nexus-100 text-nexus-800 hover:bg-nexus-200';
    if (percentage <= 120) return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    return 'bg-red-100 text-red-800 hover:bg-red-200';
  };
  
  if (!projectResources) return <div>Loading capacity data...</div>;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center justify-between">
        <h3 className="font-semibold text-slate-700 text-sm">Resource Allocation Heatmap</h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 border border-green-200 rounded"></span> Under</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-nexus-100 border border-nexus-200 rounded"></span> Optimal</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 border border-red-200 rounded"></span> Over</span>
        </div>
      </div>
      <div className="overflow-auto flex-1">
        <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200 w-64 sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Resource</th>
              {months.map(m => (
                <th key={m} className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider bg-slate-50 border-b border-slate-200">{m} 2024</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {projectResources.map(res => (
              <tr key={res.id}>
                <td className="px-6 py-4 whitespace-nowrap bg-white border-r border-slate-100 sticky left-0 z-10 font-medium text-sm text-slate-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  {res.name}
                </td>
                {months.map((m, idx) => {
                  const alloc = getMockAllocation(res.id, idx);
                  return (
                    <td key={idx} className="p-1 h-12">
                      <div className={`w-full h-full rounded flex items-center justify-center text-xs font-semibold cursor-pointer transition-colors ${getCellColor(alloc)}`}>
                        {alloc}%
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