import React, { useState } from 'react';
import { Resource } from '../types';
import { MOCK_RESOURCES } from '../constants';
import { useProjectState } from '../hooks/useProjectState';
// FIX: Import the 'Users' icon. 'Users' is the correct icon for a group, which is more fitting for "Resource Management".
import { User, Users, DollarSign, Briefcase, BarChart2, List } from 'lucide-react';

interface ResourceManagementProps {
  projectId?: string; // Optional: If provided, filters to project-specific resources
}

const ResourceManagement: React.FC<ResourceManagementProps> = ({ projectId }) => {
  const [view, setView] = useState<'list' | 'planning'>('list');
  const projectState = useProjectState(projectId || null);

  const resources = projectId ? projectState.assignedResources : MOCK_RESOURCES;

  // Mock data for heatmap
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const getMockAllocation = (resId: string, monthIdx: number) => {
    // Deterministic randomish numbers based on string char codes
    const base = resId.charCodeAt(0) + resId.charCodeAt(1) + monthIdx * 15;
    return base % 140; 
  };

  const getCellColor = (percentage: number) => {
    if (percentage < 80) return 'bg-green-100 text-green-800 hover:bg-green-200';
    if (percentage <= 100) return 'bg-nexus-100 text-nexus-800 hover:bg-nexus-200'; // Good utilization
    if (percentage <= 120) return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
    return 'bg-red-100 text-red-800 hover:bg-red-200';
  };
  
  const title = projectId ? "Project Resource Plan" : "Portfolio Resource Management";
  const description = projectId ? "Manage resources assigned to this project." : "Optimize workforce allocation and capacity planning.";

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full overflow-hidden flex flex-col p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2"><Users className="text-nexus-600"/> {title}</h1>
          <p className="text-slate-500">{description}</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
           <button 
             onClick={() => setView('list')}
             className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <List size={16} /> Pool
           </button>
           <button 
             onClick={() => setView('planning')}
             className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${view === 'planning' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
           >
             <BarChart2 size={16} /> Capacity
           </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
        {view === 'list' ? (
          <>
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between">
              <input
                type="text"
                placeholder="Search resources..."
                className="w-64 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nexus-500 text-sm"
              />
              <div className="flex gap-2">
                <button className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">Filter</button>
                <button className="px-3 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700">Add Resource</button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Resource Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Capacity (hrs/wk)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Allocated (hrs/wk)</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                  {resources.map((resource) => (
                    <tr key={resource.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-9 w-9">
                            <div className="h-9 w-9 rounded-full bg-nexus-100 flex items-center justify-center text-nexus-700 text-sm font-medium">
                                {resource.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{resource.name}</div>
                            <div className="text-sm text-slate-500">{resource.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-slate-900">{resource.role}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-slate-500">{resource.capacity}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-slate-500">{resource.allocated}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {resource.allocated > resource.capacity ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Over-allocated</span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-700 text-sm">6-Month Allocation Heatmap</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 border border-green-200 rounded"></span> &lt;80%</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-nexus-100 border border-nexus-200 rounded"></span> Optimal</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 border border-red-200 rounded"></span> &gt;100%</span>
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
                   {resources.map(res => (
                     <tr key={res.id}>
                       <td className="px-6 py-4 whitespace-nowrap bg-white border-r border-slate-100 sticky left-0 z-10 font-medium text-sm text-slate-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                         {res.name} <span className="text-xs text-slate-400 font-normal">({res.role})</span>
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
        )}
      </div>
    </div>
  );
};

export default ResourceManagement;