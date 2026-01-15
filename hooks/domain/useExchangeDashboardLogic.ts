import { useState, useTransition, useDeferredValue, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Server, Database, HardDrive, Cloud } from 'lucide-react';
import { ServiceStatus } from '../../types/business';
import { generateId } from '../../utils/formatters';

export const useExchangeDashboardLogic = () => {
    const { state, dispatch } = useData();
    const [isPending, startTransition] = useTransition();
    const [metricRange, setMetricRange] = useState('24h');
    
    // Pattern: Defensive memoization of state slices
    const throughputData = useMemo(() => state.systemMonitoring.throughput || [], [state.systemMonitoring.throughput]);
    const deferredData = useDeferredValue(throughputData);
    const services = useMemo(() => state.systemMonitoring.services || [], [state.systemMonitoring.services]);

    const getServiceIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('database') || n.includes('db')) return Database;
        if (n.includes('cloud') || n.includes('bridge')) return Cloud;
        if (n.includes('storage') || n.includes('etl')) return HardDrive;
        return Server;
    };

    const getStatusColor = (status: string) => {
        if (status === 'Operational') return 'text-green-500';
        if (status === 'Degraded') return 'text-orange-500';
        return 'text-red-500';
    };

    const handleAddService = () => {
        const newService: ServiceStatus = {
            id: generateId('SVC'),
            name: `Service Node ${services.length + 1}`,
            status: 'Operational',
            uptime: '100%',
            latency: '15ms'
        };
        dispatch({ type: 'SYSTEM_ADD_SERVICE', payload: newService });
    };
    
    const changeMetricRange = (range: string) => {
        startTransition(() => {
            setMetricRange(range);
        });
    };

    return {
        isPending,
        metricRange,
        changeMetricRange,
        deferredData,
        services,
        getServiceIcon,
        getStatusColor,
        handleAddService
    };
};