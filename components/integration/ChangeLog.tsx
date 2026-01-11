
import React, { useState, useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useTheme } from '../../context/ThemeContext';
import { FileDiff, Filter, Search, Download } from 'lucide-react';
import DataTable from '../common/DataTable';
// Corrected import path for Column and ChangeOrder from types
import { ChangeOrder, Column } from '../../types';
import { Badge } from '../ui/Badge';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../ui/Button';

const ChangeLog: React.FC = () => {
    const { changeOrders } = useProjectWorkspace();
    const theme = useTheme();
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    const filteredData = useMemo(() => {
        return changeOrders.filter(co => {
            const matchesFilter = filter === 'All' || co.status === filter;
            const matchesSearch = co.title.toLowerCase().includes(search.toLowerCase()) || 
                                  co.id.toLowerCase().includes(search.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    }, [changeOrders, filter, search]);

    const columns: Column<ChangeOrder>[] = [
        { key: 'id', header: 'CO ID', width: 'w-24', render: (c) => <span className={`font-mono text-xs ${theme.colors.text.tertiary}`}>{c.id}</span> },
        { key: 'title', header: 'Title', render: (c) => <div><div className={`font-medium ${theme.colors.text.primary}`}>{c.title}</div><div className={`text-xs ${theme.colors.text.secondary}`}>{c.category}</div></div> },
        { key: 'amount', header: 'Amount', align: 'right', render: (c) => <span className={`font-mono font-bold ${theme.colors.text.primary}`}>{formatCurrency(c.amount)}</span> },
        { key: 'scheduleImpactDays', header: 'Schedule', align: 'center', render: (c) => <span className={c.scheduleImpactDays > 0 ? 'text-red-500 font-bold' : theme.colors.text.secondary}>{c.scheduleImpactDays > 0 ? `+${c.scheduleImpactDays}d` : '-'}</span> },
        { key: 'status', header: 'Status', render: (c) => <Badge variant={c.status === 'Approved' ? 'success' : c.status === 'Rejected' ? 'danger' : 'warning'}>{c.status}</Badge> },
        { key: 'dateSubmitted', header: 'Date', render: (c) => <span className={`text-xs ${theme.colors.text.secondary}`}>{c.dateSubmitted}</span> },
    ];

    return (
        <div className={`h-full flex flex-col ${theme.colors.surface} rounded-xl shadow-sm border ${theme.colors.border} overflow-hidden`}>
             <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50`}>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <h3 className={`font-bold ${theme.colors.text.primary} flex items-center gap-2`}><FileDiff size={18} className="text-nexus-600"/> Change Log</h3>
                    <div className="relative flex-1 sm:w-64">
                         <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                         <input 
                            className={`w-full pl-9 pr-4 py-1.5 text-sm border ${theme.colors.border} rounded-lg focus:ring-2 focus:ring-nexus-500 outline-none ${theme.colors.background}`} 
                            placeholder="Search changes..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                         />
                    </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                     <select 
                        className={`px-3 py-1.5 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.background} focus:ring-2 focus:ring-nexus-500 outline-none`}
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                     >
                         <option value="All">All Status</option>
                         <option value="Approved">Approved</option>
                         <option value="Pending Approval">Pending</option>
                         <option value="Rejected">Rejected</option>
                     </select>
                     <Button variant="outline" size="sm" icon={Download}>Export</Button>
                </div>
             </div>
             
             <div className="flex-1 overflow-auto">
                 <DataTable 
                    data={filteredData}
                    columns={columns}
                    keyField="id"
                    emptyMessage="No change orders found."
                 />
             </div>
             
             <div className={`p-4 border-t ${theme.colors.border.replace('border-', 'border-slate-')}100 bg-slate-50 flex justify-between text-xs ${theme.colors.text.secondary} font-medium`}>
                 <span>Total Changes: {changeOrders.length}</span>
                 <span>Approved Total: {formatCurrency(changeOrders.filter(c => c.status === 'Approved').reduce((s, c) => s + c.amount, 0))}</span>
             </div>
        </div>
    );
};

export default ChangeLog;
