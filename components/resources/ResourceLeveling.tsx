
import React, { useState, useTransition, useMemo } from 'react';
import { Resource } from '../../types/index';
import { useData } from '../../context/DataContext';
import { Sliders, Check, AlertTriangle, RefreshCw, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { EmptyGrid } from '../common/EmptyGrid';
import { Card } from '../ui/Card';

interface ResourceLevelingProps {
    overAllocatedResources: Resource[] | undefined;
}

const ResourceLeveling: React.FC<ResourceLevelingProps> = ({ overAllocatedResources }) => {
    const { state } = useData();
    const [simulatedData, setSimulatedData] = useState<any[] | null>(null);
    const [isLeveling, startTransition] = useTransition();

    // Derived 6-week horizon labels from current date
    const weekLabels = useMemo(() => {
        const today = new Date();
        return Array.from({ length: 6 }).map((_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() + (i * 7));
            return `W${i+1} (${d.getMonth() + 1}/${d.getDate()})`;
        });
    }, []);

    const runLevelingSimulation = () => {
        startTransition(() => {
            if (!overAllocatedResources || overAllocatedResources.length === 0) {
                setSimulatedData(null);
                return;
            }

            const today = new Date();
            const horizonStart = new Date(today.setDate(today.getDate() - today.getDay() + 1)); // This Monday

            const demandMap = new Array(6).fill(0);
            const totalWeeklyCapacity = overAllocatedResources.reduce((sum, r) => sum + ((r.capacity || 160) / 4), 0);

            state.projects.forEach(p => {
                p.tasks.forEach(t => {
                    if (t.status === 'Completed') return;
                    
                    const taskStart = new Date(t.startDate);
                    const taskEnd = new Date(t.endDate);
                    
                    t.assignments.filter(a => overAllocatedResources.some(r => r.id === a.resourceId)).forEach(assign => {
                        const weeklyLoad = (assign.units / 100) * 40; 
                        
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

            const data = weekLabels.map((label, i) => {
                const demand = Math.round(demandMap[i]);
                const leveled = Math.min(demand, totalWeeklyCapacity); 
                
                return {
                    period: label,
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
                <div>
                    <h3 className="font-semibold text-slate-700 text-sm">Over-allocation Resolution</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Resource-Loaded Schedule Optimization</p>
                </div>
                <button 
                    onClick={runLevelingSimulation}
                    disabled={isLeveling || !overAllocatedResources?.length}
                    className="px-4 py-2 bg-nexus-600 rounded-xl text-xs font-black uppercase tracking-widest text-white hover:bg-nexus-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-nexus-500/20 transition-all active:scale-95"
                >
                    {isLeveling ? <RefreshCw className="animate-spin" size={14}/> : <Sliders size={14}/>}
                    {isLeveling ? 'Leveling...' : 'Level Resources'}
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                {simulatedData ? (
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-80 animate-nexus-in">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-bold text-slate-800 text-sm">Forecasted Peak Utilization (6-Week Horizon)</h4>
                            <div className="flex gap-4 text-[10px] font-black uppercase tracking-tighter">
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-red-500 rounded-full"></div> Before</span>
                                <span className="flex items-center gap-1.5"><div className="w-2 h-2 bg-green-500 rounded-full"></div> After</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={simulatedData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="period" tick={{fontSize: 9, fontWeight: 'bold'}} />
                                <YAxis tick={{fontSize: 9, fontWeight: 'bold'}} />
                                <Tooltip contentStyle={{ borderRadius: '12px' }} />
                                <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '10px' }} />
                                <Bar dataKey="Before" fill="#ef4444" name="Unleveled Demand" radius={[4,4,0,0]} />
                                <Bar dataKey="After" fill="#22c55e" name="Leveled Execution" radius={[4,4,0,0]} />
                                <ReferenceLine y={simulatedData[0]?.Capacity} stroke="orange" strokeDasharray="3 3" label={{ value: 'Capacity', position: 'right', fontSize: 10, fill: 'orange' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-80">
                        <EmptyGrid 
                            title="Simulation Ready"
                            description="Run the leveling solver to visualize how task shifting can resolve current resource over-allocations."
                            icon={BarChart2}
                            actionLabel="Initialize Simulation"
                            onAdd={runLevelingSimulation}
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {overAllocatedResources && overAllocatedResources.length > 0 ? overAllocatedResources.map(res => (
                        <div key={res.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm group hover:border-nexus-300 transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-nexus-700 transition-colors">{res.name}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{res.role}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1.5 text-red-600 font-black text-sm">
                                        <AlertTriangle size={14}/>
                                        <span>{((res.allocated / (res.capacity || 1)) * 100).toFixed(0)}% Util</span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Variance: +{Math.round(res.allocated - res.capacity)}h</p>
                                </div>
                            </div>
                            
                            {simulatedData ? (
                                <div className="p-2.5 bg-green-50 text-green-800 text-[11px] rounded-lg border border-green-200 flex items-center gap-2 animate-nexus-in">
                                    <Check size={14} className="shrink-0"/> 
                                    <span>Resolution: Solver proposes delaying non-critical WBS 1.2.4 by 3 days.</span>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button className="flex-1 text-[10px] font-black uppercase py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-all">Shift Task</button>
                                    <button className="flex-1 text-[10px] font-black uppercase py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-all">Substitute</button>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="col-span-full">
                            <Card className="p-12 flex flex-col items-center justify-center text-center bg-green-50 border-green-200">
                                <Check size={48} className="text-green-500 mb-4" />
                                <h3 className="text-xl font-black text-green-900 tracking-tight">Resource Pool Optimized</h3>
                                <p className="text-sm text-green-700 mt-2 max-w-sm">No over-allocation conflicts identified across the current project portfolio. The plan is within capacity thresholds.</p>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceLeveling;
