
import React from 'react';
import { Project, StrategicDriver } from '../../../types';
import { Edit2, MapPin, Plus } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { getDaysDiff } from '../../../utils/dateUtils';
import { FieldPlaceholder } from '../../common/FieldPlaceholder';

interface RoadmapTimelineProps {
    drivers?: StrategicDriver[];
    lanes: string[];
    projects: Project[];
    onEditAlignment: (id: string) => void;
    onQuickAlign: (lane: string) => void;
}

export const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ lanes, projects, onEditAlignment, onQuickAlign }) => {
    const theme = useTheme();

    return (
        <div className={`${theme.components.card} overflow-hidden shadow-md border-slate-200`}>
            {lanes.map(lane => {
                const laneProjects = projects.filter(p => p.category === lane);
                
                return (
                    <div key={lane} className={`border-b ${theme.colors.border} last:border-0 min-h-[140px] flex group/lane hover:bg-slate-50/30 transition-colors`}>
                        <div className={`w-64 p-6 border-r ${theme.colors.border} ${theme.colors.background} shrink-0 flex flex-col justify-between relative`}>
                            <div>
                                <h4 className={`font-black text-xs uppercase tracking-widest ${theme.colors.text.primary}`}>{lane}</h4>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                                    {laneProjects.length} Active Tracks
                                </div>
                            </div>
                            <button 
                                onClick={() => onQuickAlign(lane)}
                                className="absolute bottom-4 right-4 p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-nexus-600 hover:border-nexus-200 opacity-0 group-hover/lane:opacity-100 transition-all shadow-sm"
                                title="Align project to this driver"
                            >
                                <Plus size={14}/>
                            </button>
                        </div>
                        <div className={`flex-1 p-6 relative ${theme.colors.surface}`}>
                            {/* Grid Lines */}
                            <div className="absolute inset-0 grid grid-cols-4 pointer-events-none opacity-30">
                                <div className={`border-r ${theme.colors.border} h-full`}></div>
                                <div className={`border-r ${theme.colors.border} h-full`}></div>
                                <div className={`border-r ${theme.colors.border} h-full`}></div>
                            </div>
                            
                            {/* Bars */}
                            <div className="space-y-4 relative z-10 h-full flex flex-col justify-center min-h-[80px]">
                                {laneProjects.length > 0 ? (
                                    laneProjects.map(p => (
                                        <div 
                                            key={p.id} 
                                            className="relative h-10 bg-nexus-600 rounded-xl shadow-lg shadow-nexus-500/10 group flex items-center px-4 cursor-pointer hover:bg-nexus-700 transition-all hover:scale-[1.01] border border-nexus-500" 
                                            style={{ width: '45%', marginLeft: '5%' }}
                                        >
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <span className="text-xs font-black text-white truncate uppercase tracking-tight">{p.name}</span>
                                                <span className="text-[9px] font-mono text-white/50">{p.code}</span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                                        onAdd={() => onQuickAlign(lane)} 
                                        className="h-24 bg-transparent border-transparent"
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
