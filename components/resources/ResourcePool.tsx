
import React, { useState, useDeferredValue, useMemo } from 'react';
import { Resource, EnterpriseRole } from '../../types/index';
import { Plus, Filter, Lock, Calendar, UserCog, Briefcase, Loader2 } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useData } from '../../context/DataContext';
import { Badge } from '../ui/Badge';

interface ResourcePoolProps {
  resources: Resource[] | undefined;
}

const ResourcePool: React.FC<ResourcePoolProps> = ({ resources }) => {
  const { state } = useData();
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission('resource:write') || hasPermission('project:edit');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pattern 9: Defer search for large resource pool
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const getCalendarName = (calId: string) => {
      const cal = state.calendars.find(c => c.id === calId);
      return cal ? cal.name : 'Standard';
  };

  const getRoleBadge = (roleTitle: string) => {
      const roleDef = state.roles.find(r => r.title === roleTitle);
      return (
          <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900">{roleTitle}</span>
              {roleDef && (
                  <div className="flex gap-1 mt-1">
                      {roleDef.requiredSkills.slice(0, 2).map(skillId => (
                          <span key={skillId} className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200 font-mono">
                              {skillId.split('-').pop()}
                          </span>
                      ))}
                      {roleDef.requiredSkills.length > 2 && <span className="text-[9px] text-slate-400">+{roleDef.requiredSkills.length - 2}</span>}
                  </div>
              )}
          </div>
      );
  };

  const filteredResources = useMemo(() => {
    if (!resources) return [];
    if (!deferredSearchTerm) return resources;
    const lowerTerm = deferredSearchTerm.toLowerCase();
    return resources.filter(r => 
        r.name.toLowerCase().includes(lowerTerm) || 
        r.role.toLowerCase().includes(lowerTerm) ||
        r.skills.some(s => s.toLowerCase().includes(lowerTerm))
    );
  }, [resources, deferredSearchTerm]);

  const handleResourceClick = (id: string) => {
      console.log('Selected resource:', id);
  };

  if (!resources) {
    return <div className="p-4 flex items-center justify-center h-64 text-slate-400">Loading resources...</div>;
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center flex-shrink-0 gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search resources by name or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 pl-4 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-nexus-500 text-sm shadow-sm transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {searchTerm !== deferredSearchTerm && <Loader2 size={12} className="animate-spin text-slate-300"/>}
                  <Filter size={14} className="text-slate-400"/>
              </div>
           </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2">
                <Briefcase size={14}/> Resource Leveling
            </button>
            {canEdit ? (
                <button className="flex-1 sm:flex-none px-4 py-2 bg-nexus-600 rounded-lg text-sm font-bold text-white hover:bg-nexus-700 flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all">
                    <Plus size={16}/> Provision Resource
                </button>
            ) : (
                <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                    <Lock size={14}/> Pool Locked
                </div>
            )}
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto scrollbar-thin transition-opacity duration-300 ${searchTerm !== deferredSearchTerm ? 'opacity-70' : 'opacity-100'}`}>
        <div className="min-w-[1000px]">
            <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Resource Identity</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Enterprise Role</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Class</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Org Calendar</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Std Rate</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
                {filteredResources.map((resource) => (
                <tr 
                    key={resource.id} 
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group focus:bg-slate-50 outline-none"
                    onClick={() => handleResourceClick(resource.id)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleResourceClick(resource.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${resource.name}`}
                >
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-500 group-hover:bg-nexus-100 group-hover:text-nexus-600 transition-colors mr-3">
                                {resource.name.charAt(0)}
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-900">{resource.name}</div>
                                <div className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{resource.id}</div>
                            </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(resource.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={resource.type === 'Human' ? 'info' : 'neutral'}>
                            {resource.type}
                        </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar size={14} className="text-slate-400"/>
                            <span className="font-medium">{getCalendarName(resource.calendarId)}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 inline-flex text-[10px] leading-5 font-black uppercase rounded-full border ${
                            resource.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                            {resource.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="font-mono text-sm font-bold text-slate-700">${resource.hourlyRate}/hr</span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1">
                  <UserCog size={14} className="text-nexus-500"/>
                  <span className="font-bold">Taxonomy Match:</span>
                  <span className="text-green-600 font-black">100% Verified</span>
              </div>
              <div className="w-px h-3 bg-slate-300"></div>
              <span>Total Pooled: <strong>{resources.length} Resources</strong></span>
          </div>
          <button className="text-xs font-bold text-nexus-600 hover:underline">View Enterprise Skills Matrix</button>
      </div>
    </div>
  );
};

export default ResourcePool;
