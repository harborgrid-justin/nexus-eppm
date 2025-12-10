import React from 'react';
import { useData } from '../../context/DataContext';
import { Banknote, Plus } from 'lucide-react';

const FundingSourceSettings: React.FC = () => {
    const { state } = useData();

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <p className="text-sm text-slate-600">Define the agencies, businesses, or groups that provide funding for projects.</p>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 text-sm rounded-md hover:bg-slate-50">
                    <Plus size={14} /> Add Source
                </button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Source Name</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {state.fundingSources.map(fs => (
                            <tr key={fs.id}>
                                <td className="px-4 py-3 text-sm font-medium text-slate-800">{fs.name}</td>
                                <td className="px-4 py-3 text-sm text-slate-500">{fs.description || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FundingSourceSettings;