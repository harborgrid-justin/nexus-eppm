
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { 
    GitMerge, ArrowRight, Save, RefreshCw, Layers, 
    Code, Shield, Clock, AlertTriangle, FileCode, Check, Plus,
    Database, Mail, Lock, Activity, Shuffle, 
    Variable, History, Link, X, PlayCircle, Settings
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { NEXUS_SCHEMAS } from '../../../constants/index';
import { EtlMapping } from '../../../types';

// Mock source data simulating an incoming payload from an external ERP
const MOCK_SOURCE_DATA: Record<string, any> = {
    EXTERNAL_ID: "PRJ-9920",
    PROJ_NAME: "  Global Expansion Initiative  ", // Intentionally padded to show trim
    BUDGET_AMT: "1250000.00",
    START_DT: "2024-10-01T00:00:00Z",
    COST_CENTER: "CC-NY-01",
    STATUS_CODE: "A"
};

export const IntegrationDesigner: React.FC = () => {
    const theme = useTheme();
    const { state, dispatch } = useData();
    const [activeTab, setActiveTab] = useState<'mapping' | 'transform' | 'orchestration' | 'governance'>('mapping');
    const [targetEntity, setTargetEntity] = useState('Project');
    
    // Mapping State populated from global store
    const [mappings, setMappings] = useState<EtlMapping[]>([]);

    useEffect(() => {
        if(state.etlMappings && state.etlMappings.length > 0) {
            setMappings(state.etlMappings);
        }
    }, [state.etlMappings]);

    const availableTargets = NEXUS_SCHEMAS[targetEntity] || [];

    const handleAddMapping = () => {
        setMappings([...mappings, { 
            id: Date.now(), 
            source: '', 
            target: availableTargets[0] || '', 
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

    const handleSourceChange = (id: number, newSource: string) => {
        setMappings(mappings.map(m => m.id === id ? { ...m, source: newSource } : m));
    };

    const handleTransformChange = (id: number, newTransform: string) => {
        setMappings(mappings.map(m => m.id === id ? { ...m, transform: newTransform } : m));
    };

    const handleSaveConfig = () => {
        dispatch({ type: 'SYSTEM_SAVE_ETL_MAPPINGS', payload: mappings });
        alert("ETL Configuration Saved to System Core.");
    };

    // --- Dynamic Preview Generation ---
    const previewOutput = useMemo(() => {
        const result: Record<string, any> = {};
        
        mappings.forEach(m => {
            if (!m.target) return;
            
            let val = MOCK_SOURCE_DATA[m.source] || null;

            // Apply simulated transformations
            if (val !== null) {
                if (m.transform === 'Trim Whitespace' && typeof val === 'string') {
                    val = val.trim();
                } else if (m.transform === 'Currency(USD)' || m.transform === 'Number') {
                    val = parseFloat(val);
                } else if (m.transform === 'Date(ISO8601)') {
                    val = new Date(val).toISOString().split('T')[0];
                } else if (m.transform === 'Uppercase') {
                    val = String(val).toUpperCase();
                }
            }

            // Nested object simulation (e.g., metrics.budget)
            if (m.target.includes('.')) {
                const parts = m.target.split('.');
                if (!result[parts[0]]) result[parts[0]] = {};
                result[parts[0]][parts[1]] = val;
            } else {
                result[m.target] = val;
            }
        });

        return {
            source_id: MOCK_SOURCE_DATA.EXTERNAL_ID,
            timestamp: new Date().toISOString(),
            status: "Transformed",
            entity: targetEntity,
            data: result
        };
    }, [mappings, targetEntity]);

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
                     <Button icon={Save} onClick={handleSaveConfig}>Save Config</Button>
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
                    <div className="h-full flex flex-col md:flex-row gap-6">
                        <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-[1fr_120px_1fr_50px] gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                                <div className="pl-4">Source Field (External)</div>
                                <div className="text-center">Transform</div>
                                <div>Target Field (Nexus {targetEntity})</div>
                                <div className="text-center">Action</div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                {mappings.map((map) => (
                                    <div key={map.id} className="grid grid-cols-[1fr_120px_1fr_50px] gap-4 items-center p-3 rounded-lg border border-slate-100 hover:border-nexus-300 hover:shadow-md transition-all group bg-white">
                                        {/* Source */}
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-slate-100 rounded text-slate-500"><Database size={14}/></div>
                                            <input 
                                                className="w-full bg-transparent font-mono text-sm text-slate-700 font-bold outline-none border-b border-transparent focus:border-nexus-500"
                                                value={map.source}
                                                onChange={(e) => handleSourceChange(map.id, e.target.value)}
                                                placeholder="SOURCE_COLUMN"
                                            />
                                        </div>

                                        {/* Transform */}
                                        <div className="flex justify-center relative">
                                            <select 
                                                className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-1 rounded border border-purple-100 uppercase tracking-tight shadow-sm z-10 whitespace-nowrap outline-none cursor-pointer"
                                                value={map.transform}
                                                onChange={(e) => handleTransformChange(map.id, e.target.value)}
                                            >
                                                <option>Direct</option>
                                                <option>Trim Whitespace</option>
                                                <option>Currency(USD)</option>
                                                <option>Date(ISO8601)</option>
                                                <option>Uppercase</option>
                                            </select>
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

                        {/* Live Preview Panel */}
                        <div className="w-96 bg-slate-900 rounded-xl border border-slate-800 flex flex-col shadow-xl">
                            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                                <h4 className="text-white font-bold flex items-center gap-2"><Activity size={16} className="text-green-500"/> Live Preview</h4>
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700 font-mono">JSON Output</span>
                            </div>
                            <div className="flex-1 p-4 overflow-auto font-mono text-xs">
                                <div className="mb-4">
                                    <p className="text-slate-500 mb-2 uppercase font-bold text-[10px] tracking-widest">Input (Source)</p>
                                    <pre className="text-blue-400 opacity-70">
                                        {JSON.stringify(MOCK_SOURCE_DATA, null, 2)}
                                    </pre>
                                </div>
                                <div className="border-t border-slate-800 pt-4">
                                    <p className="text-slate-500 mb-2 uppercase font-bold text-[10px] tracking-widest">Output (Mapped)</p>
                                    <pre className="text-green-400">
                                        {JSON.stringify(previewOutput, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'transform' && (
                    <div className="h-full flex items-center justify-center text-slate-400">
                         <div className="text-center">
                             <Code size={48} className="mx-auto mb-4 opacity-20"/>
                             <p>Advanced Scripting Mode Available in Enterprise Plan</p>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};
