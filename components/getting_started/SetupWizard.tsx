
import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Building2, Layers, PieChart, Briefcase, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { generateId } from '../../utils/formatters';
import { Program, Project, EPSNode } from '../../types';

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

    // Generated IDs for linking
    const [newEpsId, setNewEpsId] = useState('');
    const [newProgramId, setNewProgramId] = useState('');

    const handleNext = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleFinalize();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleFinalize = () => {
        // 1. Update Org Profile
        dispatch({ 
            type: 'GOVERNANCE_UPDATE_ORG_PROFILE', 
            payload: { name: orgName, currency } 
        });

        // 2. Create EPS Node (Portfolio)
        const epsId = generateId('EPS');
        const epsNode: EPSNode = {
            id: epsId,
            parentId: 'EPS-ROOT', // Assume root exists or create it
            name: epsName,
            code: epsName.substring(0, 4).toUpperCase()
        };
        dispatch({ type: 'ADMIN_ADD_EPS_NODE', payload: epsNode });

        // 3. Create Program
        const programId = generateId('PRG');
        const program: Program = {
            id: programId,
            name: programName,
            managerId: state.resources[0]?.id || 'Unassigned',
            description: 'Strategic initiative created during setup.',
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            budget: 1000000,
            benefits: '',
            status: 'Active',
            health: 'Good',
            strategicImportance: 10,
            financialValue: 0,
            riskScore: 0,
            calculatedPriorityScore: 50,
            category: 'Strategic',
            businessCase: ''
        };
        dispatch({ type: 'ADD_PROGRAM', payload: program });

        // 4. Create Project
        const project: Project = {
            id: generateId('P'),
            programId: programId,
            epsId: epsId,
            obsId: 'OBS-ROOT', // Default
            calendarId: 'CAL-STD', // Default
            name: projectName,
            code: `PRJ-${new Date().getFullYear()}-01`,
            managerId: state.resources[0]?.id || 'Unassigned',
            originalBudget: 500000,
            budget: 500000,
            spent: 0,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
            health: 'Good',
            status: 'Active',
            strategicImportance: 5,
            financialValue: 0,
            riskScore: 0,
            resourceFeasibility: 5,
            calculatedPriorityScore: 50,
            category: 'General',
            tasks: []
        };
        dispatch({ type: 'PROJECT_IMPORT', payload: [project] });

        onComplete();
    };

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title="Enterprise Setup Wizard"
            size="lg"
            footer={
                <div className="flex justify-between w-full">
                    <Button variant="secondary" onClick={handleBack} disabled={currentStep === 1}>
                        <ArrowLeft className="mr-2 h-4 w-4"/> Back
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={onClose}>Skip Setup</Button>
                        <Button onClick={handleNext} icon={currentStep === 4 ? CheckCircle : ArrowRight}>
                            {currentStep === 4 ? 'Launch Platform' : 'Next Step'}
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="flex flex-col h-[400px]">
                {/* Stepper */}
                <div className="flex justify-between mb-10 relative px-4">
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10"></div>
                    {STEPS.map((step) => {
                        const isActive = step.id === currentStep;
                        const isComplete = step.id < currentStep;
                        return (
                            <div key={step.id} className="flex flex-col items-center gap-2 bg-white px-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                    isActive ? 'bg-nexus-600 text-white shadow-lg scale-110' :
                                    isComplete ? 'bg-green-500 text-white' :
                                    'bg-slate-100 text-slate-400 border border-slate-200'
                                }`}>
                                    <step.icon size={18} />
                                </div>
                                <span className={`text-xs font-bold ${isActive ? 'text-nexus-700' : 'text-slate-400'}`}>{step.label}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-xl font-bold text-slate-800 text-center">Configure Organization</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                                    <Input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="e.g. Acme Corp" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Base Currency</label>
                                    <select 
                                        className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white"
                                        value={currency}
                                        onChange={e => setCurrency(e.target.value)}
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-xl font-bold text-slate-800 text-center">Define Portfolio Structure</h3>
                            <p className="text-sm text-slate-500 text-center">Create your top-level Enterprise Project Structure (EPS) node.</p>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Portfolio Name</label>
                                <Input value={epsName} onChange={e => setEpsName(e.target.value)} placeholder="e.g. Global Infrastructure" />
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-xl font-bold text-slate-800 text-center">Establish Strategic Program</h3>
                            <p className="text-sm text-slate-500 text-center">Group related projects under a unifying program.</p>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Program Name</label>
                                <Input value={programName} onChange={e => setProgramName(e.target.value)} placeholder="e.g. Digital Transformation" />
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <h3 className="text-xl font-bold text-slate-800 text-center">Launch Pilot Project</h3>
                            <p className="text-sm text-slate-500 text-center">Create your first active project to start tracking.</p>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                                <Input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="e.g. Cloud Migration Phase 1" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};
