
import { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { WorkflowDefinition, WorkflowStep } from '../../types';

export const useWorkflowDesignerLogic = () => {
    const { state, dispatch } = useData();
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

    return {
        workflows: state.workflows,
        activeWorkflow,
        activeWorkflowId,
        setActiveWorkflowId,
        isPanelOpen,
        setIsPanelOpen,
        editingWorkflow,
        isStepPanelOpen,
        setIsStepPanelOpen,
        editingStep,
        editingStepIndex,
        handleOpenWorkflowPanel,
        handleSaveWorkflow,
        handleDeleteWorkflow,
        handleOpenStepPanel,
        handleSaveStep,
        handleDeleteStep
    };
};
