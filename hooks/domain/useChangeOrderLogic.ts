import { useMemo, useState, useTransition } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { usePermissions } from '../usePermissions';
import { generateId } from '../../utils/formatters';

export const useChangeOrderLogic = () => {
    const { project, changeOrders } = useProjectWorkspace();
    const { hasPermission, user } = usePermissions();
    const projectId = project?.id || 'UNSET';
    const canCreate = hasPermission('financials:write');

    const [viewMode, setViewMode] = useState<'list' | 'board' | 'analytics'>('list');
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCoId, setSelectedCoId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const enrichedOrders = useMemo(() => {
        return (changeOrders || []).map(co => ({
            ...co,
            priority: co.priority || 'Medium',
            category: co.category || 'Unforeseen Condition',
            scheduleImpactDays: co.scheduleImpactDays || 0,
            stage: co.stage || (co.status === 'Pending Approval' ? 'CCB Review' : co.status === 'Approved' ? 'Execution' : 'Initiation')
        }));
    }, [changeOrders]);

    const stats = useMemo(() => {
        const approved = enrichedOrders.filter(co => co.status === 'Approved');
        const pending = enrichedOrders.filter(co => co.status === 'Pending Approval');
        
        return {
            totalVolume: enrichedOrders.length,
            approvedAmount: approved.reduce((sum, co) => sum + co.amount, 0),
            pendingExposure: pending.reduce((sum, co) => sum + co.amount, 0),
            scheduleDrift: approved.reduce((sum, co) => sum + co.scheduleImpactDays, 0),
            pendingCount: pending.length
        };
    }, [enrichedOrders]);

    const filteredOrders = useMemo(() => {
        return enrichedOrders.filter(co =>
            co.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            co.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [enrichedOrders, searchTerm]);

    const handleViewChange = (mode: 'list' | 'board' | 'analytics') => {
        startTransition(() => setViewMode(mode));
    };

    const handleCreate = () => {
        setIsCreating(true);
        setSelectedCoId(null);
    };

    const handleCloseModal = () => {
        setIsCreating(false);
        setSelectedCoId(null);
    };

    const selectedOrder = useMemo(() => {
        if (selectedCoId) return filteredOrders.find(co => co.id === selectedCoId);
        if (isCreating) return {
            id: generateId('CO'), projectId, title: 'New Change Request', description: '', amount: 0,
            scheduleImpactDays: 0, status: 'Draft', stage: 'Initiation', priority: 'Medium',
            category: 'Client Request', submitterId: user?.id || 'System',
            dateSubmitted: new Date().toISOString().split('T')[0], history: []
        };
        return null;
    }, [selectedCoId, isCreating, filteredOrders, projectId, user]);

    return {
        viewMode,
        isPending,
        searchTerm,
        selectedCoId,
        isCreating,
        enrichedOrders,
        filteredOrders,
        selectedOrder,
        canCreate,
        stats,
        handleViewChange,
        setSearchTerm,
        setSelectedCoId,
        handleCreate,
        handleCloseModal
    };
};