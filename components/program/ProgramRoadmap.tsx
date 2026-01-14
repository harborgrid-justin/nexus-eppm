import React, { useMemo, useState, useEffect } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Map as MapIcon, Loader2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getDaysDiff } from '../../utils/dateUtils';
import { EmptyGrid } from '../common/EmptyGrid';

interface ProgramRoadmapProps {
  programId: string;
}

const ProgramRoadmap: React.FC<ProgramRoadmapProps> = ({ programId }) => {
  const { program, projects } = useProgramData(programId);
  const theme = useTheme();
  
  const [today, setToday] = useState<Date | null>(null);

  useEffect(() => {
    setToday(new Date());
  }, []);

  const years = useMemo(() => {
      if (!program) return [];
      const start = new Date(program.startDate);
      const end = new Date(program.endDate);
      const yr = [];
      const startYear = start.getFullYear();
      const endYear = end.getFullYear();
      for(let y = startYear; y <= endYear; y++) yr.push(y);
      return yr;
  }, [program]);

  if (!program || !today) return <div className={`flex h-full items-center justify-center ${theme.colors.text.tertiary} font-bold uppercase tracking-widest`}><Loader2 className="animate-spin mr-2"/> Synchronizing Portfolio Timeline...</div>;

  if (projects.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-8">
              <EmptyGrid 
                title="Integrated Roadmap Null"
                description="This program has no project components aligned to its strategic lifecycle. Align initiatives to activate the timeline visualization."
                icon={MapIcon}
                actionLabel="Align Initiative"
                onAdd={() => {}}
              />
          </div>
      );
  }

  const start = new Date(program.startDate);
  const end = new Date(program.endDate);
  const totalDuration = getDaysDiff(start, end) || 1; 
  const todayPosition = Math.max(0, Math.min(100, (getDaysDiff(start, today) / totalDuration) * 100));

  const getPosition = (dateStr: string) => {
      const pos = (getDaysDiff(start, new Date(dateStr)) / totalDuration) * 100;
      return Math.max(0, Math.min(100, isNaN(pos) ? 0 : pos));
  };
  
  const getWidth = (s: string, e: string) => {
      const w = (getDaysDiff(new Date(s), new Date(e)) / totalDuration) * 100;
      return Math.max(1, isNaN(w) ? 1 : w);
  };

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-500 scrollbar-thin`}>
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-nexus-900 text-white rounded-2xl shadow-xl border border-slate-700"><MapIcon size={24}/></div>
                <div>
                    <h2 className={`text-2xl font-black ${theme.colors.text.primary} tracking-tight uppercase`}>Program Delivery Roadmap</h2>
                    <p className={`text-xs ${theme.colors.text.secondary} font-bold uppercase tracking-widest mt-0.5`}>Consolidated Multi-Project Lifecycle</p>
                </div>
            </div>
            <div className={`flex items-center gap-4 text-[10px] font-black uppercase px-6 ${theme.colors.surface} border ${theme.colors.border} py-3 rounded-2xl shadow-sm`}>
                <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-nexus-500 rounded-full shadow-[0_0_8px_#0ea5e9]"></div> Active</span>
                <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></div> Delay Vector</span>
                <div className="w-px h-4 bg-slate-200 mx-2"></div>
                <span className="text-slate-400">Context: {programId}</span>
            </div>
        </div>

        <div className={`${theme.colors.surface} rounded-[2.5rem] border ${theme.colors.border} shadow-sm overflow-hidden flex-1 min-h-[400px] relative`}>
            <div className={`flex border-b ${theme.colors.border} ${theme.colors.background}`}>
                <div className={`w-64 border-r ${theme.colors.border} p-5 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] bg-slate-50/50`}>Component Track</div>
                <div className="flex-1 flex">
                    {years.map(y => (
                        <div key={y} className={`flex-1 border-r ${theme.colors.border} p-3 text-center font-black text-slate-400 text-sm`}>{y}</div>
                    ))}
                </div>
            </div>

            <div className="overflow-y-auto scrollbar-thin">
                {projects.map(proj => (
                    <div key={proj.id} className={`flex border-b border-slate-50 min-h-[80px] group hover:${theme.colors.background}/50 transition-colors`}>
                        <div className={`w-64 border-r ${theme.colors.border} p-5 shrink-0 bg-white group-hover:bg-slate-50/50 transition-colors`}>
                            <h4 className={`font-black text-sm text-slate-800 uppercase tracking-tight truncate`}>{proj.name}</h4>
                            <p className={`text-[10px] text-slate-400 font-mono mt-1 font-bold`}>{proj.code}</p>
                        </div>
                        <div className="flex-1 relative my-auto h-full px-4">
                            <div className="absolute inset-0 flex pointer-events-none opacity-30">
                                {years.map((_, i) => <div key={i} className={`flex-1 border-r border-dashed border-slate-200`}></div>)}
                            </div>
                            
                            <div 
                                className={`absolute h-8 top-1/2 -translate-y-1/2 rounded-xl shadow-lg flex items-center px-4 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] hover:shadow-xl cursor-pointer ${
                                    proj.health === 'Critical' ? 'bg-red-500 border border-red-600 shadow-red-500/20' : 
                                    proj.health === 'Warning' ? 'bg-yellow-500 border border-yellow-600 shadow-yellow-500/20' : 
                                    'bg-nexus-600 border border-nexus-700 shadow-nexus-500/20'
                                }`}
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

            <div className="absolute top-10 bottom-0 border-l-2 border-red-500 border-dashed z-10 pointer-events-none" style={{ left: `calc(16rem + ((100% - 16rem) * ${todayPosition / 100}))` }}>
                 <div className="absolute -top-3 -translate-x-1/2 bg-red-600 text-white text-[9px] font-black tracking-widest uppercase px-2 py-1 rounded-full shadow-xl">Data Date</div>
            </div>
            <div className="absolute inset-0 nexus-empty-pattern -z-10 opacity-40"></div>
        </div>
    </div>
  );
};

export default ProgramRoadmap;