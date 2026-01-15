
import { useState, useDeferredValue, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Resource } from '../../types';
import { usePermissions } from '../usePermissions';

export const useResourcePoolLogic = (resources: Resource[] | undefined) => {
  const { state, dispatch } = useData();
  const { hasPermission } = usePermissions();
  const canEdit = hasPermission('resource:write');
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Partial<Resource> | null>(null);

  const getCalendarName = (calId: string) => state.calendars.find(c => c.id === calId)?.name || 'Standard';

  const filteredResources = useMemo(() => {
    if (!resources) return [];
    if (!deferredSearchTerm) return resources;
    const term = deferredSearchTerm.toLowerCase();
    return resources.filter(r => 
        r.name.toLowerCase().includes(term) || r.role.toLowerCase().includes(term)
    );
  }, [resources, deferredSearchTerm]);

  const handleOpenPanel = (resource?: Resource) => {
      setEditingResource(resource ? { ...resource } : null);
      setIsPanelOpen(true);
  };

  const handleSaveResource = (resource: Resource) => {
      dispatch({ type: editingResource?.id ? 'RESOURCE_UPDATE' : 'RESOURCE_ADD', payload: resource });
      setIsPanelOpen(false);
  };

  const handleDeleteResource = (id: string) => {
      if (confirm("Permanently delete this resource and all active assignments?")) {
          dispatch({ type: 'RESOURCE_DELETE', payload: id });
      }
  };

  return {
    searchTerm, deferredSearchTerm, isPanelOpen, editingResource,
    filteredResources, canEdit, setSearchTerm, handleOpenPanel,
    handleSaveResource, handleDeleteResource, closePanel: () => setIsPanelOpen(false), getCalendarName
  };
};
