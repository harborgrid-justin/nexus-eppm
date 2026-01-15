
import React from 'react';
import { Plus, GitPullRequest } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../context/I18nContext';
import { Button } from '../ui/Button';
import { WorkflowCanvas } from './workflows/WorkflowCanvas';
import { WorkflowPanel } from './workflows/WorkflowPanel';
import { StepPanel } from './workflows/StepPanel';
import { useWorkflowDesignerLogic } from '../../hooks/domain/useWorkflowDesignerLogic';
import { EmptyGrid } from '../common/EmptyGrid';

const WorkflowDesigner: React.FC = () => {
    const theme = useTheme();
    const { t } = useI18n();
    const {
        workflows, activeWorkflow, activeWorkflowId, setActiveWorkflowId,
        isPanelOpen, setIsPanelOpen, editingWorkflow, isStepPanelOpen,
        setIsStepPanelOpen, editingStep, editingStepIndex,
        handleOpenWorkflowPanel, handleSaveWorkflow, handleDeleteWorkflow,
        handleOpenStepPanel, handleSaveStep, handleDeleteStep
    } = useWorkflowDesignerLogic();

    return (
        <div className="h-full flex flex-col space-y-6 animate-nexus-in">
            <div className={`p-4 rounded-xl border ${theme.colors.border} bg-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm`}>
                <div className="flex items-center gap-4">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Active Pipeline Logic:</label>
                    {workflows.length > 0 ? (
                        <select 
                            value={activeWorkflowId || ''} 
                            onChange={e => setActiveWorkflowId(e.target.value)} 
                            className={`font-black text-lg bg-transparent border-b-2 border-dashed border-slate-200 hover:border-nexus-500 focus:outline-none transition-colors outline-none cursor-pointer ${theme.colors.text.primary}`}
                        >
                            {workflows.map(wf => <option key={wf.id} value={wf.id}>{wf.name}</option>)}
                        </select>
                    ) : (
                        <span className="text-sm text-slate-400 italic">No automation threads mapped.</span>
                    )}
                </div>
                <Button size="sm" icon={Plus} onClick={() => handleOpenWorkflowPanel()}>Establish Workflow</Button>
            </div>
            
            <div className="flex-1 overflow-hidden relative rounded-[2.5rem] border border-slate-200 bg-slate-50/30 nexus-empty-pattern shadow-inner">
                {activeWorkflow ? (
                    <WorkflowCanvas 
                        workflow={activeWorkflow}
                        onAddStep={() => handleOpenStepPanel()}
                        onEditStep={(step, idx) => handleOpenStepPanel(step, idx)}
                        onDeleteStep={handleDeleteStep}
                    />
                ) : (
                    <EmptyGrid 
                        title="Workflow Ledger Neutral" 
                        description="Define an approval sequence to automate cross-tenant business processes like Change Orders and Baseline commits." 
                        icon={GitPullRequest} 
                        actionLabel="Initialize Workflow Engine"
                        onAdd={() => handleOpenWorkflowPanel()}
                    />
                )}
            </div>
            <WorkflowPanel isOpen={isPanelOpen} onClose={() => setIsPanelOpen(false)} workflow={editingWorkflow} onSave={handleSaveWorkflow} onDelete={handleDeleteWorkflow} />
            <StepPanel isOpen={isStepPanelOpen} onClose={() => setIsStepPanelOpen(false)} step={editingStep} onSave={(step) => handleSaveStep(step, editingStepIndex)} />
        </div>
    );
};
export default WorkflowDesigner;
