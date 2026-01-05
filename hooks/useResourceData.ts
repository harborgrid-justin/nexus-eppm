
import { useMemo } from 'react';
import { Resource } from '../types/index';
import { useProjectWorkspace } from '../context/ProjectWorkspaceContext';

export const useResourceData = () => {
    const { assignedResources } = useProjectWorkspace();

    const overAllocatedResources = useMemo(() => {
        return (assignedResources || []).filter(r => r.allocated > r.capacity);
    }, [assignedResources]);
    
    return {
        resources: assignedResources,
        overAllocatedResources
    };
};
