
import React, { useMemo } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Leaf, ShieldCheck, AlertTriangle, Search, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { EmptyGrid } from '../common/EmptyGrid';
import { Button } from '../ui/Button';

const PortfolioESG: React.FC = () => {
  const { esgMetrics, projects } = usePortfolioData();
  const theme = useTheme();

  // Aggregate average scores for radar chart dynamically
  const radarData = useMemo(() => {
      if (!esgMetrics.length) return [];

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

  if (esgMetrics.length === 0) {
      return (
          <div className="h-full flex items-center justify-center p-12">
              <EmptyGrid 
                title="ESG Assessment Queue Clean"
                description="No environmental, social, or governance metrics have been reported. Start a baseline assessment to begin monitoring sustainability compliance."
                icon={Leaf}
                actionLabel="Begin ESG Baseline"
                onAdd={() => {}}
              />
          </div>
      );
  }

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pageContainer} ${theme.layout.pagePadding} ${theme.layout.sectionSpacing} animate-in fade-in duration-300`}>
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <Leaf className="text-green-600" size={24}/>
                <h2 className={theme.typography.h2}>ESG & Compliance Monitor</h2>
            </div>
            <Button size="sm" icon={Plus}>New Assessment</Button>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm h-[400px] flex flex-col items-center`}>
                <h3 className="font-bold text-slate-800 mb-2">Portfolio Sustainability Index</h3>
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

            <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden flex flex-col`}>
                <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest text-[10px]">Component Scorecard</h3>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input className="pl-9 pr-4 py-1.5 text-[11px] border border-slate-300 rounded-lg w-48" placeholder="Filter scorecard..." />
                    </div>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Component</th>
                                <th className="px-6 py-3 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Env</th>
                                <th className="px-6 py-3 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Soc</th>
                                <th className="px-6 py-3 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">Gov</th>
                                <th className="px-6 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {esgMetrics.map(m => {
                                const proj = projects.find(p => p.id === m.componentId);
                                return (
                                    <tr key={m.componentId} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{proj?.name || m.componentId}</td>
                                        <td className="px-6 py-4 text-center text-sm font-mono text-green-700">{m.environmentalScore}</td>
                                        <td className="px-6 py-4 text-center text-sm font-mono text-blue-700">{m.socialScore}</td>
                                        <td className="px-6 py-4 text-center text-sm font-mono text-purple-700">{m.governanceScore}</td>
                                        <td className="px-6 py-4">
                                            {m.complianceStatus === 'Compliant' ? (
                                                <span className="flex items-center gap-1 text-[10px] font-black uppercase text-green-600"><ShieldCheck size={14}/> Compliant</span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-[10px] font-black uppercase text-red-600"><AlertTriangle size={14}/> {m.complianceStatus}</span>
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
    </div>
  );
};

export default PortfolioESG;
