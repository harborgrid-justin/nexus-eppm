
import React, { useState, useEffect } from 'react';
import { FileText, Save, Book, Lock } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

interface ResourcePlanEditorProps {
    projectId: string;
}

const ResourcePlanEditor: React.FC<ResourcePlanEditorProps> = ({ projectId }) => {
    const { state, dispatch } = useData();
    const { canEditProject } = usePermissions();
    const theme = useTheme();

    const project = state.projects.find(p => p.id === projectId);
    
    // Initialize from project state or default to empty string
    const [content, setContent] = useState('');
    const [assumptions, setAssumptions] = useState('');
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (project?.resourcePlan) {
            setContent(project.resourcePlan.staffingStrategy || '');
            setAssumptions(project.resourcePlan.assumptions || '');
        }
    }, [project]);

    const handleSave = () => {
        if (!project) return;
        
        const updatedResourcePlan = {
            ...project.resourcePlan,
            staffingStrategy: content,
            assumptions: assumptions,
            lastUpdated: new Date().toISOString()
        };

        dispatch({
            type: 'PROJECT_UPDATE',
            payload: {
                projectId,
                updatedData: { resourcePlan: updatedResourcePlan }
            }
        });
        setIsDirty(false);
    };

    const handleLoadTemplate = () => {
        setContent("1. Staffing Acquisition: Internal first, then contractors.\n2. Training: All staff must complete safety onboarding.\n3. Release: 2-week notice required.");
        setAssumptions("Assumption 1: Availability of specialized welders in Q3.\nAssumption 2: No major scope changes impacting headcount.");
        setIsDirty(true);
    };

    return (
        <div className="h-full flex flex-col bg-white">
            <div className={`p-4 border-b ${theme.colors.border} flex-shrink-0 flex items-center justify-between bg-slate-50`}>
                <h3 className={`font-bold ${theme.colors.text.primary} text-sm flex items-center gap-2`}>
                    <FileText size={16} className="text-nexus-600" /> Resource Management Plan
                </h3>
                <div className="flex gap-2">
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        icon={Book} 
                        onClick={handleLoadTemplate}
                        disabled={!canEditProject()}
                    >
                        Apply Template
                    </Button>
                    {canEditProject() ? (
                        <Button 
                            size="sm" 
                            icon={Save} 
                            onClick={handleSave}
                            disabled={!isDirty}
                            className={isDirty ? 'animate-pulse' : ''}
                        >
                            {isDirty ? 'Save Changes' : 'Saved'}
                        </Button>
                    ) : (
                        <div className={`flex items-center gap-2 px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-400`}>
                            <Lock size={14}/> Read Only
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                    <label className={`block text-xs font-bold uppercase tracking-widest ${theme.colors.text.secondary} mb-2`}>
                        Staffing Approach & Strategy
                    </label>
                    <textarea 
                        disabled={!canEditProject()}
                        className={`w-full h-48 p-4 border ${theme.colors.border} rounded-lg text-sm focus:ring-2 focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50 resize-none leading-relaxed`}
                        placeholder="Describe the approach for identifying, acquiring, and managing project resources..."
                        value={content}
                        onChange={(e) => { setContent(e.target.value); setIsDirty(true); }}
                    />
                </div>
                 <div>
                    <label className={`block text-xs font-bold uppercase tracking-widest ${theme.colors.text.secondary} mb-2`}>
                        Assumptions & Constraints
                    </label>
                    <textarea 
                        disabled={!canEditProject()}
                        className={`w-full h-32 p-4 border ${theme.colors.border} rounded-lg text-sm focus:ring-2 focus:ring-nexus-500 focus:border-nexus-500 disabled:bg-slate-50 resize-none leading-relaxed`}
                        placeholder="List any assumptions and constraints related to resource availability, skills, or budget..."
                        value={assumptions}
                        onChange={(e) => { setAssumptions(e.target.value); setIsDirty(true); }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ResourcePlanEditor;
