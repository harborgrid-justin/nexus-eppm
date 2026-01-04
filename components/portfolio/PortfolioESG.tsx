
import React, { useMemo } from 'react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { Leaf, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';

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
          // Simulated extra dimensions for the chart that aren't in core metric type yet
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
        <div className="flex items-center gap-2 mb-2">
            <Leaf className="text-green-600" size={24}/>
            <h2 className={theme.typography.h2}>ESG & Compliance Monitor</h2>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 ${theme.layout.gridGap}`}>
            {/* Radar Chart */}
            <div className={`${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm h-[400px] flex flex-col items-center`}>
                <h3 className="font-bold text-slate-800 mb-2">Portfolio Sustainability Index</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                        <Radar name="Portfolio Average" dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                        <Tooltip />
                        <Legend />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Compliance List */}
            <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
                <div className="p-4 border-b border-slate-200 bg-slate-50">
                    <h3 className="font-bold text-slate-800">Component Compliance Status</h3>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-white">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Component</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Env. Score</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Soc. Score</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Gov. Score</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {esgMetrics.map(m => {
                                const proj = projects.find(p => p.id === m.componentId);
                                return (
                                    <tr key={m.componentId} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{proj?.name || m.componentId}</td>
                                        <td className="px-6 py-4 text-center text-sm font-mono text-green-700">{m.environmentalScore}</td>
                                        <td className="px-6 py-4 text-center text-sm font-mono text-blue-700">{m.socialScore}</td>
                                        <td className="px-6 py-4 text-center text-sm font-mono text-purple-700">{m.governanceScore}</td>
                                        <td className="px-6 py-4">
                                            {m.complianceStatus === 'Compliant' ? (
                                                <span className="flex items-center gap-1 text-xs font-bold text-green-600"><ShieldCheck size={14}/> Compliant</span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs font-bold text-red-600"><AlertTriangle size={14}/> {m.complianceStatus}</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                            {esgMetrics.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">No ESG metrics recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
  );
};

export default PortfolioESG;
