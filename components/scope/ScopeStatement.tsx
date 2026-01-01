
import React, { useState } from 'react';
import { FileText, Save, Book, Lock, ChevronDown, ChevronRight, Target, AlertCircle, CheckSquare, XSquare } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';

interface ScopeStatementProps {
    projectId: string;
}

const ScopeSection = ({ title, icon: Icon, children, isOpen, onToggle }: any) => {
    const theme = useTheme();
    return (
        <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-lg overflow-hidden mb-4 shadow-sm`}>
            <button onClick={onToggle} className={`w-full flex items-center justify-between p-4 ${theme.colors.background} border-b ${theme.colors.border} hover:brightness-95 transition-all`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isOpen ? `bg-nexus-100 text-nexus-700` : `${theme.colors.surface} border ${theme.colors.border} ${theme.colors.text.secondary}`}`}>
                        <Icon size={18} />
                    </div>
                    <h4 className={`font-bold ${theme.colors.text.primary}`}>{title}</h4>
                </div>
                {isOpen ? <ChevronDown size={16} className={theme.colors.text.tertiary} /> : <ChevronRight size={16} className={theme.colors.text.tertiary} />}
            </button>
            {isOpen && <div className="p-6 animate-in slide-in-from-top-2 duration-200">{children}</div>}
        </div>
    );
};


const ScopeStatement: React.FC<ScopeStatementProps> = ({ projectId }) => {
    const theme = useTheme();
    const { canEditProject } = usePermissions();
    const [sections, setSections] = useState({
        description: true,
        deliverables: true,
        exclusions: false,
        constraints: false
    });

    const toggle = (key: keyof typeof sections) => setSections(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className={`h-full flex flex-col ${theme.colors.background}/50`}>
            <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center ${theme.colors.surface}`}>
                <h3 className={`font-semibold ${theme.colors.text.primary} text-sm flex items-center gap-2`}>
                    <FileText size={18} className="text-nexus-600" /> Project Scope Statement
                </h3>
                <div className="flex gap-2">
                    {canEditProject() ? (
                        <button className={`flex items-center gap-2 px-3 py-2 ${theme.colors.primary} rounded-lg text-sm font-medium text-white ${theme.colors.primaryHover} shadow-sm`}>
                            <Save size={14}/> Save Version
                        </button>
                    ) : (
                        <div className={`flex items-center gap-2 px-3 py-2 ${theme.colors.background} border ${theme.colors.border} rounded-lg text-sm ${theme.colors.text.tertiary}`}>
                            <Lock size={14}/> Read Only
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
                <ScopeSection title="1. Product & Project Scope Description" icon={Target} isOpen={sections.description} onToggle={() => toggle('description')}>
                    <div className="space-y-4">
                        <p className={`text-sm ${theme.colors.text.secondary}`}>Describe the characteristics of the product, service, or result.</p>
                        <textarea 
                            className={`w-full h-32 p-4 border ${theme.colors.border} rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:${theme.colors.background}`}
                            placeholder="Detailed description of the project scope..."
                            disabled={!canEditProject()}
                        />
                    </div>
                </ScopeSection>

                <ScopeSection title="2. Project Deliverables" icon={CheckSquare} isOpen={sections.deliverables} onToggle={() => toggle('deliverables')}>
                    <div className="space-y-4">
                        <p className={`text-sm ${theme.colors.text.secondary}`}>List the unique and verifiable products, results, or capabilities.</p>
                        <textarea 
                            className={`w-full h-32 p-4 border ${theme.colors.border} rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:${theme.colors.background}`}
                            placeholder="- Deliverable 1&#10;- Deliverable 2"
                            disabled={!canEditProject()}
                        />
                    </div>
                </ScopeSection>

                <ScopeSection title="3. Project Exclusions" icon={XSquare} isOpen={sections.exclusions} onToggle={() => toggle('exclusions')}>
                    <div className="space-y-4">
                        <p className={`text-sm ${theme.colors.text.secondary}`}>Explicitly state what is out of scope to manage stakeholder expectations.</p>
                        <textarea 
                            className={`w-full h-32 p-4 border ${theme.colors.border} rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:${theme.colors.background}`}
                            placeholder="The following items are out of scope..."
                            disabled={!canEditProject()}
                        />
                    </div>
                </ScopeSection>

                <ScopeSection title="4. Constraints & Assumptions" icon={AlertCircle} isOpen={sections.constraints} onToggle={() => toggle('constraints')}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.text.secondary} mb-1 uppercase`}>Constraints</label>
                                <textarea className={`w-full h-24 p-2 border ${theme.colors.border} rounded-md text-sm`} placeholder="Budget, Schedule, Resources..." disabled={!canEditProject()}/>
                            </div>
                            <div>
                                <label className={`block text-xs font-bold ${theme.colors.text.secondary} mb-1 uppercase`}>Assumptions</label>
                                <textarea className={`w-full h-24 p-2 border ${theme.colors.border} rounded-md text-sm`} placeholder="Market conditions, Approvals..." disabled={!canEditProject()}/>
                            </div>
                        </div>
                    </div>
                </ScopeSection>
            </div>
        </div>
    );
};

export default ScopeStatement;
