
import React, { useState, useMemo } from 'react';
import { 
    GitMerge, ArrowRight, Save, RefreshCw, Layers, 
    Code, Shield, Clock, AlertTriangle, FileCode, Check, Plus,
    Database, Mail, Lock, Activity, Shuffle, 
    Variable, History
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

export const IntegrationDesigner: React.FC = () => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = useState<'mapping' | 'transform' | 'orchestration' | 'resilience' | 'scripting' | 'governance'>('mapping');
    const [isSimulating, setIsSimulating] = useState(false);
    
    // Feature: Visual Field Mapping State
    const [mappings, setMappings] = useState([
        { id: 1, source: 'PROJ_ID', target: 'project_code', transform: 'Direct', required: true, type: 'String' },
        { id: 2, source: 'WBS_CODE', target: 'wbs_hierarchy', transform: 'Format: #.#.#', required: true, type: 'String' },
        { id: 3, source: 'BL_START_DATE', target: 'baseline_start', transform: 'Date(ISO8601)', required: false, type: 'Date' },
        { id: '4', source: 'STATUS_CODE', target: 'status', transform: 'Lookup: P6_Status_Map', required: true, type: 'Enum' },
        { id: '5', source: 'COST_ACTUAL', target: 'actual_cost', transform: 'Currency(USD)', required: false, type: 'Decimal' },
    ]);

    // Feature: Configuration State
    const [config, setConfig] = useState({
        scheduleType: 'cron',
        targetEntity: 'Project', // Added target entity selector
        cronExpression: '0 0 * * *', // Daily midnight
        webhookUrl: 'https://api.nexus-ppm.com/hooks/v1/p6-sync',
        dependency: 'None',
        errorThreshold: 5, // %
        autoRollback: true,
        dryRun: false,
        deltaLoad: true,
        batchSize: 200,
        rateLimit: 500, // req/min
        compression: true,
        encoding: 'UTF-8',
        notifyEmail: true,
        notifySlack: false,
        approvalRequired: true,
        preScript: '// Pre-processing hook\nfunction beforeProcess(batch) {\n  return batch.filter(r => r.active);\n}',
        postScript: '// Post-processing hook\nfunction afterProcess(results) {\n  console.log("Sync complete", results.stats);\n}'
    });

    const handleSimulate = () => {
        setIsSimulating(true);
        setTimeout(() => setIsSimulating(false), 2000);
    };

    const SYSTEM_ENTITIES = [
        'Project', 'Task', 'Resource', 'WBS', 'Baseline', 'Budget', 'CostEstimate', 
        'Expense', 'Funding', 'ChangeOrder', 'PurchaseOrder', 'Risk', 'Issue', 
        'Program', 'StrategicGoal', 'Vendor', 'Contract', 'RFI', 'Submittal', 
        'DailyLog', 'SafetyIncident', 'SystemAlert', 'AuditLog', 'ResourceRequest',
        'Timesheet', 'Invoice', 'PaymentApplication', 'CommunicationLog', 'Document',
        'QualityReport', 'NonConformance', 'Requirement', 'LessonLearned', 'Stakeholder',
        'PortfolioScenario', 'GovernanceDecision', 'ProgramRisk', 'ProgramIssue',
        'ActivityCode', 'UserDefinedField', 'Calendar', 'Location'
    ].sort();

    return (
        <div className="h-full flex flex-col">
            {/* Header / Actions */}
            <div className={`${theme.colors.surface} p-4 border-b ${theme.colors.border} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4`}>
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-100 text-purple-700 rounded-lg shrink-0">
                        <GitMerge size={24} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="font-bold text-slate-800 text-lg">P6 to Nexus Sync (v2.4)</h3>
                            <Badge variant="success">Active</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1"><FileCode size={12}/> XML Source</span>
                            <ArrowRight size={12}/>
                            <span className="flex items-center gap-1"><Layers size={12}/> {config.targetEntity} API</span>
                            <span className="text-slate-300 hidden sm:inline">|</span>
                            <span className="flex items-center gap-1"><History size={12}/> Last Run: 2h ago</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" icon={RefreshCw} onClick={handleSimulate} isLoading={isSimulating} className="flex-1 sm:flex-none">
                        {isSimulating ? 'Simulating...' : 'Dry Run'}
                    </Button>
                    <Button size="sm" icon={Save} className="flex-1 sm:flex-none">Save & Deploy</Button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className={`${theme.colors.background} border-b ${theme.colors.border} px-4 flex gap-1 overflow-x-auto scrollbar-hide`}>
                {[
                    { id: 'mapping', label: 'Field Map', icon: Shuffle },
                    { id: 'transform', label: 'Transform', icon: Variable },
                    { id: 'orchestration', label: 'Orchestrate', icon: Clock },
                    { id: 'resilience', label: 'Resilience', icon: Shield },
                    { id: 'scripting', label: 'Script Hooks', icon: Code },
                    { id: 'governance', label: 'Governance', icon: Lock }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === tab.id 
                            ? `border-nexus-600 text-nexus-700 ${theme.colors.surface}` 
                            : `border-transparent ${theme.colors.text.secondary} hover:${theme.colors.text.primary} hover:bg-slate-100`
                        }`}
                    >
                        <tab.icon size={14}/> {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className={`flex-1 overflow-y-auto p-4 md:p-6 ${theme.colors.background}/50`}>
                <div className="max-w-6xl mx-auto">
                    
                    {/* --- MAPPING TAB --- */}
                    {activeTab === 'mapping' && (
                        <div className="space-y-4">
                             <div className={`${theme.colors.semantic.info.bg} ${theme.colors.semantic.info.border} border p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                                 <div>
                                     <label className={`text-xs font-bold ${theme.colors.semantic.info.text} uppercase tracking-widest block mb-1`}>Target System Object</label>
                                     <p className={`text-xs ${theme.colors.semantic.info.text}`}>Select the Nexus entity this pipeline will populate.</p>
                                 </div>
                                 <select 
                                     className={`w-full sm:w-auto p-2 border ${theme.colors.semantic.info.border} rounded-lg text-sm ${theme.colors.surface} font-bold ${theme.colors.text.primary} min-w-[200px]`}
                                     value={config.targetEntity}
                                     onChange={(e) => setConfig(prev => ({...prev, targetEntity: e.target.value}))} // Rule 5: Functional update
                                 >
                                     {SYSTEM_ENTITIES.map(e => <option key={e} value={e}>{e}</option>)}
                                 </select>
                             </div>
                             {/* ... Mappings List ... */}
                             <div className={`${theme.components.card} overflow-hidden`}>
                                <div className="overflow-x-auto">
                                    <div className="min-w-[800px]">
                                        <div className={`p-4 border-b ${theme.colors.border} ${theme.colors.background} flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest`}>
                                            <span className="w-1/3">Source Schema</span>
                                            <span className="w-1/3 text-center">Transformation Logic</span>
                                            <span className="w-1/3 text-right">Target Schema ({config.targetEntity})</span>
                                        </div>
                                        <div className="divide-y divide-slate-100">
                                            {mappings.map((map) => (
                                                <div key={map.id} className={`flex items-center p-4 hover:${theme.colors.background} group transition-colors`}>
                                                    <div className="w-1/3 flex items-center gap-3">
                                                        <div className={`p-1.5 ${theme.colors.background} rounded text-slate-500`}><Database size={14}/></div>
                                                        <div>
                                                            <p className="font-mono text-sm font-bold text-slate-700">{map.source}</p>
                                                            <p className="text-[10px] text-slate-400">{map.type} {map.required ? '(Required)' : '(Optional)'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="w-1/3 flex justify-center">
                                                        <div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-xs font-medium border border-purple-100 cursor-pointer hover:bg-purple-100">
                                                            <Shuffle size={12}/> {map.transform}
                                                        </div>
                                                    </div>
                                                    <div className="w-1/3 flex items-center justify-end gap-3">
                                                        <div className="text-right">
                                                            <p className="font-mono text-sm font-bold text-nexus-700">{map.target}</p>
                                                            <p className="text-[10px] text-slate-400">Mapped</p>
                                                        </div>
                                                        <div className="p-1.5 bg-nexus-50 rounded text-nexus-600"><Check size={14}/></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className={`p-4 border-t ${theme.colors.border} ${theme.colors.background}`}>
                                    <button className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 font-bold text-sm hover:border-nexus-400 hover:text-nexus-600 transition-all flex items-center justify-center gap-2">
                                        <Plus size={16}/> Map New Field
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* ... Other Tabs ... */}
                    {activeTab === 'transform' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`${theme.components.card} p-6 space-y-6`}>
                                <h4 className="font-bold text-slate-800 flex items-center gap-2"><Variable size={18}/> Value Translation</h4>
                                <div className="space-y-4">
                                    <div className={`flex justify-between items-center p-3 border ${theme.colors.border} rounded-lg`}>
                                        <span className="text-sm font-medium">Status Codes</span>
                                        <button className="text-xs text-blue-600 font-bold hover:underline">Edit Lookup Table</button>
                                    </div>
                                    <div className={`flex justify-between items-center p-3 border ${theme.colors.border} rounded-lg`}>
                                        <span className="text-sm font-medium">Cost Codes</span>
                                        <button className="text-xs text-blue-600 font-bold hover:underline">Edit Lookup Table</button>
                                    </div>
                                </div>
                            </div>
                            <div className={`${theme.components.card} p-6 space-y-6`}>
                                <h4 className="font-bold text-slate-800 flex items-center gap-2"><Shield size={18}/> Data Sanitization</h4>
                                <div className="space-y-3">
                                    <label className="flex items-center justify-between text-sm text-slate-700">
                                        <span>Mask PII (Email, Phone)</span>
                                        <input type="checkbox" className="w-10 h-5 rounded-full appearance-none bg-slate-200 checked:bg-nexus-600 relative cursor-pointer transition-all" checked readOnly/>
                                    </label>
                                    <label className="flex items-center justify-between text-sm text-slate-700">
                                        <span>Normalize Currency (to USD)</span>
                                        <input type="checkbox" className="w-10 h-5 rounded-full appearance-none bg-slate-200 checked:bg-nexus-600 relative cursor-pointer transition-all" checked readOnly/>
                                    </label>
                                    <label className="flex items-center justify-between text-sm text-slate-700">
                                        <span>Standardize Dates (ISO 8601)</span>
                                        <input type="checkbox" className="w-10 h-5 rounded-full appearance-none bg-slate-200 checked:bg-nexus-600 relative cursor-pointer transition-all" checked readOnly/>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orchestration' && (
                        <div className="space-y-6">
                            <div className={`${theme.components.card} p-6`}>
                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={18}/> Scheduling & Triggers</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Trigger Type</label>
                                        <select 
                                            className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface}`}
                                            value={config.scheduleType}
                                            onChange={e => setConfig(prev => ({...prev, scheduleType: e.target.value}))}
                                        >
                                            <option value="manual">Manual Only</option>
                                            <option value="cron">Scheduled (CRON)</option>
                                            <option value="webhook">Event Driven (Webhook)</option>
                                        </select>
                                    </div>
                                    {config.scheduleType === 'cron' && (
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">CRON Expression</label>
                                            <input 
                                                className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm font-mono`}
                                                value={config.cronExpression}
                                                onChange={e => setConfig(prev => ({...prev, cronExpression: e.target.value}))}
                                            />
                                            <p className="text-[10px] text-slate-400 mt-1">Next Run: Tomorrow at 00:00 UTC</p>
                                        </div>
                                    )}
                                    {config.scheduleType === 'webhook' && (
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Webhook Endpoint</label>
                                            <div className="flex gap-2">
                                                <input 
                                                    className={`flex-1 p-2 border ${theme.colors.border} rounded-lg text-sm font-mono ${theme.colors.background}`}
                                                    value={config.webhookUrl}
                                                    readOnly
                                                />
                                                <Button size="sm" variant="secondary">Copy</Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className={`${theme.components.card} p-6`}>
                                <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Layers size={18}/> Dependency Chaining</h4>
                                <div className={`flex flex-col sm:flex-row items-center gap-4 p-4 ${theme.colors.background} rounded-lg border ${theme.colors.border}`}>
                                    <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Run this job AFTER:</span>
                                    <select 
                                        className={`flex-1 w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface}`}
                                        value={config.dependency}
                                        onChange={e => setConfig(prev => ({...prev, dependency: e.target.value}))}
                                    >
                                        <option value="None">-- No Dependency --</option>
                                        <option value="ERP_SYNC">ERP Master Data Sync</option>
                                        <option value="HR_SYNC">HR Resource Update</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'resilience' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className={`${theme.components.card} p-6 space-y-6`}>
                                <h4 className="font-bold text-slate-800 flex items-center gap-2"><AlertTriangle size={18}/> Error Handling</h4>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Failure Threshold (%)</label>
                                    <input 
                                        type="number" 
                                        className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm`}
                                        value={config.errorThreshold}
                                        onChange={e => setConfig(prev => ({...prev, errorThreshold: parseInt(e.target.value)}))}
                                    />
                                    <p className="text-xs text-slate-400 mt-1">Job aborts if error rate exceeds this value.</p>
                                </div>
                                <label className={`flex items-center justify-between p-3 rounded-lg border ${theme.colors.background} ${theme.colors.border}`}>
                                    <span className="text-sm font-bold text-slate-700">Automatic Rollback on Failure</span>
                                    <input 
                                        type="checkbox" 
                                        checked={config.autoRollback} 
                                        onChange={() => setConfig(prev => ({...prev, autoRollback: !prev.autoRollback}))} 
                                        className="w-10 h-5 rounded-full appearance-none bg-slate-200 checked:bg-nexus-600 relative cursor-pointer transition-all before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-5 shadow-inner" 
                                    />
                                </label>
                            </div>

                            <div className={`${theme.components.card} p-6 space-y-6`}>
                                <h4 className="font-bold text-slate-800 flex items-center gap-2"><Activity size={18}/> Performance Tuning</h4>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Batch Size (Records)</label>
                                    <input type="number" className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm`} value={config.batchSize} onChange={e => setConfig(prev => ({...prev, batchSize: parseInt(e.target.value)}))}/>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">API Rate Limit (Req/Min)</label>
                                    <input type="number" className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm`} value={config.rateLimit} onChange={e => setConfig(prev => ({...prev, rateLimit: parseInt(e.target.value)}))}/>
                                </div>
                                <label className="flex items-center gap-2 text-sm text-slate-700">
                                    <input type="checkbox" checked={config.deltaLoad} onChange={() => setConfig(prev => ({...prev, deltaLoad: !prev.deltaLoad}))} className="rounded text-nexus-600"/>
                                    Enable Delta Load (Incremental)
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'scripting' && (
                        <div className="space-y-6">
                            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                                <div className="p-3 bg-slate-700 border-b border-slate-600 flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Code size={14}/> Pre-Processing Hook (JS)</span>
                                    <span className="text-[10px] text-slate-500">Node.js 18.x Context</span>
                                </div>
                                <textarea 
                                    className="w-full h-40 bg-slate-800 text-green-400 font-mono text-sm p-4 outline-none resize-none"
                                    value={config.preScript}
                                    onChange={e => setConfig(prev => ({...prev, preScript: e.target.value}))}
                                />
                            </div>
                            <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                                <div className="p-3 bg-slate-700 border-b border-slate-600 flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Code size={14}/> Post-Processing Hook (JS)</span>
                                    <span className="text-[10px] text-slate-500">Node.js 18.x Context</span>
                                </div>
                                <textarea 
                                    className="w-full h-40 bg-slate-800 text-blue-400 font-mono text-sm p-4 outline-none resize-none"
                                    value={config.postScript}
                                    onChange={e => setConfig(prev => ({...prev, postScript: e.target.value}))}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'governance' && (
                        <div className={`${theme.components.card} p-6 space-y-6`}>
                             <h4 className="font-bold text-slate-800 flex items-center gap-2"><Lock size={18}/> Access & Approval</h4>
                             <div className="space-y-3">
                                 <label className={`flex items-center justify-between p-3 border ${theme.colors.border} rounded-lg`}>
                                     <span className="text-sm font-medium">Require Approval for Full Loads</span>
                                     <input type="checkbox" checked={config.approvalRequired} onChange={() => setConfig(prev => ({...prev, approvalRequired: !prev.approvalRequired}))} className="rounded text-nexus-600"/>
                                 </label>
                                 <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t ${theme.colors.border.replace('border-','border-t-')}`}>
                                     <div>
                                         <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Owner / Steward</label>
                                         <input className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm`} defaultValue="IT Operations" />
                                     </div>
                                     <div>
                                         <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Access Control List (ACL)</label>
                                         <select className={`w-full p-2 border ${theme.colors.border} rounded-lg text-sm ${theme.colors.surface}`}>
                                             <option>Admin Only</option>
                                             <option>Integration Team</option>
                                             <option>Public</option>
                                         </select>
                                     </div>
                                 </div>
                             </div>

                             <h4 className={`font-bold text-slate-800 flex items-center gap-2 pt-4 border-t ${theme.colors.border.replace('border-','border-t-')}`}><Mail size={18}/> Notifications</h4>
                             <div className="flex flex-col sm:flex-row gap-6">
                                 <label className="flex items-center gap-2 text-sm text-slate-700">
                                     <input type="checkbox" checked={config.notifyEmail} onChange={() => setConfig(prev => ({...prev, notifyEmail: !prev.notifyEmail}))} className="rounded text-nexus-600"/>
                                     Email Alerts
                                 </label>
                                 <label className="flex items-center gap-2 text-sm text-slate-700">
                                     <input type="checkbox" checked={config.notifySlack} onChange={() => setConfig(prev => ({...prev, notifySlack: !prev.notifySlack}))} className="rounded text-nexus-600"/>
                                     Slack / Teams Webhook
                                 </label>
                             </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
