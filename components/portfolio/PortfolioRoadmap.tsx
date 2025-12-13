import React from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Map as MapIcon, Flag, Diamond } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getDaysDiff } from '../../utils/dateUtils';

const PortfolioRoadmap: React.FC = () => {
  const { projects, drivers } = usePortfolioData();
  const theme = useTheme();

  // Determine timeline bounds
  const startDate = new Date('2024-01-01');
  const endDate = new Date('2026-12-31');
  const totalDays = getDaysDiff(startDate, endDate);

  const getPosition = (dateStr: string) => {
      const d = new Date(dateStr);
      const diff = getDaysDiff(startDate, d);
      return Math.max(0, Math.min(100, (diff / totalDays) * 100));
  };

  const getWidth = (startStr: string, endStr: string) => {
      const s = new Date(startStr);
      const e = new Date(endStr);
      const dur = getDaysDiff(s, e);
      return Math.max(1, (dur / totalDays) * 100);
  };

  const years = [2024, 2025, 2026];

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <MapIcon className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Strategic Portfolio Roadmap</h2>
        </div>
        <p className="text-slate-500 text-sm mb-6">Long-range visualization of portfolio components aligned to strategic drivers.</p>

        <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
            {/* Timeline Header */}
            <div className="flex border-b border-slate-200 bg-slate-50 h-10 sticky top-0 z-20">
                <div className="w-64 flex-shrink-0 border-r border-slate-200 px-4 flex items-center font-bold text-xs text-slate-500 uppercase">Strategic Driver</div>
                <div className="flex-1 relative">
                    {years.map((year, i) => (
                        <div key={year} className="absolute top-0 bottom-0 border-l border-slate-200 flex items-center justify-center font-bold text-xs text-slate-400" 
                             style={{ left: `${(i / years.length) * 100}%`, width: `${100 / years.length}%` }}>
                            {year}
                        </div>
                    ))}
                </div>
            </div>

            {/* Swimlanes */}
            <div className="divide-y divide-slate-100">
                {drivers.map(driver => {
                    // Filter projects that (mock) align to this driver
                    // In a real app, projects would have a `primaryDriverId` field.
                    // Here we assign randomly based on index or category for demo.
                    const alignedProjects = projects.filter((_, idx) => idx % drivers.length === drivers.indexOf(driver));

                    return (
                        <div key={driver.id} className="flex min-h-[100px] group hover:bg-slate-50/50">
                            {/* Driver Header */}
                            <div className="w-64 flex-shrink-0 border-r border-slate-200 p-4 bg-white z-10">
                                <h4 className="font-bold text-sm text-slate-800">{driver.name}</h4>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{driver.description}</p>
                                <span className="inline-block mt-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-mono">
                                    Weight: {driver.weight}%
                                </span>
                            </div>

                            {/* Timeline Area */}
                            <div className="flex-1 relative py-4">
                                {/* Grid Lines */}
                                {years.map((y, i) => (
                                    <div key={y} className="absolute top-0 bottom-0 border-l border-dashed border-slate-100" style={{ left: `${(i / years.length) * 100}%` }}></div>
                                ))}

                                {alignedProjects.map(proj => (
                                    <div 
                                        key={proj.id}
                                        className="absolute h-8 rounded-md bg-nexus-500 border border-nexus-600 shadow-sm flex items-center px-2 text-white text-xs font-bold whitespace-nowrap overflow-hidden cursor-pointer hover:bg-nexus-600 transition-colors z-10"
                                        style={{
                                            left: `${getPosition(proj.startDate)}%`,
                                            width: `${getWidth(proj.startDate, proj.endDate)}%`,
                                            top: '20px' // Simple stacking logic would go here
                                        }}
                                        title={`${proj.name} (${proj.startDate} - ${proj.endDate})`}
                                    >
                                        {proj.name}
                                    </div>
                                ))}
                                {alignedProjects.length === 0 && <div className="text-xs text-slate-400 italic p-4">No active initiatives</div>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

export default PortfolioRoadmap;