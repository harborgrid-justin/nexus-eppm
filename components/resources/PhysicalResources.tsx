
import React from 'react';
import { Box } from 'lucide-react';

const PhysicalResources: React.FC = () => {
    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 h-full overflow-y-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2"><Box className="text-orange-500"/> Physical Resource Tracking</h2>
            <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-100">
                    <tr>
                        <th className="px-4 py-2 text-left font-medium text-slate-500">Resource Name</th>
                        <th className="px-4 py-2 text-left font-medium text-slate-500">Type</th>
                        <th className="px-4 py-2 text-left font-medium text-slate-500">Location</th>
                        <th className="px-4 py-2 text-left font-medium text-slate-500">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {[
                        { name: 'Excavator #44', type: 'Equipment', location: 'Site A - North', status: 'In Use' },
                        { name: 'Cement Mixers (x4)', type: 'Equipment', location: 'Site B - Yard', status: 'Available' },
                        { name: 'Steel Beams (Batch 1)', type: 'Material', location: 'Warehouse 4', status: 'Allocated' },
                    ].map((res, i) => (
                        <tr key={i}>
                            <td className="px-4 py-3 font-medium text-slate-800">{res.name}</td>
                            <td className="px-4 py-3 text-slate-600">{res.type}</td>
                            <td className="px-4 py-3 text-slate-600">{res.location}</td>
                            <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">{res.status}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PhysicalResources;
