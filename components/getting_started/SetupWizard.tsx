
import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Building2, Layers, PieChart, Briefcase, CheckCircle, ArrowRight, ArrowLeft, X, Rocket } from 'lucide-react';
import { generateId } from '../../utils/formatters';
import { Program, Project, EPSNode } from '../../types';
import { WizardStep1 } from './wizard/WizardStep1';
// Note: We can inline other simple steps or extract them similarly. For brevity, I'll inline the simple inputs but use the extracted component for Step 1 as a pattern demonstration and to reduce LOC.
import { Input } from '../ui/Input';

interface SetupWizardProps {
    onClose: () => void;
    onComplete: () => void;
}

const STEPS = [
    { id: 1, label: 'Organization', icon: Building2 },
    { id: 2, label: 'Portfolio Structure', icon: Layers },
    { id: 3, label: 'Strategic Program', icon: PieChart },
    { id: 4, label: 'Pilot Project', icon: Briefcase },
];

export const SetupWizard: React.FC<SetupWizardProps> = ({ onClose, onComplete }) => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const [currentStep, setCurrentStep] = useState(1);
    
    // Form States
    const [orgName, setOrgName] = useState(state.governance.organization.name || '');
    const [epsName, setEpsName] = useState('Strategic Portfolio');
    const [programName, setProgramName] = useState('FY25 Transformation');
    const [projectName, setProjectName] = useState('Pilot Initiative');
    const [currency, setCurrency] = useState(state.governance.organization.currency || 'USD');

    const handleNext = () => {
        if (currentStep < STEPS.length) setCurrentStep(prev => prev + 1);
        else handleFinalize();
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleFinalize = () => {
        dispatch({ type: 'GOVERNANCE_UPDATE_ORG_PROFILE', payload: { name: orgName, currency } });

        const epsId = generateId('EPS');
        dispatch({ type: 'ADMIN_ADD_EPS_NODE', payload: { id: epsId, parentId: 'EPS-ROOT', name: epsName, code: epsName.substring(0, 4).toUpperCase() } });

        const programId = generateId('PRG');
        dispatch({ type: 'ADD_PROGRAM', payload: {
            id: programId, name: programName, managerId: state.resources[0]?.id || 'Unassigned',
            description: 'Strategic initiative created during setup.', startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            budget: 1000000, benefits: '', status: 'Active', health: 'Good', strategicImportance: 10,
            financialValue: 0, riskScore: 0, calculatedPriorityScore: 50, category: 'Strategic', businessCase: ''
        }});

        const project: Project = {
            id: generateId('P'), programId: programId, epsId: epsId, obsId: 'OBS-ROOT', calendarId: 'CAL-STD',
            name: projectName, code: `PRJ-${new Date().getFullYear()}-01`, managerId: state.resources[0]?.id || 'Unassigned',
            originalBudget: 500000, budget: 500000, spent: 0, startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
            health: 'Good', status: 'Active', strategicImportance: 5, financialValue: 0, riskScore: 0,
            resourceFeasibility: 5, calculatedPriorityScore: 50, category: 'General', tasks: []
        };
        dispatch({ type: 'PROJECT_IMPORT', payload: [project] });

        onComplete();
    };

    return (
        <div className={`fixed inset-0 z-[100] ${theme.colors.background} flex flex-col animate-in slide-in-from-bottom-10 duration-300`}>
            <div className={`flex items-center justify-between px-8 py-6 bg-white border-b ${theme.colors.border} shrink-0`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-nexus-600 text-white rounded-xl shadow-lg shadow-nexus-500/30"><Rocket size={24}/></div>
                    <div><h1 className="text-xl font-black text-slate-900 tracking-tight">Enterprise Setup</h1><p className="text-sm text-slate-500 font-medium">Configure your environment in 4 steps.</p></div>
                </div>
                <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"><X size={24} /></button>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col h-full items-center pt-12 pb-24">
                     <div className="w-full max-w-4xl px-8 mb-16">
                        <div className="flex justify-between relative">
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -z-10 rounded-full transform -translate-y-1/2"></div>
                            <div className="absolute top-1/2 left-0 h-1 bg-nexus-500 -z-10 rounded-full transform -translate-y-1/2 transition-all duration-500 ease-out" style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}></div>
                            
                            {STEPS.map((step) => {
                                const isActive = step.id === currentStep;
                                const isComplete = step.id < currentStep;
                                return (
                                    <div key={step.id} className="flex flex-col items-center gap-3">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-nexus-600 text-white shadow-xl scale-110 ring-4 ring-white' : isComplete ? 'bg-green-500 text-white ring-4 ring-white' : 'bg-slate-100 text-slate-400 ring-4 ring-white'}`}>
                                            {isComplete ? <CheckCircle size={20}/> : <step.icon size={20} />}
                                        </div>
                                        <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-nexus-700' : 'text-slate-400'}`}>{step.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                     </div>

                    <div className="w-full max-w-lg bg-white p-10 rounded-3xl shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {currentStep === 1 && <WizardStep1 orgName={orgName} setOrgName={setOrgName} currency={currency} setCurrency={setCurrency} />}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8"><h3 className="text-2xl font-black text-slate-900 mb-2">Define Portfolio Structure</h3><p className="text-sm text-slate-500">Create your top-level Enterprise Project Structure (EPS).</p></div>
                                <div><label className="block text-sm font-bold text-slate-700 mb-2">Portfolio Name</label><Input value={epsName} onChange={e => setEpsName(e.target.value)} placeholder="e.g. Global Infrastructure" className="h-12 text-lg" /></div>
                            </div>
                        )}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8"><h3 className="text-2xl font-black text-slate-900 mb-2">Strategic Program</h3><p className="text-sm text-slate-500">Group related projects under a unifying program.</p></div>
                                <div><label className="block text-sm font-bold text-slate-700 mb-2">Program Name</label><Input value={programName} onChange={e => setProgramName(e.target.value)} placeholder="e.g. Digital Transformation" className="h-12 text-lg" /></div>
                            </div>
                        )}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="text-center mb-8"><h3 className="text-2xl font-black text-slate-900 mb-2">Launch Pilot Project</h3><p className="text-sm text-slate-500">Create your first active project to start tracking.</p></div>
                                <div><label className="block text-sm font-bold text-slate-700 mb-2">Project Name</label><Input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="e.g. Cloud Migration Phase 1" className="h-12 text-lg" /></div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-200 flex justify-between items-center z-10 shrink-0">
                 <Button variant="ghost" onClick={handleBack} disabled={currentStep === 1} size="lg" className="text-slate-500"><ArrowLeft className="mr-2 h-5 w-5"/> Back</Button>
                 <div className="flex gap-4">
                    <Button variant="secondary" onClick={onClose} size="lg">Skip Setup</Button>
                    <Button onClick={handleNext} size="lg" className="px-8 shadow-xl shadow-nexus-500/20 bg-nexus-600 hover:bg-nexus-700 text-white">
                        {currentStep === 4 ? 'Launch Platform' : 'Next Step'} 
                        {currentStep !== 4 && <ArrowRight className="ml-2 h-5 w-5"/>}
                    </Button>
                 </div>
            </div>
        </div>
    );
};
