
import React from 'react';
import { WorkflowDefinition, WorkflowStep } from '../../../types';
import { Plus, ArrowRight, UserCheck, Bell, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface WorkflowCanvasProps {
    workflow?: WorkflowDefinition;
    onAddStep: () => void;
    onEditStep: (step: WorkflowStep, index: number) => void;
    onDeleteStep: (index: number) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ workflow, onAddStep, onEditStep, onDeleteStep }) => {
    const theme = useTheme();

    if (!workflow) return <div className="flex-1 flex items-center justify-center text-slate-400">Select or create a workflow</div>;

    return (
        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-8 overflow-x-auto flex items-center gap-4 min-h-[400px]">
            {/* Start Node */}
            <div className="flex flex-col items-center gap-2 opacity-50">
                <div className="w-12 h-12 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-green-600"></div>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Start</span>
            </div>

            <ArrowRight className="text-slate-300" size={24}/>

            {workflow.steps.map((step, idx) => (
                <React.Fragment key={step.id || idx}>
                    <div 
                        onClick={() => onEditStep(step, idx)}
                        className={`
                            w-64 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md relative group bg-white
                            ${step.type === 'Approval' ? 'border-blue-200 hover:border-blue-400' : 'border-slate-200 hover:border-slate-400'}
                        `}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{step.type}</span>
                            {step.type === 'Approval' && <UserCheck size={14} className="text-blue-500"/>}
                            {step.type === 'Notification' && <Bell size={14} className="text-yellow-500"/>}
                        </div>
                        <h4 className="font-bold text-slate-800">{step.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">Assignee: {step.role}</p>
                    </div>
                    <ArrowRight className="text-slate-300" size={24}/>
                </React.Fragment>
            ))}

            {/* Add Node */}
            <button 
                onClick={onAddStep}
                className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-nexus-600 hover:border-nexus-400 transition-all bg-white"
            >
                <Plus size={24}/>
            </button>

            <ArrowRight className="text-slate-300" size={24}/>

            {/* End Node */}
             <div className="flex flex-col items-center gap-2 opacity-50">
                <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-slate-400 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-sm bg-slate-500"></div>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">End</span>
            </div>
        </div>
    );
};
