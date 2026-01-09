
import React, { useState, useEffect } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useData } from '../../context/DataContext';
import { ShieldCheck, Activity, Settings, ListTree, Grid, Save, Book } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePermissions } from '../../hooks/usePermissions';
import { Button } from '../ui/Button';
import { PlanOverview } from './planning/PlanOverview';
import { PlanMethodology } from './planning/PlanMethodology';
import { PlanTaxonomy } from './planning/PlanTaxonomy';
import { PlanThresholds } from './planning/PlanThresholds';
import { PlanTemplatePanel } from './planning/PlanTemplatePanel';
import { Badge } from '../ui/Badge';
import { NarrativeField } from '../common/NarrativeField';

const RiskPlanEditor: React.FC = () => {
    const { project, riskPlan } = useProjectWorkspace();
    const { dispatch } = useData();
    const theme = useTheme();
    const { canEditProject } = usePermissions();

    const [formData, setFormData] = useState(riskPlan);
    const [activeTab, setActiveTab] = useState<'overview' | 'methodology' | 'taxonomy' | 'thresholds'>('overview');
    const [isTemplatePanelOpen, setIsTemplatePanelOpen] = useState(false);

    useEffect(() => { if (riskPlan) setFormData(riskPlan); }, [riskPlan]);

    const handleSave = () => {
        if (formData) {
            dispatch({ type: 'PROJECT_UPDATE_RISK_PLAN', payload: { projectId: project.id, plan: formData } });
            alert("Risk Management Plan updated.");
        }
    };

    if (!formData || !project) return <div className="p-8 text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Initializing Plan Context...</div>;
    
    return (
        <div className={`h-full flex flex-col ${theme.colors.background}/30 scrollbar-thin`}>
            <div className={`px-8 py-5 border-b ${theme.colors.border} ${theme.colors.surface} flex justify-between items-center shrink-0`}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 ${theme.colors.background} rounded-xl border ${theme.colors.border}`}><ShieldCheck size={24}/></div>
                    <div>
                        <h1 className="text-xl font-bold">Risk Management Plan</h1>
                        <div className="flex items-center gap-3 mt-1"><Badge variant={formData.status === 'Approved' ? 'success' : 'warning'}>{formData.status}</Badge></div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" icon={Book} onClick={() => setIsTemplatePanelOpen(true)}>Templates</Button>
                    {canEditProject() && <Button icon={Save} onClick={handleSave}>Commit Plan</Button>}
                </div>
            </div>

            <div className={`${theme.colors.surface} border-b ${theme.colors.border} px-8 flex gap-1`}>
                {[ 
                    { id: 'overview', label: 'Overview', icon: Activity }, 
                    { id: 'methodology', label: 'Methodology', icon: Settings }, 
                    { id: 'taxonomy', label: 'RBS', icon: ListTree }, 
                    { id: 'thresholds', label: 'Thresholds', icon: Grid } 
                ].map(tab => (
                    <button 
                        key={tab.id} 
                        onClick={() => setActiveTab(tab.id as any)} 
                        className={`px-6 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${activeTab === tab.id ? `border-nexus-600 text-nexus-700` : `border-transparent text-slate-500 hover:text-slate-800`}`}
                    >
                        <tab.icon size={14}/> {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto bg-white border border-slate-200 shadow-sm rounded-xl p-10 min-h-[600px] space-y-10">
                    {activeTab === 'overview' && (
                        <div className="space-y-10 animate-nexus-in">
                            <NarrativeField 
                                label="Risk Management Objectives"
                                value={formData.objectives}
                                placeholderLabel="Objectives not established for this project."
                                onAdd={() => {}}
                            />
                            <NarrativeField 
                                label="Execution Scope"
                                value={formData.scope}
                                placeholderLabel="Plan scope boundaries undefined."
                                onAdd={() => {}}
                            />
                        </div>
                    )}
                    
                    {activeTab === 'methodology' && (
                        <div className="animate-nexus-in">
                            <NarrativeField 
                                label="Risk Approach & Methodology"
                                value={formData.approach}
                                placeholderLabel="No approach defined. Using standard corporate policy by default."
                                onAdd={() => {}}
                                className="mb-8"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                                <div className="p-4 rounded-xl border bg-slate-50"><h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Frequency</h4><p className="text-sm font-bold">Weekly Review</p></div>
                                <div className="p-4 rounded-xl border bg-slate-50"><h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Analysis</h4><p className="text-sm font-bold">Qualitative & Monte Carlo</p></div>
                                <div className="p-4 rounded-xl border bg-slate-50"><h4 className="text-xs font-bold text-slate-400 uppercase mb-1">Escalation</h4><p className="text-sm font-bold">Score >= 15</p></div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'taxonomy' && <PlanTaxonomy formData={formData} setFormData={setFormData} isReadOnly={!canEditProject()} />}
                    {activeTab === 'thresholds' && <PlanThresholds formData={formData} setFormData={setFormData} isReadOnly={!canEditProject()} />}
                </div>
            </div>
            <PlanTemplatePanel isOpen={isTemplatePanelOpen} onClose={() => setIsTemplatePanelOpen(false)} onApply={() => {}} />
        </div>
    );
};

export default RiskPlanEditor;
