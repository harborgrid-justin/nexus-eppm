
import { useState, useMemo, useDeferredValue } from 'react';
import { useData } from '../../context/DataContext';
import { usePermissions } from '../usePermissions';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';

export const useDocumentControlLogic = () => {
  const { project } = useProjectWorkspace();
  const { getProjectDocs } = useData();
  const { hasPermission } = usePermissions();
  const canUpload = hasPermission('project:edit');

  const [searchTerm, setSearchTerm] = useState('');
  const deferredSearchTerm = useDeferredValue(searchTerm);

  const docs = useMemo(() => {
    if (!project) return [];
    const allDocs = getProjectDocs(project.id);
    if (!deferredSearchTerm) return allDocs;
    return allDocs.filter(doc => doc.name.toLowerCase().includes(deferredSearchTerm.toLowerCase()));
  }, [project, getProjectDocs, deferredSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    deferredSearchTerm,
    docs,
    canUpload
  };
};
