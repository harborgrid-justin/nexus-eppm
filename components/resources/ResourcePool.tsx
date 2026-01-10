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
    <div className="h-full flex flex-col bg-white relative">
      {/* Toolbar */}
      <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 gap-4`}>
        <div className="flex items-center gap-4 w-full sm:w-auto">
             <div className="relative flex-1 sm:min-w-[300px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                <input 
                    className={`pl-10 pr-4 py-2 border ${theme.colors.border} rounded-lg text-sm w-full focus:ring-2 focus:ring-nexus-500 outline-none transition-all ${theme.colors.surface} ${theme.colors.text.primary}`}
                    placeholder="Search by name, role, or skill..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    disabled={isEmpty}
                />
                {searchTerm !== deferredSearchTerm && <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-nexus-500"/>}
             </div>
             <div className="flex gap-2">
                 <button className={`p-2 border ${theme.colors.border} rounded-lg bg-white text-slate-500 hover:text-nexus-600`} title="Filter">
                     <Filter size={18}/>
                 </button>
                 <button className={`p-2 border ${theme.colors.border} rounded-lg bg-white text-slate-500 hover:text-nexus-600`} title="Export" disabled={isEmpty}>
                     <Download size={18}/>
                 </button>
             </div>
        </div>

        {canEdit ? (
          <div className="flex gap-3">
              <Button variant="secondary" icon={Upload} disabled={isEmpty} className="hidden md:flex">Import</Button>
              <Button onClick={() => handleOpenPanel()} icon={Plus}>Provision Resource</Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
            <Lock size={14}/> Access Restricted
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto relative">
        {isEmpty ? (
            <div className="h-full flex flex-col">
                <EmptyGrid 
                    title="Enterprise Resource Pool Null"
                    description="No human capital, labor crews, or equipment have been provisioned in the global registry. Provision resources to enable resource-loaded scheduling and cost analysis."
                    onAdd={canEdit ? () => handleOpenPanel() : undefined}
                    actionLabel="Provision Resource"
                    icon={Users}
                />
            </div>
        ) : (
            <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                <ResourceTableHeader />
                <tbody className={`divide-y ${theme.colors.border.replace('border-', 'divide-')}`}>
                    {filteredResources.map(res => (
                    <ResourceRow 
                        key={res.id} resource={res} 
                        calendarName={getCalendarName(res.calendarId)} 
                        canEdit={canEdit} onEdit={handleOpenPanel} onDelete={handleDeleteResource}
                    />
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