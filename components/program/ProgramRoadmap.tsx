import React from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Map as MapIcon, Link as LinkIcon, AlertTriangle, Calendar, Flag } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getDaysDiff } from '../../utils/dateUtils';

interface ProgramRoadmapProps {
  programId: string;
}

const ProgramRoadmap: React.FC<ProgramRoadmapProps> = ({ programId }) => {
  const { program, projects, programDependencies } = useProgramData(programId);
  const theme = useTheme();

  if (!program) return null;

  // Simple Timeline Calculation
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
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-3 h-3 bg-blue-500 rounded"></span> Project
                    <span className="w-3 h-3 bg-nexus-600 rounded rotate-45"></span> Milestone
                    <span className="w-3 h-0.5 bg-slate-400"></span> Dependency
                </div>
            </div>
        </div>

        <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Timeline Header */}
                <div className="relative h-8 border-b border-slate-200 mb-4 text-xs font-bold text-slate-400 uppercase">
                    {years.map(year => {
                        const yearStart = new Date(year, 0, 1);
                        const pos = getPosition(yearStart.toISOString());
                        // Only show if within range (simplified check)
                        if (pos > 0 && pos < 100) {
                            return <span key={year} className="absolute top-0 transform -translate-x-1/2" style={{ left: `${pos}%` }}>{year}</span>
                        }
                        return null;
                    })}
                    <span className="absolute left-0">{startYear}</span>
                    <span className="absolute right-0">{endYear}</span>
                </div>
                
                <div className="relative space-y-10 min-h-[300px] py-4">
                    {/* Vertical Grid Lines & Today Marker */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="w-full h-full flex justify-between opacity-10">
                            <div className="border-r border-slate-900 h-full w-1/4"></div>
                            <div className="border-r border-slate-900 h-full w-1/4"></div>
                            <div className="border-r border-slate-900 h-full w-1/4"></div>
                            <div className="border-r border-slate-900 h-full w-1/4"></div>
                        </div>
                        {/* Today Line */}
                        <div 
                            className="absolute top-0 bottom-0 border-l-2 border-red-500 border-dashed z-20"
                            style={{ left: `${todayPosition}%` }}
                        >
                            <div className="absolute -top-1 -translate-x-1/2 text-[10px] font-bold text-red-500 bg-white px-1">TODAY</div>
                        </div>
                    </div>

                    {projects.map((proj, idx) => (
                        <div key={proj.id} className="relative h-12 group">
                            {/* Project Bar */}
                            <div 
                                className={`absolute top-0 h-10 rounded-lg shadow-sm flex items-center px-3 text-white text-xs font-bold overflow-hidden whitespace-nowrap z-10 transition-all cursor-pointer border-b-4 border-black/20 ${
                                    proj.health === 'Critical' ? 'bg-red-500 hover:bg-red-600' :
                                    proj.health === 'Warning' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                                style={{ 
                                    left: `${getPosition(proj.startDate)}%`, 
                                    width: `${getWidth(proj.startDate, proj.endDate)}%` 
                                }}
                                title={`${proj.name} (${proj.startDate} - ${proj.endDate})`}
                            >
                                <span className="mr-2 opacity-70 font-mono">{proj.code}</span>
                                {proj.name}
                            </div>
                            
                            {/* Dependency Lines (Visual only, simple logic) */}
                            {programDependencies.filter(d => d.sourceProjectId === proj.id).map(dep => {
                                const target = projects.find(p => p.id === dep.targetProjectId);
                                if(!target) return null;
                                
                                const isCritical = dep.status === 'Critical';
                                const sourcePos = getPosition(proj.endDate);
                                const targetPos = getPosition(target.startDate);
                                const width = Math.abs(targetPos - sourcePos);
                                const left = Math.min(sourcePos, targetPos);

                                return (
                                    <div 
                                        key={dep.id} 
                                        className="absolute top-5 h-12 z-0 pointer-events-none"
                                        style={{
                                            left: `${left}%`,
                                            width: `${width}%`
                                        }}
                                    >
                                        {/* Simplified connector line */}
                                        <svg width="100%" height="100%" preserveAspectRatio="none" className="overflow-visible">
                                            <path 
                                                d={`M 0 5 Q ${width/2} 5, ${width} 40`} 
                                                fill="none" 
                                                stroke={isCritical ? '#f87171' : '#94a3b8'} 
                                                strokeWidth="2" 
                                                strokeDasharray={isCritical ? "0" : "4 4"}
                                            />
                                        </svg>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
              </div>
            </div>
        </div>

        {/* Dependency Log */}
        <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><LinkIcon size={16}/> Critical Dependencies Log</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-white">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Source</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Target</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                      {programDependencies.map(dep => {
                          const source = projects.find(p => p.id === dep.sourceProjectId);
                          const target = projects.find(p => p.id === dep.targetProjectId);
                          
                          return (
                              <tr key={dep.id} className="hover:bg-slate-50">
                                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{source?.name || dep.sourceProjectId}</td>
                                  <td className="px-6 py-4 text-sm font-bold text-slate-700">{target?.name || dep.targetProjectId}</td>
                                  <td className="px-6 py-4 text-sm text-slate-600">{dep.type}</td>
                                  <td className="px-6 py-4 text-sm text-slate-600">{dep.description}</td>
                                  <td className="px-6 py-4">
                                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                                          dep.status === 'Critical' ? 'bg-red-100 text-red-700' : 
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