import React from 'react';
import { Project, StrategicDriver } from '../../../types';
import { Edit2, MapPin } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { getDaysDiff } from '../../../utils/dateUtils';
import { FieldPlaceholder } from '../../common/FieldPlaceholder';

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
                        <div className={`w-64 p-4 border-r ${theme.colors.border} ${theme.colors.background} shrink-0 flex flex-col justify-between`}>
                            <h4 className={`font-black text-xs uppercase tracking-widest ${theme.colors.text.primary}`}>{lane}</h4>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                {laneProjects.length} Active Tracks
                            </div>
                        </div>
                        <div className={`flex-1 p-4 relative ${theme.colors.surface}`}>
                            {/* Grid Lines */}
                            <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-50">
                                <div className={`border-r ${theme.colors.border.replace('border-','border-slate-')}100 h-full`}></div>
                                <div className={`border-r ${theme.colors.border.replace('border-','border-slate-')}100 h-full`}></div>
                                <div className={`border-r ${theme.colors.border.replace('border-','border-slate-')}100 h-full`}></div>
                            </div>
                            
                            {/* Bars */}
                            <div className="space-y-4 relative z-10 h-full flex flex-col justify-center">
                                {laneProjects.length > 0 ? (
                                    laneProjects.map(p => (
                                        <div 
                                            key={p.id} 
                                            className="relative h-9 bg-nexus-600 rounded-xl shadow-lg shadow-nexus-500/10 group flex items-center px-4 cursor-pointer hover:bg-nexus-700 transition-all hover:scale-[1.01] border border-nexus-500" 
                                            style={{ width: '45%', marginLeft: '5%' }}
                                        >
                                            <span className="text-xs font-black text-white truncate flex-1 uppercase tracking-tight">{p.name}</span>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-[9px] font-mono text-white/60">{p.code}</span>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); onEditAlignment(p.id); }}
                                                    className="p-1.5 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                                >
                                                    <Edit2 size={12} className="text-white"/>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <FieldPlaceholder 
                                        label={`No ${lane} initiatives mapped.`} 
                                        onAdd={() => {}} 
                                        className="h-20 bg-transparent border-transparent"
                                        icon={MapPin}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};