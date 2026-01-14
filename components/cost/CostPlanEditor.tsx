
import React, { useState } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { useI18n } from '../../context/I18nContext';
import { FileText, Save, Book, Lock, Calculator, TrendingUp, BarChart2, DollarSign, ChevronDown, Info, ShieldCheck, Copy, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { SidePanel } from '../ui/SidePanel';
import { NarrativeField } from '../common/NarrativeField';
import { CostPlanTemplatePanel } from './planning/CostPlanTemplatePanel';

interface CostPlanEditorProps {
    projectId: string;
}

interface PlanSectionProps {
    title: string;
    icon: any;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

const PlanSection: React.FC<PlanSectionProps> = ({ 
    title, 
    icon: Icon, 
    children, 
    isOpen, 
    onToggle 
}) => {
    const theme = useTheme();
    return (
        <div className={`border rounded-2xl bg-white overflow-hidden mb-6 shadow-sm transition-all duration-300 ${isOpen ? 'border-nexus-200 ring-4 ring-nexus-500/5' : 'border-slate-200'}`}>
            <button 
                onClick={onToggle}
                className={`w-full flex items-center justify-between p-5 text-left transition-colors ${isOpen ? 'bg-white border-b border-slate-100' : 'bg-slate-50/50 hover:bg-slate-100'}`}
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${isOpen ? 'bg-nexus-600 text-white shadow-lg shadow-nexus-500/20 scale-110' : 'bg-white border border-slate-200 text-slate-400'}`}>
                        <Icon size={20} />
                    </div>
                    <h4 className={`font-black uppercase text-xs tracking-widest ${isOpen ? 'text-slate-900' : 'text-slate-500'}`}>{title}</h4>
                </div>
                <div className={`p-1.5 rounded-full transition-all ${isOpen ? 'bg-nexus-50 text-nexus-600 rotate-0' : 'bg-slate-100 text-slate-400 rotate-180'}`}>
                    <ChevronDown size={18} />
                </div>
            </button>
            {isOpen && <div className="p-8 animate-in slide-in-from-top-4 duration-300 bg-white" role="region">{children}</div>}
        </div>
    );
};

const CostPlanEditor: React.FC<CostPlanEditorProps> = ({ projectId }) => {
    const { state, dispatch } = useData(); 
    const { t } = useI18n();
    const project = state.projects.find(p => p.id === projectId);
    const plan = project?.costPlan || {
        estimatingMethodology: '',
        precisionLevel: '',
        unitsOfMeasure: '',
        controlThresholds: '',
        reportingFormats: '',
        fundingStrategy: '',
        status: 'Draft',
        version: '0.1',
        lastUpdated: new Date().toISOString()
    };

    const [formData, setFormData] = useState(plan);
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        methodology: true,
        controls: false,
        reporting: false,
        funding: false
    });

    const [isTemplatePanelOpen, setIsTemplatePanelOpen] = useState(false);
    
    const { canEditProject } = usePermissions();
    const theme = useTheme();

    const toggleSection = (id: string) => setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));

    const handleChange = (field: keyof typeof plan, value: string) => {
        const next = { ...formData, [field]: value };
        setFormData(next);
        // Direct commit to state for production readiness
        dispatch({
            type: 'PROJECT_UPDATE',
            payload: { projectId, updatedData: { costPlan: { ...next, lastUpdated: new Date().toISOString() } } }
        });
    };

    const applyTemplate = (selectedTemplateId: string | null) => {
        if (!selectedTemplateId) return;
        const template = state.standardTemplates.find(t => t.id === selectedTemplateId);
        const templateText = `[Applied from ${template?.name} Template]\n\n`;
        const updated = {
            ...formData,
            estimatingMethodology: templateText + "Definitive estimates required for all major work packages.",
            controlThresholds: templateText + "SPI/CPI variance of +/- 0.10 requires formal explanation.",
            status: 'Draft'
        };
        setFormData(updated);
        dispatch({ type: 'PROJECT_UPDATE', payload: { projectId, updatedData: { costPlan: updated } } });
        setIsTemplatePanelOpen(false);
    };

    return (
        <div className="h-full flex flex-col bg-slate-100/30 scrollbar-thin">
            <div className={`p-6 border-b border-slate-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-2 uppercase">
                        <FileText size={24} className="text-nexus-600" /> {t('cost.plan.title', 'Cost Management Strategy')}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> {formData.status}
                        </div>
                        <span>Protocol: v{formData.version}</span>
                        <span>Synced: {new Date(formData.lastUpdated).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" icon={Book} onClick={() => setIsTemplatePanelOpen(true)}>{t('cost.plan.templates', 'Apply Template')}</Button>
                    {!canEditProject() && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Lock size={14}/> {t('common.read_only', 'Read Only')}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto w-full space-y-6">
                <PlanSection title="1. Estimating Methodology" icon={Calculator} isOpen={openSections.methodology} onToggle={() => toggleSection('methodology')}>
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
                        <NarrativeField 
                            label="Corporate Estimating Protocol"
                            value={formData.estimatingMethodology}
                            placeholderLabel="Define standard methods for cost development (e.g., Parametric, Bottom-up)."
                            onSave={(val) => handleChange('estimatingMethodology', val)}
                            isReadOnly={!canEditProject()}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <NarrativeField 
                                label="Precision Tolerance"
                                value={formData.precisionLevel}
                                placeholderLabel="e.g., +/- 10% Definitive"
                                onSave={(val) => handleChange('precisionLevel', val)}
                                isReadOnly={!canEditProject()}
                            />
                            <NarrativeField 
                                label="Standard Units of Measure"
                                value={formData.unitsOfMeasure}
                                placeholderLabel="e.g., Man-hours, Cubic Yards"
                                onSave={(val) => handleChange('unitsOfMeasure', val)}
                                isReadOnly={!canEditProject()}
                            />
                        </div>
                    </div>
                </PlanSection>

                <PlanSection title="2. Control Thresholds & Variance" icon={TrendingUp} isOpen={openSections.controls} onToggle={() => toggleSection('controls')}>
                    <NarrativeField 
                        label="Variance Management Protocol"
                        value={formData.controlThresholds}
                        placeholderLabel="Specify the formal variance thresholds (CPI/CV) that trigger mandatory escalation."
                        onSave={(val) => handleChange('controlThresholds', val)}
                        isReadOnly={!canEditProject()}
                    />
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 shadow-sm">
                        <Info size={20} className="text-amber-600 shrink-0 mt-0.5"/>
                        <p className="text-[10px] text-amber-800 leading-relaxed font-bold uppercase tracking-tight">
                            Fiscal breaches are auto-detected by the Performance Measurement Engine and will trigger immediate alerts to the PMO.
                        </p>
                    </div>
                </PlanSection>

                <PlanSection title="3. Reporting & Alignment" icon={BarChart2} isOpen={openSections.reporting} onToggle={() => toggleSection('reporting')}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <NarrativeField 
                            label="Reporting Formats"
                            value={formData.reportingFormats}
                            placeholderLabel="Define artifacts like EVM Reports and Burn Rate Charts."
                            onSave={(val) => handleChange('reportingFormats', val)}
                            isReadOnly={!canEditProject()}
                        />
                        <NarrativeField 
                            label="Strategic Funding Strategy"
                            value={formData.fundingStrategy}
                            placeholderLabel="Outline funding sources and grant restrictions."
                            onSave={(val) => handleChange('fundingStrategy', val)}
                            isReadOnly={!canEditProject()}
                        />
                    </div>
                </PlanSection>

                <div className="p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden shadow-2xl border border-white/5">
                    <div className="relative z-10">
                        <h4 className="font-bold flex items-center gap-2 mb-3 text-base tracking-tight">
                            <ShieldCheck size={18} className="text-nexus-400"/> Regulatory Compliance
                        </h4>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-2xl font-medium">
                            The Cost Management Plan (CMP) acts as the governance baseline for all fiscal commitments. Any deviation requires a formal change order and CCB approval.
                        </p>
                    </div>
                    <DollarSign size={180} className="absolute -right-12 -bottom-12 text-white/5 rotate-12 pointer-events-none" />
                </div>
            </div>

            <CostPlanTemplatePanel isOpen={isTemplatePanelOpen} onClose={() => setIsTemplatePanelOpen(false)} onApply={applyTemplate} />
        </div>
    );
};

export default CostPlanEditor;
