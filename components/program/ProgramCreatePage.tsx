
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { PageHeader } from '../common/PageHeader';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { NarrativeField } from '../common/NarrativeField';
// Added missing Badge component import
import { Badge } from '../ui/Badge';
import { 
    Layers, Save, X, Target, DollarSign, 
    Calendar, ShieldCheck, Gavel, Info, Activity
} from 'lucide-react';
import { generateId, formatCompactCurrency } from '../../utils/formatters';
import { Program } from '../../types';

const ProgramCreatePage: React.FC = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { state, dispatch } = useData();
    const { success, warning } = useToast();

    // Initial state for a fresh "Enterprise Cage"
    const [formData, setFormData] = useState<Partial<Program>>({
        name: '',
        description: '',
        managerId: '',
        budget: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        status: 'Planned',
        health: 'Good',
        category: 'Strategic',
        strategicImportance: 5,
        businessCase: '',
        benefits: ''
    });

    const handleFieldChange = (field: keyof Program, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!formData.name) {
            warning("Validation Error", "Program Designation is mandatory for portfolio inclusion.");
            return;
        }

        const newProgram: Program = {
            id: generateId('PRG'),
            name: formData.name,
            description: formData.description || '',
            managerId: formData.managerId || 'Unassigned',
            budget: Number(formData.budget) || 0,
            startDate: formData.startDate || '',
            endDate: formData.endDate || '',
            status: formData.status as any || 'Planned',
            health: formData.health as any || 'Good',
            category: formData.category || 'Strategic',
            strategicImportance: Number(formData.strategicImportance) || 5,
            benefits: formData.benefits || '',
            financialValue: 0,
            riskScore: 0,
            calculatedPriorityScore: 50,
            businessCase: formData.businessCase || ''
        };

        dispatch({ type: 'ADD_PROGRAM', payload: newProgram });
        success("Program Established", `${newProgram.name} has been committed to the strategic ledger.`);
        navigate('/programs');
    };

    return (
        <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.colors.background} space-y-8 animate-in fade-in duration-500 scrollbar-thin`}>
            <PageHeader 
                title="Establish Strategic Program"
                subtitle="Initialize a high-level initiative to aggregate multi-project delivery."
                icon={Layers}
                actions={
                    <div className="flex gap-2">
                        <Button variant="ghost" icon={X} onClick={() => navigate('/programs')}>Cancel</Button>
                        <Button icon={Save} onClick={handleSave} className="bg-nexus-600 text-white shadow-lg shadow-nexus-500/20">Commit Program</Button>
                    </div>
                }
            />

            <div className={`max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 ${theme.layout.gridGap} pb-20`}>
                {/* Main Content: The Narrative Cage */}
                <div className="lg:col-span-3 space-y-8">
                    <Card className="p-8 border-t-4 border-t-nexus-600 shadow-md">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                <Target size={14} className="text-nexus-600"/> Program Charter Parameters
                            </h3>
                            {/* Correctly using the imported Badge component */}
                            <Badge variant="neutral" className="font-mono">NEW_RECORD_PENDING</Badge>
                        </div>

                        <div className="space-y-8">
                            <div className="max-w-2xl">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Program Designation</label>
                                <Input 
                                    value={formData.name} 
                                    onChange={e => handleFieldChange('name', e.target.value)} 
                                    placeholder="e.g. FY25 Infrastructure Modernization" 
                                    className="h-14 text-xl font-black placeholder:text-slate-200"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Responsible Portfolio Lead</label>
                                    <select 
                                        className={`w-full p-3.5 border ${theme.colors.border} rounded-xl text-sm font-bold focus:ring-2 focus:ring-nexus-500 outline-none bg-slate-50/50 hover:bg-white transition-colors`}
                                        value={formData.managerId}
                                        onChange={e => handleFieldChange('managerId', e.target.value)}
                                    >
                                        <option value="">Select Resource...</option>
                                        {state.resources.filter(r => r.type === 'Human').map(r => (
                                            <option key={r.id} value={r.name}>{r.name} ({r.role})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Strategic Categorization</label>
                                    <select 
                                        className={`w-full p-3.5 border ${theme.colors.border} rounded-xl text-sm font-bold focus:ring-2 focus:ring-nexus-500 outline-none bg-slate-50/50 hover:bg-white transition-colors`}
                                        value={formData.category}
                                        onChange={e => handleFieldChange('category', e.target.value)}
                                    >
                                        <option>Strategic</option>
                                        <option>Innovation & Growth</option>
                                        <option>Operational Efficiency</option>
                                        <option>Regulatory & Compliance</option>
                                    </select>
                                </div>
                            </div>

                            <NarrativeField 
                                label="Strategic Mandate & Business Justification"
                                value={formData.businessCase}
                                placeholderLabel="Program mandate undefined. Narrative justification required for baseline approval."
                                onSave={(val) => handleFieldChange('businessCase', val)}
                            />

                            <NarrativeField 
                                label="Benefits Realization Plan"
                                value={formData.benefits}
                                placeholderLabel="Value delivery KPIs unmapped. Define expected organizational outcomes."
                                onSave={(val) => handleFieldChange('benefits', val)}
                            />
                        </div>
                    </Card>
                </div>

                {/* Sidebar: Financials & Lifecycle */}
                <div className="space-y-6">
                    <Card className={`p-6 ${theme.colors.background} border-slate-200 shadow-sm`}>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <DollarSign size={14} className="text-green-600"/> Fiscal Authority
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Approved Budget Cap</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-lg group-focus-within:text-nexus-500 transition-colors">$</span>
                                    <input 
                                        type="number" 
                                        className={`w-full pl-9 pr-4 py-4 border ${theme.colors.border} rounded-xl text-xl font-mono font-black focus:ring-4 focus:ring-nexus-500/5 focus:border-nexus-500 outline-none bg-white transition-all shadow-inner`}
                                        value={formData.budget}
                                        onChange={e => handleFieldChange('budget', parseFloat(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 shadow-sm">
                         <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Calendar size={14} className="text-blue-600"/> Lifecycle Dates
                        </h3>
                        <div className="space-y-5">
                             <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Planned Start</label>
                                <Input type="date" value={formData.startDate} onChange={e => handleFieldChange('startDate', e.target.value)} className="bg-slate-50/50" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Target Completion</label>
                                <Input type="date" value={formData.endDate} onChange={e => handleFieldChange('endDate', e.target.value)} className="bg-slate-50/50" />
                            </div>
                        </div>
                    </Card>

                    <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-white/5">
                         <div className="relative z-10">
                            <h4 className="font-bold flex items-center gap-2 mb-3 text-base tracking-tight">
                                <ShieldCheck size={18} className="text-nexus-400"/> System Integrity
                            </h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium uppercase tracking-tight">
                                Program creation acts as a strategic parent node in the Enterprise Graph. All projects assigned to this program will contribute to aggregated Earned Value (EVM) metrics and burn rates.
                            </p>
                            <div className="mt-6 flex items-center gap-2 text-nexus-400">
                                <Activity size={14} className="animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Awaiting Commitment</span>
                            </div>
                        </div>
                        <Gavel size={140} className="absolute -right-8 -bottom-8 text-white/5 rotate-12 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramCreatePage;
