
import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';

export const useIoTStreamLogic = () => {
    const { state } = useData();

    // Map global monitoring throughput data to chart format
    // This allows the chart to reflect the global state which might be updated by system events or other logic
    const chartData = useMemo(() => {
        const throughput = state.systemMonitoring?.throughput || [];
        return throughput.map((d: any, i: number) => ({
            i,
            val: d.records || 0
        }));
    }, [state.systemMonitoring]);

    // Use actual equipment resources as sensors to reflect real asset state
    const sensors = useMemo(() => {
        return state.resources
            .filter(r => r.type === 'Equipment')
            .slice(0, 10)
            .map(r => ({
                id: r.id,
                name: r.name,
                location: r.location,
                maintenanceStatus: r.maintenanceStatus
            }));
    }, [state.resources]);

    // Filter for Supply Chain or Risk alerts from the global alert stream
    const alerts = useMemo(() => {
        return state.governance.alerts
            .filter(a => a.category === 'Supply Chain' || a.category === 'Risk')
            .slice(0, 3);
    }, [state.governance.alerts]);

    return {
        chartData,
        sensors,
        alerts
    };
};
