import React, { useState } from 'react';
import { FileText, Save, Book } from 'lucide-react';

interface QualityPlanEditorProps {
    projectId: string;
}

const QualityPlanEditor: React.FC<QualityPlanEditorProps> = ({ projectId }) => {
    const [objectives, setObjectives] = useState('');
    const [roles, setRoles] = useState('');

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center justify-between">
                <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                    <FileText size={16} /> Quality Management Plan
                </h3>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                        <Book size={14}/> Apply Template
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700">
                        <Save size={14}/> Save Plan
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                    <label className="text-sm font-bold text-slate-900 block mb-2">Quality Objectives</label>
                    <textarea 
                        className="w-full h-32 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500"
                        placeholder="Define the primary quality goals for this project, aligned with stakeholder expectations..."
                        value={objectives}
                        onChange={(e) => setObjectives(e.target.value)}
                    />
                </div>
                <div>
                    <label className="text-sm font-bold text-slate-900 block mb-2">Applicable Standards & Metrics</label>
                    <div className="p-4 border border-dashed border-slate-300 rounded-lg text-sm text-slate-500">
                        Link to Quality Standards and Metrics defined in other sections.
                    </div>
                </div>
                 <div>
                    <label className="text-sm font-bold text-slate-900 block mb-2">Roles & Responsibilities</label>
                    <textarea 
                        className="w-full h-32 p-4 border border-slate-300 rounded-lg text-sm focus:ring-nexus-500 focus:border-nexus-500"
                        placeholder="Detail the roles responsible for quality assurance and control activities..."
                        value={roles}
                        onChange={(e) => setRoles(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default QualityPlanEditor;
