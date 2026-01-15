import { useState, useMemo, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { Resource } from '../../types';

interface StreamPoint {
    i: number;
    val: number;
}

export const useIoTStreamLogic = () => {
    const { state } = useData();
    const [chartData, setChartData] = useState<StreamPoint[]>([]);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Initial Data Load
    useEffect(() => {
        const throughput = state.systemMonitoring?.throughput || [];
        setChartData(throughput.map((d, i) => ({ i, val: d.records || 0 })));

        // Live Simulation to mimic real hardware telemetry
        intervalRef.current = setInterval(() => {
            setChartData(prev => {
                const nextI = prev.length > 0 ? prev[prev.length - 1].i + 1 : 0;
                const nextVal = Math.floor(Math.random() * 40) + 30;
                const nextData = [...prev.slice(-29), { i: nextI, val: nextVal }];
                return nextData;
            });
        }, 2000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [state.systemMonitoring?.throughput]);

    const sensors = useMemo(() => {
        return state.resources
            .filter(r => r.type === 'Equipment')
            .slice(0, 10)
            .map(r => ({
                id: r.id,
                name: r.name,
                location: r.location || 'Site Unset',
                maintenanceStatus: r.maintenanceStatus || 'Unknown'
            }));
    }, [state.resources]);

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