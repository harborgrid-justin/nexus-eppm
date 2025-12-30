
import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { UDFSubjectArea } from '../../types';
import { Plus, FileText } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const Edit3 = (LucideIcons as any).Edit3 || FileText;

const UdfSettings: React.FC = () => {
    const { state } = useData();
    const [subjectArea, setSubjectArea] = useState<UDFSubjectArea>('Tasks');

    const filteredUdfs = state.userDefinedFields.filter(udf => udf.subjectArea === subjectArea);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600">Create custom fields to capture unique information for projects, tasks, and more.</p>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 text-sm rounded-md hover:bg-slate-50">
                    <Plus size={14} /> Add UDF
                </button>
            </div>
            
            <div>
                <label className="text-xs font-medium text-slate-500">Subject Area</label>
                <select 
                    value={subjectArea} 
                    onChange={e => setSubjectArea(e.target.value as UDFSubjectArea)}
                    className="mt-1 block w-full md:w-1/3 border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-nexus-500 focus:border-nexus-500 sm:text-sm"
                >
                    <option>Projects</option>
                    <option>Tasks</option>
                    <option>Resources</option>
                    <option>Risks</option>
                </select>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data Type</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {filteredUdfs.map(udf => (
                            <tr key={udf.id}>
                                <td className="px-4 py-3 text-sm font-medium text-slate-800">{udf.title}</td>
                                <td className="px-4 py-3 text-sm text-slate-500">{udf.dataType}</td>
                            </tr>
                        ))}
                        {filteredUdfs.length === 0 && (
                            <tr><td colSpan={2} className="px-4 py-4 text-center text-sm text-slate-400">No UDFs defined for this area.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UdfSettings;
