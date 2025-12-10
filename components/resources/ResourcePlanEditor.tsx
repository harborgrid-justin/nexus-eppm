import React, { useState } from 'react';
import { FileText, Save, Book } from 'lucide-react';

interface ResourcePlanEditorProps {
    projectId: string;
}

const ResourcePlanEditor: React.FC<ResourcePlanEditorProps> = ({ projectId }) => {
    const [content, setContent] = useState('');
    const [assumptions, setAssumptions] = useState('');

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center justify-between">
                <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                    <FileText size={16} /> Resource Management Plan
                </h3>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <Book size={14}/> Apply Template
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700">
                        <Save size={14}/> Save as Template
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                    <label className="text-sm font-bold text-slate-900 block mb-2">Staffing Approach & Strategy</label>
                    <textarea 
                        className="w-full h-48 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500"
                        placeholder="Describe the approach for identifying, acquiring, and managing project resources..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                 <div>
                    <label className="text-sm font-bold text-slate-900 block mb-2">Assumptions & Constraints</label>
                    <textarea 
                        className="w-full h-32 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500"
                        placeholder="List any assumptions and constraints related to resource availability, skills, or budget..."
                        value={assumptions}
                        onChange={(e) => setAssumptions(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ResourcePlanEditor;
