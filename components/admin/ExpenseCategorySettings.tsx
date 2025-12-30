import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Plus, Briefcase, FileText, Folder } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { ActivityCodeScope } from '../../types';

const Receipt = (LucideIcons as any).Receipt || FileText;
const Globe = (LucideIcons as any).Globe || Folder;

const ExpenseCategorySettings: React.FC = () => {
    const { state } = useData();
    const [activeScope, setActiveScope] = useState<ActivityCodeScope>('Global');

    const filteredCategories = state.expenseCategories.filter(ec => ec.scope === activeScope);

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600">Define standard categories for non-resource costs like travel and materials.</p>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 text-sm rounded-md hover:bg-slate-50">
                    <Plus size={14} /> Add Category
                </button>
            </div>

            <div className="flex bg-slate-100 p-1 rounded-lg w-min">
                <button
                    onClick={() => setActiveScope('Global')}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md ${activeScope === 'Global' ? 'bg-white shadow-sm' : ''}`}
                >
                    <Globe size={14} /> Global
                </button>
                <button
                    onClick={() => setActiveScope('Project')}
                    className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md ${activeScope === 'Project' ? 'bg-white shadow-sm' : ''}`}
                >
                    <Briefcase size={14} /> Project
                </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category Name</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {filteredCategories.map(cat => (
                            <tr key={cat.id}>
                                <td className="px-4 py-3 text-sm font-medium text-slate-800">{cat.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpenseCategorySettings;