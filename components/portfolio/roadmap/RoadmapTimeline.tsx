import React from 'react';
import { Project, StrategicDriver } from '../../../types';
import { Edit2 } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { getDaysDiff } from '../../../utils/dateUtils';

interface RoadmapTimelineProps {
    drivers?: StrategicDriver[]; // Kept for type compatibility if needed upstream
    lanes: string[]; // Explicit lane names
    projects: Project[];
    onEditAlignment: (id: string) => void;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ lanes, projects, onEditAlignment }) => {
    const theme = useTheme();

    return (
        <div className={`${theme.components.card} overflow-hidden`}>
            {lanes.map(lane => {
                const laneProjects = projects.filter(p => p.category === lane || (!p.category && lane === 'Innovation & Growth')); // Fallback logic for unassigned
                
                return (
                    <div key={lane} className={`border-b ${theme.colors.border} last:border-0 min-h-[120px] flex`}>
                        <div className={`w-64 p-4 border-r ${theme.colors.border} ${theme.colors.background} shrink-0`}>
                            <h4 className={`font-bold text-sm ${theme.colors.text.primary}`}>{lane}</h4>
                        </div>
                        <div className={`flex-1 p-4 relative ${theme.colors.surface}`}>
                            {/* Grid Lines */}
                            <div className="absolute inset-0 grid grid-cols-4 pointer-events-none">
                                <div className={`border-r ${theme.colors.border.replace('border-','border-slate-')}50 h-full`}></div>
                                <div className={`border-r ${theme.colors.border.replace('border-','border-slate-')}50 h-full`}></div>
                                <div className={`border-r ${theme.colors.border.replace('border-','border-slate-')}50 h-full`}></div>
                            </div>
                            
                            {/* Bars */}
                            <div className="space-y-4 relative z-10">
                                {laneProjects.map(p => (
                                    <div key={p.id} className="relative h-8 bg-nexus-500 rounded-md shadow-sm group flex items-center px-3 cursor-pointer hover:bg-nexus-600 transition-colors" style={{ width: '40%', marginLeft: '10%' }}>
                                        <span className="text-xs font-bold text-white truncate flex-1">{p.name}</span>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onEditAlignment(p.id); }}
                                            className="opacity-0 group-hover:opacity-100 text-white/80 hover:text-white transition-opacity"
                                        >
                                            <Edit2 size={12}/>
                                        </button>
                                    </div>
                                ))}
                                {laneProjects.length === 0 && <div className={`text-xs ${theme.colors.text.tertiary} italic p-2`}>No initiatives mapped.</div>}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};