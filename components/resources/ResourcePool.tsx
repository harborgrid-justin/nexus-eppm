
import React from 'react';
import { Resource } from '../../types';
import { Plus, Filter, Lock, Calendar } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useData } from '../../context/DataContext';

interface ResourcePoolProps {
  resources: Resource[] | undefined;
}

const ResourcePool: React.FC<ResourcePoolProps> = ({ resources }) => {
  const { state } = useData();
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission('resource:write') || hasPermission('project:edit');

  const getCalendarName = (calId: string) => {
      const cal = state.calendars.find(c => c.id === calId);
      return cal ? cal.name : 'Standard';
  };

  if (!resources) {
    return <div className="p-4">Loading resources...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center flex-shrink-0 gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <input
             type="text"
             placeholder="Search resources..."
             className="w-full sm:w-64 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nexus-500 text-sm"
           />
           <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
             <Filter size={14}/>
           </button>
        </div>
        {canEdit ? (
            <button className="w-full sm:w-auto px-3 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700 flex items-center justify-center gap-2">
            <Plus size={16}/> Add Resource
            </button>
        ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                <Lock size={14}/> Pool Locked
            </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="min-w-[800px]">
            <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Resource Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Calendar</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
                {resources.map((resource) => (
                <tr key={resource.id} className="hover:bg-slate-50 cursor-pointer transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">{resource.name}</div>
                    <div className="text-sm text-slate-500">{resource.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-slate-900">{resource.role}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-slate-500">{resource.type}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar size={14} className="text-slate-400"/>
                            {getCalendarName(resource.calendarId)}
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        resource.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                        {resource.status}
                    </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default ResourcePool;
