import { useState, useCallback } from 'react';
import { useData } from '../../context/DataContext';
import { DataJob } from '../../types';

export const useJobHistoryLogic = () => {
    const { state } = useData();
    const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

    const toggleExpand = useCallback((id: string) => {
        setExpandedJobId(prev => prev === id ? null : id);
    }, []);

    // Generate deterministic logs based on job data
    const generateLogs = useCallback((job: DataJob) => {
        const logs = [];
        const ts = new Date(job.timestamp);
        const fmt = (offsetSeconds: number) => new Date(ts.getTime() + offsetSeconds * 1000).toLocaleTimeString();

        logs.push(`[${fmt(0)}] INFO: Job ${job.id} initialized by ${job.submittedBy}`);
        logs.push(`[${fmt(1)}] INFO: Handshake established. Protocol: ${job.format}`);
        
        if (job.type === 'Import') {
             logs.push(`[${fmt(2)}] INFO: Uploading payload (${job.fileSize || 'Unknown Size'})...`);
             logs.push(`[${fmt(4)}] INFO: Validating schema integrity...`);
             if (job.status === 'Failed') {
                 logs.push(`[${fmt(6)}] ERROR: Schema validation failed. Unexpected token at line 42.`);
                 logs.push(`[${fmt(7)}] ERROR: Transaction rolled back.`);
             } else {
                 logs.push(`[${fmt(5)}] SUCCESS: Validation passed. Schema v2.4.`);
                 logs.push(`[${fmt(8)}] INFO: Committing records to warehouse...`);
                 logs.push(`[${fmt(12)}] SUCCESS: ${job.details}`);
             }
        } else {
             logs.push(`[${fmt(2)}] INFO: Querying Data Warehouse...`);
             logs.push(`[${fmt(5)}] INFO: Serializing to ${job.format}...`);
             if (job.status === 'Completed') {
                 logs.push(`[${fmt(8)}] SUCCESS: File generated. Available for download.`);
             }
        }
        return logs;
    }, []);

    const dataJobs = state.dataJobs || [];
    const totalJobs = dataJobs.length;
    const errorJobs = dataJobs.filter(j => j.status === 'Failed').length;

    return {
        dataJobs,
        expandedJobId,
        toggleExpand,
        generateLogs,
        totalJobs,
        errorJobs
    };
};