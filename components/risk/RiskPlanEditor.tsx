
import React, { useState, useEffect } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useData } from '../../context/DataContext';
import { FileText, Save, Book, Lock, ShieldCheck, Activity, Settings, ListTree, Grid } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePermissions } from '../../hooks/usePermissions';
import { Button } from '../ui/Button';
import { PlanOverview } from './planning/PlanOverview';
import { PlanMethodology } from './planning/PlanMethodology';
import { PlanTaxonomy } from './planning/PlanTaxonomy';
import { PlanThresholds } from './planning/PlanThresholds';
import { PlanTemplatePanel } from './planning/PlanTemplatePanel';
import { Badge } from '../ui/Badge';

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

    if (!formData || !project) return <div className="p-8 text-slate-400">Initializing Plan Context...</div>;
    
    const renderContent = () => {
        const props = { formData, setFormData, isReadOnly: !canEditProject() };
        switch(activeTab) {
            case 'overview': return <PlanOverview {...props} project={project} />;
            case 'methodology': return <PlanMethodology {...props} />;
            case 'taxonomy': return <PlanTaxonomy {...props} />;
            case 'thresholds': return <PlanThresholds {...props} />;
            default: return null;
        }
    }

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
                {[ { id: 'overview', label: 'Overview', icon: Activity }, { id: 'methodology', label: 'Methodology', icon: Settings }, { id: 'taxonomy', label: 'RBS', icon: ListTree }, { id: 'thresholds', label: 'Thresholds', icon: Grid } ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-6 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${activeTab === tab.id ? `border-nexus-600 text-nexus-700` : `border-transparent text-slate-500 hover:text-slate-800`}`}>
                        <tab.icon size={14}/> {tab.label}
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-5xl mx-auto bg-white border border-slate-200 shadow-sm rounded-xl p-10 min-h-[600px]">
                    {renderContent()}
                </div>
            </div>
            <PlanTemplatePanel isOpen={isTemplatePanelOpen} onClose={() => setIsTemplatePanelOpen(false)} onApply={() => {}} />
        </div>
    );
};

export default RiskPlanEditor;
