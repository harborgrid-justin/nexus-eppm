
import React, { useMemo } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Leaf, ShieldCheck, AlertTriangle, Search, Plus, Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { EmptyGrid } from '../common/EmptyGrid';
import { Button } from '../ui/Button';

const PortfolioESG: React.FC = () => {
  const { esgMetrics, projects } = usePortfolioData();
  const theme = useTheme();

  const radarData = useMemo(() => {
      if (!esgMetrics || esgMetrics.length === 0) return [];

      const totals = esgMetrics.reduce((acc, curr) => {
          acc.environmental += curr.environmentalScore;
          acc.social += curr.socialScore;
          acc.governance += curr.governanceScore;
          acc.safety += (curr.socialScore * 0.95); 
          acc.diversity += (curr.socialScore * 0.85); 
          acc.privacy += (curr.governanceScore * 0.92); 
          return acc;
      }, { environmental: 0, social: 0, governance: 0, safety: 0, diversity: 0, privacy: 0 });

      const count = esgMetrics.length;
      
      return [
          { subject: 'Environmental', A: Math.round(totals.environmental / count), fullMark: 100 },
          { subject: 'Social', A: Math.round(totals.social / count), fullMark: 100 },
          { subject: 'Governance', A: Math.round(totals.governance / count), fullMark: 100 },
          { subject: 'Safety', A: Math.round(totals.safety / count), fullMark: 100 },
          { subject: 'Diversity', A: Math.round(totals.diversity / count), fullMark: 100 },
          { subject: 'Data Privacy', A: Math.round(totals.privacy / count), fullMark: 100 },
      ];
  }, [esgMetrics]);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
        <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
                <Leaf className="text-green-600" size={24}/>
                <h2 className={theme.typography.h2}>ESG & Corporate Compliance Monitor</h2>
            </div>
            {esgMetrics.length > 0 && <Button size="sm" icon={Plus} onClick={() => {}}>Report Performance</Button>}
        </div>

        {esgMetrics.length === 0 ? (
            <div className="flex-1 flex h-full">
                <EmptyGrid 
                    title="Sustainability Ledger Inactive"
                    description="No environmental, social, or governance metrics have been synchronized for the current portfolio period. Conduct an assessment to begin monitoring sustainability compliance."
                    icon={Leaf}
                    actionLabel="Initialize ESG Assessment"
                    onAdd={() => {}}
                />
            </div>
        ) : (
            <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap} flex-1 min-h-0`}>
                <div className={`${theme.colors.surface} p-8 rounded-[2.5rem] border ${theme.colors.border} shadow-sm h-[450px] flex flex-col items-center`}>
                    <div className="flex justify-between items-start w-full mb-4 border-b pb-4">
                        <div>
                             <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Portfolio Index</h3>
                             <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Multi-Vector Sustainability Score</p>
                        </div>
                        <Activity className="text-nexus-400" size={18}/>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fontWeight: 'bold', fill: '#64748b' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Portfolio Average" dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.15} strokeWidth={2} />
                                <Tooltip contentStyle={{borderRadius: '12px', border: '1px solid #e2e8f0'}} />
                                <Legend wrapperStyle={{paddingTop: '20px'}} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={`${theme.colors.surface} rounded-[2.5rem] border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col h-[450px]`}>
                    <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">Regulatory Compliance Scorecard</h3>
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                            <input className="pl-9 pr-4 py-1.5 text-[11px] font-bold border border-slate-300 rounded-xl w-48 bg-white focus:ring-4 focus:ring-nexus-500/10 outline-none transition-all" placeholder="Filter entities..." />
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto scrollbar-thin">
                        <table className="min-w-full divide-y divide-slate-200 border-separate border-spacing-0">
                            <thead className="bg-white sticky top-0 z-10 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Entity</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Env</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Soc</th>
                                    <th className="px-6 py-4 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Gov</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest pr-8">Posture</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {esgMetrics.map(m => {
                                    const proj = projects.find(p => p.id === m.componentId);
                                    return (
                                        <tr key={m.componentId} className="nexus-table-row transition-colors hover:bg-slate-50/50">
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-black text-slate-800 uppercase tracking-tight">{proj?.name || m.componentId}</div>
                                                <div className="text-[10px] font-mono text-slate-400 mt-0.5">{proj?.code}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-sm font-black font-mono text-green-700">{m.environmentalScore}</td>
                                            <td className="px-6 py-4 text-center text-sm font-black font-mono text-blue-700">{m.socialScore}</td>
                                            <td className="px-6 py-4 text-center text-sm font-black font-mono text-purple-700">{m.governanceScore}</td>
                                            <td className="px-6 py-4 text-right pr-8">
                                                {m.complianceStatus === 'Compliant' ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100 shadow-sm"><ShieldCheck size={14}/> Compliant</span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-100 shadow-sm"><AlertTriangle size={14}/> {m.complianceStatus}</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default PortfolioESG;
