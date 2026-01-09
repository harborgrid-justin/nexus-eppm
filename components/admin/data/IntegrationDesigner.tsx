
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../../context/DataContext';
import { NEXUS_SCHEMAS } from '../../../constants/index';
import { EtlMapping } from '../../../types';
import { 
    GitMerge, ArrowRight, Save, Clock, Shield, Plus,
    Database, Shuffle, Variable, X, PlayCircle, Layers,
    Calendar, RefreshCw, AlertTriangle, UserCheck
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Input } from '../../ui/Input';
import { useIntegrationDesignerLogic } from '../../../hooks/domain/useIntegrationDesignerLogic';

export const IntegrationDesigner: React.FC = () => {
    const theme = useTheme();
    const {
        activeTab,
        setActiveTab,
        targetEntity,
        setTargetEntity,
        mappings,
        testPayload,
        setTestPayload,
        availableTargets,
        previewOutput,
        orchestration,
        setOrchestration,
        governance,
        setGovernance,
        handleAddMapping,
        handleRemoveMapping,
        handleTargetChange,
        handleSourceChange,
        handleTransformChange,
        handleSaveConfig
    } = useIntegrationDesignerLogic();

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className={`p-6 border-b ${theme.colors.border} ${theme.colors.surface} flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-200">
                        <GitMerge size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className={`font-bold ${theme.colors.text.primary} text-xl`}>ETL Pipeline Designer</h3>
                            <Badge variant="success">v2.4 Active</Badge>
                        </div>
                        <p className={`text-sm ${theme.colors.text.secondary} mt-1`}>Orchestrate data flow from External Sources to Nexus Core Modules.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                     <Button variant="outline" icon={PlayCircle}>Test Pipeline</Button>
                     <Button icon={Save} onClick={handleSaveConfig}>Save Config</Button>
                </div>
            </div>

            {/* Config Bar */}
            <div className={`px-6 py-4 ${theme.colors.surface} border-b ${theme.colors.border} flex items-center gap-6 overflow-x-auto`}>
                <div className="flex flex-col">
                    <label className={`text-[10px] font-bold ${theme.colors.text.tertiary} uppercase tracking-widest mb-1`}>Source Connector</label>
                    <select className={`${theme.colors.background} border ${theme.colors.border} rounded-lg py-1.5 px-3 text-sm font-bold ${theme.colors.text.primary} outline-none focus:ring-2 focus:ring-purple-500`}>
                        <option>SAP S/4HANA (ERP)</option>
                        <option>Oracle P6 (Schedule)</option>
                        <option>Salesforce (CRM)</option>
                        <option>Flat File (CSV)</option>
                    </select>
                </div>
                <ArrowRight className={theme.colors.text.tertiary} />
                <div className="flex flex-col">
                    <label className={`text-[10px] font-bold ${theme.colors.text.tertiary} uppercase tracking-widest mb-1`}>Target Module</label>
                    <select 
                        className={`${theme.colors.background} border ${theme.colors.border} rounded-lg py-1.5 px-3 text-sm font-bold ${theme.colors.text.primary} outline-none focus:ring-2 focus:ring-nexus-500`}
                        value={targetEntity}
                        onChange={(e) => setTargetEntity(e.target.value)}
                    >
                        {Object.keys(NEXUS_SCHEMAS).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                </div>
                <div className={`h-8 w-px ${theme.colors.border} mx-2`}></div>
                
                {/* Tabs */}
                <div className={`flex ${theme.colors.background} p-1 rounded-lg border ${theme.colors.border}`}>
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
                                ? `${theme.colors.surface} text-nexus-700 shadow-sm` 
                                : `${theme.colors.text.tertiary} hover:${theme.colors.text.primary}`
                            }`}
                        >
                            <tab.icon size={14}/> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className={`flex-1 overflow-hidden p-6 relative ${theme.colors.background}/50`}>
                {activeTab === 'mapping' && (
                    <div className="h-full flex flex-col md:flex-row gap-6">
                        <div className={`flex-1 flex flex-col ${theme.colors.surface} border ${theme.colors.border} rounded-xl shadow-sm overflow-hidden`}>
                            <div className={`p-4 ${theme.colors.background} border-b ${theme.colors.border} grid grid-cols-[1fr_120px_1fr_50px] gap-4 text-xs font-bold ${theme.colors.text.secondary} uppercase tracking-widest`}>
                                <div className="pl-4">Source Field (External)</div>
                                <div className="text-center">Transform</div>
                                <div>Target Field (Nexus {targetEntity})</div>
                                <div className="text-center">Action</div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                {mappings.map((map) => (
                                    <div key={map.id} className={`grid grid-cols-[1fr_120px_1fr_50px] gap-4 items-center p-3 rounded-lg border border-transparent hover:${theme.colors.border} hover:shadow-md transition-all group ${theme.colors.surface}`}>
                                        {/* Source */}
                                        <div className="flex items-center gap-3">
                                            <div className={`p-1.5 ${theme.colors.background} rounded ${theme.colors.text.tertiary}`}><Database size={14}/></div>
                                            <input 
                                                className={`w-full bg-transparent font-mono text-sm ${theme.colors.text.primary} font-bold outline-none border-b border-transparent focus:border-nexus-500`}
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
                                    className={`w-full py-3 border-2 border-dashed ${theme.colors.border} rounded-lg ${theme.colors.text.tertiary} font-bold text-sm hover:border-nexus-400 hover:text-nexus-600 hover:${theme.colors.surface} transition-all flex items-center justify-center gap-2`}
                                >
                                    <Plus size={16}/> Add Field Map
                                </button>
                            </div>
                        </div>

                        {/* Live Preview Panel */}
                        <div className="w-96 bg-slate-900 rounded-xl border border-slate-800 flex flex-col shadow-xl">
                            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                                <h4 className="text-white font-bold flex items-center gap-2"><Clock size={16} className="text-green-500"/> Live Preview</h4>
                                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700 font-mono">JSON Output</span>
                            </div>
                            <div className="flex-1 p-4 overflow-auto font-mono text-xs">
                                <div className="mb-4">
                                    <p className="text-slate-500 mb-2 uppercase font-bold text-[10px] tracking-widest">Input (Source)</p>
                                    <textarea 
                                        className="w-full h-32 bg-slate-950 border border-slate-700 rounded p-2 text-blue-400 outline-none resize-none"
                                        value={testPayload}
                                        onChange={(e) => setTestPayload(e.target.value)}
                                    />
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

                {activeTab === 'orchestration' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-xl p-6 shadow-sm`}>
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={18} className="text-nexus-600"/> Scheduling & Triggers</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Trigger Type</label>
                                    <div className="flex gap-2">
                                        {['Scheduled', 'Event-Based', 'Manual'].map(t => (
                                            <button 
                                                key={t}
                                                onClick={() => setOrchestration({...orchestration, triggerType: t})}
                                                className={`flex-1 py-2 text-sm rounded border ${orchestration.triggerType === t ? 'bg-nexus-50 border-nexus-200 text-nexus-700 font-bold' : 'border-slate-200 text-slate-600'}`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                {orchestration.triggerType === 'Scheduled' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
                                            <select 
                                                className="w-full p-2 border border-slate-300 rounded text-sm"
                                                value={orchestration.frequency}
                                                onChange={e => setOrchestration({...orchestration, frequency: e.target.value})}
                                            >
                                                <option>Hourly</option>
                                                <option>Daily</option>
                                                <option>Weekly</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">CRON Expression</label>
                                            <Input 
                                                value={orchestration.cronExpression} 
                                                onChange={e => setOrchestration({...orchestration, cronExpression: e.target.value})} 
                                                className="font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-xl p-6 shadow-sm`}>
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><RefreshCw size={18} className="text-orange-500"/> Retry Policy</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Max Attempts</label>
                                    <Input 
                                        type="number" 
                                        value={orchestration.retryAttempts} 
                                        onChange={e => setOrchestration({...orchestration, retryAttempts: parseInt(e.target.value)})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Backoff (Seconds)</label>
                                    <Input 
                                        type="number" 
                                        value={orchestration.backoffInterval} 
                                        onChange={e => setOrchestration({...orchestration, backoffInterval: parseInt(e.target.value)})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'governance' && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-xl p-6 shadow-sm`}>
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Shield size={18} className="text-green-600"/> Data Quality Gates</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Validation Mode</label>
                                    <select 
                                        className="w-full p-2 border border-slate-300 rounded text-sm"
                                        value={governance.validationMode}
                                        onChange={e => setGovernance({...governance, validationMode: e.target.value})}
                                    >
                                        <option value="Strict">Strict (Fail Batch on Any Error)</option>
                                        <option value="Permissive">Permissive (Skip Errors & Log)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Error Threshold (%)</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="range" min="0" max="20" 
                                            value={governance.errorThreshold} 
                                            onChange={e => setGovernance({...governance, errorThreshold: parseInt(e.target.value)})}
                                            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-nexus-600"
                                        />
                                        <span className="w-12 text-right font-bold text-sm">{governance.errorThreshold}%</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Job aborts if error rate exceeds this value.</p>
                                </div>
                            </div>
                        </div>

                        <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-xl p-6 shadow-sm`}>
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><UserCheck size={18} className="text-blue-600"/> Stewardship & Alerting</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Data Steward</label>
                                    <Input value={governance.dataSteward} onChange={e => setGovernance({...governance, dataSteward: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Failure Notification</label>
                                    <Input value={governance.notifyEmails} onChange={e => setGovernance({...governance, notifyEmails: e.target.value})} placeholder="email@company.com" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'transform' && (
                    <div className={`h-full flex items-center justify-center ${theme.colors.text.tertiary}`}>
                         <div className="text-center">
                             <Variable size={48} className="mx-auto mb-4 opacity-20"/>
                             <p>Advanced Scripting Mode Available in Enterprise Plan</p>
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};
