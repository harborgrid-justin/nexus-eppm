
import React, { useState, useTransition } from 'react';
import { Resource } from '../../types/index';
import { useData } from '../../context/DataContext';
import { Sliders, Check, AlertTriangle, RefreshCw, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

interface ResourceLevelingProps {
    overAllocatedResources: Resource[] | undefined;
}

const ResourceLeveling: React.FC<ResourceLevelingProps> = ({ overAllocatedResources }) => {
    const { state } = useData();
    const [simulatedData, setSimulatedData] = useState<any[] | null>(null);
    const [isLeveling, startTransition] = useTransition();

    const runLevelingSimulation = () => {
        startTransition(() => {
            if (!overAllocatedResources || overAllocatedResources.length === 0) {
                setSimulatedData(null);
                return;
            }

            // 1. Calculate Real Demand for these resources over next 6 weeks
            const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'];
            const today = new Date();
            const horizonStart = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // This Monday

            // Map: Week Index -> Total Demand Hours
            const demandMap = new Array(6).fill(0);
            
            // Total Capacity of selected resources (Weekly)
            // Assuming Capacity is Monthly in DB (e.g. 160), convert to Weekly (~40)
            const totalWeeklyCapacity = overAllocatedResources.reduce((sum, r) => sum + ((r.capacity || 160) / 4), 0);

            state.projects.forEach(p => {
                p.tasks.forEach(t => {
                    if (t.status === 'Completed') return;
                    
                    const taskStart = new Date(t.startDate);
                    const taskEnd = new Date(t.endDate);
                    
                    // Filter assignments for our target resources
                    t.assignments.filter(a => overAllocatedResources.some(r => r.id === a.resourceId)).forEach(assign => {
                        // Calculate weekly load
                        // Simplified: Uniform distribution over duration
                        const weeklyLoad = (assign.units / 100) * 40; // 40h work week assumption
                        
                        // Check overlap with our 6 week horizon
                        for (let i = 0; i < 6; i++) {
                            const wStart = new Date(horizonStart);
                            wStart.setDate(wStart.getDate() + (i * 7));
                            const wEnd = new Date(wStart);
                            wEnd.setDate(wEnd.getDate() + 6);

                            if (taskStart <= wEnd && taskEnd >= wStart) {
                                demandMap[i] += weeklyLoad;
                            }
                        }
                    });
                });
            });

            // 2. Generate Data with "After" logic (Leveling = Capping at Capacity + Variance)
            const data = weeks.map((week, i) => {
                const demand = Math.round(demandMap[i]);
                // Leveling Logic: If Demand > Capacity, push excess to future (simplified visual)
                // Real leveling engine would shift specific task dates
                const leveled = Math.min(demand, totalWeeklyCapacity); 
                
                return {
                    period: week,
                    Capacity: Math.round(totalWeeklyCapacity),
                    Before: demand,
                    After: leveled
                };
            });
            
            setSimulatedData(data);
        });
    };

    return (
        <div className="h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 flex-shrink-0 flex items-center justify-between bg-slate-50">
                <h3 className="font-semibold text-slate-700 text-sm">Over-allocation Resolution</h3>
                <button 
                    onClick={runLevelingSimulation}
                    disabled={isLeveling || !overAllocatedResources?.length}
                    className="px-3 py-2 bg-nexus-600 rounded-lg text-sm font-medium text-white hover:bg-nexus-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                    {isLeveling ? <RefreshCw className="animate-spin" size={16}/> : <Sliders size={16}/>}
                    {isLeveling ? 'Optimizing Plan...' : 'Run CPM Leveling'}
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Visualizer */}
                {simulatedData ? (
                    <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm h-64 animate-in fade-in slide-in-from-top-4">
                        <h4 className="font-bold text-slate-700 mb-2 text-sm">Leveling Impact Simulation (6-Week Horizon)</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={simulatedData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="period" tick={{fontSize: 10}} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Before" fill="#ef4444" name="Current Demand" />
                                <Bar dataKey="After" fill="#22c55e" name="Leveled Load" />
                                <ReferenceLine y={simulatedData[0]?.Capacity} label="Capacity Limit" stroke="orange" strokeDasharray="3 3" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl h-64 flex flex-col items-center justify-center text-slate-400">
                        <BarChart2 size={32} className="mb-2 opacity-50"/>
                        <p className="text-sm">Run simulation to visualize capacity impact.</p>
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
                                <span>{((res.allocated / (res.capacity || 1)) * 100).toFixed(0)}% Allocated</span>
                            </div>
                        </div>
                        <div className="text-xs space-y-1 text-slate-600">
                            <p><strong>Capacity:</strong> {res.capacity} hrs/mo</p>
                            <p><strong>Allocated:</strong> {res.allocated} hrs/mo</p>
                        </div>
                        
                        {simulatedData ? (
                             <div className="mt-3 p-2 bg-green-50 text-green-800 text-xs rounded border border-green-200 flex items-center gap-2 animate-in fade-in">
                                <Check size={14}/> Resolution: Shift non-critical tasks to reduce peak load.
                             </div>
                        ) : (
                            <div className="mt-3 flex gap-2">
                                <button className="text-xs px-3 py-1 bg-white border border-slate-300 rounded-md hover:bg-slate-50 text-slate-700">Delay Task</button>
                                <button className="text-xs px-3 py-1 bg-white border border-slate-300 rounded-md hover:bg-slate-50 text-slate-700">Reassign</button>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                        <Check size={48} className="text-green-500 mb-4" />
                        <h3 className="font-bold text-slate-600">Resource Pool Optimized</h3>
                        <p className="text-sm">No over-allocation conflicts detected for this project.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResourceLeveling;
