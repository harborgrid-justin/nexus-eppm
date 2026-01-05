
import React, { useState } from 'react';
import { FileText, Save, Book, Lock, Calculator, TrendingUp, BarChart2, DollarSign, ChevronDown, ChevronRight, Copy, Info, ShieldCheck, AlertTriangle } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { SidePanel } from '../ui/SidePanel';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

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
                    <h4 className={`font-bold tracking-tight ${isOpen ? 'text-slate-900 text-lg' : 'text-slate-700 text-base'}`}>{title}</h4>
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
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    const { canEditProject } = usePermissions();
    const theme = useTheme();

    const templates = [
        { id: 'gov_standard', name: 'Government Standard (EVM)', description: 'Strict adherence to ANSI/EIA-748 EVMS guidelines with variance thresholds.' },
        { id: 'agile_lean', name: 'Agile / Lean Costing', description: 'Focus on burn rate, throughput accounting, and iterative funding releases.' },
        { id: 'construction_fixed', name: 'Construction (Fixed Price)', description: 'Emphasis on committed costs, retainage, and change order management.' }
    ];

    const toggleSection = (id: string) => {
        setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleChange = (field: keyof typeof plan, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        dispatch({
            type: 'PROJECT_UPDATE',
            payload: {
                projectId,
                updatedData: { 
                    costPlan: {
                        ...formData,
                        lastUpdated: new Date().toISOString()
                    } 
                }
            }
        });
        alert('Cost Management Plan saved successfully.');
    };

    const applyTemplate = () => {
        if (!selectedTemplate) return;
        const templateText = `[Applied from ${templates.find(t => t.id === selectedTemplate)?.name} Template]\n\n`;
        setFormData({
            ...formData,
            estimatingMethodology: templateText + "Definitive estimates required for Phase 2.",
            controlThresholds: templateText + "SPI/CPI +/- 0.10 requires VAR.",
            status: 'Draft'
        });
        setIsTemplatePanelOpen(false);
    };

    return (
        <div className="h-full flex flex-col bg-slate-100/30 scrollbar-thin">
            <div className={`p-6 md:p-8 flex-shrink-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border-b border-slate-200`}>
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-2">
                        <FileText size={24} className="text-nexus-600" /> Cost Management Strategy
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-slate-200 bg-slate-50">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> {formData.status}
                        </div>
                        <span>Protocol: v{formData.version}</span>
                        <span>Synchronized: {new Date(formData.lastUpdated).toLocaleDateString()}</span>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => setIsTemplatePanelOpen(true)}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm active:scale-95 transition-all"
                    >
                        <Book size={16} className="text-nexus-600"/> Apply Corporate Baseline
                    </button>
                    {canEditProject() ? (
                        <button 
                            onClick={handleSave}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-nexus-600 rounded-xl text-sm font-black text-white hover:bg-nexus-700 shadow-lg shadow-nexus-500/30 active:scale-95 transition-all uppercase tracking-widest`}
                        >
                            <Save size={16}/> Save & Version
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <Lock size={14}/> Read Only Strategy
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto w-full">
                <PlanSection 
                    title="1. Estimating Methodology" 
                    icon={Calculator} 
                    isOpen={openSections.methodology} 
                    onToggle={() => toggleSection('methodology')}
                >
                    <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-4 leading-relaxed">Define the standardized methods for cost development (e.g., Analogous, Parametric, Bottom-up) and the mandatory precision levels for the current WBS phase.</p>
                            <textarea 
                                disabled={!canEditProject()}
                                className="w-full h-40 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 focus:bg-white outline-none disabled:opacity-70 transition-all resize-none shadow-inner"
                                placeholder="Formalize the estimating approach here..."
                                value={formData.estimatingMethodology}
                                onChange={(e) => handleChange('estimatingMethodology', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Precision Tolerance</label>
                                <input 
                                    disabled={!canEditProject()}
                                    type="text"
                                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-nexus-500 outline-none"
                                    placeholder="e.g., +/- 10% Definitive"
                                    value={formData.precisionLevel}
                                    onChange={(e) => handleChange('precisionLevel', e.target.value)}
                                />
                            </div>
                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Corporate Units of Measure</label>
                                <input 
                                    disabled={!canEditProject()}
                                    type="text"
                                    className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-nexus-500 outline-none"
                                    placeholder="e.g., Man-hours, Cubic Yards, USD"
                                    value={formData.unitsOfMeasure}
                                    onChange={(e) => handleChange('unitsOfMeasure', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </PlanSection>

                <PlanSection 
                    title="2. Control Thresholds & Variance" 
                    icon={TrendingUp} 
                    isOpen={openSections.controls} 
                    onToggle={() => toggleSection('controls')}
                >
                    <div className="space-y-6">
                        <p className="text-sm font-medium text-slate-500 leading-relaxed">Specify the formal variance thresholds (CPI/CV) that trigger mandatory Corrective Action Plans or executive escalation.</p>
                        <textarea 
                            disabled={!canEditProject()}
                            className="w-full h-40 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 outline-none transition-all resize-none shadow-inner"
                            placeholder="e.g., If CPI < 0.90 for two consecutive periods, a formal VAR must be submitted..."
                            value={formData.controlThresholds}
                            onChange={(e) => handleChange('controlThresholds', e.target.value)}
                        />
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 shadow-sm">
                            <Info size={20} className="text-amber-600 shrink-0 mt-0.5"/>
                            <p className="text-[11px] text-amber-800 leading-relaxed font-bold uppercase tracking-tight">
                                Threshold breaches are auto-detected by the Performance Measurement Engine and will trigger immediate alerts to the PMO Steering Committee.
                            </p>
                        </div>
                    </div>
                </PlanSection>

                <PlanSection 
                    title="3. Reporting Formats" 
                    icon={BarChart2} 
                    isOpen={openSections.reporting} 
                    onToggle={() => toggleSection('reporting')}
                >
                    <div className="space-y-4">
                        <p className="text-sm font-medium text-slate-500">Define the formal reporting templates and distribution cadence for financial status.</p>
                        <textarea 
                            disabled={!canEditProject()}
                            className="w-full h-40 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 outline-none transition-all resize-none shadow-inner"
                            placeholder="Identify specific artifacts like EVM Reports, Burn Rate Charts, and CBS Summaries..."
                            value={formData.reportingFormats}
                            onChange={(e) => handleChange('reportingFormats', e.target.value)}
                        />
                    </div>
                </PlanSection>

                <PlanSection 
                    title="4. Funding Strategy" 
                    icon={DollarSign} 
                    isOpen={openSections.funding} 
                    onToggle={() => toggleSection('funding')}
                >
                    <div className="space-y-6">
                        <p className="text-sm font-medium text-slate-500 leading-relaxed">Outline funding sources, grant restrictions, and the mechanisms for periodic fund reconciliation against spending curves.</p>
                        <textarea 
                            disabled={!canEditProject()}
                            className="w-full h-40 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-700 focus:ring-4 focus:ring-nexus-500/10 focus:border-nexus-500 outline-none transition-all resize-none shadow-inner"
                            placeholder="Detail Capital vs Operating fund split and authority limits..."
                            value={formData.fundingStrategy}
                            onChange={(e) => handleChange('fundingStrategy', e.target.value)}
                        />
                        <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden shadow-xl">
                            <div className="relative z-10">
                                <h4 className="font-bold flex items-center gap-2 mb-2 text-base tracking-tight">
                                    <ShieldCheck size={20} className="text-nexus-400"/> Regulatory Alignment
                                </h4>
                                <p className="text-xs text-slate-400 leading-relaxed max-w-lg">
                                    Funding releases are gated via the Stage-Gate Governance process. All actuals must be reconciled against the approved Fiscal Year budget before next-phase funding is authorized.
                                </p>
                            </div>
                            <DollarSign size={160} className="absolute -right-12 -bottom-12 text-white/5 opacity-10 rotate-12" />
                        </div>
                    </div>
                </PlanSection>
            </div>

            <SidePanel
                isOpen={isTemplatePanelOpen}
                onClose={() => setIsTemplatePanelOpen(false)}
                title="Strategy Template Library"
                width="md:w-[500px]"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsTemplatePanelOpen(false)}>Cancel</Button>
                        <Button onClick={applyTemplate} disabled={!selectedTemplate} icon={Copy}>Apply Corporate Policy</Button>
                    </>
                }
            >
                <div className="space-y-6">
                    <p className="text-sm font-medium text-slate-600 bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                        <AlertTriangle className="text-amber-600 shrink-0" size={18}/>
                        <span>Applying a template will <strong className="text-amber-900">overwrite</strong> current strategy text. This action is logged in the project audit trail.</span>
                    </p>
                    <div className="space-y-4">
                        {templates.map(t => (
                            <div 
                                key={t.id} 
                                onClick={() => setSelectedTemplate(t.id)}
                                className={`p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                                    selectedTemplate === t.id 
                                    ? 'bg-nexus-50 border-nexus-500 ring-4 ring-nexus-500/10' 
                                    : 'bg-white border-slate-100 hover:border-nexus-300'
                                }`}
                            >
                                <h4 className="font-black text-slate-900 text-base mb-1">{t.name}</h4>
                                <p className="text-sm font-medium text-slate-500 leading-relaxed">{t.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </SidePanel>
        </div>
    );
};

export default CostPlanEditor;
