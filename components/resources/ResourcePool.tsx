import React from 'react';
import { Resource } from '../../types';
import { useResourcePoolLogic } from '../../hooks/domain/useResourcePoolLogic';
import { ResourceRow } from './ResourceRow';
import { ResourceTableHeader } from './ResourceTableHeader';
import { ResourceFormPanel } from './ResourceFormPanel';
import { Users, Filter, Plus, Lock, Loader2, Upload, Download, Search } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { EmptyGrid } from '../common/EmptyGrid';

interface ResourcePoolProps {
  resources: Resource[] | undefined;
}

export const ResourcePool: React.FC<ResourcePoolProps> = ({ resources = [] }) => {
  const theme = useTheme();
  const {
      searchTerm, deferredSearchTerm, isPanelOpen, editingResource,
      filteredResources, canEdit, setSearchTerm, handleOpenPanel,
      handleSaveResource, handleDeleteResource, closePanel, getCalendarName
  } = useResourcePoolLogic(resources);

  const isEmpty = !resources || resources.length === 0;

  return (
    <div className="h-full flex flex-col bg-white relative animate-nexus-in">
      {/* Dynamic Toolbar */}
      <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 gap-4 shadow-sm z-10`}>
        <div className="flex items-center gap-4 w-full sm:w-auto">
             <div className="relative flex-1 sm:min-w-[320px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input 
                    className={`pl-11 pr-4 py-2.5 border ${theme.colors.border} rounded-2xl text-sm w-full focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 outline-none transition-all ${theme.colors.surface} ${theme.colors.text.primary} font-medium`}
                    placeholder="Search global pool by identity, role, or competency..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    disabled={isEmpty}
                />
                {searchTerm !== deferredSearchTerm && <Loader2 size={14} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-nexus-500"/>}
             </div>
             <div className="flex gap-2">
                 <button className={`p-2.5 border ${theme.colors.border} rounded-xl bg-white text-slate-500 hover:text-nexus-600 transition-colors shadow-sm`} title="Advanced Filter">
                     <Filter size={20}/>
                 </button>
                 <button className={`p-2.5 border ${theme.colors.border} rounded-xl bg-white text-slate-500 hover:text-nexus-600 transition-colors shadow-sm`} title="Export Registry" disabled={isEmpty}>
                     <Download size={20}/>
                 </button>
             </div>
        </div>

        {canEdit ? (
          <div className="flex gap-3 w-full sm:w-auto">
              <Button variant="outline" icon={Upload} disabled={isEmpty} className="hidden md:flex flex-1 sm:flex-none">Bulk Import</Button>
              <Button onClick={() => handleOpenPanel()} icon={Plus} className="flex-1 sm:flex-none shadow-lg shadow-nexus-500/20 font-black uppercase tracking-widest text-[10px] h-10 px-6">Provision Resource</Button>
          </div>
        ) : (
          <div className={`flex items-center gap-2 text-[10px] font-black uppercase ${theme.colors.text.tertiary} ${theme.colors.background} px-4 py-2 rounded-xl border ${theme.colors.border} shadow-sm`}>
            <Lock size={14}/> Registry Locked
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto relative scrollbar-thin">
        {isEmpty ? (
            <div className="h-full flex flex-col justify-center">
                <EmptyGrid 
                    title="Enterprise Resource Pool Null"
                    description="No human capital, labor crews, or physical equipment assets have been provisioned in the global strategic registry. Provisioning is required for project staffing."
                    onAdd={canEdit ? () => handleOpenPanel() : undefined}
                    actionLabel="Provision First Resource"
                    icon={Users}
                />
            </div>
        ) : (
            <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0" role="grid">
                <ResourceTableHeader />
                <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')} bg-white`}>
                    {filteredResources.map(res => (
                    <ResourceRow 
                        key={res.id} resource={res} 
                        calendarName={getCalendarName(res.calendarId)} 
                        canEdit={canEdit} onEdit={handleOpenPanel} onDelete={handleDeleteResource}
                    />
                    ))}
                    {/* Aesthetic filler rows */}
                    {[...Array(5)].map((_, i) => (
                        <tr key={`spacer-${i}`} className="nexus-empty-pattern opacity-10 h-14">
                            <td colSpan={7}></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )}
      </div>

      <ResourceFormPanel isOpen={isPanelOpen} onClose={closePanel} onSave={handleSaveResource} editingResource={editingResource} />
    </div>
  );
};

export default ResourcePool;