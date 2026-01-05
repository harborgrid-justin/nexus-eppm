
import { useState, useTransition, useDeferredValue } from 'react';
import { useData } from '../../context/DataContext';
import { Server, Database, HardDrive, Cloud } from 'lucide-react';
import { ServiceStatus } from '../../types';
import { generateId } from '../../utils/formatters';

export const useExchangeDashboardLogic = () => {
    const { state, dispatch } = useData();
    const [isPending, startTransition] = useTransition();
    const [metricRange, setMetricRange] = useState('24h');
    
    // Retrieve centralized metrics
    const throughputData = state.systemMonitoring.throughput || [];
    const deferredData = useDeferredValue(throughputData);
    const services = state.systemMonitoring.services || [];

    const getServiceIcon = (name: string) => {
        if (name.includes('Database') || name.includes('DB')) return Database;
        if (name.includes('Cloud') || name.includes('Bridge')) return Cloud;
        if (name.includes('Storage') || name.includes('ETL')) return HardDrive;
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
            name: `New Service Node ${services.length + 1}`,
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
