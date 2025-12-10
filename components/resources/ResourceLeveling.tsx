import React from 'react';
import { MOCK_RESOURCES } from '../../constants';
import { Sliders, Check, AlertTriangle } from 'lucide-react';

const ResourceLeveling: React.FC = () => {
    const overAllocatedResources = MOCK_RESOURCES.filter(r => r.allocated > r.capacity);
    
    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center justify-between">
                <h3 className="font-semibold text-slate-700 text-sm">Over-allocation Resolution</h3>
                <button className="px-3 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700 flex items-center gap-2">
                    <Sliders size={16}/> Auto-Level All
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {overAllocatedResources.length > 0 ? overAllocatedResources.map(res => (
                    <div key={res.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <h4 className="font-bold text-slate-800">{res.name}</h4>
                                <p className="text-xs text-slate-500">{res.role}</p>
                            </div>
                            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                                <AlertTriangle size={16}/>
                                <span>{((res.allocated / res.capacity) * 100).toFixed(0)}% Allocated</span>
                            </div>
                        </div>
                        <div className="text-xs space-y-1 text-slate-600">
                            {/* This would list tasks causing over-allocation */}
                            <p><strong>Conflict Period:</strong> June 10 - June 24</p>
                            <p><strong>Affected Tasks:</strong> T3, T5</p>
                        </div>
                        <div className="mt-3 flex gap-2">
                            <button className="text-xs px-3 py-1 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Delay Task</button>
                            <button className="text-xs px-3 py-1 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Reassign</button>
                        </div>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Check size={48} className="text-green-500 mb-4" />
                        <h3 className="font-bold text-slate-600">All Resources Leveled</h3>
                        <p className="text-sm">No over-allocation conflicts detected.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceLeveling;
