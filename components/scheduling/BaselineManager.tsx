
import React, { useState } from 'react';
import { Project, Baseline } from '../../types/index';
import { Layers, History, Save, RotateCcw, Eye, Plus, Trash2, Calendar, FileCheck, Edit2, ShieldAlert } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { SidePanel } from '../ui/SidePanel';
import { Input } from '../ui/Input';
import { formatDate } from '../../utils/formatters';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';

const BaselineManager: React.FC = () => {
  const { project } = useProjectWorkspace();
  const { dispatch } = useData();
  const theme = useTheme();
  
  const [selectedBaselineId, setSelectedBaselineId] = useState<string | null>(null);
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [formData, setFormData] = useState<{ id?: string; name: string; type: Baseline['type'] }>({
      name: '',
      type: 'Revised'
  });

  if (!project) return null;
  const projectId = project.id;

  const baselines = project.baselines || [];
  const activeBaseline = baselines.find(b => b.id === selectedBaselineId);

  const handleOpenCreate = () => {
    setFormData({ name: `Baseline ${baselines.length + 1}`, type: 'Revised' });
    setIsPanelOpen(true);
  };

  const handleOpenEdit = (b: Baseline) => {
    setFormData({ id: b.id, name: b.name, type: b.type });
    setIsPanelOpen(true);
  };

  const handleDelete = (id: string) => {
      if(confirm("Are you sure you want to delete this baseline? This action cannot be undone.")) {
          dispatch({ type: 'BASELINE_DELETE', payload: { projectId, baselineId: id } });
          if (selectedBaselineId === id) setSelectedBaselineId(null);
      }
  };

  const handleSubmit = () => {
    if (!formData.name) return;
    
    if (formData.id) {
        dispatch({ 
            type: 'BASELINE_UPDATE', 
            payload: { projectId, baselineId: formData.id, name: formData.name, type: formData.type } 
        });
    } else {
        dispatch({ 
            type: 'BASELINE_SET', 
            payload: { projectId, name: formData.name, type: formData.type } 
        });
    }
    setIsPanelOpen(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
        <div className="p-6 border-b border-slate-200 bg-white flex justify-between items-center">
            <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <History className="text-nexus-600" /> Project Baseline Manager
                </h2>
                <p className="text-sm text-slate-500">Manage schedule and cost snapshots for performance measurement.</p>
            </div>
            <Button onClick={handleOpenCreate} icon={Plus}>Capture New Baseline</Button>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* List Sidebar */}
            <div className="w-80 border-r border-slate-200 bg-white flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex justify-between items-center">
                    <span>Available Baselines</span>
                    <span className="bg-slate-200 text-slate-600 px-1.5 rounded">{baselines.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {baselines.map(b => (
                        <div 
                            key={b.id} 
                            onClick={() => setSelectedBaselineId(b.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer group relative ${
                                selectedBaselineId === b.id 
                                ? 'bg-nexus-50 border-nexus-200 ring-1 ring-nexus-500/20 shadow-sm' 
                                : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-1 pr-6">
                                <h4 className={`font-bold text-sm ${selectedBaselineId === b.id ? 'text-nexus-800' : 'text-slate-800'}`}>{b.name}</h4>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Calendar size={12}/>
                                    {formatDate(b.date)}
                                </div>
                                <Badge variant={b.type === 'Initial' ? 'success' : 'neutral'}>{b.type}</Badge>
                            </div>
                            
                            {/* Actions overlay */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded backdrop-blur-sm">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleOpenEdit(b); }}
                                    className="p-1.5 text-slate-500 hover:text-nexus-600 hover:bg-nexus-100 rounded"
                                >
                                    <Edit2 size={12}/>
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleDelete(b.id); }}
                                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                                >
                                    <Trash2 size={12}/>
                                </button>
                            </div>
                        </div>
                    ))}
                    {baselines.length === 0 && (
                        <div className="p-8 text-center flex flex-col items-center justify-center text-slate-400 h-full">
                            <Layers size={32} className="opacity-20 mb-2"/>
                            <p className="text-sm italic">No baselines captured.</p>
                            <Button variant="ghost" size="sm" onClick={handleOpenCreate} className="mt-2">Create First</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Comparison / Detail Area */}
            <div className="flex-1 overflow-auto p-6">
                {activeBaseline ? (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-bold text-slate-900">{activeBaseline.name}</h3>
                                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{activeBaseline.id}</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">Variance Analysis against current Live Schedule</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-200 flex items-center gap-2 transition-colors">
                                    <RotateCcw size={14}/> Restore as Live
                                </button>
                                <button className="px-3 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
                                    <FileCheck size={14}/> Export Report
                                </button>
                            </div>
                        </div>

                        {/* Detailed Variance Table */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                             <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                                <h4 className="font-bold text-sm text-slate-700">Task Performance Variance</h4>
                                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">{Object.keys(activeBaseline.taskBaselines).length} Snapshots</span>
                             </div>
                             <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-100">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Activity</th>
                                            <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">Baseline Finish</th>
                                            <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">Current Finish</th>
                                            <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">Baseline Dur.</th>
                                            <th className="px-6 py-3 text-center text-xs font-bold text-slate-500 uppercase">Current Dur.</th>
                                            <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Variance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {project.tasks.filter(t => t.type !== 'Summary').slice(0, 15).map(task => {
                                            const blTask = activeBaseline.taskBaselines[task.id];
                                            if(!blTask) return null;
                                            
                                            const baselineDate = new Date(blTask.baselineEndDate);
                                            const currentDate = new Date(task.endDate);
                                            const variance = Math.round((currentDate.getTime() - baselineDate.getTime()) / (1000 * 3600 * 24));
                                            
                                            const durVariance = task.duration - blTask.baselineDuration;

                                            return (
                                                <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-sm text-slate-900">{task.name}</div>
                                                        <div className="text-[10px] text-slate-400 font-mono">{task.wbsCode}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-sm text-slate-500">{formatDate(blTask.baselineEndDate)}</td>
                                                    <td className="px-6 py-4 text-center text-sm text-slate-800 font-semibold">{formatDate(task.endDate)}</td>
                                                    <td className="px-6 py-4 text-center text-sm text-slate-500">{blTask.baselineDuration}d</td>
                                                    <td className={`px-6 py-4 text-center text-sm font-bold ${durVariance > 0 ? 'text-red-600' : 'text-slate-800'}`}>{task.duration}d</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                            variance > 0 ? 'bg-red-100 text-red-700' : 
                                                            variance < 0 ? 'bg-green-100 text-green-700' : 
                                                            'bg-slate-100 text-slate-600'
                                                        }`}>
                                                            {variance > 0 ? `+${variance} Days` : variance < 0 ? `${variance} Days` : 'On Track'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 animate-in fade-in zoom-in-95">
                        <div className="p-6 bg-slate-50 rounded-full mb-4 shadow-inner">
                            <History size={48} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-700">Select a baseline to analyze</h3>
                        <p className="text-sm max-w-sm text-center mt-2">Historical snapshots allow you to track schedule slippage and cost drift over time. Select one from the left to view variance details.</p>
                    </div>
                )}
            </div>
        </div>

        {/* Create/Edit Panel */}
        <SidePanel
            isOpen={isPanelOpen}
            onClose={() => setIsPanelOpen(false)}
            title={formData.id ? "Edit Baseline Details" : "Capture New Baseline"}
            width="md:w-[500px]"
            footer={
                <>
                    <Button variant="secondary" onClick={() => setIsPanelOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} icon={Save}>{formData.id ? "Update" : "Capture Snapshot"}</Button>
                </>
            }
        >
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Baseline Name</label>
                    <Input 
                        value={formData.name} 
                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        placeholder="e.g. Phase 1 Approval"
                        autoFocus
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Baseline Type</label>
                    <select 
                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-nexus-500 outline-none"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                    >
                        <option value="Initial">Initial (Project Start)</option>
                        <option value="Revised">Revised (Re-baseline)</option>
                        <option value="Customer Approved">Customer Approved</option>
                    </select>
                </div>
                
                {!formData.id && (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                        <div className="mt-0.5 text-blue-600"><ShieldAlert size={18}/></div>
                        <div className="text-xs text-blue-800 leading-relaxed">
                            <p className="font-bold mb-1">Snapshot Scope</p>
                            Creating a baseline will lock in the current Start Date, Finish Date, and Duration for <strong>{project.tasks.length}</strong> tasks. This static copy will be used for variance reporting.
                        </div>
                    </div>
                )}
            </div>
        </SidePanel>
    </div>
  );
};

export default BaselineManager;
