
import React from 'react';
import { Resource } from '../../types/index';
import { Plus, Filter, Lock, Calendar, UserCog, Briefcase, Loader2, Edit2, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Badge } from '../ui/Badge';
import { ResourceFormPanel } from './ResourceFormPanel';
import { useResourcePoolLogic } from '../../hooks/domain/useResourcePoolLogic';
import { useTheme } from '../../context/ThemeContext';

interface ResourcePoolProps {
  resources: Resource[] | undefined;
}

const ResourcePool: React.FC<ResourcePoolProps> = ({ resources }) => {
  const { state } = useData(); 
  const theme = useTheme();
  
  const {
      searchTerm,
      deferredSearchTerm,
      isPanelOpen,
      editingResource,
      filteredResources,
      canEdit,
      setSearchTerm,
      handleOpenPanel,
      handleSaveResource,
      handleDeleteResource,
      closePanel,
      getCalendarName
  } = useResourcePoolLogic(resources);

  const getRoleBadge = (roleTitle: string) => {
      const roleDef = state.roles.find(r => r.title === roleTitle);
      return (
          <div className="flex flex-col">
              <span className={`text-sm font-medium ${theme.colors.text.primary}`}>{roleTitle}</span>
              {roleDef && (
                  <div className="flex gap-1 mt-1">
                      {roleDef.requiredSkills.slice(0, 2).map(skillId => (
                          <span key={skillId} className={`text-[9px] px-1.5 py-0.5 ${theme.colors.background} ${theme.colors.text.secondary} rounded border ${theme.colors.border} font-mono`}>
                              {skillId.split('-').pop()}
                          </span>
                      ))}
                      {roleDef.requiredSkills.length > 2 && <span className={`text-[9px] ${theme.colors.text.tertiary}`}>+{roleDef.requiredSkills.length - 2}</span>}
                  </div>
              )}
          </div>
      );
  };

  if (!resources) {
    return <div className={`p-4 flex items-center justify-center h-64 ${theme.colors.text.tertiary}`}>Loading resources...</div>;
  }

  return (
    <div className={`h-full flex flex-col ${theme.colors.surface}`}>
      <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-center flex-shrink-0 gap-3 ${theme.colors.background}/50`}>
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <div className="relative flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search resources by name or skill..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full sm:w-80 pl-4 pr-10 py-2 border ${theme.colors.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-nexus-500 text-sm shadow-sm transition-all ${theme.colors.surface} ${theme.colors.text.primary}`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  {searchTerm !== deferredSearchTerm && <Loader2 size={12} className="animate-spin text-slate-300"/>}
                  <Filter size={14} className="text-slate-400"/>
              </div>
           </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
            <button className={`flex-1 sm:flex-none px-3 py-2 ${theme.colors.surface} border ${theme.colors.border} rounded-lg text-sm font-medium ${theme.colors.text.secondary} hover:${theme.colors.background} flex items-center justify-center gap-2`}>
                <Briefcase size={14}/> Resource Leveling
            </button>
            {canEdit ? (
                <button 
                    onClick={() => handleOpenPanel()}
                    className={`flex-1 sm:flex-none px-4 py-2 ${theme.colors.primary} rounded-lg text-sm font-bold text-white hover:${theme.colors.primaryHover} flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all`}
                >
                    <Plus size={16}/> Provision Resource
                </button>
            ) : (
                <div className={`flex items-center gap-2 text-xs text-slate-400 ${theme.colors.background} px-3 py-2 rounded-lg border ${theme.colors.border}`}>
                    <Lock size={14}/> Pool Locked
                </div>
            )}
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto scrollbar-thin transition-opacity duration-300 ${searchTerm !== deferredSearchTerm ? 'opacity-70' : 'opacity-100'}`}>
        <div className="min-w-[1000px]">
            <table className={`min-w-full divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
            <thead className={`${theme.colors.background} sticky top-0 z-10 shadow-sm`}>
                <tr>
                <th scope="col" className={`px-6 py-4 text-left text-xs font-bold ${theme.colors.text.secondary} uppercase tracking-widest`}>Resource Identity</th>
                <th scope="col" className={`px-6 py-4 text-left text-xs font-bold ${theme.colors.text.secondary} uppercase tracking-widest`}>Enterprise Role</th>
                <th scope="col" className={`px-6 py-4 text-left text-xs font-bold ${theme.colors.text.secondary} uppercase tracking-widest`}>Class</th>
                <th scope="col" className={`px-6 py-4 text-left text-xs font-bold ${theme.colors.text.secondary} uppercase tracking-widest`}>Org Calendar</th>
                <th scope="col" className={`px-6 py-4 text-left text-xs font-bold ${theme.colors.text.secondary} uppercase tracking-widest`}>Status</th>
                <th scope="col" className={`px-6 py-4 text-right text-xs font-bold ${theme.colors.text.secondary} uppercase tracking-widest`}>Std Rate</th>
                <th scope="col" className={`px-6 py-4 text-right text-xs font-bold ${theme.colors.text.secondary} uppercase tracking-widest`}>Actions</th>
                </tr>
            </thead>
            <tbody className={`${theme.colors.surface} divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                {filteredResources.map((resource) => (
                <tr 
                    key={resource.id} 
                    className={`hover:${theme.colors.background}/80 cursor-default transition-colors group`}
                    tabIndex={0}
                >
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-lg ${theme.colors.background} border ${theme.colors.border} flex items-center justify-center text-xs font-black ${theme.colors.text.secondary} group-hover:bg-nexus-50 group-hover:text-nexus-600 transition-colors mr-3`}>
                                {resource.name.charAt(0)}
                            </div>
                            <div>
                                <div className={`text-sm font-bold ${theme.colors.text.primary}`}>{resource.name}</div>
                                <div className={`text-[10px] ${theme.colors.text.tertiary} font-mono tracking-tighter uppercase`}>{resource.id}</div>
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
                        <div className={`flex items-center gap-2 text-sm ${theme.colors.text.secondary}`}>
                            <Calendar size={14} className={theme.colors.text.tertiary}/>
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
                        <span className={`font-mono text-sm font-bold ${theme.colors.text.primary}`}>${resource.hourlyRate}/hr</span>
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {canEdit && (
                                <>
                                    <button 
                                        onClick={() => handleOpenPanel(resource)} 
                                        className={`p-1.5 hover:${theme.colors.background} rounded ${theme.colors.text.secondary} hover:text-nexus-600`}
                                        title="Edit Resource"
                                    >
                                        <Edit2 size={14}/>
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteResource(resource.id)} 
                                        className={`p-1.5 hover:${theme.colors.background} rounded ${theme.colors.text.secondary} hover:text-red-500`}
                                        title="Delete Resource"
                                    >
                                        <Trash2 size={14}/>
                                    </button>
                                </>
                            )}
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
      
      <div className={`p-4 border-t ${theme.colors.border} ${theme.colors.background} flex justify-between items-center shrink-0`}>
          <div className={`flex items-center gap-4 text-xs ${theme.colors.text.secondary}`}>
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

      <ResourceFormPanel 
        isOpen={isPanelOpen} 
        onClose={closePanel} 
        onSave={handleSaveResource}
        editingResource={editingResource}
      />
    </div>
  );
};

export default ResourcePool;