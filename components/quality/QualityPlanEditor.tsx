
import React, { useState } from 'react';
import { FileText, Save, Book, Lock, CheckCircle, List, Users, PenTool, Shield, ArrowDown, GitPullRequest } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { PlanSection } from './planning/PlanSection';
import { PlanTemplatePanel } from './planning/PlanTemplatePanel';
import { WorkflowDiagram } from './planning/WorkflowDiagram';
import { Button } from '../ui/Button';

interface QualityPlanEditorProps {
    projectId: string;
}

const QualityPlanEditor: React.FC<QualityPlanEditorProps> = ({ projectId }) => {
    const { state } = useData(); 
    const project = state.projects.find(p => p.id === projectId);
    const plan = project?.qualityPlan || {
        objectives: '', rolesAndResp: '', deliverablesVerification: '', 
        nonConformanceProcess: '', toolsAndTechniques: '', status: 'Draft',
        version: '0.1', lastUpdated: new Date().toISOString()
    };

    const [formData, setFormData] = useState(plan);
    const [openSections, setOpenSections] = useState({ objectives: true, roles: false, control: false, assurance: false, tools: false });
    const [isTemplatePanelOpen, setIsTemplatePanelOpen] = useState(false);
    const { canEditProject } = usePermissions();
    const theme = useTheme();

    const toggleSection = (id: keyof typeof openSections) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
    const handleChange = (field: keyof typeof plan, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

    const applyTemplate = (selectedTemplateId: string | null) => {
        if (!selectedTemplateId) return;
        setFormData({
            ...formData,
            objectives: `[Applied Template] Objective: Zero critical defects.`,
            rolesAndResp: `[Applied Template] Quality Manager: Full authority.`,
            status: 'Draft'
        });
        setIsTemplatePanelOpen(false);
    };

    return (
        <div className="h-full flex flex-col bg-slate-50/50">
            <div className={`p-4 ${theme.layout.headerBorder} shrink-0 flex items-center justify-between bg-white`}>
                <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2"><FileText size={18} /> Quality Management Plan (QMP)</h3>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" icon={Book} onClick={() => setIsTemplatePanelOpen(true)}>Templates</Button>
                    {canEditProject() && <Button size="sm" icon={Save}>Save & Version</Button>}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
                <PlanSection title="1. Quality Objectives & Standards" icon={CheckCircle} isOpen={openSections.objectives} onToggle={() => toggleSection('objectives')}>
                    <textarea disabled={!canEditProject()} className="w-full h-32 p-4 border rounded-lg text-sm" value={formData.objectives} onChange={(e) => handleChange('objectives', e.target.value)} />
                </PlanSection>
                <PlanSection title="2. Roles & Responsibilities" icon={Users} isOpen={openSections.roles} onToggle={() => toggleSection('roles')}>
                    <textarea disabled={!canEditProject()} className="w-full h-32 p-4 border rounded-lg text-sm" value={formData.rolesAndResp} onChange={(e) => handleChange('rolesAndResp', e.target.value)} />
                </PlanSection>
                <PlanSection title="3. Quality Control (QC) & Verification" icon={List} isOpen={openSections.control} onToggle={() => toggleSection('control')}>
                    <textarea disabled={!canEditProject()} className="w-full h-32 p-4 border rounded-lg text-sm" value={formData.deliverablesVerification} onChange={(e) => handleChange('deliverablesVerification', e.target.value)} />
                </PlanSection>
                <PlanSection title="4. Non-Conformance Management" icon={Shield} isOpen={openSections.assurance} onToggle={() => toggleSection('assurance')}>
                    <WorkflowDiagram />
                    <textarea disabled={!canEditProject()} className="w-full h-32 p-4 border rounded-lg text-sm mt-4" value={formData.nonConformanceProcess} onChange={(e) => handleChange('nonConformanceProcess', e.target.value)} />
                </PlanSection>
                <PlanSection title="5. Tools & Software" icon={PenTool} isOpen={openSections.tools} onToggle={() => toggleSection('tools')}>
                    <textarea disabled={!canEditProject()} className="w-full h-24 p-4 border rounded-lg text-sm" value={formData.toolsAndTechniques} onChange={(e) => handleChange('toolsAndTechniques', e.target.value)} />
                </PlanSection>
            </div>
            <PlanTemplatePanel isOpen={isTemplatePanelOpen} onClose={() => setIsTemplatePanelOpen(false)} onApply={applyTemplate} />
        </div>
    );
};

export default QualityPlanEditor;