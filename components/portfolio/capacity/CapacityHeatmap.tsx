import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

interface HeatmapProps {
    resources: any[];
    monthBuckets: any[];
    matrix: Record<string, Record<string, number>>;
}

export const CapacityHeatmap: React.FC<HeatmapProps> = ({ resources, monthBuckets, matrix }) => {
    const theme = useTheme();
    const getCellColor = (demand: number, capacity: number) => {
        const util = capacity > 0 ? (demand / capacity) * 100 : 0;
        if (util === 0) return 'bg-slate-50 text-slate-300';
        if (util < 80) return 'bg-green-50 text-green-700';
        if (util <= 100) return 'bg-blue-50 text-blue-700';
        if (util <= 115) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-700 font-bold';
    };

    return (
        <div className="flex-1 overflow-auto bg-white border border-slate-200 rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                <thead className="bg-slate-50 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider sticky left-0 bg-slate-50 z-20 w-48 shadow-[1px_0_0_0_#e2e8f0]">Resource</th>
                        {monthBuckets.map(m => <th key={m.key} className="px-2 py-3 text-center text-[10px] font-bold uppercase tracking-wider min-w-[60px]">{m.label}</th>)}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {resources.map(r => (
                        <tr key={r.id}>
                            <td className="px-4 py-3 text-xs font-bold text-slate-700 bg-white sticky left-0 z-10 shadow-[1px_0_0_0_#f1f5f9]">
                                <div className="truncate">{r.name}</div>
                            </td>
                            {monthBuckets.map(m => {
                                const demand = matrix[r.id]?.[m.key] || 0;
                                const capacity = r.capacity || 160;
                                return (
                                    <td key={m.key} className="p-1">
                                        <div className={`w-full h-8 rounded flex items-center justify-center text-[10px] ${getCellColor(demand, capacity)}`}>
                                            {capacity > 0 ? `${Math.round((demand/capacity)*100)}%` : '-'}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};