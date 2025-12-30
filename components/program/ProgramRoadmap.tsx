
import React from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import * as LucideIcons from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getDaysDiff } from '../../utils/dateUtils';

const { Map: MapIcon, AlertTriangle, Calendar, Flag, ChevronRight, TrendingUp } = LucideIcons;
const LinkIcon = (LucideIcons as any).Link || ChevronRight;
const Activity = (LucideIcons as any).Activity || TrendingUp;

interface ProgramRoadmapProps {
  programId: string;
}

const ProgramRoadmap: React.FC<ProgramRoadmapProps> = ({ programId }) => {
  const { program, projects, programDependencies } = useProgramData(programId);
  const theme = useTheme();

  if (!program) return null;

  // Timeline bounds
  const start = new Date(program.startDate);
  const end = new Date(program.endDate);
  const today = new Date();
  
  const totalDuration = getDaysDiff(start, end);
  const todayPosition = Math.max(0, Math.min(100, (getDaysDiff(start, today) / totalDuration) * 100));

  const getPosition = (dateStr: string) => {
      const d = new Date(dateStr);
      const diff = getDaysDiff(start, d);
      return Math.max(0, Math.min(100, (diff / totalDuration) * 100));
  };

  const getWidth = (startStr: string, endStr: string) => {
      const s = new Date(startStr);
      const e = new Date(endStr);
      const dur = getDaysDiff(s, e);
      return Math.max(1, (dur / totalDuration) * 100);
  };

  // Generate Year markers
  const years = [];
  const startYear = start.getFullYear();
  const endYear = end.getFullYear();
  for(let y = startYear; y <= endYear; y++) {
      years.push(y);
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in duration-300`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-4 md:gap-0">
            <div className="flex items-center gap-2">
                <MapIcon className="text-nexus-600" size={24}/>
                <h2 className={theme.typography.h2}>Integrated Master Roadmap</h2>
            </div>
            <div className="flex gap-2 flex-wrap">
                <div className="flex items-center gap-4 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-500 rounded"></span> Project</span>
                    <span className="flex items-center gap-1"><span className="w-3 h-3 bg-nexus-600 rounded rotate-45"></span> Milestone</span>
                    {/* Feature: Legend for Critical Dependencies */}
                    <span className="flex items-center gap-1"><span className="w-6 h-0.5 bg-red-500 border-b border-dashed"></span> Critical Dep</span>
                    <span className="flex items-center gap-1"><span className="w-6 h-0.5 bg-slate-400"></span> Standard Dep</span>
                </div>
            </div>
        </div>

        <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
            <div className="overflow-x-auto">
              <div className="min-w-[1000px]">
                {/* Timeline Header */}
                <div className="relative h-8 border-b border-slate-200 mb-4 text-xs font-bold text-slate-400 uppercase">
                    {years.map(year => {
                        const yearStart = new Date(year, 0, 1);
                        const pos = getPosition(yearStart.toISOString());
                        if (pos > 0 && pos < 100) {
                            return <span key={year} className="absolute top-0 transform -translate-x-1/2 border-l border-slate-200 h-full pl-2" style={{ left: `${pos}%` }}>{year}</span>
                        }
                        return null;
                    })}
                </div>
                
                <div className="relative space-y-12 min-h-[400px] py-4">
                    {/* Vertical Grid Lines & Today Marker */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="w-full h-full flex justify-between opacity-5">
                            {[0,1,2,3,4,5,6,7,8].map(i => <div key={i} className="border-r border-slate-900 h-full w-full"></div>)}
                        </div>
                        {/* Feature: Integrated Today Line */}
                        <div 
                            className="absolute top-0 bottom-0 border-l-2 border-red-500 border-dashed z-20"
                            style={{ left: `${todayPosition}%` }}
                        >
                            <div className="absolute -top-2 -translate-x-1/2 text-[10px] font-bold text-white bg-red-500 px-2 py-0.5 rounded shadow-sm">TODAY</div>
                        </div>
                    </div>

                    {projects.map((proj, idx) => (
                        <div key={proj.id} className="relative h-12 group">
                            {/* Feature: Baseline Ghost Bar (Mocked as slightly wider/shifted) */}
                            <div 
                                className="absolute top-1 h-10 rounded-lg bg-slate-100 border border-slate-300 opacity-50 z-0"
                                style={{ 
                                    left: `${getPosition(proj.startDate) - 2}%`, 
                                    width: `${getWidth(proj.startDate, proj.endDate)}%` 
                                }}
                            ></div>

                            {/* Project Bar */}
                            <div 
                                className={`absolute top-0 h-10 rounded-lg shadow-md flex items-center px-3 text-white text-xs font-bold overflow-hidden whitespace-nowrap z-10 transition-all cursor-pointer border-b-4 border-black/10 hover:shadow-lg ${
                                    proj.health === 'Critical' ? 'bg-red-500' :
                                    proj.health === 'Warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                }`}
                                style={{ 
                                    left: `${getPosition(proj.startDate)}%`, 
                                    width: `${getWidth(proj.startDate, proj.endDate)}%` 
                                }}
                            >
                                <span className="mr-2 opacity-80 font-mono bg-black/10 px-1 rounded">{proj.code}</span>
                                {proj.name}
                                {/* Feature: Progress Bar inside Roadmap Item */}
                                <div className="absolute bottom-0 left-0 h-1 bg-white/30" style={{width: '65%'}}></div>
                            </div>
                            
                            {/* Feature: Cross-Project Dependency Visualization */}
                            {programDependencies.filter(d => d.sourceProjectId === proj.id).map(dep => {
                                const target = projects.find(p => p.id === dep.targetProjectId);
                                if(!target) return null;
                                
                                const isCritical = dep.status === 'Critical';
                                const sourceEndPos = getPosition(proj.endDate);
                                const targetStartPos = getPosition(target.startDate);
                                
                                // Draw curve
                                const width = Math.abs(targetStartPos - sourceEndPos);
                                const left = Math.min(sourceEndPos, targetStartPos);
                                const isForward = targetStartPos > sourceEndPos;
                                const verticalGap = 50; // approximate gap between rows

                                return (
                                    <div 
                                        key={dep.id} 
                                        className="absolute top-5 h-20 z-20 pointer-events-none"
                                        style={{
                                            left: `${left}%`,
                                            width: `${width}%`
                                        }}
                                    >
                                        <svg width="100%" height="100%" preserveAspectRatio="none" className="overflow-visible">
                                            {/* Feature: Red line if critical/delayed */}
                                            <path 
                                                d={`M ${isForward ? 0 : '100%'} 5 C ${isForward ? '50%' : '50%'} 5, ${isForward ? '50%' : '50%'} ${verticalGap}, ${isForward ? '100%' : 0} ${verticalGap}`} 
                                                fill="none" 
                                                stroke={isCritical ? '#ef4444' : '#94a3b8'} 
                                                strokeWidth={isCritical ? "3" : "1.5"} 
                                                strokeDasharray={isCritical ? "0" : "4 4"}
                                                markerEnd={isCritical ? "url(#arrow-red)" : "url(#arrow-gray)"}
                                            />
                                            <defs>
                                                <marker id="arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" /></marker>
                                                <marker id="arrow-gray" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" /></marker>
                                            </defs>
                                        </svg>
                                        {/* Warning Icon on Critical Path */}
                                        {isCritical && (
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-0.5 border border-red-200">
                                                <AlertTriangle size={12} className="text-red-500" fill="white"/>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
              </div>
            </div>
        </div>

        {/* Dependency Log Table */}
        <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><LinkIcon size={16}/> Program Dependencies Log</h3>
                <span className="text-xs text-slate-500 bg-white px-2 py-1 rounded border">Showing {programDependencies.length} links</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-white">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Predecessor (Source)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Successor (Target)</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Lag</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                      {programDependencies.map(dep => {
                          const source = projects.find(p => p.id === dep.sourceProjectId);
                          const target = projects.find(p => p.id === dep.targetProjectId);
                          
                          return (
                              <tr key={dep.id} className="hover:bg-slate-50">
                                  <td className="px-6 py-4 text-sm font-bold text-slate-700 flex items-center gap-2">
                                      <Activity size={14} className="text-slate-400"/> {source?.name || dep.sourceProjectId}
                                  </td>
                                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{target?.name || dep.targetProjectId}</td>
                                  <td className="px-6 py-4 text-sm text-slate-600">{dep.type}</td>
                                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">0d</td>
                                  <td className="px-6 py-4">
                                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                                          dep.status === 'Critical' ? 'bg-red-100 text-red-700 animate-pulse' : 
                                          dep.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                                      }`}>
                                          {dep.status}
                                      </span>
                                  </td>
                              </tr>
                          );
                      })}
                  </tbody>
              </table>
            </div>
        </div>
    </div>
  );
};

export default ProgramRoadmap;