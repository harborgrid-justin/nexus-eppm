
import React from 'react';
import { Resource } from '../../types';
import { useResourcePoolLogic } from '../../hooks/domain/useResourcePoolLogic';
import { ResourceRow } from './ResourceRow';
import { ResourceTableHeader } from './ResourceTableHeader';
import { ResourceFormPanel } from './ResourceFormPanel';
import { EmptyGrid } from '../common/EmptyGrid';
import { Users, Filter, Plus, Lock, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

interface ResourcePoolProps {
  resources: Resource[] | undefined;
}

const ResourcePool: React.FC<ResourcePoolProps> = ({ resources }) => {
  const theme = useTheme();
  const {
      searchTerm, deferredSearchTerm, isPanelOpen, editingResource,
      filteredResources, canEdit, setSearchTerm, handleOpenPanel,
      handleSaveResource, handleDeleteResource, closePanel, getCalendarName
  } = useResourcePoolLogic(resources);

  if (!resources || resources.length === 0) {
    return (
      <EmptyGrid 
        title="Enterprise Resource Pool Undefined"
        description="Provision human capital, labor, or equipment to enable resource-loaded scheduling."
        onAdd={canEdit ? () => handleOpenPanel() : undefined}
        actionLabel="Provision Resource"
        icon={Users}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className={`p-4 border-b ${theme.colors.border} flex justify-between items-center bg-slate-50/50`}>
        <div className="relative">
          <input 
            className={`pl-9 pr-4 py-2 border ${theme.colors.border} rounded-lg text-sm w-80 focus:ring-2 focus:ring-nexus-500 outline-none transition-all ${theme.colors.surface} ${theme.colors.text.primary}`}
            placeholder="Search registry..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
          {searchTerm !== deferredSearchTerm && <Loader2 size={12} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-nexus-500"/>}
        </div>
        {canEdit ? (
          <Button onClick={() => handleOpenPanel()} icon={Plus}>Provision</Button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
            <Lock size={14}/> Access Restricted
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto">
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
      </div>

      <ResourceFormPanel isOpen={isPanelOpen} onClose={closePanel} onSave={handleSaveResource} editingResource={editingResource} />
    </div>
  );
};
export default ResourcePool;
