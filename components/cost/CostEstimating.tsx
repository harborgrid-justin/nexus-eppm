
import React, { useState, useEffect, useMemo } from 'react';
import { useWbsManager } from '../../hooks';
import { CostEstimate, CostEstimateItem, WBSNode } from '../../types';
import { useData } from '../../context/DataContext';
import { Save, Plus, Trash2, Calculator, PieChart, FileText, ChevronRight, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency, formatCompactCurrency, formatPercentage } from '../../utils/formatters';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface CostEstimatingProps {
  projectId: string;
}

const RESOURCE_TYPES = ['Labor', 'Material', 'Equipment', 'Subcontract', 'Other'];
const ESTIMATE_CLASSES = [
    { id: 'Class 5 (ROM)', accuracy: '-50% to +100%' },
    { id: 'Class 4 (Preliminary)', accuracy: '-30% to +50%' },
    { id: 'Class 3 (Budget)', accuracy: '-20% to +30%' },
    { id: 'Class 2 (Control)', accuracy: '-15% to +20%' },
    { id: 'Class 1 (Definitive)', accuracy: '-10% to +15%' },
];

const COLORS = ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

const CostEstimating: React.FC<CostEstimatingProps> = ({ projectId }) => {
  const { state, dispatch } = useData();
  const { wbsTree, selectedNode, handleNodeClick } = useWbsManager(projectId);
  
  const [estimate, setEstimate] = useState<CostEstimate | null>(null);
  const [activeTab, setActiveTab] = useState<'worksheet' | 'analysis' | 'boe'>('worksheet');

  // Load estimate when node selection changes
  useEffect(() => {
    if (selectedNode) {
      const project = state.projects.find(p => p.id === projectId);
      // In real app, fetch from API. Here we simulate finding or creating one.
      const existing = project?.costEstimates?.find(e => e.wbsId === selectedNode.id);
      
      if (existing) {
        setEstimate(JSON.parse(JSON.stringify(existing))); // Deep copy
      } else {
        // Create new draft
        setEstimate({
            id: `EST-${Date.now()}`,
            wbsId: selectedNode.id,
            projectId,
            version: 1,
            status: 'Draft',
            method: 'Deterministic',
            class: 'Class 3 (Budget)',
            baseCost: 0,
            contingencyPercent: 10,
            escalationPercent: 3,
            totalCost: 0,
            items: [],
            basisOfEstimate: '',
            updatedAt: new Date().toISOString(),
            updatedBy: 'CurrentUser'
        });
      }
    } else {
        setEstimate(null);
    }
  }, [selectedNode, state.projects, projectId]);

  // Auto-calculate totals when items change
  useEffect(() => {
      if (!estimate) return;
      
      const newBaseCost = estimate.items.reduce((sum, item) => sum + item.total, 0);
      const contingency = newBaseCost * (estimate.contingencyPercent / 100);
      const escalation = newBaseCost * (estimate.escalationPercent / 100);
      const newTotal = newBaseCost + contingency + escalation;

      if (newBaseCost !== estimate.baseCost || newTotal !== estimate.totalCost) {
          setEstimate(prev => prev ? ({ ...prev, baseCost: newBaseCost, totalCost: newTotal }) : null);
      }
  }, [estimate?.items, estimate?.contingencyPercent, estimate?.escalationPercent]);

  const handleAddItem = () => {
      if (!estimate) return;
      const newItem: CostEstimateItem = {
          id: `ITEM-${Date.now()}`,
          description: '',
          resourceType: 'Material',
          quantity: 1,
          uom: 'EA',
          unitRate: 0,
          total: 0
      };
      setEstimate({ ...estimate, items: [...estimate.items, newItem] });
  };

  const handleUpdateItem = (id: string, field: keyof CostEstimateItem, value: any) => {
      if (!estimate) return;
      const updatedItems = estimate.items.map(item => {
          if (item.id === id) {
              const updated = { ...item, [field]: value };
              // Recalculate line total
              if (estimate.method === 'Deterministic') {
                  updated.total = updated.quantity * updated.unitRate;
              } else if (estimate.method === 'Three-Point') {
                  // PERT Formula: (O + 4M + P) / 6
                  const opt = updated.optimistic || 0;
                  const ml = updated.mostLikely || 0;
                  const pess = updated.pessimistic || 0;
                  updated.total = (opt + 4 * ml + pess) / 6;
              }
              return updated;
          }
          return item;
      });
      setEstimate({ ...estimate, items: updatedItems });
  };

  const handleDeleteItem = (id: string) => {
      if (!estimate) return;
      setEstimate({ ...estimate, items: estimate.items.filter(i => i.id !== id) });
  };

  const handleSave = () => {
      if (estimate && estimate.id) {
          dispatch({ 
              type: 'ADD_OR_UPDATE_COST_ESTIMATE', 
              payload: { projectId, estimate: { ...estimate, updatedAt: new Date().toISOString() } } 
          });
          alert('Estimate Saved Successfully');
      }
  };

  // --- Visual Data ---
  const chartData = useMemo(() => {
      if (!estimate) return [];
      const buckets: Record<string, number> = {};
      estimate.items.forEach(i => {
          buckets[i.resourceType] = (buckets[i.resourceType] || 0) + i.total;
      });
      return Object.entries(buckets).map(([name, value]) => ({ name, value }));
  }, [estimate]);

  const renderTree = (nodes: WBSNode[], level: number) => {
    return nodes.map(node => (
      <React.Fragment key={node.id}>
        <div 
          onClick={() => handleNodeClick(node.id)}
          className={`group flex items-center p-2 my-0.5 rounded-md cursor-pointer transition-colors ${selectedNode?.id === node.id ? 'bg-nexus-100' : 'hover:bg-slate-100'}`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          <div className="mr-2 text-slate-400">
             {node.children.length > 0 ? <ChevronDown size={14}/> : <div className="w-[14px]"/>}
          </div>
          <span className="font-mono text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded mr-2">{node.wbsCode}</span>
          <span className={`text-sm truncate ${selectedNode?.id === node.id ? 'font-bold text-nexus-800' : 'text-slate-700'}`}>{node.name}</span>
        </div>
        {node.children.length > 0 && renderTree(node.children, level + 1)}
      </React.Fragment>
    ));
  };

  if (!wbsTree.length) return <div className="p-6">Loading WBS...</div>;

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
      {/* Sidebar: WBS Selector */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">WBS Structure</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {renderTree(wbsTree, 0)}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {estimate ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-slate-200 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            {selectedNode?.name}
                            <span className={`text-xs px-2 py-1 rounded-full border ${estimate.status === 'Approved' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                                {estimate.status}
                            </span>
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">Estimate ID: {estimate.id} • Version {estimate.version}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-nexus-600 text-white rounded-lg text-sm font-medium hover:bg-nexus-700 shadow-sm transition-colors">
                            <Save size={16}/> Save Estimate
                        </button>
                    </div>
                </div>

                {/* KPI Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-xs text-slate-500 uppercase font-bold">Total Estimate</span>
                        <div className="text-xl font-bold text-slate-900">{formatCompactCurrency(estimate.totalCost)}</div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-xs text-slate-500 uppercase font-bold">Base Cost</span>
                        <div className="text-lg font-medium text-slate-700">{formatCompactCurrency(estimate.baseCost)}</div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <span className="text-xs text-slate-500 uppercase font-bold">Contingency</span>
                        <div className="text-lg font-medium text-slate-700">{formatPercentage(estimate.contingencyPercent)}</div>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-lg">
                        <select 
                            className="w-full h-full text-sm font-medium text-slate-700 bg-transparent outline-none cursor-pointer"
                            value={estimate.class}
                            onChange={(e) => setEstimate({...estimate, class: e.target.value as any})}
                        >
                            {ESTIMATE_CLASSES.map(cls => <option key={cls.id} value={cls.id}>{cls.id}</option>)}
                        </select>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 -mb-6 mt-2">
                    <button onClick={() => setActiveTab('worksheet')} className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'worksheet' ? 'border-nexus-600 text-nexus-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                        Worksheet
                    </button>
                    <button onClick={() => setActiveTab('analysis')} className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'analysis' ? 'border-nexus-600 text-nexus-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                        Visual Analysis
                    </button>
                    <button onClick={() => setActiveTab('boe')} className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'boe' ? 'border-nexus-600 text-nexus-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                        Basis of Estimate
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
                
                {activeTab === 'worksheet' && (
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="method" 
                                        checked={estimate.method === 'Deterministic'} 
                                        onChange={() => setEstimate({...estimate, method: 'Deterministic'})}
                                    /> Deterministic
                                </label>
                                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="method" 
                                        checked={estimate.method === 'Three-Point'} 
                                        onChange={() => setEstimate({...estimate, method: 'Three-Point'})}
                                    /> Three-Point (PERT)
                                </label>
                            </div>
                            <button onClick={handleAddItem} className="text-xs flex items-center gap-1 bg-white border border-slate-300 px-2 py-1 rounded hover:bg-slate-50 text-slate-700 font-medium">
                                <Plus size={12}/> Add Line Item
                            </button>
                        </div>
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase w-1/3">Description</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Type</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">Qty / UOM</th>
                                    {estimate.method === 'Deterministic' ? (
                                        <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">Unit Rate</th>
                                    ) : (
                                        <>
                                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase text-green-600">Opt ($)</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase text-blue-600">Likely ($)</th>
                                            <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase text-red-600">Pess ($)</th>
                                        </>
                                    )}
                                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase">Total</th>
                                    <th className="px-4 py-3 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {estimate.items.map(item => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="px-4 py-2">
                                            <input 
                                                type="text" 
                                                className="w-full bg-transparent border-b border-transparent focus:border-nexus-500 outline-none text-sm"
                                                placeholder="Item description"
                                                value={item.description}
                                                onChange={e => handleUpdateItem(item.id, 'description', e.target.value)}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <select 
                                                className="w-full bg-transparent text-sm text-slate-600 outline-none"
                                                value={item.resourceType}
                                                onChange={e => handleUpdateItem(item.id, 'resourceType', e.target.value)}
                                            >
                                                {RESOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex gap-2">
                                                <input 
                                                    type="number" 
                                                    className="w-16 bg-transparent border border-slate-200 rounded px-1 text-sm text-right"
                                                    value={item.quantity}
                                                    onChange={e => handleUpdateItem(item.id, 'quantity', parseFloat(e.target.value))}
                                                />
                                                <input 
                                                    type="text" 
                                                    className="w-12 bg-transparent border-b border-transparent focus:border-nexus-500 outline-none text-sm text-center uppercase"
                                                    value={item.uom}
                                                    onChange={e => handleUpdateItem(item.id, 'uom', e.target.value)}
                                                />
                                            </div>
                                        </td>
                                        
                                        {estimate.method === 'Deterministic' ? (
                                            <td className="px-4 py-2">
                                                <input 
                                                    type="number" 
                                                    className="w-full bg-transparent border border-slate-200 rounded px-1 text-sm text-right"
                                                    value={item.unitRate}
                                                    onChange={e => handleUpdateItem(item.id, 'unitRate', parseFloat(e.target.value))}
                                                />
                                            </td>
                                        ) : (
                                            <>
                                                <td className="px-4 py-2"><input type="number" className="w-full bg-green-50/50 border border-green-200 rounded px-1 text-sm text-right" value={item.optimistic || 0} onChange={e => handleUpdateItem(item.id, 'optimistic', parseFloat(e.target.value))} /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full bg-blue-50/50 border border-blue-200 rounded px-1 text-sm text-right" value={item.mostLikely || 0} onChange={e => handleUpdateItem(item.id, 'mostLikely', parseFloat(e.target.value))} /></td>
                                                <td className="px-4 py-2"><input type="number" className="w-full bg-red-50/50 border border-red-200 rounded px-1 text-sm text-right" value={item.pessimistic || 0} onChange={e => handleUpdateItem(item.id, 'pessimistic', parseFloat(e.target.value))} /></td>
                                            </>
                                        )}

                                        <td className="px-4 py-2 text-right font-mono text-sm font-bold text-slate-800">
                                            {formatCurrency(item.total)}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            <button onClick={() => handleDeleteItem(item.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                                        </td>
                                    </tr>
                                ))}
                                {estimate.items.length === 0 && (
                                    <tr><td colSpan={7} className="p-8 text-center text-slate-400 italic">No line items. Click "Add Line Item" to start.</td></tr>
                                )}
                            </tbody>
                            <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                                <tr>
                                    <td colSpan={estimate.method === 'Deterministic' ? 4 : 6} className="px-4 py-2 text-right text-sm text-slate-600">Subtotal (Base Cost)</td>
                                    <td className="px-4 py-2 text-right text-sm text-slate-900">{formatCurrency(estimate.baseCost)}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td colSpan={estimate.method === 'Deterministic' ? 4 : 6} className="px-4 py-2 text-right text-sm text-slate-600 flex items-center justify-end gap-2">
                                        Contingency
                                        <input 
                                            type="number" 
                                            className="w-12 border border-slate-300 rounded px-1 text-right font-normal" 
                                            value={estimate.contingencyPercent}
                                            onChange={e => setEstimate({...estimate, contingencyPercent: parseFloat(e.target.value)})}
                                        /> %
                                    </td>
                                    <td className="px-4 py-2 text-right text-sm text-slate-900">{formatCurrency(estimate.baseCost * (estimate.contingencyPercent/100))}</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td colSpan={estimate.method === 'Deterministic' ? 4 : 6} className="px-4 py-2 text-right text-sm text-slate-600 flex items-center justify-end gap-2">
                                        Escalation
                                        <input 
                                            type="number" 
                                            className="w-12 border border-slate-300 rounded px-1 text-right font-normal" 
                                            value={estimate.escalationPercent}
                                            onChange={e => setEstimate({...estimate, escalationPercent: parseFloat(e.target.value)})}
                                        /> %
                                    </td>
                                    <td className="px-4 py-2 text-right text-sm text-slate-900">{formatCurrency(estimate.baseCost * (estimate.escalationPercent/100))}</td>
                                    <td></td>
                                </tr>
                                <tr className="bg-slate-100 text-base">
                                    <td colSpan={estimate.method === 'Deterministic' ? 4 : 6} className="px-4 py-3 text-right text-slate-800">Total Estimate</td>
                                    <td className="px-4 py-3 text-right text-nexus-700">{formatCurrency(estimate.totalCost)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}

                {activeTab === 'analysis' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><PieChart size={18}/> Cost Distribution by Type</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RePieChart>
                                        <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip formatter={(val: number) => formatCurrency(val)} />
                                        <Legend />
                                    </RePieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Calculator size={18}/> Estimating Metrics</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-slate-50 rounded-lg flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Estimate Class</span>
                                    <span className="font-bold text-slate-900">{estimate.class}</span>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Expected Accuracy</span>
                                    <span className="font-bold text-nexus-600">{ESTIMATE_CLASSES.find(c => c.id === estimate.class)?.accuracy}</span>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-lg flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Item Count</span>
                                    <span className="font-bold text-slate-900">{estimate.items.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'boe' && (
                    <div className="space-y-4 max-w-3xl mx-auto">
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3">
                            <CheckCircle className="text-blue-600 shrink-0 mt-0.5" size={20}/>
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm">Basis of Estimate (BoE)</h4>
                                <p className="text-sm text-blue-800 mt-1">
                                    Document the logic, assumptions, data sources, and calculations used to develop this cost estimate. This narrative is crucial for audits and reviews.
                                </p>
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
                            <textarea 
                                className="w-full p-4 h-96 outline-none text-sm text-slate-700 resize-none rounded-lg"
                                placeholder="Start typing the Basis of Estimate narrative here..."
                                value={estimate.basisOfEstimate}
                                onChange={e => setEstimate({...estimate, basisOfEstimate: e.target.value})}
                            />
                        </div>
                    </div>
                )}

            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 bg-slate-50/50">
            <Calculator size={48} className="mb-4 opacity-50"/>
            <p>Select a WBS element to view or create an estimate.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CostEstimating;
