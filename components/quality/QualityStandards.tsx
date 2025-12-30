
import React, { useState } from 'react';
import { BadgeCheck, Plus, Lock, Globe, Building, Scale, Search, Filter, Link as LinkIcon, Trash2, Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { QualityStandard } from '../../types';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { generateId } from '../../utils/formatters';

const QualityStandards: React.FC = () => {
    const theme = useTheme();
    const { state } = useData(); 
    const { canEditProject } = usePermissions();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    
    // Panel State
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingStandard, setEditingStandard] = useState<Partial<QualityStandard>>({
        name: '',
        category: 'General',
        source: 'Internal',
        description: '',
        enforcement: 'Mandatory'
    });

    const standards: QualityStandard[] = state.qualityStandards;

    const filteredStandards = standards.filter(std => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = std.name.toLowerCase().indexOf(searchLower) !== -1 ||
                             std.description.toLowerCase().indexOf(searchLower) !== -1;
        const matchesCat = categoryFilter === 'All' || std.category === categoryFilter;
        return matchesSearch && matchesCat;
    });

    const handleOpenPanel = (standard?: QualityStandard) => {
        if (standard) {
            setEditingStandard({ ...standard });
        } else {
            setEditingStandard({
                name: '',
                category: 'General',
                source: 'Internal',
                description: '',
                enforcement: 'Mandatory'
            });
        }
        setIsPanelOpen(true);
    };

    const handleSave = () => {
        // In a real app, dispatch to store
        console.log("Saving standard:", editingStandard);
        const newStandard = {
            ...editingStandard,
            id: editingStandard.id || generateId('QS')
        };
        // dispatch({ type: 'ADD_QUALITY_STANDARD', payload: newStandard });
        setIsPanelOpen(false);
    };

    const getSourceIcon = (source: string) => {
        switch(source) {
            case 'Internal': return <Building size={14} className="text-blue-500"/>;
            case 'Regulatory': return <Scale size={14} className="text-red-500"/>;
            default: return <Globe size={14} className="text-green-500"/>;
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className={`p-4 ${theme.layout.headerBorder} flex-shrink-0 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50`}>
                <div>
                    <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                        <BadgeCheck size={18} className="text-nexus-600" /> Applicable Standards Registry
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">Catalog of quality codes, standards, and specifications applied to this project.</p>
                </div>
                
                {canEditProject() ? (
                    <Button onClick={() => handleOpenPanel()} icon={Plus}>Add Standard</Button>
                ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                        <Lock size={14}/> Read Only
                    </div>
                )}
            </div>

            {/* Toolbar */}
            <div className="px-4 py-3 border-b border-slate-200 flex gap-3 items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input 
                        type="text" 
                        placeholder="Search standards..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-1.5 w-full text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-nexus-500 outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter size={14} className="text-slate-400"/>
                    <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="text-sm border border-slate-300 rounded-md py-1.5 px-3 bg-white focus:ring-1 focus:ring-nexus-500 outline-none"
                    >
                        <option value="All">All Categories</option>
                        <option value="General">General</option>
                        <option value="Material">Material</option>
                        <option value="Process">Process</option>
                        <option value="Safety">Safety</option>
                    </select>
                </div>
            </div>

            {/* Registry Table */}
            <div className="flex-1 overflow-auto bg-slate-50">
                <div className="min-w-[800px]">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-white sticky top-0 shadow-sm z-10">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Standard Code</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Enforcement</th>
                                <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">WBS Links</th>
                                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {filteredStandards.map(standard => (
                                <tr key={standard.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 cursor-pointer" onClick={() => handleOpenPanel(standard)}>{standard.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600">
                                        <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">{standard.category}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            {getSourceIcon(standard.source)}
                                            {standard.source}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate" title={standard.description}>{standard.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                            standard.enforcement === 'Mandatory' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                            {standard.enforcement}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">{standard.linkedWbsIds?.length || 0}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1 hover:bg-slate-100 rounded text-nexus-600" title="Link to WBS">
                                                <LinkIcon size={14}/>
                                            </button>
                                            {canEditProject() && (
                                                <button className="p-1 hover:bg-red-50 rounded text-red-500" title="Remove">
                                                    <Trash2 size={14}/>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredStandards.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                                        <p>No standards found matching your filter.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Panel */}
            <SidePanel
                isOpen={isPanelOpen}
                onClose={() => setIsPanelOpen(false)}
                title={editingStandard.id ? "Edit Standard" : "Add Quality Standard"}
                width="md:w-[500px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave} icon={Save}>Save Standard</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Standard Name / Code</label>
                        <Input 
                            value={editingStandard.name} 
                            onChange={e => setEditingStandard({...editingStandard, name: e.target.value})} 
                            placeholder="e.g. ISO 9001:2015"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select 
                                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500"
                                value={editingStandard.category}
                                onChange={e => setEditingStandard({...editingStandard, category: e.target.value})}
                            >
                                <option>General</option>
                                <option>Process</option>
                                <option>Material</option>
                                <option>Safety</option>
                                <option>Environmental</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                            <select 
                                className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500"
                                value={editingStandard.source}
                                onChange={e => setEditingStandard({...editingStandard, source: e.target.value as any})}
                            >
                                <option>Internal</option>
                                <option>External</option>
                                <option>Regulatory</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea 
                            className="w-full p-3 border border-slate-300 rounded-lg text-sm h-32 focus:ring-2 focus:ring-nexus-500"
                            placeholder="Describe the standard and its applicability..."
                            value={editingStandard.description}
                            onChange={e => setEditingStandard({...editingStandard, description: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Enforcement Level</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="enforcement" 
                                    value="Mandatory" 
                                    checked={editingStandard.enforcement === 'Mandatory'}
                                    onChange={() => setEditingStandard({...editingStandard, enforcement: 'Mandatory'})}
                                    className="text-nexus-600 focus:ring-nexus-500"
                                />
                                Mandatory
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="enforcement" 
                                    value="Guideline" 
                                    checked={editingStandard.enforcement === 'Guideline'}
                                    onChange={() => setEditingStandard({...editingStandard, enforcement: 'Guideline'})}
                                    className="text-nexus-600 focus:ring-nexus-500"
                                />
                                Guideline (Best Practice)
                            </label>
                        </div>
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default QualityStandards;
