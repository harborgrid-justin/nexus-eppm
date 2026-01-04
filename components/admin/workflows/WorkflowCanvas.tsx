
import React from 'react';
import { WorkflowDefinition, WorkflowStep } from '../../../types';
import { Plus, ArrowRight, UserCheck, Bell, Trash2, Edit2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

interface WorkflowCanvasProps {
    workflow?: WorkflowDefinition;
    onAddStep: () => void;
    onEditStep: (step: WorkflowStep, index: number) => void;
    onDeleteStep: (index: number) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ workflow, onAddStep, onEditStep, onDeleteStep }) => {
    const theme = useTheme();

    if (!workflow) return (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="font-bold">No Workflow Selected</p>
            <p className="text-sm">Create a new workflow or select an existing one to edit.</p>
        </div>
    );

    return (
        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-8 overflow-x-auto flex items-center min-h-[400px] shadow-inner relative">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" 
                 style={{ 
                     backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', 
                     backgroundSize: '20px 20px' 
                 }}>
            </div>

            <div className="flex items-center gap-4 z-10 mx-auto">
                {/* Start Node */}
                <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-green-100 border-4 border-green-500 flex items-center justify-center shadow-sm">
                        <div className="w-4 h-4 rounded-full bg-green-600"></div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-green-700">Start</span>
                </div>

                <ArrowRight className="text-slate-300" size={32}/>

                {workflow.steps.map((step, idx) => (
                    <React.Fragment key={step.id || idx}>
                        <div className="relative group">
                            {/* Action Buttons overlay */}
                            <div className="absolute -top-3 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 bg-white shadow-sm rounded-full border border-slate-200 px-1 py-0.5">
                                <button onClick={() => onEditStep(step, idx)} className="p-1 text-slate-500 hover:text-nexus-600 rounded-full"><Edit2 size={12}/></button>
                                <button onClick={() => onDeleteStep(idx)} className="p-1 text-slate-500 hover:text-red-600 rounded-full"><Trash2 size={12}/></button>
                            </div>

                            <div 
                                onClick={() => onEditStep(step, idx)}
                                className={`
                                    w-72 p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 relative bg-white
                                    ${step.type === 'Approval' ? 'border-blue-200 hover:border-blue-400' : 
                                      step.type === 'Review' ? 'border-purple-200 hover:border-purple-400' :
                                      'border-slate-200 hover:border-slate-400'}
                                `}
                            >
                                <div className="flex justify-between items-center mb-3">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                                        step.type === 'Approval' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                        step.type === 'Review' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                        'bg-slate-50 text-slate-600 border-slate-100'
                                    }`}>{step.type}</span>
                                    {step.type === 'Approval' && <UserCheck size={16} className="text-blue-500"/>}
                                    {step.type === 'Notification' && <Bell size={16} className="text-yellow-500"/>}
                                </div>
                                <h4 className="font-bold text-slate-800 text-sm mb-1">{step.name}</h4>
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <span className="font-medium">Assignee:</span> {step.role}
                                </div>
                            </div>
                        </div>
                        <ArrowRight className="text-slate-300" size={32}/>
                    </React.Fragment>
                ))}

                {/* Add Node Button */}
                <button 
                    onClick={onAddStep}
                    className="w-16 h-16 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-nexus-600 hover:border-nexus-400 hover:bg-white hover:shadow-md transition-all group"
                >
                    <Plus size={24} className="group-hover:scale-110 transition-transform"/>
                </button>

                <ArrowRight className="text-slate-300" size={32}/>

                {/* End Node */}
                 <div className="flex flex-col items-center gap-2 opacity-50">
                    <div className="w-16 h-16 rounded-full bg-slate-200 border-4 border-slate-400 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-sm bg-slate-500"></div>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">End</span>
                </div>
            </div>
        </div>
    );
};
