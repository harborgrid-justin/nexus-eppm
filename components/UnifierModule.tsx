
import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { CostSheet } from './unifier/CostSheet';
import { BusinessProcessForm } from './unifier/BusinessProcessForm';
import { SidePanel } from './ui/SidePanel';
import { BPRecord } from '../types/unifier';
import { Table, Plus, FileText, Layers, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UnifierModule: React.FC = () => {
  const { state, dispatch } = useData();
  const { user } = useAuth();
  const theme = useTheme();
  
  const [activeTab, setActiveTab] = useState<'CostSheet' | 'BPs'>('CostSheet');
  const [selectedBP, setSelectedBP] = useState<string>('bp_co'); // Default to Change Orders
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BPRecord | undefined>(undefined);

  // Mock Project Context
  const projectId = 'P1001'; 

  const activeDefinition = state.unifier.definitions.find(d => d.id === selectedBP);
  const records = state.unifier.records.filter(r => r.bpDefId === selectedBP && r.projectId === projectId);

  const handleCreate = () => {
    setEditingRecord(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (rec: BPRecord) => {
    setEditingRecord(rec);
    setIsFormOpen(true);
  };

  const handleSaveRecord = (record: BPRecord, action: string) => {
     dispatch({ 
         type: 'UNIFIER_UPDATE_BP_RECORD', 
         payload: { record, action, user } 
     });
     setIsFormOpen(false);
  };

  return (
    <div className={`h-full flex flex-col ${theme.layout.pagePadding}`}>
        {/* Module Header */}
        <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className={theme.typography.h1}>Unifier Project Controls</h1>
                <p className={theme.typography.small}>Advanced Cost & Workflow Automation</p>
            </div>
            <div className="flex bg-white border border-slate-200 rounded-lg p-1">
                <button onClick={() => setActiveTab('CostSheet')} className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 ${activeTab === 'CostSheet' ? 'bg-nexus-600 text-white shadow' : 'text-slate-500'}`}>
                    <Table size={16}/> Cost Sheet
                </button>
                <button onClick={() => setActiveTab('BPs')} className={`px-4 py-2 text-sm font-bold rounded-md flex items-center gap-2 ${activeTab === 'BPs' ? 'bg-nexus-600 text-white shadow' : 'text-slate-500'}`}>
                    <Layers size={16}/> Business Processes
                </button>
            </div>
        </div>

        {activeTab === 'CostSheet' ? (
            <CostSheet projectId={projectId} />
        ) : (
            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* BP Selector Sidebar */}
                <div className="w-64 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs uppercase text-slate-500 tracking-wider">
                        Process Logs
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {state.unifier.definitions.map(def => (
                            <button 
                                key={def.id}
                                onClick={() => setSelectedBP(def.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-3 ${selectedBP === def.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <div className={`w-2 h-2 rounded-full ${selectedBP === def.id ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                                {def.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* BP Log Grid */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">{activeDefinition?.name} Log</h3>
                        <button onClick={handleCreate} className={`px-3 py-1.5 ${theme.colors.primary} text-white rounded-lg text-xs font-bold flex items-center gap-2 hover:opacity-90`}>
                            <Plus size={14}/> Create New
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Record No.</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                                    {activeDefinition?.fields.slice(0, 3).map(f => (
                                        <th key={f.key} className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">{f.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {records.map(r => (
                                    <tr key={r.id} onClick={() => handleEdit(r)} className="hover:bg-slate-50 cursor-pointer">
                                        <td className="px-6 py-4 text-sm font-mono text-slate-600">{r.id}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-800">{r.title}</td>
                                        <td className="px-6 py-4 text-sm"><span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-600 border border-slate-200">{r.status}</span></td>
                                        {activeDefinition?.fields.slice(0, 3).map(f => (
                                            <td key={f.key} className="px-6 py-4 text-sm text-slate-600">
                                                {typeof r.data[f.key] === 'object' ? JSON.stringify(r.data[f.key]) : r.data[f.key]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {/* BP Form Side Panel */}
        {isFormOpen && activeDefinition && (
            <SidePanel
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingRecord ? `Edit ${editingRecord.id}` : `New ${activeDefinition.name}`}
                width="md:w-[600px]"
                footer={null} // Handled by form internal
            >
                <BusinessProcessForm 
                    definition={activeDefinition} 
                    record={editingRecord} 
                    projectId={projectId}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSaveRecord}
                />
            </SidePanel>
        )}
    </div>
  );
};

export default UnifierModule;
