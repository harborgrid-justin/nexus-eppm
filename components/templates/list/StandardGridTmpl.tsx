import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { Card } from '../../ui/Card';
import { Input } from '../../ui/Input';
import { Button } from '../../ui/Button';
import { Search, Filter, Plus, Download, MoreHorizontal } from 'lucide-react';
import { StatusBadge } from '../../common/StatusBadge';
import { formatCompactCurrency } from '../../../utils/formatters';

export const StandardGridTmpl: React.FC = () => {
    const { state } = useData();
    const [search, setSearch] = useState('');
    const projects = state.projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <Card className="flex-1 flex flex-col overflow-hidden border-slate-200">
            <div className="p-4 border-b bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <Input isSearch placeholder="Search..." onChange={e => setSearch(e.target.value)} />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" icon={Download}>Export</Button>
                    <Button variant="primary" size="sm" icon={Plus}>Add Project</Button>
                </div>
            </div>
            <div className="flex-1 overflow-auto bg-white">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-[10px] font-bold text-slate-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-500 uppercase">Budget</th>
                            <th className="px-6 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {projects.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 text-xs font-mono text-slate-500">{p.code}</td>
                                <td className="px-6 py-4 text-sm font-bold text-slate-800">{p.name}</td>
                                <td className="px-6 py-4"><StatusBadge status={p.health} variant="health" /></td>
                                <td className="px-6 py-4 text-right font-mono text-sm">{formatCompactCurrency(p.budget)}</td>
                                <td className="px-6 py-4"><MoreHorizontal size={16} className="text-slate-300 cursor-pointer"/></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {projects.length === 0 && <div className="p-12 text-center text-slate-300 italic">No records in registry.</div>}
            </div>
        </Card>
    );
};