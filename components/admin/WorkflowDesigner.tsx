
import React, { useState } from 'react';
import { GitPullRequest, Plus, ArrowRight, X, Check } from 'lucide-react';
import { Card } from '../ui/Card';

interface WorkflowStep {
    id: string;
    name: string;
    role: string;
    type: 'Review' | 'Approval' | 'Notification';
}

const WorkflowDesigner: React.FC = () => {
    const [steps, setSteps] = useState<WorkflowStep[]>([
        { id: '1', name: 'Submit Request', role: 'Requester', type: 'Review' },
        { id: '2', name: 'Project Manager Review', role: 'Project Manager', type: 'Approval' },
        { id: '3', name: 'Financial Check', role: 'Finance Controller', type: 'Approval' },
        { id: '4', name: 'Final Approval', role: 'Sponsor', type: 'Approval' },
        { id: '5', name: 'Notify Stakeholders', role: 'System', type: 'Notification' }
    ]);

    return (
        <div className="h-full flex flex-col space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">Change Order Approval Workflow</h3>
                    <p className="text-sm text-slate-500">Define the sequential steps for approving financial change orders.</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-nexus-600 text-white rounded-lg text-sm font-medium hover:bg-nexus-700 shadow-sm">
                    <Plus size={16}/> Add Step
                </button>
            </div>

            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-8 overflow-y-auto flex flex-col items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        {/* Step Node */}
                        <div className="relative group w-80">
                            <Card className="p-4 border-l-4 border-l-nexus-500 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step {index + 1}</span>
                                    <button className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X size={14}/>
                                    </button>
                                </div>
                                <h4 className="font-bold text-slate-800">{step.name}</h4>
                                <div className="mt-2 flex items-center justify-between">
                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 font-medium">
                                        {step.role}
                                    </span>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                        step.type === 'Approval' ? 'bg-green-100 text-green-700' :
                                        step.type === 'Review' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                                    }`}>
                                        {step.type}
                                    </span>
                                </div>
                            </Card>
                            
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="h-10 w-0.5 bg-slate-300 mx-auto my-1 relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border border-slate-300 rounded-full p-1 text-slate-400">
                                        <ArrowRight size={12} className="rotate-90"/>
                                    </div>
                                </div>
                            )}
                        </div>
                    </React.Fragment>
                ))}

                {/* End Node */}
                <div className="mt-2 flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-bold border border-green-200">
                    <Check size={16}/> Workflow Complete
                </div>
            </div>
        </div>
    );
};

export default WorkflowDesigner;
