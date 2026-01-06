import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { Button } from '../../ui/Button';
import { Calendar, ZoomIn, ZoomOut } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatters';

export const GanttTimelineTmpl: React.FC = () => {
    const { state } = useData();
    const project = state.projects[0];
    const [zoom, setZoom] = useState('Week');

    if (!project) return <div className="p-8 text-center text-slate-400">No project data for Gantt.</div>;

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                <div className="flex gap-2">
                    {['Day', 'Week', 'Month'].map(z => (
                        <button key={z} onClick={() => setZoom(z)} className={`px-3 py-1 rounded text-xs font-bold ${zoom === z ? 'bg-slate-900 text-white' : 'bg-white border'}`}>{z}</button>
                    ))}
                </div>
                <div className="flex gap-2"><Button size="sm" icon={ZoomIn}/><Button size="sm" icon={ZoomOut}/></div>
            </div>
            <div className="flex-1 overflow-auto flex">
                <div className="w-64 border-r bg-white p-2">
                    {project.tasks.map(t => <div key={t.id} className="text-sm py-2 border-b truncate font-medium">{t.name}</div>)}
                </div>
                <div className="flex-1 bg-slate-50 relative p-4">
                    {project.tasks.map(t => (
                        <div key={t.id} className="h-6 mb-3 bg-blue-500 rounded-sm shadow-sm" style={{ width: t.duration * 5, marginLeft: 20 }}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};