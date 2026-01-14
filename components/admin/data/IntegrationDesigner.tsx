import React from 'react';
import { NEXUS_SCHEMAS } from '../../../constants/index';
import { GitMerge, ArrowRight, Save, Shuffle, Variable, Clock, Shield, PlayCircle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { useIntegrationDesignerLogic } from '../../../hooks/domain/useIntegrationDesignerLogic';
import { useToast } from '../../../context/ToastContext';
import { MappingTab } from './integration/MappingTab';
import { PreviewPanel } from './integration/PreviewPanel';
import { OrchestrationTab } from './integration/OrchestrationTab';
import { GovernanceTab } from './integration/GovernanceTab';
// Added missing EmptyGrid import
import { EmptyGrid } from '../../common/EmptyGrid';

export const IntegrationDesigner: React.FC = () => {
    const theme = useTheme();
    const { success } = useToast();
    const {
        activeTab, setActiveTab, targetEntity, setTargetEntity, mappings,
        testPayload, setTestPayload, availableTargets, previewOutput,
        orchestration, setOrchestration, governance, setGovernance,
        handleAddMapping, handleRemoveMapping, handleTargetChange,
        handleSourceChange, handleTransformChange, handleSaveConfig
    } = useIntegrationDesignerLogic();

    const onSaveClick = () => {
        handleSaveConfig();
        success("System Logic Updated", "Transformation pipeline committed to the core ingestion engine.");
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-500 bg-white">
            <div className={`p-8 border-b ${theme.colors.border} ${theme.colors.surface} flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm z-10`}>
                <div className="flex items-center gap-5">
                    <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-2xl shadow-slate-900/20 rotate-3 group-hover:rotate-0 transition-transform"><GitMerge size={28} /></div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className={`font-black ${theme.colors.text.primary} text-2xl tracking-tighter uppercase`}>ETL Pipeline Orchestrator</h3>
                            <Badge variant="success" className="font-mono text-[9px] tracking-[0.2em]">VER_2.4_STABLE</Badge>
                        </div>
                        <p className={`text-sm ${theme.colors.text.secondary} mt-1 font-medium`}>Declarative schema mapping and data transformation logic.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                     <Button variant="outline" size="sm" icon={PlayCircle} className="font-bold uppercase tracking-widest text-[10px] h-11 px-6">Dry Run Simulation</Button>
                     <Button icon={Save} onClick={onSaveClick} className="shadow-2xl shadow-nexus-500/20 font-black uppercase tracking-widest text-[10px] h-11 px-8">Commit Configuration</Button>
                </div>
            </div>

            <div className={`px-8 py-5 ${theme.colors.surface} border-b ${theme.colors.border} flex items-center gap-10 overflow-x-auto bg-slate-50/50`}>
                <div className="flex flex-col min-w-[200px]">
                    <label className={`text-[9px] font-black ${theme.colors.text.tertiary} uppercase tracking-[0.2em] mb-2 ml-1`}>Ingestion Source (Artifact)</label>
                    <select className={`${theme.colors.background} border ${theme.colors.border} rounded-xl py-2 px-4 text-sm font-black text-slate-800 outline-none focus:ring-4 focus:ring-nexus-500/10 transition-all cursor-pointer shadow-sm`}>
                        <option>SAP S/4HANA (Global ERP)</option><option>Oracle Primavera P6 (XER)</option><option>AWS S3 Data Lake</option><option>Legacy Flat File (CSV)</option>
                    </select>
                </div>
                <div className="pt-5 text-slate-300"><ArrowRight size={24} /></div>
                <div className="flex flex-col min-w-[200px]">
                    <label className={`text-[9px] font-black ${theme.colors.text.tertiary} uppercase tracking-[0.2em] mb-2 ml-1`}>Nexus Entity Target (Core)</label>
                    <select className={`${theme.colors.background} border ${theme.colors.border} rounded-xl py-2 px-4 text-sm font-black text-slate-800 outline-none focus:ring-4 focus:ring-nexus-500/10 transition-all cursor-pointer shadow-sm`} value={targetEntity} onChange={(e) => setTargetEntity(e.target.value)}>
                        {Object.keys(NEXUS_SCHEMAS).map(k => <option key={k} value={k}>{k} Registry</option>)}
                    </select>
                </div>
                <div className={`h-10 w-px bg-slate-200 mx-2 hidden lg:block`}></div>
                <div className={`flex ${theme.colors.background} p-1 rounded-2xl border ${theme.colors.border} shadow-inner`}>
                    {[ 
                        { id: 'mapping', label: 'Schema Map', icon: Shuffle }, 
                        { id: 'transform', label: 'Transf.', icon: Variable }, 
                        { id: 'orchestration', label: 'Orchestration', icon: Clock }, 
                        { id: 'governance', label: 'Quality Gates', icon: Shield } 
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab.id ? `${theme.colors.surface} text-nexus-700 shadow-md border ${theme.colors.border}` : `${theme.colors.text.tertiary} hover:text-nexus-600`}`}>
                            <tab.icon size={16}/> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`flex-1 overflow-hidden p-10 relative bg-slate-50/30 nexus-empty-pattern`}>
                {activeTab === 'mapping' && (
                    <div className="h-full flex flex-col xl:flex-row gap-10">
                        <MappingTab mappings={mappings} availableTargets={availableTargets} targetEntity={targetEntity} onSourceChange={handleSourceChange} onTransformChange={handleTransformChange} onTargetChange={handleTargetChange} onRemove={handleRemoveMapping} onAdd={handleAddMapping} />
                        <PreviewPanel testPayload={testPayload} setTestPayload={setTestPayload} previewOutput={previewOutput} />
                    </div>
                )}
                {activeTab === 'orchestration' && (
                    <div className="animate-nexus-in"><OrchestrationTab orchestration={orchestration} setOrchestration={setOrchestration} /></div>
                )}
                {activeTab === 'governance' && (
                    <div className="animate-nexus-in"><GovernanceTab governance={governance} setGovernance={setGovernance} /></div>
                )}
                
                {/* Fallback for unbuilt 'transform' tab */}
                {activeTab === 'transform' && (
                    <div className="h-full flex flex-col items-center justify-center">
                         <EmptyGrid title="Logic Engine Initializing" description="Advanced transformation script editor is loading from the extensions registry." icon={Variable} />
                    </div>
                )}
            </div>
        </div>
    );
};