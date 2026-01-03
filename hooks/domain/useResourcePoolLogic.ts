
import { useState, useDeferredValue, useMemo, useTransition } from 'react';
import { useData } from '../../context/DataContext';
import { Resource } from '../../types';
import { usePermissions } from '../usePermissions';

export const useResourcePoolLogic = (resources: Resource[] | undefined) => {
  const { state, dispatch } = useData();
  const { hasPermission } = usePermissions();
  
  const canEdit = hasPermission('resource:write') || hasPermission('project:edit');
  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);
  
  // Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<Partial<Resource> | null>(null);

  const getCalendarName = (calId: string) => {
      const cal = state.calendars.find(c => c.id === calId);
      return cal ? cal.name : 'Standard';
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

  // CRUD Handlers
  const handleOpenPanel = (resource?: Resource) => {
      setEditingResource(resource ? { ...resource } : null);
      setIsPanelOpen(true);
  };

  const handleSaveResource = (resource: Resource) => {
      if (editingResource?.id) {
          dispatch({ type: 'RESOURCE_UPDATE', payload: resource });
      } else {
          dispatch({ type: 'RESOURCE_ADD', payload: resource });
      }
      setIsPanelOpen(false);
  };

  const handleDeleteResource = (id: string) => {
      if (confirm("Are you sure you want to remove this resource?")) {
          dispatch({ type: 'RESOURCE_DELETE', payload: id });
      }
  };

  const closePanel = () => setIsPanelOpen(false);

  return {
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
  };
};
