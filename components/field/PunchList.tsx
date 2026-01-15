
import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { CheckSquare, Filter, Plus, MapPin, Camera, User, CheckCircle, Circle, Search, MoreHorizontal, Copy } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import DataTable from '../common/DataTable';
import { PunchItem, Column } from '../../types/index';
import { generateId } from '../../utils/formatters';

const PunchList: React.FC<{ projectId: string }> = ({ projectId }) => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');

    const items = state.punchList.filter(p => p.projectId === projectId);

    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const matchesStatus = filter === 'All' || item.status === filter;
            const matchesSearch = item.description.toLowerCase().includes(search.toLowerCase()) || 
                                  item.location.toLowerCase().includes(search.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [items, filter, search]);

    const handleStatusToggle = (item: PunchItem) => {
        const nextStatus = item.status === 'Open' ? 'Resolved' : item.status === 'Resolved' ? 'Closed' : 'Open';
        dispatch({ type: 'FIELD_UPDATE_PUNCH_ITEM', payload: { ...item, status: nextStatus } });
    };

    const copyToClipboard = async (text: string) => {
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(text);
            } catch (err) {
                console.error('Failed to copy', err);
            }
        }
    };

    const handleAddItem = () => {
        const newItem: PunchItem = {
            id: generateId('PL'),
            projectId,
            description: 'New Punch Item',
            location: 'TBD',
            assignee: 'Unassigned',
            status: 'Open',
            priority: 'Medium',
            dateIdentified: new Date().toISOString().split('T')[0]
        };
        dispatch({ type: 'FIELD_ADD_PUNCH_ITEM', payload: newItem });
    };

    const columns: Column<PunchItem>[] = [
        {
            key: 'id', header: 'ID', width: 'w-28',
            render: (i) => (
                <div className="flex items-center gap-1 group/id">
                    <span className="font-mono text-xs text-slate-500">{i.id}</span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); copyToClipboard(i.id); }}
                        className="opacity-0 group-hover/id:opacity-100 text-slate-400 hover:text-nexus-600 transition-opacity"
                        title="Copy ID"
                    >
                        <Copy size={10}/>
                    </button>
                </div>
            )
        },
        {
            key: 'description', header: 'Description',
            render: (i) => (
                <div>
                    <div className="font-medium text-slate-900">{i.description}</div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><MapPin size={10}/> {i.location}</span>
                        {i.image && <span className="flex items-center gap-1 text-blue-600"><Camera size={10}/> Photo</span>}
                    </div>
                </div>
            )
        },
        {
            key: 'assignee', header: 'Assignee',
            render: (i) => (
                <div className="flex items-center gap-2 text-sm text-slate-700">
                    <User size={14} className="text-slate-400"/> {i.assignee}
                </div>
            )
        },
        {
            key: 'priority', header: 'Priority', width: 'w-24',
            render: (i) => (
                <Badge variant={i.priority === 'High' ? 'danger' : i.priority === 'Medium' ? 'warning' : 'neutral'}>
                    {i.priority}
                </Badge>
            )
        },
        {
            key: 'status', header: 'Status', width: 'w-32',
            render: (i) => (
                <button 
                    onClick={(e) => { e.stopPropagation(); handleStatusToggle(i); }}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-bold transition-all ${
                        i.status === 'Open' ? 'bg-red-50 text-red-700 hover:bg-red-100' :
                        i.status === 'Resolved' ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' :
                        'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                >
                    {i.status === 'Closed' ? <CheckCircle size={12}/> : <Circle size={12}/>}
                    {i.status}
                </button>
            )
        },
        {
            key: 'actions', header: '', width: 'w-10',
            render: () => <button className="text-slate-400 hover:text-slate-600"><MoreHorizontal size={16}/></button>
        }
    ];

    return (
        <div className="h-full flex flex-col bg-white">
            <div className={`p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50`}>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input 
                            type="text" 
                            placeholder="Search punch items..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-1.5 text-sm border border-slate-300 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-nexus-500 outline-none"
                        />
                    </div>
                    <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
                        {['All', 'Open', 'Resolved', 'Closed'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filter === s ? 'bg-slate-100 text-slate-900 font-bold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" icon={Filter}>Filter</Button>
                    <Button variant="primary" size="sm" icon={Plus} onClick={handleAddItem}>Add Item</Button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <DataTable
                    data={filteredItems}
                    columns={columns}
                    keyField="id"
                    emptyMessage="No punch items found."
                />
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex justify-between">
                <span>{filteredItems.length} items</span>
                <div className="flex gap-4">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> {items.filter(i => i.status === 'Open').length} Open</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> {items.filter(i => i.status === 'Closed').length} Closed</span>
                </div>
            </div>
        </div>
    );
};

export default PunchList;
