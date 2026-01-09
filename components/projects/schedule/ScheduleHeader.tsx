
import React from 'react';
import { Calendar, ArrowLeft, Download, Play } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useTheme } from '../../../context/ThemeContext';
import { Project } from '../../../types';

interface ScheduleHeaderProps {
    projects: Project[];
    activeProjectId: string;
    onProjectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onBack: () => void;
    viewMode: 'day' | 'week' | 'month';
    setViewMode: (mode: 'day' | 'week' | 'month') => void;
    runSchedule: () => void;
    isScheduling: boolean;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
    projects, activeProjectId, onProjectChange, onBack, viewMode, setViewMode, runSchedule, isScheduling
}) => {
    const theme = useTheme();

    return (
        <div className={`h-16 ${theme.colors.surface} border-b ${theme.colors.border} flex items-center justify-between px-6 shadow-sm z-40`}>
            <div className="flex items-center gap-4 min-w-0 flex-1">
                <button onClick={onBack} className={`p-2 rounded-full hover:bg-slate-100 text-slate-500`}>
                    <ArrowLeft size={20} />
                </button>
                <div className="min-w-0">
                    <h1 className="text-lg font-black text-slate-900 flex items-center gap-2 truncate">
                        <Calendar className="text-nexus-600 shrink-0" size={20}/> Master Schedule
                    </h1>
                    <p className="text-xs text-slate-500 truncate hidden sm:block">Real-time Critical Path Method (CPM) Explorer</p>
                </div>
                <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
                <select 
                    className={`hidden md:block bg-slate-50 border ${theme.colors.border} text-sm font-bold text-slate-700 rounded-lg py-1.5 px-3 focus:ring-2 focus:ring-nexus-500 outline-none w-64`}
                    value={activeProjectId}
                    onChange={onProjectChange}
                >
                    {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.code}: {p.name}</option>
                    ))}
                </select>
            </div>
            
            <div className="flex items-center gap-3 shrink-0 ml-4">
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    {['day', 'week', 'month'].map((mode) => (
                        <button
                            key={mode}
                            onClick={() => setViewMode(mode as any)}
                            className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${viewMode === mode ? 'bg-white shadow text-nexus-700' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            {mode}
                        </button>
                    ))}
                </div>
                <Button variant="outline" size="sm" icon={Download} className="hidden sm:flex">Export</Button>
                <Button onClick={runSchedule} isLoading={isScheduling} icon={Play} size="sm">Schedule (F9)</Button>
            </div>
        </div>
    );
};
