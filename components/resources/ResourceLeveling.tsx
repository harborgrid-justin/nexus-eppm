


import React, { useState, useMemo } from 'react';
// FIX: Corrected import path for Resource type to resolve module resolution error.
import { Resource } from '../../types/index';
import { Sliders, Check, AlertTriangle, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

interface ResourceLevelingProps {
    overAllocatedResources: Resource[] | undefined;
}

const ResourceLeveling: React.FC<ResourceLevelingProps> = ({ overAllocatedResources }) => {
    const [simulatedData, setSimulatedData] = useState<any[] | null>(null);
    const [isLeveling, setIsLeveling] = useState(false);

    // Mock Simulation Logic
    const runLevelingSimulation = () => {
        setIsLeveling(true);
        setTimeout(() => {
            // Create "Before" and "After" dataset
            // In a real app, this runs the leveling heuristic (e.g., Burgess algorithm)
            const data = [
                { period: 'Week 1', Capacity: 100, Before: 110, After: 95 },
                { period: 'Week 2', Capacity: 100, Before: 130, After: 100 },
                { period: 'Week 3', Capacity: 100, Before: 150, After: 100 },
                { period: 'Week 4', Capacity: 100, Before: 80,  After: 100 },
                { period: 'Week 5', Capacity: 100, Before: 90,  After: 100 },
                { period: 'Week 6', Capacity: 100, Before: 60,  After: 85 },
            ];
            setSimulatedData(data);
            setIsLeveling(false);
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center justify-between">
                <h3 className="font-semibold text-slate-700 text-sm">Over-allocation Resolution</h3>
                <button 
                    onClick={runLevelingSimulation}
                    disabled={isLeveling || !overAllocatedResources?.length}
                    className="px-3 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700 flex items-center gap-2 disabled:opacity-50"
                >
                    {isLeveling ? <RefreshCw className="animate-spin" size={16}/> : <Sliders size={16}/>}
                    {isLeveling ? 'Leveling...' : 'Auto-Level All'}
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Visualizer */}
                {simulatedData && (
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-64">
                        <h4 className="font-bold text-slate-700 mb-2 text-sm">Leveling Impact Simulation</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={simulatedData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="period" tick={{fontSize: 10}} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Before" fill="#ef4444" name="Before Leveling" />
                                <Bar dataKey="After" fill="#22c55e" name="After Leveling" />
                                <ReferenceLine y={100} label="Max Capacity" stroke="red" strokeDasharray="3 3" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {overAllocatedResources && overAllocatedResources.length > 0 ? overAllocatedResources.map(res => (
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
                            <p><strong>Conflict Period:</strong> June 10 - June 24</p>
                            <p><strong>Affected Tasks:</strong> T-102, T-105</p>
                        </div>
                        
                        {simulatedData ? (
                             <div className="mt-3 p-2 bg-green-50 text-green-800 text-xs rounded border border-green-200 flex items-center gap-2">
                                <Check size={14}/> Resolution: Shift T-105 by +5 days.
                             </div>
                        ) : (
                            <div className="mt-3 flex gap-2">
                                <button className="text-xs px-3 py-1 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Delay Task</button>
                                <button className="text-xs px-3 py-1 bg-white border border-slate-300 rounded-md hover:bg-slate-50">Reassign</button>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Check size={48} className="text-green-500 mb-4" />
                        <h3 className="font-bold text-slate-600">All Resources Leveled</h3>
                        <p className="text-sm">No over-allocation conflicts detected for this project.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceLeveling;