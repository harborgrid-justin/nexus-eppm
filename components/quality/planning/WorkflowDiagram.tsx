
import React from 'react';
import { ArrowRight, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

export const WorkflowDiagram: React.FC = () => {
    const theme = useTheme();
    return (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl overflow-x-auto">
            <div className="flex items-center gap-4 min-w-[500px] justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-xl border border-slate-300 flex items-center justify-center shadow-sm">
                        <AlertTriangle className="text-orange-500" size={20}/>
                    </div>
                    <span className="text-xs font-bold mt-2 text-slate-600">Identify</span>
                </div>
                <ArrowRight className="text-slate-400" />
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-xl border border-slate-300 flex items-center justify-center shadow-sm">
                        <FileText className="text-blue-500" size={20}/>
                    </div>
                    <span className="text-xs font-bold mt-2 text-slate-600">Document</span>
                </div>
                <ArrowRight className="text-slate-400" />
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-white rounded-xl border border-slate-300 flex items-center justify-center shadow-sm">
                        <CheckCircle className="text-green-500" size={20}/>
                    </div>
                    <span className="text-xs font-bold mt-2 text-slate-600">Disposition</span>
                </div>
            </div>
            <p className="text-center text-xs text-slate-400 mt-4 italic">Standard Non-Conformance Workflow</p>
        </div>
    );
};
