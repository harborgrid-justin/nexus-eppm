
import React from 'react';
import { MoreVertical } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const GridRenderer: React.FC = () => {
    const theme = useTheme();
    return (
        <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                    {['ID', 'Name', 'Status', 'Date', 'Owner', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                </tr>
                </thead>
                <tbody className={`${theme.colors.surface} divide-y divide-slate-100`}>
                {[...Array(10)].map((_, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">REC-{1000+i}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">Item Description {i+1}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">Active</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">2024-03-{10+i}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">User {i+1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400"><MoreVertical size={16} /></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
