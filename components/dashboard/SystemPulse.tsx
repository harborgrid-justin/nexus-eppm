
import React from 'react';
import { Zap } from 'lucide-react';

interface SystemPulseProps {
    summary: any;
}

export const SystemPulse: React.FC<SystemPulseProps> = ({ summary }) => (
    <div className="mt-6 p-4 bg-slate-900 rounded-xl text-white flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-nexus-600 rounded-lg"><Zap size={20}/></div>
            <div>
                <p className="font-bold text-sm">System Pulse</p>
                <p className="text-xs text-slate-400">Real-time data stream active</p>
            </div>
        </div>
        <div className="flex gap-6 text-xs text-slate-300 font-mono">
            <span><strong className="text-white">{summary.totalTasks}</strong> Tasks</span>
            <span><strong className="text-white">{summary.totalCriticalIssues}</strong> Critical Issues</span>
            <span><strong className="text-white">{summary.healthCounts.critical}</strong> Projects At Risk</span>
        </div>
    </div>
);
