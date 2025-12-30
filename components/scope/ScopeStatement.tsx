
import React, { useState } from 'react';
import { FileText, Save, BookOpen, Lock, ChevronDown, ChevronRight, AlertCircle, Check, X } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useTheme } from '../../context/ThemeContext';

interface ScopeStatementProps {
    projectId: string;
}

const ScopeSection = ({ title, icon: Icon, children, isOpen, onToggle }: any) => (
    <div className="border border-slate-200 rounded-lg bg-white overflow-hidden mb-4 shadow-sm">
        <button onClick={onToggle} className="w-full flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100 hover:bg-slate-100 transition-colors">
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
        <div className="h-full flex flex-col bg-slate-50/50">
            <div className={`p-4 ${theme.layout.headerBorder} flex justify-between items-center bg-white`}>
                <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                    <FileText size={18} className="text-nexus-600" /> Project Scope Statement
                </h3>
                <div className="flex gap-2">
                    {canEditProject() ? (
                        <button className={`flex items-center gap-2 px-3 py-2 ${theme.colors.accentBg} rounded-lg text-sm font-medium text-white hover:bg-nexus-700 shadow-sm`}>
                            <Save size={14}/> Save Version
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-400">
                            <Lock size={14}/> Read Only
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
                <ScopeSection title="1. Product & Project Scope Description" icon={FileText} isOpen={sections.description} onToggle={() => toggle('description')}>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500">Describe the characteristics of the product, service, or result.</p>
                        <textarea 
                            className="w-full h-32 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50"
                            placeholder="Detailed description of the project scope..."
                            disabled={!canEditProject()}
                        />
                    </div>
                </ScopeSection>

                <ScopeSection title="2. Project Deliverables" icon={Check} isOpen={sections.deliverables} onToggle={() => toggle('deliverables')}>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500">List the unique and verifiable products, results, or capabilities.</p>
                        <textarea 
                            className="w-full h-32 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50"
                            placeholder="- Deliverable 1&#10;- Deliverable 2"
                            disabled={!canEditProject()}
                        />
                    </div>
                </ScopeSection>

                <ScopeSection title="3. Project Exclusions" icon={X} isOpen={sections.exclusions} onToggle={() => toggle('exclusions')}>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500">Explicitly state what is out of scope to manage stakeholder expectations.</p>
                        <textarea 
                            className="w-full h-32 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50"
                            placeholder="The following items are out of scope..."
                            disabled={!canEditProject()}
                        />
                    </div>
                </ScopeSection>

                <ScopeSection title="4. Constraints & Assumptions" icon={AlertCircle} isOpen={sections.constraints} onToggle={() => toggle('constraints')}>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Constraints</label>
                                <textarea className="w-full h-24 p-2 border border-slate-300 rounded-md text-sm" placeholder="Budget, Schedule, Resources..." disabled={!canEditProject()}/>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Assumptions</label>
                                <textarea className="w-full h-24 p-2 border border-slate-300 rounded-md text-sm" placeholder="Market conditions, Approvals..." disabled={!canEditProject()}/>
                            </div>
                        </div>
                    </div>
                </ScopeSection>
            </div>
        </div>
    );
};

export default ScopeStatement;
