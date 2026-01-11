
import React, { useState } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useData } from '../../context/DataContext';
import { FileText, Target, AlertCircle, CheckSquare, XSquare, Info, ChevronDown, Lock } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';
import { NarrativeField } from '../common/NarrativeField';
import { useToast } from '../../context/ToastContext';

interface ScopeSectionProps {
    title: string;
    icon: React.ElementType;
    children: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
}

const ScopeSection: React.FC<ScopeSectionProps> = ({ title, icon: Icon, children, isOpen, onToggle }) => {
    const theme = useTheme();
    return (
        <div className={`border ${theme.colors.border} rounded-2xl overflow-hidden mb-6 shadow-sm bg-white transition-all duration-300 ${isOpen ? 'ring-4 ring-nexus-500/5 border-nexus-200' : ''}`}>
            <button 
                onClick={onToggle} 
                className={`w-full flex items-center justify-between p-5 text-left transition-all ${isOpen ? 'bg-white border-b border-slate-100' : 'bg-slate-50/50 hover:bg-slate-100'}`}
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${isOpen ? 'bg-nexus-600 text-white shadow-lg shadow-nexus-500/20 scale-110' : `bg-white border border-slate-200 text-slate-400`}`}>
                        <Icon size={20} />
                    </div>
                    <h4 className={`font-black tracking-tight uppercase text-xs tracking-widest ${isOpen ? 'text-slate-900' : 'text-slate-500'}`}>{title}</h4>
                </div>
                <div className={`p-1.5 rounded-full transition-all ${isOpen ? 'bg-nexus-50 text-nexus-600 rotate-0' : 'bg-slate-100 text-slate-400 rotate-180'}`}>
                    <ChevronDown size={18} />
                </div>
            </button>
            {isOpen && <div className={`p-8 animate-in slide-in-from-top-2 duration-300 bg-white`}>{children}</div>}
        </div>
    );
};

const ScopeStatement: React.FC<{ projectId: string }> = ({ projectId }) => {
    const theme = useTheme();
    const { project } = useProjectWorkspace();
    const { dispatch } = useData();
    const { success } = useToast();
    const { canEditProject } = usePermissions();
    
    const [sections, setSections] = useState({
        description: true,
        deliverables: true,
        exclusions: false,
        constraints: false
    });

    const toggle = (key: keyof typeof sections) => setSections(prev => ({ ...prev, [key]: !prev[key] }));

    const handleUpdate = (field: string, value: any) => {
        dispatch({
            type: 'PROJECT_UPDATE',
            payload: {
                projectId,
                updatedData: { [field]: value }
            }
        });
        success("Scope Baseline Updated", "Project boundaries synchronized in the global ledger.");
    };

    if (!project) return null;

    return (
        <div className={`h-full flex flex-col bg-slate-50/30 scrollbar-thin`}>
            <div className="flex-1 overflow-y-auto p-10 max-w-6xl mx-auto w-full">
                {/* Configuration Baseline Hero Section */}
                <div className="mb-10 p-8 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl border border-white/10">
                    <div className="relative z-10">
                        <h4 className="font-black flex items-center gap-2 mb-3 text-sm uppercase tracking-widest text-nexus-400">
                            <Target size={16}/> Configuration Baseline
                        </h4>
                        <p className="text-slate-300 text-lg leading-relaxed max-w-2xl font-medium">
                            The Project Scope Statement establishes the authoritative boundary for the Performance Measurement Baseline (PMB). All execution must align with these verified objectives.
                        </p>
                    </div>
                    <FileText size={200} className="absolute -right-16 -bottom-16 text-white/5 opacity-5 rotate-12 pointer-events-none" />
                </div>

                {/* 1. Product & Project Scope */}
                <ScopeSection title="1. Product & Project Scope" icon={Target} isOpen={sections.description} onToggle={() => toggle('description')}>
                    <NarrativeField 
                        label="Strategic Intent & Characteristics"
                        value={project.businessCase} 
                        placeholderLabel="No strategic intent defined. Justify the initiative to lock baseline."
                        onSave={(val) => handleUpdate('businessCase', val)}
                        isReadOnly={!canEditProject()}
                    />
                </ScopeSection>

                {/* 2. Project Deliverables */}
                <ScopeSection title="2. Project Deliverables" icon={CheckSquare} isOpen={sections.deliverables} onToggle={() => toggle('deliverables')}>
                    <NarrativeField 
                        label="Verifiable Outcomes (WBS Summary)"
                        value={project.description} 
                        placeholderLabel="Unique products or services to be produced are currently unmapped."
                        onSave={(val) => handleUpdate('description', val)}
                        isReadOnly={!canEditProject()}
                    />
                </ScopeSection>

                {/* 3. Project Exclusions */}
                <ScopeSection title="3. Project Exclusions" icon={XSquare} isOpen={sections.exclusions} onToggle={() => toggle('exclusions')}>
                    <NarrativeField 
                        label="Out-of-Scope Items (Negative Scope)"
                        value="" 
                        placeholderLabel="Explicitly state what is excluded to manage stakeholder expectations and prevent scope creep."
                        onAdd={() => {}} 
                        isReadOnly={!canEditProject()}
                    />
                </ScopeSection>

                {/* 4. Constraints & Assumptions */}
                <ScopeSection title="4. Constraints & Assumptions" icon={AlertCircle} isOpen={sections.constraints} onToggle={() => toggle('constraints')}>
                    <div className="space-y-8">
                        <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-4 items-start shadow-sm">
                             <Info size={24} className="text-blue-600 shrink-0 mt-0.5"/>
                             <p className="text-xs text-blue-900 leading-relaxed font-bold uppercase tracking-tight">
                                 Assumptions and constraints are critical inputs for risk modeling and Monte Carlo simulations. These parameters are reviewed by the PMO quarterly to ensure roadmap integrity.
                             </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <NarrativeField 
                                label="Project Constraints"
                                value="" 
                                placeholderLabel="Budget caps, hard logic constraints, or resource limitations."
                                onAdd={() => {}}
                                isReadOnly={!canEditProject()}
                            />
                            <NarrativeField 
                                label="Execution Assumptions"
                                value={project.assumptions?.[0]?.description} 
                                placeholderLabel="Factors considered to be true without absolute proof."
                                onSave={(val) => {
                                    const newAssumptions = [{ id: 'ASM-01', description: val, ownerId: 'Unassigned', status: 'Active' }];
                                    handleUpdate('assumptions', newAssumptions);
                                }}
                                isReadOnly={!canEditProject()}
                            />
                        </div>
                    </div>
                </ScopeSection>
            </div>
            
            {!canEditProject() && (
                <div className="p-4 bg-slate-900 text-white flex justify-center items-center gap-2 text-[10px] font-black uppercase tracking-widest shrink-0 border-t border-white/10">
                    <Lock size={14} className="text-nexus-400"/> Read-Only Mode: Baseline Protected
                </div>
            )}
        </div>
    );
};

export default ScopeStatement;
