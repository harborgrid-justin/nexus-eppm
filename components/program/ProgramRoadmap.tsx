
import React, { useMemo, useState, useEffect } from 'react';
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
  
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  if (!program || !today) return <div className="flex h-full items-center justify-center text-slate-400 font-bold uppercase tracking-widest"><Loader2 className="animate-spin mr-2"/> Painting Roadmap...</div>;

  const start = new Date(program.startDate);
  const end = new Date(program.endDate);
  const totalDuration = getDaysDiff(start, end) || 1; // Prevent division by zero
  const todayPosition = Math.max(0, Math.min(100, (getDaysDiff(start, today) / totalDuration) * 100));

  const getPosition = (dateStr: string) => {
      const pos = (getDaysDiff(start, new Date(dateStr)) / totalDuration) * 100;
      return Math.max(0, Math.min(100, isNaN(pos) ? 0 : pos));
  };
  
  const getWidth = (s: string, e: string) => {
      const w = (getDaysDiff(new Date(s), new Date(e)) / totalDuration) * 100;
      return Math.max(1, isNaN(w) ? 1 : w);
  };

  const years = useMemo(() => {
      const yr = [];
      const startYear = start.getFullYear();
      const endYear = end.getFullYear();
      for(let y = startYear; y <= endYear; y++) yr.push(y);
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
            <div className="bg-white border p-1.5 rounded-xl shadow-sm flex items-center gap-4 text-[10px] font-bold text-slate-500 uppercase px-4">
                <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm shadow-blue-500/50"></div> Healthy</span>
                <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm shadow-red-500/50"></div> Delay</span>
            </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 min-h-[400px] relative">
            {/* Header Years */}
            <div className="flex border-b border-slate-200 bg-slate-50">
                <div className="w-64 border-r border-slate-200 p-4 font-bold text-slate-500 text-xs uppercase tracking-widest">Work Stream</div>
                <div className="flex-1 flex">
                    {years.map(y => (
                        <div key={y} className="flex-1 border-r border-slate-200 p-2 text-center font-bold text-slate-400 text-sm">{y}</div>
                    ))}
                </div>
            </div>

            {/* Timeline Body */}
            <div className="overflow-y-auto">
                {projects.map(proj => (
                    <div key={proj.id} className="flex border-b border-slate-100 min-h-[60px] group hover:bg-slate-50 transition-colors">
                        <div className="w-64 border-r border-slate-200 p-4 shrink-0">
                            <h4 className="font-bold text-sm text-slate-800 truncate">{proj.name}</h4>
                            <p className="text-[10px] text-slate-500 uppercase">{proj.code}</p>
                        </div>
                        <div className="flex-1 relative my-auto h-full">
                            <div className="absolute inset-0 flex pointer-events-none">
                                {years.map((_, i) => <div key={i} className="flex-1 border-r border-dashed border-slate-200/50"></div>)}
                            </div>
                            
                            <div 
                                className={`absolute h-8 top-1/2 -translate-y-1/2 rounded-md shadow-sm flex items-center px-3 text-xs font-bold text-white transition-all hover:scale-105 cursor-pointer ${proj.health === 'Critical' ? 'bg-red-500' : proj.health === 'Warning' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                                style={{
                                    left: `${getPosition(proj.startDate)}%`,
                                    width: `${getWidth(proj.startDate, proj.endDate)}%`
                                }}
                            >
                                <span className="truncate">{proj.name}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Today Line */}
            <div className="absolute top-10 bottom-0 border-l-2 border-red-500 border-dashed z-10 pointer-events-none" style={{ left: `calc(16rem + ((100% - 16rem) * ${todayPosition / 100}))` }}>
                 <div className="absolute -top-3 -translate-x-1/2 bg-red-500 text-white text-[9px] font-bold px-1.5 rounded">TODAY</div>
            </div>
        </div>
    </div>
  );
};

export default ProgramRoadmap;
    