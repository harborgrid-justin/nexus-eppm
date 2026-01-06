import React from 'react';
import { useData } from '../../../context/DataContext';
import { Map } from 'lucide-react';

export const StrategicRoadmapTmpl: React.FC = () => {
    const { state } = useData();
    const lanes = state.programs.length > 0 ? state.programs : [{ id: '1', name: 'Strategic Portfolio' }];

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="p-4 border-b flex items-center gap-2 font-bold"><Map size={18}/> Global Initiative Roadmap</div>
            <div className="flex-1 overflow-auto">
                {lanes.map(lane => (
                    <div key={lane.id} className="flex border-b min-h-[120px]">
                        <div className="w-64 p-4 border-r bg-slate-50 font-bold text-sm">{lane.name}</div>
                        <div className="flex-1 p-4 relative bg-slate-50/20">
                            <div className="h-8 bg-nexus-600 rounded-lg w-1/2 mt-4 shadow-md"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};