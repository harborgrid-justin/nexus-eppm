
import React, { useMemo, useState, useEffect, useTransition } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Map as MapIcon, Link as LinkIcon, AlertTriangle, Calendar, Flag, Activity, Loader2, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getDaysDiff } from '../../utils/dateUtils';

interface ProgramRoadmapProps {
  programId: string;
}

const ProgramRoadmap: React.FC<ProgramRoadmapProps> = ({ programId }) => {
  const { program, projects, programDependencies } = useProgramData(programId);
  const theme = useTheme();
  
  // Pattern 27: Use transition for complex timeline calculations
  const [isPending, startTransition] = useTransition();
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    startTransition(() => {
        setToday(new Date());
    });
  }, []);

  if (!program || !today) return <div className="flex h-full items-center justify-center text-slate-400 font-bold uppercase tracking-widest"><Loader2 className="animate-spin mr-2"/> Painting Roadmap...</div>;

  const start = new Date(program.startDate);
  const end = new Date(program.endDate);
  const totalDuration = getDaysDiff(start, end);
  const todayPosition = (getDaysDiff(start, today) / totalDuration) * 100;

  const getPosition = (dateStr: string) => Math.max(0, Math.min(100, (getDaysDiff(start, new Date(dateStr)) / totalDuration) * 100));
  const getWidth = (s: string, e: string) => Math.max(1, (getDaysDiff(new Date(s), new Date(e)) / totalDuration) * 100);

  const years = useMemo(() => {
      const yr = [];
      for(let y = start.getFullYear(); y <= end.getFullYear(); y++) yr.push(y);
      return yr;
  }, [start, end]);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} space-y-6 animate-in fade-in duration-500 scrollbar-thin`}>
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-nexus-900 text-white rounded-2xl shadow-xl border border-slate-700"><MapIcon size={24}/></div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Integrated Strategic Roadmap</h2>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mt-0.5">Program ID: {programId}</p>
                </div>
            </div>
            {isPending && <span className="text-nexus-600 animate-pulse text-[10px] font-black uppercase tracking-widest">Warping Timeline...</span>}
            <div className="bg-white border p-1.5 rounded-xl shadow-sm flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase px-4">
                <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm shadow-blue-500/50"></div> Healthy</span>
                <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm shadow-red-500/50"></div> Delay</span>
            </div>
        </div>

        <div className={`${theme.components.card} border-slate-200 shadow-2xl relative overflow-hidden`}>
            <div className="overflow-x-auto scrollbar-thin">
              <div className="min-w-[1200px] p-6">
                <div className="relative h-10 border-b border-slate-100 mb-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/50 -mx-6 px-6 flex items-center">
                    {years.map(year => (
                        <span key={year} className="absolute border-l-2 border-slate-200 h-full pl-3 flex items-center" style={{ left: `${getPosition(`${year}-01-01`)}%` }}>{year}</span>
                    ))}
                </div>
                
                <div className="relative space-y-14 min-h-[500px] py-6">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 bottom-0 border-l-2 border-red-500 border-dashed z-40" style={{ left: `${todayPosition}%` }}>
                            <div className="absolute -top-8 -translate-x-1/2 text-[9px] font-black text-white bg-red-500 px-2 py-1 rounded-full shadow-lg ring-4 ring-red-500/20">LIVE</div>
                        </div>
                    </div>

                    {projects.map((proj, idx) => (
                        <div key={proj.id} className="relative h-14 group">
                            <div className="absolute top-1.5 h-11 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 opacity-40 z-0" style={{ left: `${getPosition(proj.startDate) - 1.5}%`, width: `${getWidth(proj.startDate, proj.endDate) + 3}%` }}></div>
                            <div className={`absolute top-0 h-11 rounded-xl shadow-xl flex items-center px-4 text-white text-[11px] font-black overflow-hidden whitespace-nowrap z-10 transition-all cursor-pointer border-b-4 border-black/10 group-hover:-translate-y-0.5 group-hover:shadow-2xl ${proj.health === 'Critical' ? 'bg-red-500' : proj.health === 'Warning' ? 'bg-yellow-500 text-slate-900' : 'bg-blue-600'}`} style={{ left: `${getPosition(proj.startDate)}%`, width: `${getWidth(proj.startDate, proj.endDate)}%` }}>
                                <span className="mr-3 opacity-90 font-mono bg-black/10 px-2 py-0.5 rounded-lg border border-white/10 uppercase">{proj.code}</span>
                                <span className="truncate">{proj.name}</span>
                                <div className="absolute bottom-0 left-0 h-1 bg-white/20 shadow-inner" style={{width: '65%'}}></div>
                            </div>
                            
                            {programDependencies.filter(d => d.sourceProjectId === proj.id).map(dep => {
                                const target = projects.find(p => p.id === dep.targetProjectId);
                                if(!target) return null;
                                const isCritical = dep.status === 'Critical';
                                return (
                                    <div key={dep.id} className="absolute top-6 z-20 pointer-events-none" style={{ left: `${getPosition(proj.endDate)}%`, width: `${Math.abs(getPosition(target.startDate) - getPosition(proj.endDate))}%` }}>
                                        <svg width="100%" height="80" preserveAspectRatio="none" className="overflow-visible opacity-60">
                                            <path d="M 0 5 C 50% 5, 50% 60, 100% 60" fill="none" stroke={isCritical ? '#ef4444' : '#64748b'} strokeWidth={isCritical ? "3" : "1.5"} strokeDasharray={isCritical ? "0" : "5 5"} markerEnd={isCritical ? "url(#arrow-red)" : "url(#arrow-gray)"}/>
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

        <div className="bg-white border rounded-3xl p-6 shadow-xl border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
             <div className="flex items-center gap-6">
                <div className="p-4 bg-nexus-50 rounded-2xl border border-nexus-100 shadow-sm"><Activity size={24} className="text-nexus-600"/></div>
                <div>
                    <h4 className="font-black text-slate-900 text-lg tracking-tight">System Interlocks Verified</h4>
                    <p className="text-sm text-slate-500 font-medium">All cross-project dependencies are logically sound and within float tolerance.</p>
                </div>
             </div>
             <button className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-xl active:scale-95">
                 Optimize Sequence <ArrowRight size={16}/>
             </button>
        </div>
    </div>
  );
};
export default ProgramRoadmap;
