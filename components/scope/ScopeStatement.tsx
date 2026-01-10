import React, { useState } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useData } from '../../context/DataContext';
import { FileText, Save, Lock, ChevronDown, ChevronRight, Target, AlertCircle, CheckSquare, XSquare, Info } from 'lucide-react';
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
            >
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl transition-all duration-300 ${isOpen ? 'bg-nexus-600 text-white shadow-lg shadow-nexus-500/20' : `bg-white border border-slate-200 text-slate-400`}`}>
                        <Icon size={20} />
                    </div>
                    <h4 className={`font-black tracking-tight uppercase text-xs tracking-widest ${isOpen ? 'text-slate-900' : 'text-slate-500'}`}>{title}</h4>
                </div>
                {isOpen ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
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

    const handleUpdate = (field: string, value: string) => {
        dispatch({
            type: 'PROJECT_UPDATE',
            payload: {
                projectId,
                updatedData: { [field]: value }
            }
        });
        success("Field Updated", "Project scope baseline synchronized.");
    };

    if (!project) return null;

    return (
        <div className={`h-full flex flex-col bg-slate-50/30 scrollbar-thin`}>
            <div className={`p-6 border-b ${theme.colors.border} flex justify-between items-center bg-white shrink-0`}>
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-nexus-900 text-white rounded-xl">
                        <FileText size={22} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">Project Scope Statement</h3>
                        <p className="text-xs text-slate-500 font-medium">Formal boundary definition for project deliverables.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    {!canEditProject() && (
                        <div className={`flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest`}>
                            <Lock size={14}/> Read Only
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 max-w-6xl mx-auto w-full">
                <div className="mb-8 p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10">
                        <h4 className="font-bold flex items-center gap-2 mb-2 text-base tracking-tight">
                            <Target size={20} className="text-nexus-400"/> Strategic Baseline
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
                            The Scope Statement provides a common understanding of the project's requirements. 
                            It defines what is <strong>included</strong> and what is <strong>excluded</strong> to prevent scope creep during execution.
                        </p>
                    </div>
                    <FileText size={180} className="absolute -right-12 -bottom-12 text-white/5 opacity-10 rotate-12" />
                </div>

                <ScopeSection title="1. Product & Project Scope" icon={Target} isOpen={sections.description} onToggle={() => toggle('description')}>
                    <NarrativeField 
                        label="In-Scope Characteristics"
                        value={project.businessCase} 
                        placeholderLabel="Detailed description of the characteristics of the product or service."
                        onSave={(val) => handleUpdate('businessCase', val)}
                        isReadOnly={!canEditProject()}
                    />
                </ScopeSection>

                <ScopeSection title="2. Project Deliverables" icon={CheckSquare} isOpen={sections.deliverables} onToggle={() => toggle('deliverables')}>
                    <NarrativeField 
                        label="Verifiable Outcomes"
                        value={project.description} 
                        placeholderLabel="Identify the unique and verifiable products, results, or capabilities to be produced."
                        onSave={(val) => handleUpdate('description', val)}
                        isReadOnly={!canEditProject()}
                    />
                </ScopeSection>

                <ScopeSection title="3. Project Exclusions" icon={XSquare} isOpen={sections.exclusions} onToggle={() => toggle('exclusions')}>
                    <NarrativeField 
                        label="Out-of-Scope Items"
                        value="" // Assuming a schema extension or using description if needed, for now placeholder
                        placeholderLabel="Explicitly state what is excluded from the project to manage expectations."
                        onSave={() => {}} 
                        isReadOnly={!canEditProject()}
                    />
                </ScopeSection>

                <ScopeSection title="4. Constraints & Assumptions" icon={AlertCircle} isOpen={sections.constraints} onToggle={() => toggle('constraints')}>
                    <div className="space-y-8">
                        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3">
                             <Info size={20} className="text-amber-600 mt-0.5 shrink-0"/>
                             <p className="text-xs text-amber-800 leading-relaxed font-bold uppercase tracking-tight">
                                 Failure to validate assumptions often results in schedule delay or budget overrun. These should be reviewed by the CCB monthly.
                             </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <NarrativeField 
                                label="Project Constraints"
                                value="" 
                                placeholderLabel="Budget, Schedule, Technical, or Resource limitations."
                                onAdd={() => {}}
                                isReadOnly={!canEditProject()}
                            />
                            <NarrativeField 
                                label="Strategic Assumptions"
                                value={project.assumptions?.[0]?.description} 
                                placeholderLabel="Factors considered to be true for planning purposes."
                                onSave={(val) => {
                                    const newAssumptions = [{ id: 'ASM-01', description: val, ownerId: 'Unassigned', status: 'Active' }];
                                    handleUpdate('assumptions', JSON.stringify(newAssumptions));
                                }}
                                isReadOnly={!canEditProject()}
                            />
                        </div>
                    </div>
                </ScopeSection>
            </div>
        </div>
    );
};

export default ScopeStatement;