import React, { useState, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../ui/Card';
import { Search, Filter, Plus, MoreVertical, ChevronRight, Folder, MoreHorizontal, LayoutGrid, List as ListIcon, MapPin, Download, ChevronDown } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useData } from '../../context/DataContext';
import { generateId, formatCompactCurrency, formatCurrency } from '../../utils/formatters';
import { KanbanTask, EPSNode } from '../../types/index';
import { StatusBadge } from '../common/StatusBadge';

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

export const StandardGridTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const [search, setSearch] = useState('');

    const filteredRows = state.projects.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase()));

    const getManagerName = (id: string) => state.resources.find(r => r.id === id)?.name || id;

    return (
        <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
            <TemplateHeader number="06" title="Data Grid" subtitle="High density tabular data view (Projects)" />
            
            <Card className="flex-1 flex flex-col overflow-hidden border border-slate-200 shadow-sm rounded-xl">
                <div className="p-4 border-b border-slate-200 bg-white"><MockToolbar onSearch={setSearch} /></div>
                <div className="flex-1 overflow-auto bg-white">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Manager</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-200">Budget</th>
                                <th className="px-6 py-3 w-10 border-b border-slate-200"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {filteredRows.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-slate-500 font-medium">{row.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-800">{row.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={row.health} variant="health" />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 border border-slate-200">
                                            {getManagerName(row.managerId).charAt(0)}
                                        </div>
                                        {getManagerName(row.managerId)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-mono text-slate-700 font-medium">{formatCompactCurrency(row.budget)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                            {filteredRows.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400">No projects found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export const TreeHierarchyTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(state.eps[0]?.id || null);
    
    // Recursive Tree Renderer
    const renderTree = (nodes: EPSNode[], parentId: string | null = null, level = 0) => {
        return nodes
            .filter(n => n.parentId === parentId)
            .map(node => (
                <div key={node.id} className="select-none">
                    <div 
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm transition-colors ${selectedNodeId === node.id ? 'bg-nexus-50 text-nexus-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                        style={{ paddingLeft: `${level * 16 + 8}px` }}
                    >
                        <ChevronRight size={14} className="text-slate-400" />
                        <Folder size={16} className={selectedNodeId === node.id ? 'text-nexus-600' : 'text-blue-400'} />
                        <span className="truncate">{node.name}</span>
                    </div>
                    {renderTree(nodes, node.id, level + 1)}
                </div>
            ));
    };

    const selectedNode = state.eps.find(n => n.id === selectedNodeId);
    const nodeProjects = state.projects.filter(p => p.epsId === selectedNodeId);
    const totalBudget = nodeProjects.reduce((sum, p) => sum + p.budget, 0);

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
                        {renderTree(state.eps)}
                    </div>
                </div>

                <div className="flex-1 flex flex-col">
                    <Card className={`flex-1 ${theme.layout.cardPadding} shadow-sm border border-slate-200`}>
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className={theme.typography.h2}>{selectedNode?.name || 'Select a Node'}</h2>
                                <p className="text-slate-500 mt-1 font-medium">{selectedNode?.code || '---'}</p>
                            </div>
                            <Button icon={Download} variant="outline">Export Data</Button>
                        </div>
                        
                        <div className={`grid grid-cols-3 ${theme.layout.gridGap} mb-8`}>
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Projects</p>
                                <p className="text-3xl font-black text-slate-900">{nodeProjects.length}</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Budget</p>
                                <p className="text-3xl font-black text-slate-900">{formatCompactCurrency(totalBudget)}</p>
                            </div>
                            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Node ID</p>
                                <p className="text-sm font-black text-slate-900 truncate">{selectedNodeId}</p>
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-auto">
                             <table className="min-w-full text-sm">
                                 <thead className="bg-slate-50 border-b border-slate-100">
                                     <tr>
                                         <th className="px-4 py-2 text-left font-bold text-slate-500">Project</th>
                                         <th className="px-4 py-2 text-right font-bold text-slate-500">Budget</th>
                                         <th className="px-4 py-2 text-right font-bold text-slate-500">Spent</th>
                                     </tr>
                                 </thead>
                                 <tbody>
                                     {nodeProjects.map(p => (
                                         <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                                             <td className="px-4 py-2 font-medium">{p.name}</td>
                                             <td className="px-4 py-2 text-right font-mono">{formatCompactCurrency(p.budget)}</td>
                                             <td className="px-4 py-2 text-right font-mono">{formatCompactCurrency(p.spent)}</td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                             {nodeProjects.length === 0 && <div className="text-center p-8 text-slate-400 italic">No projects in this node.</div>}
                        </div>
                    </Card>
                </div>
             </div>
        </div>
    );
};

export const KanbanBoardTmpl: React.FC = () => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    const tasks = state.kanbanTasks || [];
    
    const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
    const [dragOverCol, setDragOverCol] = useState<string | null>(null);

    const moveTask = (id: string, targetCol: string) => {
        dispatch({ type: 'KANBAN_MOVE_TASK', payload: { taskId: id, status: targetCol } });
    };

    const addTask = () => {
        const newTask: KanbanTask = {
            id: generateId('TASK'),
            title: 'New Task',
            status: 'todo',
            priority: 'Medium'
        };
        dispatch({ type: 'KANBAN_ADD_TASK', payload: newTask });
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
        e.dataTransfer.setData('text/plain', taskId);
        setDraggedTaskId(taskId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); 
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetCol: string) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('text/plain');
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
                <Button icon={Plus} onClick={addTask}>Add Card</Button>
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
                            <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs font-bold text-slate-500 border border-slate-200">{tasks.filter(t => t.status === col.id).length}</span>
                        </div>
                        <div className="p-3 space-y-3 overflow-y-auto flex-1 scrollbar-thin">
                            {tasks.filter(t => t.status === col.id).map(card => (
                                <div 
                                    key={card.id} 
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, card.id)}
                                    onDragEnd={() => setDraggedTaskId(null)}
                                    className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-nexus-300 transition-all group relative ${draggedTaskId === card.id ? 'opacity-50 scale-95' : ''}`}
                                >
                                    <div className="text-sm font-bold text-slate-800 mb-3 leading-snug">{card.title}</div>
                                    <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                                        <span className="text-[10px] font-mono font-bold text-slate-400">{card.id}</span>
                                        <StatusBadge status={card.priority} variant="priority" />
                                    </div>
                                </div>
                            ))}
                             {dragOverCol === col.id && tasks.filter(t => t.status === col.id).length === 0 && (
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

export const MasterDetailTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const materials = state.resources.filter(r => r.type === 'Material');
    const [selectedItem, setSelectedItem] = useState<string | null>(materials[0]?.id || null);

    const activeMaterial = materials.find(m => m.id === selectedItem);

    if (materials.length === 0) return <div className="p-12 text-center text-slate-400">No materials defined in resources.</div>;

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
                    {materials.map(mat => (
                        <div key={mat.id} onClick={() => setSelectedItem(mat.id)} className={`p-5 border-b border-slate-50 cursor-pointer transition-all group ${selectedItem === mat.id ? 'bg-nexus-50 border-l-4 border-l-nexus-600' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}>
                            <div className="flex justify-between items-start">
                                <div className={`font-bold text-sm ${selectedItem===mat.id ? 'text-nexus-800' : 'text-slate-800'}`}>{mat.name}</div>
                                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-bold border border-slate-200 uppercase">{mat.unitOfMeasure}</span>
                            </div>
                            <div className="flex justify-between mt-2">
                                <div className="text-xs text-slate-500 truncate font-medium">{mat.location || 'Unassigned'}</div>
                                <span className={`text-xs font-mono font-bold ${selectedItem===mat.id ? 'text-nexus-600' : 'text-slate-400'}`}>QTY: {mat.availableQuantity}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className={`flex-1 ${theme.layout.pagePadding} overflow-y-auto`}>
                {activeMaterial ? (
                    <div className="max-w-3xl mx-auto">
                        <TemplateHeader number="09" title="Item Detail View" />
                        <Card className={`${theme.layout.cardPadding} shadow-md border-slate-200`}>
                            <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{activeMaterial.name}</h2>
                                    <p className="text-slate-500 font-mono text-xs mt-1 font-bold">SKU: {activeMaterial.id} • {activeMaterial.status}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">History</Button>
                                    <Button size="sm">Edit Item</Button>
                                </div>
                            </div>
                            
                            <div className={`grid grid-cols-2 ${theme.layout.gridGap} mb-8`}>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Price</label>
                                    <p className="text-xl font-mono font-bold text-slate-900">{formatCurrency(activeMaterial.hourlyRate)}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</label>
                                    <p className="text-lg font-bold text-slate-800">{activeMaterial.role}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</label>
                                    <p className="text-lg font-medium text-slate-700">{activeMaterial.location}</p>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reorder Point</label>
                                    <p className="text-lg font-bold text-orange-600">{activeMaterial.minQuantity} {activeMaterial.unitOfMeasure}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">Select an item to view details.</div>
                )}
            </div>
        </div>
    );
};

export const SplitPaneTmpl: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

    // Filter Equipment
    const assets = state.resources.filter(r => r.type === 'Equipment');

    return (
        <div className="h-full flex flex-col">
            <div className="h-1/2 bg-blue-50 relative border-b border-slate-300 overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
                
                {assets.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">No assets available.</div>
                ) : (
                     /* Mock Positioning for Visualization - Scatter them */
                     assets.map((asset, i) => (
                        <div 
                            key={asset.id}
                            className="absolute flex flex-col items-center cursor-pointer group/pin"
                            style={{ 
                                left: `${20 + (i * 15) % 70}%`, 
                                top: `${30 + (i * 20) % 50}%` 
                            }}
                            onClick={() => setSelectedAsset(asset.id)}
                        >
                             <MapPin size={32} className={`transition-all ${selectedAsset === asset.id ? 'text-nexus-600 scale-125' : 'text-slate-400 opacity-70 group-hover/pin:opacity-100 group-hover/pin:text-nexus-400'}`}/>
                             {selectedAsset === asset.id && <span className="bg-white text-xs font-bold px-2 py-1 rounded shadow mt-1">{asset.name}</span>}
                        </div>
                     ))
                )}
                
                <div className="absolute top-4 left-4 z-10">
                    <TemplateHeader number="10" title="Geospatial Assets" />
                </div>
            </div>
            
            <div className="h-1/2 bg-white flex flex-col">
                <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm z-10">
                    <span className="font-black text-xs uppercase text-slate-500 tracking-widest flex items-center gap-2">
                        <LayoutGrid size={14}/> Selected Assets ({assets.length})
                    </span>
                </div>
                <div className="flex-1 overflow-auto p-0">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Asset ID</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {assets.map(asset => (
                                <tr key={asset.id} onClick={() => setSelectedAsset(asset.id)} className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedAsset === asset.id ? 'bg-nexus-50' : ''}`}>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500 font-mono">{asset.id}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{asset.name}</td>
                                    <td className="px-6 py-4"><Badge variant={asset.status === 'Active' ? 'success' : 'neutral'}>{asset.status}</Badge></td>
                                    <td className="px-6 py-4 text-xs font-mono text-slate-500">{asset.location}</td>
                                </tr>
                            ))}
                            {assets.length === 0 && <tr><td colSpan={4} className="p-8 text-center">No assets found.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
