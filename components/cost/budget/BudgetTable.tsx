
import React from 'react';
import { formatCurrency, formatPercentage } from '../../../utils/formatters';
import { BudgetLineItem } from '../../../types';

interface BudgetTableProps {
    items: (BudgetLineItem & { committed: number; totalExposure: number; remaining: number })[];
    onSelectItem: (id: string) => void;
}

export const BudgetTable: React.FC<BudgetTableProps> = ({ items, onSelectItem }) => {
    const totals = {
        planned: items.reduce((a, c) => a + c.planned, 0),
        committed: items.reduce((a, c) => a + c.committed, 0),
        actual: items.reduce((a, c) => a + c.actual, 0),
        exposure: items.reduce((a, c) => a + c.totalExposure, 0),
        remaining: items.reduce((a, c) => a + c.remaining, 0),
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 border-separate border-spacing-0">
                <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase">Category (CBS)</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase">Planned</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase text-blue-600 bg-blue-50/30">Committed</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase text-nexus-600 bg-nexus-50/30">Invoiced</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase">Exposure</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase">Available</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-50">
                {items.map(item => (
                    <tr key={item.id} onClick={() => onSelectItem(item.id)} className="hover:bg-slate-50/80 cursor-pointer">
                        <td className="px-6 py-4 text-sm font-bold">{item.category}</td>
                        <td className="px-6 py-4 text-right text-sm font-mono">{formatCurrency(item.planned)}</td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-blue-600 bg-blue-50/20 font-mono">{formatCurrency(item.committed)}</td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-nexus-700 bg-nexus-50/20 font-mono">{formatCurrency(item.actual)}</td>
                        <td className="px-6 py-4 text-right text-sm font-black font-mono">{formatCurrency(item.totalExposure)}</td>
                        <td className={`px-6 py-4 text-right text-sm font-bold font-mono ${item.remaining < 0 ? 'text-red-600' : 'text-emerald-600'}`}>{formatCurrency(item.remaining)}</td>
                    </tr>
                ))}
                </tbody>
                <tfoot className="bg-slate-100/50 font-black">
                    <tr>
                        <td className="px-6 py-4 text-[10px] uppercase">Totals</td>
                        <td className="px-6 py-4 text-right text-sm font-mono">{formatCurrency(totals.planned)}</td>
                        <td className="px-6 py-4 text-right text-sm text-blue-700 font-mono">{formatCurrency(totals.committed)}</td>
                        <td className="px-6 py-4 text-right text-sm text-nexus-700 font-mono">{formatCurrency(totals.actual)}</td>
                        <td className="px-6 py-4 text-right text-sm font-mono">{formatCurrency(totals.exposure)}</td>
                        <td className="px-6 py-4 text-right text-sm font-mono">{formatCurrency(totals.remaining)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};
