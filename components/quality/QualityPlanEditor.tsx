
import React, { useState } from 'react';
import { FileText, Save, Book, Lock, CheckCircle, List, Users, PenTool, Shield, ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';
import { Project } from '../../types';
import { useData } from '../../context/DataContext';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';

interface QualityPlanEditorProps {
    projectId: string;
}

interface PlanSectionProps {
    title: string;
    icon: any;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

// Collapsible Section Component
const PlanSection: React.FC<PlanSectionProps> = ({ 
    title, 
    icon: Icon, 
    children, 
    isOpen, 
    onToggle 
}) => (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden mb-4 shadow-sm">
        <button 
            onClick={onToggle}
            className="w-full flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100 hover:bg-slate-100 transition-colors"
        >
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isOpen ? 'bg-nexus-100 text-nexus-700' : 'bg-white border border-slate-200 text-slate-500'}`}>
                    <Icon size={18} />
                </div>
                <h4 className="font-bold text-slate-800">{title}</h4>
            </div>
            {isOpen ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
        </button>
        {isOpen && <div className="p-6 animate-in slide-in-from-top-2 duration-200">{children}</div>}
    </div>
);

const QualityPlanEditor: React.FC<QualityPlanEditorProps> = ({ projectId }) => {
    const { state } = useData(); 
    const project = state.projects.find(p => p.id === projectId);
    const plan = project?.qualityPlan || {
        objectives: '',
        rolesAndResp: '',
        deliverablesVerification: '',
        nonConformanceProcess: '',
        toolsAndTechniques: '',
        status: 'Draft',
        version: '0.1',
        lastUpdated: new Date().toISOString()
    };

    // State for form fields
    const [formData, setFormData] = useState(plan);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        objectives: true,
        roles: false,
        control: false,
        assurance: false
    });
    
    // Template Panel State
    const [isTemplatePanelOpen, setIsTemplatePanelOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const { canEditProject } = usePermissions();
    const theme = useTheme();

    const templates = [
        { id: 'iso9001', name: 'ISO 9001:2015 Compliant', description: 'Standard QMS structure focusing on customer satisfaction and continual improvement.' },
        { id: 'sixsigma', name: 'Six Sigma / DMAIC', description: 'Data-driven approach for minimizing defects in process-heavy projects.' },
        { id: 'lean', name: 'Lean Construction', description: 'Focus on minimizing waste and maximizing value flow.' }
    ];

    const toggleSection = (id: string) => {
        setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleChange = (field: keyof typeof plan, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const applyTemplate = () => {
        if (!selectedTemplate) return;
        // Mock template application - simply pre-filling text
        const templateText = `[Applied from ${templates.find(t => t.id === selectedTemplate)?.name} Template]\n\n`;
        setFormData({
            ...formData,
            objectives: templateText + "Objective: Zero critical defects at handover.",
            rolesAndResp: templateText + "Quality Manager: Full authority to stop work.",
            status: 'Draft'
        });
        setIsTemplatePanelOpen(false);
    };

    return (
        <div className="h-full flex flex-col bg-slate-50/50">
            {/* Toolbar */}
            <div className={`p-4 ${theme.layout.headerBorder} flex-shrink-0 flex items-center justify-between bg-white`}>
                <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                        <FileText size={18} className="text-nexus-600" /> Quality Management Plan (QMP)
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded border ${
                            formData.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }`}>
                            {formData.status}
                        </span>
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-500 font-mono">v{formData.version}</span>
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-500">Updated: {new Date(formData.lastUpdated).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsTemplatePanelOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        <Book size={14}/> Templates
                    </button>
                    {canEditProject() ? (
                        <button className={`flex items-center gap-2 px-3 py-2 ${theme.colors.accentBg} rounded-lg text-sm font-medium text-white hover:bg-nexus-700 shadow-sm`}>
                            <Save size={14}/> Save & Version
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-400">
                            <Lock size={14}/> Read Only
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
                
                <PlanSection 
                    title="1. Quality Objectives & Standards" 
                    icon={CheckCircle} 
                    isOpen={openSections.objectives} 
                    onToggle={() => toggleSection('objectives')}
                >
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 mb-2">Define the primary quality goals and applicable industry standards (ISO, ASTM, etc.).</p>
                        <textarea 
                            disabled={!canEditProject()}
                            className="w-full h-32 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50"
                            placeholder="e.g., The project will adhere to ISO 9001:2015. Zero critical defects allowed at handover..."
                            value={formData.objectives}
                            onChange={(e) => handleChange('objectives', e.target.value)}
                        />
                    </div>
                </PlanSection>

                <PlanSection 
                    title="2. Roles & Responsibilities" 
                    icon={Users} 
                    isOpen={openSections.roles} 
                    onToggle={() => toggleSection('roles')}
                >
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 mb-2">Identify who is responsible for Quality Assurance (Process) and Quality Control (Product).</p>
                        <textarea 
                            disabled={!canEditProject()}
                            className="w-full h-32 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50"
                            placeholder="e.g., Project Manager: Responsible for overall quality. Site Engineer: Responsible for daily inspections..."
                            value={formData.rolesAndResp}
                            onChange={(e) => handleChange('rolesAndResp', e.target.value)}
                        />
                    </div>
                </PlanSection>

                <PlanSection 
                    title="3. Quality Control (QC) & Verification" 
                    icon={List} 
                    isOpen={openSections.control} 
                    onToggle={() => toggleSection('control')}
                >
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 mb-2">Describe how deliverables will be verified against requirements. Include inspection methods.</p>
                        <textarea 
                            disabled={!canEditProject()}
                            className="w-full h-32 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50"
                            placeholder="e.g., All concrete pours require a pre-pour inspection checklist signed by the structural engineer..."
                            value={formData.deliverablesVerification}
                            onChange={(e) => handleChange('deliverablesVerification', e.target.value)}
                        />
                    </div>
                </PlanSection>

                <PlanSection 
                    title="4. Non-Conformance Management" 
                    icon={Shield} 
                    isOpen={openSections.assurance} 
                    onToggle={() => toggleSection('assurance')}
                >
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 mb-2">Define the process for identifying, documenting, and correcting defects (NCR Process).</p>
                        
                        {/* Visual Workflow for Context */}
                        <div className="flex items-center justify-between text-xs font-bold text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center">1</div>
                                <span>Identify Defect</span>
                            </div>
                            <div className="h-0.5 bg-slate-300 w-8"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center">2</div>
                                <span>Log NCR</span>
                            </div>
                            <div className="h-0.5 bg-slate-300 w-8"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center">3</div>
                                <span>Root Cause</span>
                            </div>
                            <div className="h-0.5 bg-slate-300 w-8"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center">4</div>
                                <span>Corrective Action</span>
                            </div>
                            <div className="h-0.5 bg-slate-300 w-8"></div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center">5</div>
                                <span>Close Out</span>
                            </div>
                        </div>

                        <textarea 
                            disabled={!canEditProject()}
                            className="w-full h-32 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50"
                            placeholder="Describe the escalation path for critical defects..."
                            value={formData.nonConformanceProcess}
                            onChange={(e) => handleChange('nonConformanceProcess', e.target.value)}
                        />
                    </div>
                </PlanSection>

                <PlanSection 
                    title="5. Tools & Software" 
                    icon={PenTool} 
                    isOpen={openSections.tools} 
                    onToggle={() => toggleSection('tools')}
                >
                    <div className="space-y-4">
                        <textarea 
                            disabled={!canEditProject()}
                            className="w-full h-24 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50"
                            placeholder="List software used for QA/QC (e.g., Nexus PPM, Autodesk Build, SmartSheets)..."
                            value={formData.toolsAndTechniques}
                            onChange={(e) => handleChange('toolsAndTechniques', e.target.value)}
                        />
                    </div>
                </PlanSection>

            </div>

            {/* Template Selection Panel */}
            <SidePanel
                isOpen={isTemplatePanelOpen}
                onClose={() => setIsTemplatePanelOpen(false)}
                title="Apply Quality Plan Template"
                width="md:w-[500px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsTemplatePanelOpen(false)}>Cancel</Button>
                        <Button onClick={applyTemplate} disabled={!selectedTemplate} icon={Copy}>Apply Template</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">Select a standardized Quality Management Plan template to pre-fill sections. <strong className="text-red-600">Warning: This will overwrite existing content.</strong></p>
                    <div className="space-y-3">
                        {templates.map(t => (
                            <div 
                                key={t.id} 
                                onClick={() => setSelectedTemplate(t.id)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                                    selectedTemplate === t.id 
                                    ? 'bg-nexus-50 border-nexus-500 ring-1 ring-nexus-500' 
                                    : 'bg-white border-slate-200 hover:border-nexus-300'
                                }`}
                            >
                                <h4 className="font-bold text-slate-800">{t.name}</h4>
                                <p className="text-sm text-slate-600 mt-1">{t.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default QualityPlanEditor;
