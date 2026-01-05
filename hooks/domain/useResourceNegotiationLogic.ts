
import { useState, useMemo, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { ResourceRequest } from '../../types';

export const useResourceNegotiationLogic = () => {
    const { state, dispatch } = useData();
    const [selectedReqId, setSelectedReqId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'manager' | 'requester'>('manager');

    // Use live requests from state instead of mocks
    const requests = useMemo(() => state.resourceRequests, [state.resourceRequests]);
    
    const selectedReq = useMemo(() => requests.find(r => r.id === selectedReqId), [requests, selectedReqId]);

    // Dynamic Impact Calculation
    const impactData = useMemo(() => {
        if (!selectedReq) return null;
        
        // Calculate Utilization impact
        const totalRoleCapacity = state.resources
            .filter(r => r.role === selectedReq.role && r.status === 'Active')
            .reduce((sum, r) => sum + (r.capacity || 160), 0);
            
        const currentRoleLoad = state.resources
            .filter(r => r.role === selectedReq.role && r.status === 'Active')
            .reduce((sum, r) => sum + (r.allocated || 0), 0);
            
        // Assume request adds (Quantity * 160) hours of demand if month duration is roughly 1
        // Simplified heuristic: Quantity * 40 hours/week * 4 weeks
        const requestLoad = selectedReq.quantity * 160;

        const currentUtilization = totalRoleCapacity > 0 ? (currentRoleLoad / totalRoleCapacity) * 100 : 0;
        const newUtilization = totalRoleCapacity > 0 ? ((currentRoleLoad + requestLoad) / totalRoleCapacity) * 100 : 0;

        return {
            currentUtilization: Math.round(currentUtilization),
            newUtilization: Math.round(newUtilization),
            roleCount: state.resources.filter(r => r.role === selectedReq.role).length,
            available: state.resources.filter(r => r.role === selectedReq.role && r.status === 'Active').length
        };
    }, [selectedReq, state.resources]);

    const handleUpdateStatus = useCallback((status: ResourceRequest['status']) => {
        if (!selectedReq) return;
        dispatch({
            type: 'RESOURCE_REQUEST_UPDATE',
            payload: { ...selectedReq, status }
        });
    }, [selectedReq, dispatch]);

    return {
        requests,
        selectedReqId,
        setSelectedReqId,
        viewMode,
        setViewMode,
        selectedReq,
        impactData,
        handleUpdateStatus
    };
};
