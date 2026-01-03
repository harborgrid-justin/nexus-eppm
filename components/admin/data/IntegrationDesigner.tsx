import React, { useState, useMemo } from 'react';
import { 
    GitMerge, ArrowRight, Save, RefreshCw, Layers, 
    Code, Shield, Clock, AlertTriangle, FileCode, Check, Plus,
    Database, Mail, Lock, Activity, Shuffle, 
    Variable, History, Link, X, PlayCircle, Settings
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

// Mock Schema Definitions for Internal Modules
const NEXUS_SCHEMAS: Record<string, string[]> = {
    'Project': ['id', 'name', 'status', 'budget', 'startDate', 'endDate', 'managerId'],
    'Task': ['id', 'name', 'duration', 'progress', 'status', 'wbsCode'],
    'Resource': ['id', 'name', 'role', 'rate', 'capacity'],
    'Risk': ['id', 'description', 'probability', 'impact', 'score'],
    'Financials': ['id', 'costCode', 'amount', 'vendor', 'invoiceDate']
};

export const IntegrationDesigner: React.FC = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState<'mapping' | 'transform' | 'orchestration' | 'governance'>('mapping');
    const [targetEntity, setTargetEntity] = useState('Project');
    
    // Mapping State
    const [mappings, setMappings] = useState([
        { id: 1, source: 'EXTERNAL_ID', target: 'id', transform: 'Direct', type: 'String' },
        { id: 2, source: 'PROJ_NAME', target: 'name', transform: 'Trim Whitespace', type: 'String' },
        { id: 3, source: 'BUDGET_AMT', target: 'budget', transform: 'Currency(USD)', type: 'Number' },
        { id: 4, source: 'START_DT', target: 'startDate', transform: 'Date(ISO8601)', type: 'Date' },
    ]);

    const availableTargets = NEXUS_SCHEMAS[targetEntity] || [];

    const handleAddMapping = () => {
        setMappings([...mappings, { 
            id: Date.now(), 
            source: 'NEW_FIELD', 
            target: availableTargets[0], 
            transform: 'Direct', 
            type: 'String' 
        }]);
    };

    const handleRemoveMapping = (id: number) => {
        setMappings(mappings.filter(m => m.id !== id));
    };

    const handleTargetChange = (id: number, newTarget: string) => {
        setMappings(mappings.map(m => m.id === id ? { ...m, target: newTarget } : m));
    };

    return (
        <div className="h-full flex flex-col bg-slate-50/50">
            {/* Header */}
            <div className={`p-6 border-b ${theme.colors.border} bg-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-200">
                        <GitMerge size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-slate-900 text-xl">ETL Pipeline Designer</h3>
                            <Badge variant="success">v2.4 Active</Badge>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">Orchestrate data flow from External Sources to Nexus Core Modules.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                     <Button variant="outline" icon={PlayCircle}>Test Pipeline</Button>
                     <Button icon={Save}>Save Config</Button>
                </div>
            </div>

            {/* Config Bar */}
            <div className="px-6 py-4 bg-white border-b border-slate-200 flex items-center gap-6 overflow-x-auto">
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Source Connector</label>
                    <select className="bg-slate-50 border border-slate-300 rounded-lg py-1.5 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-purple-500">
                        <option>SAP S/4HANA (ERP)</option>
                        <option>Oracle P6 (Schedule)</option>
                        <option>Salesforce (CRM)</option>
                        <option>Flat File (CSV)</option>
                    </select>
                </div>
                <ArrowRight className="text-slate-300" />
                <div className="flex flex-col">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Target Module</label>
                    <select 
                        className="bg-slate-50 border border-slate-300 rounded-lg py-1.5 px-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-nexus-500"
                        value={targetEntity}
                        onChange={(e) => setTargetEntity(e.target.value)}
                    >
                        {Object.keys(NEXUS_SCHEMAS).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                </div>
                <div className="h-8 w-px bg-slate-200 mx-2"></div>
                
                {/* Tabs */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {[
                        { id: 'mapping', label: 'Schema Map', icon: Shuffle },
                        { id: 'transform', label: 'Transformation', icon: Variable },
                        { id: 'orchestration', label: 'Schedule', icon: Clock },
                        { id: 'governance', label: 'Controls', icon: Shield }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                                activeTab === tab.id 
                                ? 'bg-white text-nexus-700 shadow-sm' 
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                        >
                            <tab.icon size={14}/> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden p-6 relative">
                {activeTab === 'mapping' && (
                    <div className="h-full flex flex-col max-w-5xl mx-auto bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-[1fr_100px_1fr_50px] gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            <div className="pl-4">Source Field (External)</div>
                            <div className="text-center">Transform</div>
                            <div>Target Field (Nexus {targetEntity})</div>
                            <div className="text-center">Action</div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {mappings.map((map) => (
                                <div key={map.id} className="grid grid-cols-[1fr_100px_1fr_50px] gap-4 items-center p-3 rounded-lg border border-slate-100 hover:border-nexus-300 hover:shadow-md transition-all group bg-white">
                                    {/* Source */}
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-slate-100 rounded text-slate-500"><Database size={14}/></div>
                                        <input 
                                            className="w-full bg-transparent font-mono text-sm text-slate-700 font-bold outline-none border-b border-transparent focus:border-nexus-500"
                                            defaultValue={map.source}
                                        />
                                    </div>

                                    {/* Transform */}
                                    <div className="flex justify-center relative">
                                        <div className="absolute inset-0 flex items-center justify-center -z-10">
                                            <div className="w-full h-px bg-slate-200"></div>
                                        </div>
                                        <div className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded border border-purple-100 uppercase tracking-tight shadow-sm z-10 whitespace-nowrap">
                                            {map.transform}
                                        </div>
                                    </div>

                                    {/* Target */}
                                    <div className="flex items-center gap-3">
                                        <div className="p-1.5 bg-nexus-50 rounded text-nexus-600"><Layers size={14}/></div>
                                        <select 
                                            className="w-full bg-transparent font-mono text-sm text-nexus-700 font-bold outline-none cursor-pointer"
                                            value={map.target}
                                            onChange={(e) => handleTargetChange(map.id, e.target.value)}
                                        >
                                            {availableTargets.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-center">
                                        <button onClick={() => handleRemoveMapping(map.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                            <X size={16}/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                            
                            <button 
                                onClick={handleAddMapping}
                                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 font-bold text-sm hover:border-nexus-400 hover:text-nexus-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                            >
                                <Plus size={16}/> Add Field Map
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'transform' && (
                    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
                        <div className="bg-slate-900 rounded-xl overflow-hidden flex flex-col shadow-xl">
                            <div className="p-3 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
                                <span className="text-xs font-bold text-green-400 uppercase tracking-widest flex items-center gap-2"><Code size={14}/> Script Editor (Node.js)</span>
                                <span className="text-[10px] text-slate-500">middleware.js</span>
                            </div>
                            <textarea 
                                className="flex-1 bg-slate-900 text-slate-300 font-mono text-xs p-4 outline-none resize-none leading-relaxed"
                                defaultValue={`// Transformation Hook
module.exports = async function(record) {
  
  // 1. Sanitize Strings
  record.name = record.name.trim();

  // 2. Convert Currency
  if (record.currency !== 'USD') {
    record.budget = await convert(record.budget, record.currency, 'USD');
  }

  // 3. Enrich Data
  if (!record.managerId && record.department) {
    record.managerId = await lookupManager(record.department);
  }

  return record;
}`}
                            />
                        </div>
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Settings size={18}/> Standard Rules</h4>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <span className="text-sm font-medium text-slate-700">Skip Invalid Records</span>
                                        <input type="checkbox" className="rounded text-nexus-600" defaultChecked/>
                                    </label>
                                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <span className="text-sm font-medium text-slate-700">Auto-create Missing Reference Data</span>
                                        <input type="checkbox" className="rounded text-nexus-600"/>
                                    </label>
                                    <label className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                                        <span className="text-sm font-medium text-slate-700">Enforce Target Validation</span>
                                        <input type="checkbox" className="rounded text-nexus-600" defaultChecked/>
                                    </label>
                                </div>
                            </div>
                            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2"><Activity size={18}/> Test Output</h4>
                                <pre className="text-xs font-mono text-blue-800 bg-white/50 p-3 rounded border border-blue-200 overflow-x-auto">
{`{
  "status": "Success",
  "transformed": 1,
  "result": {
    "id": "P-102",
    "budget": 50000.00,
    "valid": true
  }
}`}
                                </pre>
                                <Button size="sm" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 border-none text-white">Run Test Record</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};