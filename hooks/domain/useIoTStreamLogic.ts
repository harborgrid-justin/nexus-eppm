
import { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';

export const useIoTStreamLogic = () => {
    const { state } = useData();
    const [dataPoints, setDataPoints] = useState<number[]>(new Array(20).fill(0));

    // Filter for Equipment Resources as "Sensors"
    const sensors = useMemo(() => {
        return state.resources.filter(r => r.type === 'Equipment').slice(0, 10);
    }, [state.resources]);

    // Filter for IoT related alerts
    const alerts = useMemo(() => {
        return state.governance.alerts.filter(a => a.category === 'Supply Chain' || a.category === 'Risk').slice(0, 3);
    }, [state.governance.alerts]);

    // Simulate real-time stream
    useEffect(() => {
        const interval = setInterval(() => {
            setDataPoints(prev => [...prev.slice(1), Math.floor(Math.random() * 100)]);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const chartData = useMemo(() => dataPoints.map((val, i) => ({ i, val })), [dataPoints]);

    return {
        chartData,
        sensors,
        alerts
    };
};
