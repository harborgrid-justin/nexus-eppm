import React from 'react';
import { BPRecord } from '../../types/unifier';

interface Props {
  records: BPRecord[];
  activeDefinition: any;
  onEdit: (r: BPRecord) => void;
}

export const BPLogGrid: React.FC<Props> = ({ records, activeDefinition, onEdit }) => (
    <div className="flex-1 overflow-auto bg-white">
        <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Record No.</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    {activeDefinition?.fields.slice(0, 3).map((f: any) => (
                        <th key={f.key} className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{f.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {records.length === 0 && <tr><td colSpan={6} className="p-12 text-center text-slate-300 italic">Registry Empty</td></tr>}
                {records.map(r => (
                    <tr key={r.id} onClick={() => onEdit(r)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                        <td className="px-6 py-4 text-sm font-mono text-slate-600">{r.id}</td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-800">{r.title}</td>
                        <td className="px-6 py-4 text-sm"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600 border border-slate-200">{r.status}</span></td>
                        {activeDefinition?.fields.slice(0, 3).map((f: any) => (
                            <td key={f.key} className="px-6 py-4 text-sm text-slate-600">
                                {typeof r.data[f.key] === 'object' ? '[Object Data]' : String(r.data[f.key] || '')}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);