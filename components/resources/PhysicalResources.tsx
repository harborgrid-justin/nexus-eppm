
import React from 'react';
import { Box } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface PhysicalResource {
    id: string;
    name: string;
    type: string;
    location: string;
    status: string;
}

const PhysicalResources: React.FC = () => {
    const { state } = useData();

    const physicalResources: PhysicalResource[] = state.resources
        .filter(r => r.type === 'Equipment' || r.type === 'Material')
        .map(r => {
            const utilizationPct = r.capacity > 0 ? (r.allocated / r.capacity) * 100 : 0;
            return {
                id: r.id,
                name: r.name,
                type: r.type || 'Equipment',
                location: 'Central Warehouse',
                status: utilizationPct < 20 ? 'Available' : utilizationPct < 80 ? 'In Use' : 'Allocated'
            };
        });

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
                    {physicalResources.length > 0 ? physicalResources.map((res) => (
                        <tr key={res.id}>
                            <td className="px-4 py-3 font-medium text-slate-800">{res.name}</td>
                            <td className="px-4 py-3 text-slate-600">{res.type}</td>
                            <td className="px-4 py-3 text-slate-600">{res.location}</td>
                            <td className="px-4 py-3"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">{res.status}</span></td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-slate-400">No physical resources found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PhysicalResources;
