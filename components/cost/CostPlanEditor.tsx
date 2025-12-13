
import React, { useState } from 'react';
import { FileText, Save, Book, Lock, Calculator, TrendingUp, BarChart2, DollarSign, ChevronDown, ChevronRight } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';

interface CostPlanEditorProps {
    projectId: string;
}

// Collapsible Section Component
const PlanSection = ({ 
    title, 
    icon: Icon, 
    children, 
    isOpen, 
    onToggle 
}: { 
    title: string; 
    icon: any; 
    children: React.ReactNode; 
    isOpen: boolean; 
    onToggle: () => void; 
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

const CostPlanEditor: React.FC<CostPlanEditorProps> = ({ projectId }) => {
    const { state } = useData(); 
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

    const { canEditProject } = usePermissions();
    const theme = useTheme();

    const toggleSection = (id: string) => {
        setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleChange = (field: keyof typeof plan, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="h-full flex flex-col bg-slate-50/50">
            {/* Toolbar */}
            <div className={`p-4 ${theme.layout.headerBorder} flex-shrink-0 flex items-center justify-between bg-white`}>
                <div className="flex items-center gap-4">
                    <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                        <FileText size={18} className="text-nexus-600" /> Cost Management Plan
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
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
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
                    title="1. Estimating Methodology & Precision" 
                    icon={Calculator} 
                    isOpen={openSections.methodology} 
                    onToggle={() => toggleSection('methodology')}
                >
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 mb-2">Define the methods used for estimating costs (e.g., Analogous, Parametric, Bottom-up) and the required level of precision.</p>
                        <textarea 
                            disabled={!canEditProject()}
                            className="w-full h-32 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50"
                            placeholder="e.g., Conceptual estimates will use analogous data (+/- 50%). Definitive estimates will use bottom-up quotes (+/- 10%)..."
                            value={formData.estimatingMethodology}
                            onChange={(e) => handleChange('estimatingMethodology', e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Precision Level</label>
                                <input 
                                    disabled={!canEditProject()}
                                    type="text"
                                    className="w-full p-2 border border-slate-300 rounded-md text-sm"
                                    placeholder="e.g., Round to nearest $100"
                                    value={formData.precisionLevel}
                                    onChange={(e) => handleChange('precisionLevel', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Units of Measure</label>
                                <input 
                                    disabled={!canEditProject()}
                                    type="text"
                                    className="w-full p-2 border border-slate-300 rounded-md text-sm"
                                    placeholder="e.g., Staff hours, USD, Linear Feet"
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
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 mb-2">Specify the variance thresholds for monitoring cost performance (CPI/CV) that trigger corrective action.</p>
                        <textarea 
                            disabled={!canEditProject()}
                            className="w-full h-32 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50"
                            placeholder="e.g., If CPI < 0.9, PM must submit a corrective action plan. If CPI < 0.8, escalate to Sponsor..."
                            value={formData.controlThresholds}
                            onChange={(e) => handleChange('controlThresholds', e.target.value)}
                        />
                    </div>
                </PlanSection>

                <PlanSection 
                    title="3. Reporting Formats" 
                    icon={BarChart2} 
                    isOpen={openSections.reporting} 
                    onToggle={() => toggleSection('reporting')}
                >
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 mb-2">Define the format and frequency of cost reports.</p>
                        <textarea 
                            disabled={!canEditProject()}
                            className="w-full h-32 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50"
                            placeholder="e.g., Monthly Earned Value Report (Format A) distributed to Stakeholders by the 5th business day..."
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
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 mb-2">Outline funding sources and mechanisms for reconciling limits.</p>
                        <textarea 
                            disabled={!canEditProject()}
                            className="w-full h-32 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50"
                            placeholder="e.g., Self-funded via Q3 CapEx allocation. Reconciled quarterly against spending curve..."
                            value={formData.fundingStrategy}
                            onChange={(e) => handleChange('fundingStrategy', e.target.value)}
                        />
                    </div>
                </PlanSection>

            </div>
        </div>
    );
};

export default CostPlanEditor;
