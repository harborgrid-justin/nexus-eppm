
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
        success("Configuration Saved", "ETL Pipeline and Schema Map committed to system core.");
    };

    return (
        <div className="h-full flex flex-col">
            <div className={`p-6 border-b ${theme.colors.border} ${theme.colors.surface} flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-200"><GitMerge size={24} /></div>
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
                     <Button icon={Save} onClick={onSaveClick}>Save Config</Button>
                </div>
            </div>

            <div className={`px-6 py-4 ${theme.colors.surface} border-b ${theme.colors.border} flex items-center gap-6 overflow-x-auto`}>
                <div className="flex flex-col">
                    <label className={`text-[10px] font-bold ${theme.colors.text.tertiary} uppercase tracking-widest mb-1`}>Source Connector</label>
                    <select className={`${theme.colors.background} border ${theme.colors.border} rounded-lg py-1.5 px-3 text-sm font-bold ${theme.colors.text.primary} outline-none focus:ring-2 focus:ring-purple-500`}>
                        <option>SAP S/4HANA (ERP)</option><option>Oracle P6 (Schedule)</option><option>Salesforce (CRM)</option><option>Flat File (CSV)</option>
                    </select>
                </div>
                <ArrowRight className={theme.colors.text.tertiary} />
                <div className="flex flex-col">
                    <label className={`text-[10px] font-bold ${theme.colors.text.tertiary} uppercase tracking-widest mb-1`}>Target Module</label>
                    <select className={`${theme.colors.background} border ${theme.colors.border} rounded-lg py-1.5 px-3 text-sm font-bold ${theme.colors.text.primary} outline-none focus:ring-2 focus:ring-nexus-500`} value={targetEntity} onChange={(e) => setTargetEntity(e.target.value)}>
                        {Object.keys(NEXUS_SCHEMAS).map(k => <option key={k} value={k}>{k}</option>)}
                    </select>
                </div>
                <div className={`h-8 w-px ${theme.colors.border} mx-2`}></div>
                <div className={`flex ${theme.colors.background} p-1 rounded-lg border ${theme.colors.border}`}>
                    {[ { id: 'mapping', label: 'Schema Map', icon: Shuffle }, { id: 'transform', label: 'Transformation', icon: Variable }, { id: 'orchestration', label: 'Schedule', icon: Clock }, { id: 'governance', label: 'Controls', icon: Shield } ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === tab.id ? `${theme.colors.surface} text-nexus-700 shadow-sm` : `${theme.colors.text.tertiary} hover:${theme.colors.text.primary}`}`}>
                            <tab.icon size={14}/> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className={`flex-1 overflow-hidden p-6 relative ${theme.colors.background}/50`}>
                {activeTab === 'mapping' && (
                    <div className="h-full flex flex-col md:flex-row gap-6">
                        <MappingTab mappings={mappings} availableTargets={availableTargets} targetEntity={targetEntity} onSourceChange={handleSourceChange} onTransformChange={handleTransformChange} onTargetChange={handleTargetChange} onRemove={handleRemoveMapping} onAdd={handleAddMapping} />
                        <PreviewPanel testPayload={testPayload} setTestPayload={setTestPayload} previewOutput={previewOutput} />
                    </div>
                )}
                {activeTab === 'orchestration' && <OrchestrationTab orchestration={orchestration} setOrchestration={setOrchestration} />}
                {activeTab === 'governance' && <GovernanceTab governance={governance} setGovernance={setGovernance} />}
                {activeTab === 'transform' && (
                    <div className={`h-full flex items-center justify-center ${theme.colors.text.tertiary}`}>
                         <div className="text-center"><Variable size={48} className="mx-auto mb-4 opacity-20"/><p>Advanced Scripting Mode Available in Enterprise Plan</p></div>
                    </div>
                )}
            </div>
        </div>
    );
};
