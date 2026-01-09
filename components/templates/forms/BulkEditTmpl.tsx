
import React, { useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { TemplateHeader } from '../TemplateHeader';

export const BulkEditTmpl: React.FC = () => {
    const theme = useTheme();
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    
    const toggleRow = (id: number) => {
        setSelectedRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding}`}>
            <TemplateHeader number="14" title="Bulk Editor" subtitle="Spreadsheet-style data manipulation" />
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 text-left w-10"><input type="checkbox"/></th>
                                <th className="p-4 text-left">Item Name</th>
                                <th className="p-4 text-left">Category</th>
                                <th className="p-4 text-left">Status</th>
                                <th className="p-4 text-right">Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {[1, 2, 3, 4, 5].map(i => (
                                <tr key={i} className={`group hover:bg-blue-50/50 ${selectedRows.includes(i) ? 'bg-blue-50' : ''}`}>
                                    <td className="p-4"><input type="checkbox" checked={selectedRows.includes(i)} onChange={() => toggleRow(i)} className="rounded text-nexus-600"/></td>
                                    <td className="p-2"><Input defaultValue={`Item ${i}`} className="h-8 text-sm border-transparent group-hover:border-slate-300 group-hover:bg-white"/></td>
                                    <td className="p-2">
                                        <select className="w-full h-8 text-sm border border-transparent rounded px-2 bg-transparent group-hover:border-slate-300 group-hover:bg-white">
                                            <option>Hardware</option>
                                            <option>Software</option>
                                            <option>Service</option>
                                        </select>
                                    </td>
                                    <td className="p-2">
                                        <select className="w-full h-8 text-sm border border-transparent rounded px-2 bg-transparent group-hover:border-slate-300 group-hover:bg-white">
                                            <option>Active</option>
                                            <option>Pending</option>
                                            <option>Archived</option>
                                        </select>
                                    </td>
                                    <td className="p-2"><Input defaultValue={`${(i * 150).toFixed(2)}`} className="h-8 text-sm text-right font-mono border-transparent group-hover:border-slate-300 group-hover:bg-white"/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-xs text-slate-500 font-bold uppercase">{selectedRows.length} Records Selected</span>
                    <div className="flex gap-2">
                        <Button variant="danger" size="sm">Delete</Button>
                        <Button size="sm">Update All</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};
