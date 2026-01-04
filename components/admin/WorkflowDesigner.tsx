
import React, { useState, useMemo } from 'react';
import { Plus, Settings } from 'lucide-react';
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
    // Track index for editing existing steps
    const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);

    const activeWorkflow = useMemo(() => state.workflows.find(w => w.id === activeWorkflowId), [state.workflows, activeWorkflowId]);

    const handleOpenWorkflowPanel = (wf?: WorkflowDefinition) => {
        setEditingWorkflow(wf || { name: '', trigger: 'ChangeOrder', status: 'Draft', steps: [] });
        setIsPanelOpen(true);
    };

    const handleSaveWorkflow = (wfToSave: WorkflowDefinition) => {
        dispatch({ type: wfToSave.id.startsWith('WF') ? 'ADMIN_UPDATE_WORKFLOW' : 'ADMIN_ADD_WORKFLOW', payload: wfToSave });
        setIsPanelOpen(false);
        if (!activeWorkflowId) setActiveWorkflowId(wfToSave.id);
    };

    const handleDeleteWorkflow = (id: string) => {
        if (confirm("Delete workflow?")) {
            dispatch({ type: 'ADMIN_DELETE_WORKFLOW', payload: id });
            if (activeWorkflowId === id) setActiveWorkflowId(state.workflows.find(w => w.id !== id)?.id || '');
        }
    };

    const handleOpenStepPanel = (step?: WorkflowStep, index: number | null = null) => {
        setEditingStep(step || { name: '', type: 'Approval', role: '', requirements: [] });
        setEditingStepIndex(index);
        setIsStepPanelOpen(true);
    };

    const handleSaveStep = (stepToSave: WorkflowStep, index: number | null) => {
        if (!activeWorkflow) return;
        const updatedSteps = [...activeWorkflow.steps];
        
        if (index !== null && index >= 0) { 
            updatedSteps[index] = stepToSave; 
        } else { 
            updatedSteps.push(stepToSave); 
        }
        
        dispatch({ type: 'ADMIN_UPDATE_WORKFLOW', payload: { ...activeWorkflow, steps: updatedSteps } });
        setIsStepPanelOpen(false);
    };

    const handleDeleteStep = (index: number) => {
        if (!activeWorkflow) return;
        const updatedSteps = activeWorkflow.steps.filter((_, i) => i !== index);
        dispatch({ type: 'ADMIN_UPDATE_WORKFLOW', payload: { ...activeWorkflow, steps: updatedSteps } });
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Definition:</label>
                    {state.workflows.length > 0 ? (
                        <select 
                            value={activeWorkflowId || ''} 
                            onChange={e => setActiveWorkflowId(e.target.value)} 
                            className={`font-bold text-lg bg-transparent border-b border-dashed border-slate-300 hover:border-nexus-500 focus:outline-none cursor-pointer ${theme.colors.text.primary}`}
                        >
                            {state.workflows.map(wf => <option key={wf.id} value={wf.id}>{wf.name}</option>)}
                        </select>
                    ) : (
                        <span className="text-sm text-slate-400 italic">No workflows defined.</span>
                    )}
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" icon={Settings} onClick={() => activeWorkflow && handleOpenWorkflowPanel(activeWorkflow)} disabled={!activeWorkflow}>Settings</Button>
                    <Button size="sm" icon={Plus} onClick={() => handleOpenWorkflowPanel()}>New Workflow</Button>
                </div>
            </div>
            
            <WorkflowCanvas 
                workflow={activeWorkflow}
                onAddStep={() => handleOpenStepPanel()}
                onEditStep={(step, idx) => handleOpenStepPanel(step, idx)}
                onDeleteStep={handleDeleteStep}
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
                onSave={(step) => handleSaveStep(step, editingStepIndex)}
            />
        </div>
    );
};

export default WorkflowDesigner;
