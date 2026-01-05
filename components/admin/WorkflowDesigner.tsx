
import React from 'react';
import { Plus, Settings } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';
import { WorkflowCanvas } from './workflows/WorkflowCanvas';
import { WorkflowPanel } from './workflows/WorkflowPanel';
import { StepPanel } from './workflows/StepPanel';
import { useWorkflowDesignerLogic } from '../../hooks/domain/useWorkflowDesignerLogic';

const WorkflowDesigner: React.FC = () => {
    const theme = useTheme();
    const {
        workflows,
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
    } = useWorkflowDesignerLogic();

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Definition:</label>
                    {workflows.length > 0 ? (
                        <select 
                            value={activeWorkflowId || ''} 
                            onChange={e => setActiveWorkflowId(e.target.value)} 
                            className={`font-bold text-lg bg-transparent border-b border-dashed border-slate-300 hover:border-nexus-500 focus:outline-none cursor-pointer ${theme.colors.text.primary}`}
                        >
                            {workflows.map(wf => <option key={wf.id} value={wf.id}>{wf.name}</option>)}
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
