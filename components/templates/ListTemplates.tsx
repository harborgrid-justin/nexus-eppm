
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Search, Filter, Plus, MoreVertical, ChevronRight, Folder, MoreHorizontal, LayoutGrid, List as ListIcon, MapPin, Download } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const TemplateHeader = ({ number, title, subtitle }: { number: string, title: string, subtitle?: string }) => (
    <div className="flex items-start gap-4 mb-8 border-b border-slate-200 pb-6">
        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono text-lg font-bold shadow-lg shadow-slate-200 shrink-0">
            {number}
        </div>
        <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
            {subtitle && <p className="text-slate-500 mt-1">{subtitle}</p>}
        </div>
    </div>
);

const MockToolbar = ({ onSearch }: { onSearch: (val: string) => void }) => {
    const theme = useTheme();
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        onChange={(e) => onSearch(e.target.value)}
                        className={`w-full pl-9 pr-4 py-2 text-sm border ${theme.colors.border} rounded-lg focus:ring-2 focus:ring-nexus-500 outline-none`} 
                    />
                </div>
                <Button variant="secondary" size="md" icon={Filter}>Filter</Button>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" size="md" icon={Download}>Export</Button>
                <Button variant="primary" size="md" icon={Plus}>Add New</Button>
            </div>
        </div>
    );
};

/**
 * 6. Standard Data Grid
 */
export const StandardGridTmpl: React.FC = () => {
    const theme = useTheme();
    const [rows, setRows] = useState([...Array(10)].map((_, i) => ({ id: i, name: `Enterprise Initiative ${i+1}` })));
    const [search, setSearch] = useState('');

    const handleDelete = (id: number) => {
        setRows(rows.filter(r => r.id !== id));
    };

    const filteredRows = rows.filter(r => r.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <TemplateHeader number="06" title="Data Grid" subtitle="High density tabular data view" />
            
            <Card className="flex-1 flex flex-col overflow-hidden border border-slate-200 shadow-sm rounded-xl">
                <div className="p-4 border-b border-slate-200 bg-white"><MockToolbar onSearch={setSearch} /></div>
                <div className="flex-1 overflow-auto bg-white">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Owner</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Budget</th>
                                <th className="px-6 py-3 w-10 border-b border-slate-200"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {filteredRows.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-500 font-medium">PROJ-{100+row.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">{row.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide border ${row.id % 3 === 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                                            {row.id % 3 === 0 ? 'Active' : 'Planning'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">MR</div>
                                        Mike Ross
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-slate-700 font-medium">$1,250,000</td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => handleDelete(row.id)} className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center text-xs text-slate-500 font-medium">
                    <span>Showing {filteredRows.length} records</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border rounded hover:bg-white disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border rounded hover:bg-white bg-white text-nexus-600 font-bold border-nexus-200">1</button>
                        <button className="px-3 py-1 border rounded hover:bg-white">2</button>
                        <button className="px-3 py-1 border rounded hover:bg-white">3</button>
                        <button className="px-3 py-1 border rounded hover:bg-white">Next</button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

/**
 * 7. Tree Hierarchy
 */
export const TreeHierarchyTmpl: React.FC = () => {
    const theme = useTheme();
    const [selectedNode, setSelectedNode] = useState<number | null>(1);
    
    return (
        <div className={`h-full flex flex-col ${theme.colors.background}`}>
             <div className={theme.layout.pagePadding}>
                <TemplateHeader number="07" title="Hierarchy Tree" subtitle="EPS / WBS Navigation Structure" />
             </div>
             
             <div className={`flex-1 flex overflow-hidden px-8 pb-8 ${theme.layout.gridGap}`}>
                <div className="w-80 border border-slate-200 bg-white flex flex-col rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">Enterprise Structure</h3>
                    </div>
                    <div className="flex-1 p-2 space-y-0.5 overflow-y-auto">
                        <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-sm font-bold text-slate-800">
                            <ChevronRight size={14} className="text-slate-400 rotate-90" />
                            <Folder size={16} className="text-nexus-500" />
                            <span>Global Portfolio</span>
                        </div>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="pl-6">
                                <div 
                                    onClick={() => setSelectedNode(i)}
                                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm transition-colors ${selectedNode===i ? 'bg-nexus-50 text-nexus-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <ChevronRight size={14} className="text-slate-400" />
                                    <Folder size={16} className={selectedNode===i ? 'text-nexus-600' : 'text-blue-400'} />
                                    <span>Division Node {i}</span>
                                </div>
                                {i === 1 && (
                                    <div className="pl-6 mt-0.5 space-y-0.5">
                                        <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs text-slate-600 font-medium">
                                            <div className="w-4 h-px bg-slate-300"></div>
                                            <span>Project Alpha</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-xs text-slate-600 font-medium">
                                            <div className="w-4 h-px bg-slate-300"></div>
                                            <span>Project Beta</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <Card className={`flex-1 ${theme.layout.cardPadding} shadow-sm border border-slate-200`}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className={theme.typography.h2}>Division Node {selectedNode}</h2>
                                <p className="text-slate-500 mt-1 font-medium">North American Infrastructure Group</p>
                            </div>
                            <Button icon={Download} variant="outline">Export Data</Button>
                        </div>
                        
                        <div className={`grid grid-cols-3 ${theme.layout.gridGap} mb-8`}>
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Projects</p>
                                <p className="text-3xl font-black text-slate-900">{12 + (selectedNode || 0)}</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Budget</p>
                                <p className="text-3xl font-black text-slate-900">${45 + (selectedNode || 0)}M</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Headcount</p>
                                <p className="text-3xl font-black text-slate-900">142</p>
                            </div>
                        </div>
                        
                        <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50/50 min-h-[300px]">
                            <div className="text-center text-slate-400">
                                <LayoutGrid size={48} className="mx-auto mb-4 opacity-20"/>
                                <p className="font-medium">Aggregation Visualization Area</p>
                            </div>
                        </div>
                    </Card>
                </div>
             </div>
        </div>
    );
};

/**
 * 8. Kanban Board
 */
export const KanbanBoardTmpl: React.FC = () => {
    const theme = useTheme();
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Implement API caching', col: 'todo' },
        { id: 2, title: 'Refactor Auth', col: 'todo' },
        { id: 3, title: 'Design System Update', col: 'progress' },
        { id: 4, title: 'User Testing', col: 'review' },
        { id: 5, title: 'Deploy v2', col: 'done' }
    ]);
    const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
    const [dragOverCol, setDragOverCol] = useState<string | null>(null);

    const moveTask = (id: number, targetCol: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, col: targetCol } : t));
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: number) => {
        e.dataTransfer.setData('text/plain', taskId.toString());
        setDraggedTaskId(taskId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetCol: string) => {
        e.preventDefault();
        const taskId = parseInt(e.dataTransfer.getData('text/plain'), 10);
        moveTask(taskId, targetCol);
        setDragOverCol(null);
    };

    const columns = [
        { id: 'todo', label: 'To Do', color: 'border-slate-400' },
        { id: 'progress', label: 'In Progress', color: 'border-blue-500' },
        { id: 'review', label: 'Review', color: 'border-yellow-500' },
        { id: 'done', label: 'Complete', color: 'border-green-500' }
    ];

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding} overflow-hidden`}>
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <TemplateHeader number="08" title="Sprint Board" subtitle="Agile execution view" />
                <Button icon={Plus} onClick={() => setTasks([...tasks, { id: Date.now(), title: 'New Task', col: 'todo' }])}>Add Card</Button>
            </div>
            
            <div className={`flex-1 flex ${theme.layout.gridGap} overflow-x-auto pb-4`}>
                {columns.map(col => (
                    <div 
                        key={col.id} 
                        className={`w-80 flex-shrink-0 flex flex-col h-full rounded-xl bg-slate-100 border border-slate-200 transition-colors ${dragOverCol === col.id ? 'bg-nexus-50' : ''}`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, col.id)}
                        onDragEnter={() => setDragOverCol(col.id)}
                        onDragLeave={() => setDragOverCol(null)}
                    >
                        <div className={`p-4 font-bold text-slate-700 text-sm flex justify-between items-center border-t-4 rounded-t-xl bg-white border-b border-slate-200 ${col.color}`}>
                            {col.label} 
                            <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs font-bold text-slate-500 border border-slate-200">{tasks.filter(t => t.col === col.id).length}</span>
                        </div>
                        <div className="p-3 space-y-3 overflow-y-auto flex-1 scrollbar-thin">
                            {tasks.filter(t => t.col === col.id).map(card => (
                                <div 
                                    key={card.id} 
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, card.id)}
                                    onDragEnd={() => setDraggedTaskId(null)}
                                    className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-nexus-300 transition-all group relative ${draggedTaskId === card.id ? 'opacity-50 scale-95' : ''}`}
                                >
                                    <div className="text-sm font-bold text-slate-800 mb-3 leading-snug">{card.title}</div>
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                        <span className="text-[10px] font-mono font-bold text-slate-400">TSK-{card.id}</span>
                                    </div>
                                </div>
                            ))}
                             {dragOverCol === col.id && tasks.filter(t => t.col === col.id).length === 0 && (
                                <div className="h-24 rounded-lg border-2 border-dashed border-nexus-300 bg-nexus-50/50 flex items-center justify-center text-xs text-nexus-500 font-medium">
                                    Drop here
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

/**
 * 9. Master-Detail List
 */
export const MasterDetailTmpl: React.FC = () => {
    const theme = useTheme();
    const [selectedItem, setSelectedItem] = useState(1);

    return (
        <div className="h-full flex overflow-hidden bg-slate-50">
            <div className="w-1/3 min-w-[350px] border-r border-slate-200 bg-white flex flex-col z-10 shadow-[4px_0_15px_-3px_rgba(0,0,0,0.05)]">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-lg mb-4">Inventory Items</h3>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-nexus-500 outline-none transition-all" placeholder="Filter list..." />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} onClick={() => setSelectedItem(i)} className={`p-5 border-b border-slate-50 cursor-pointer transition-all group ${selectedItem === i ? 'bg-nexus-50 border-l-4 border-l-nexus-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}>
                            <div className="flex justify-between items-start">
                                <div className={`font-bold text-sm ${selectedItem===i ? 'text-nexus-800' : 'text-slate-800'}`}>Steel Beam W12x40</div>
                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold border border-slate-200 uppercase">Mat</span>
                            </div>
                            <div className="flex justify-between mt-2">
                                <div className="text-xs text-slate-500 truncate font-medium">Warehouse A • Zone 4</div>
                                <span className={`text-xs font-mono font-bold ${selectedItem===i ? 'text-nexus-600' : 'text-slate-400'}`}>QTY: {420 + i}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className={`flex-1 ${theme.layout.pagePadding} overflow-y-auto`}>
                <div className="max-w-3xl mx-auto">
                    <TemplateHeader number="09" title="Item Detail View" />
                    <Card className={`${theme.layout.cardPadding} shadow-md border-slate-200`}>
                        <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Steel Beam W12x40 (Item {selectedItem})</h2>
                                <p className="text-slate-500 font-mono text-xs mt-1 font-bold">SKU: MAT-STL-{selectedItem}42 • REVISION B</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">History</Button>
                                <Button size="sm">Edit Item</Button>
                            </div>
                        </div>
                        
                        <div className={`grid grid-cols-2 ${theme.layout.gridGap} mb-8`}>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Price</label>
                                <p className="text-xl font-mono font-bold text-slate-900">$245.00</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Supplier</label>
                                <p className="text-lg font-bold text-slate-800">Acme Steelworks</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Time</label>
                                <p className="text-lg font-medium text-slate-700">14 Days</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reorder Point</label>
                                <p className="text-lg font-bold text-orange-600">500 Units</p>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8">
                            <h4 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Technical Specifications</h4>
                            <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                Standard wide-flange carbon steel structural beam. ASTM A992 compliant. Yield strength 50 ksi. Used for primary structural framing in Sector 4.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

/**
 * 10. Split Pane (Map/List)
 */
export const SplitPaneTmpl: React.FC = () => {
    const theme = useTheme();
    const [selectedAsset, setSelectedAsset] = useState<number | null>(null);

    return (
        <div className="h-full flex flex-col">
            <div className="h-1/2 bg-blue-50 relative border-b border-slate-300 overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <MapPin size={64} className={`text-slate-400 opacity-50 ${selectedAsset ? 'text-nexus-600 opacity-100 scale-110' : ''} transition-all`}/>
                </div>
                <div className="absolute top-4 left-4 z-10">
                    <TemplateHeader number="10" title="Geospatial Assets" />
                </div>
                {selectedAsset && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg border border-slate-200 text-sm font-bold animate-in slide-in-from-bottom-2">
                        Selected: EQ-{1000+selectedAsset}
                    </div>
                )}
            </div>
            
            <div className="h-1/2 bg-white flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm z-10">
                    <span className="font-black text-xs uppercase text-slate-500 tracking-widest flex items-center gap-2">
                        <LayoutGrid size={14}/> Selected Assets (12)
                    </span>
                </div>
                <div className="flex-1 overflow-auto p-0">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Asset ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Coordinates</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Telemetry</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {[1,2,3,4,5].map(i => (
                                <tr key={i} onClick={() => setSelectedAsset(i)} className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedAsset === i ? 'bg-nexus-50' : ''}`}>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 font-mono">EQ-{1000+i}</td>
                                    <td className="px-6 py-4"><span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 font-bold uppercase tracking-wide">Online</span></td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-500">34.0522° N, 118.2437° W</td>
                                    <td className="px-6 py-4 text-right text-xs font-mono font-bold text-slate-700">Running (42h)</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};