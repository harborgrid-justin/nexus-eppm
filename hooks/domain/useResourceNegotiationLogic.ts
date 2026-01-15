
import { useState, useMemo, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ResourceRequest } from '../../types/resource';
import { generateId } from '../../utils/formatters';

export const useResourceNegotiationLogic = () => {
    const { state, dispatch } = useData();
    const { user } = useAuth();
    const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'manager' | 'requester'>('manager');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const requests = useMemo(() => state.resourceRequests || [], [state.resourceRequests]);
    
    const filteredRequests = useMemo(() => {
        if (viewMode === 'requester') {
            return requests.filter(r => r.requesterName === user?.name);
        }
        return requests;
    }, [requests, viewMode, user?.name]);

    const selectedReq = useMemo(() => 
        requests.find(r => r.id === selectedReqId), 
    [requests, selectedReqId]);

    const impactData = useMemo(() => {
        if (!selectedReq) return null;
        
        const standardHours = (state.governance.resourceDefaults.defaultWorkHoursPerDay || 8) * 20;
        
        const totalRoleCapacity = state.resources
            .filter(r => r.role === selectedReq.role && r.status === 'Active')
            .reduce((sum, r) => sum + (r.capacity || standardHours), 0);
            
        const currentRoleLoad = state.resources
            .filter(r => r.role === selectedReq.role && r.status === 'Active')
            .reduce((sum, r) => sum + (r.allocated || 0), 0);
            
        const requestLoad = selectedReq.quantity * standardHours;

        const currentUtilization = totalRoleCapacity > 0 ? (currentRoleLoad / totalRoleCapacity) * 100 : 0;
        const newUtilization = totalRoleCapacity > 0 ? ((currentRoleLoad + requestLoad) / totalRoleCapacity) * 100 : 0;

        return {
            currentUtilization: Math.round(currentUtilization),
            newUtilization: Math.round(newUtilization),
            roleCount: state.resources.filter(r => r.role === selectedReq.role).length,
            available: state.resources.filter(r => r.role === selectedReq.role && r.status === 'Active').length
        };
    }, [selectedReq, state.resources, state.governance.resourceDefaults]);

    const handleUpdateStatus = useCallback((status: ResourceRequest['status']) => {
        if (!selectedReq) return;
        dispatch({
            type: 'RESOURCE_REQUEST_UPDATE',
            payload: { ...selectedReq, status }
        });
    }, [selectedReq, dispatch]);

    const handleCreateRequest = useCallback((data: Partial<ResourceRequest>) => {
        if (!data.projectId || !data.role) return;
        
        const targetProject = state.projects.find(p => p.id === data.projectId);
        
        const newRequest: ResourceRequest = {
            id: generateId('REQ'),
            projectId: data.projectId,
            projectName: targetProject?.name || 'External Site',
            requesterName: user?.name || 'Justin Saadein',
            role: data.role,
            quantity: Number(data.quantity) || 1,
            startDate: data.startDate || new Date().toISOString().split('T')[0],
            endDate: data.endDate || new Date(Date.now() + 2592000000).toISOString().split('T')[0], 
            status: 'Pending',
            notes: data.notes
        };
        dispatch({ type: 'RESOURCE_REQUEST_ADD', payload: newRequest });
        setIsCreateModalOpen(false);
    }, [dispatch, user, state.projects]);

    return {
        requests: filteredRequests,
        selectedReqId,
        setSelectedReqId,
        viewMode,
        setViewMode,
        selectedReq,
        impactData,
        isCreateModalOpen,
        setIsCreateModalOpen,
        handleUpdateStatus,
        handleCreateRequest
    };
};
