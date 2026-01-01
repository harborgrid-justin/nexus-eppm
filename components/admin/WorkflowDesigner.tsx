
import React, { useState, useMemo } from 'react';
import { GitPullRequest, Plus, Settings, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useTheme } from '../../context/ThemeContext';
import { WorkflowDefinition, WorkflowStep } from '../../types';
import { Button } from '../ui/Button';
import { WorkflowCanvas } from './workflows/WorkflowCanvas';
import { WorkflowPanel } from './workflows/WorkflowPanel';
import { StepPanel } from './workflows/StepPanel';

const WorkflowDesigner: React.FC = () => {
    const { state, dispatch } = useData();
    const theme = useTheme();
    const [activeWorkflowId, setActiveWorkflowId] = useState<string>(state.workflows[0]?.id);
    
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [editingWorkflow, setEditingWorkflow] = useState<Partial<WorkflowDefinition> | null>(null);
    const [isStepPanelOpen, setIsStepPanelOpen] = useState(false);
    const [editingStep, setEditingStep] = useState<Partial<WorkflowStep> | null>(null);

    const activeWorkflow = useMemo(() => state.workflows.find(w => w.id === activeWorkflowId), [state.workflows, activeWorkflowId]);

    const handleOpenWorkflowPanel = (wf?: WorkflowDefinition) => {
        setEditingWorkflow(wf || { name: '', trigger: 'ChangeOrder', status: 'Draft', steps: [] });
        setIsPanelOpen(true);
    };

    const handleSaveWorkflow = (wfToSave: WorkflowDefinition) => {
        dispatch({ type: wfToSave.id.startsWith('WF') ? 'UPDATE_WORKFLOW' : 'ADD_WORKFLOW', payload: wfToSave });
        setIsPanelOpen(false);
        if (!activeWorkflowId) setActiveWorkflowId(wfToSave.id);
    };

    const handleDeleteWorkflow = (id: string) => {
        if (confirm("Delete workflow?")) {
            dispatch({ type: 'DELETE_WORKFLOW', payload: id });
            if (activeWorkflowId === id) setActiveWorkflowId(state.workflows.find(w => w.id !== id)?.id || '');
        }
    };

    const handleSaveStep = (stepToSave: WorkflowStep, index: number | null) => {
        if (!activeWorkflow) return;
        const updatedSteps = [...activeWorkflow.steps];
        if (index !== null) { updatedSteps[index] = stepToSave; } 
        else { updatedSteps.push(stepToSave); }
        dispatch({ type: 'UPDATE_WORKFLOW', payload: { ...activeWorkflow, steps: updatedSteps } });
        setIsStepPanelOpen(false);
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border">
                <div className="flex items-center gap-4">
                    <select value={activeWorkflowId || ''} onChange={e => setActiveWorkflowId(e.target.value)} className="font-bold text-lg bg-transparent">
                        {state.workflows.map(wf => <option key={wf.id} value={wf.id}>{wf.name}</option>)}
                    </select>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" icon={Settings} onClick={() => activeWorkflow && handleOpenWorkflowPanel(activeWorkflow)}>Settings</Button>
                    <Button size="sm" icon={Plus} onClick={() => handleOpenWorkflowPanel()}>New Workflow</Button>
                </div>
            </div>
            <WorkflowCanvas 
                workflow={activeWorkflow}
                onAddStep={() => setIsStepPanelOpen(true)}
                onEditStep={(step, index) => { setEditingStep(step); setIsStepPanelOpen(true); }}
                onDeleteStep={(index) => {}}
            />
            <WorkflowPanel 
                isOpen={isPanelOpen} 
                onClose={() => setIsPanelOpen(false)} 
                workflow={editingWorkflow} 
                onSave={handleSaveWorkflow}
                onDelete={handleDeleteWorkflow}
            />
            <StepPanel 
                isOpen={isStepPanelOpen}
                onClose={() => setIsStepPanelOpen(false)}
                step={editingStep}
                onSave={(step, index) => handleSaveStep(step, index)}
            />
        </div>
    );
};

export default WorkflowDesigner;
