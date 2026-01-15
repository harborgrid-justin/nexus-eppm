
import { useState, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { DataJob } from '../../types';

export const useJobHistoryLogic = () => {
    const { state } = useData();
    const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

    const generateLogs = useCallback((job: DataJob) => {
        const logs = [];
        const ts = new Date(job.timestamp);
        const fmt = (offset: number) => new Date(ts.getTime() + offset * 1000).toLocaleTimeString();
        logs.push(`[${fmt(0)}] INFO: Transmission thread ${job.id} initialized.`);
        logs.push(`[${fmt(1)}] INFO: Handshake established. Protocol: ${job.format}`);
        if (job.status === 'Failed') {
             logs.push(`[${fmt(6)}] ERROR: Integrity fault at row 142.`);
        } else {
             logs.push(`[${fmt(12)}] SUCCESS: ${job.details}`);
        }
        return logs;
    }, []);

    return {
        dataJobs: state.dataJobs || [],
        expandedJobId,
        toggleExpand: (id: string) => setExpandedJobId(prev => prev === id ? null : id),
        generateLogs,
        totalJobs: state.dataJobs.length,
        errorJobs: state.dataJobs.filter(j => j.status === 'Failed').length
    };
};
