
import React, { useState } from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import * as LucideIcons from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { formatCompactCurrency } from '../../utils/formatters';

const { TrendingUp, AlertTriangle, ArrowRight, DollarSign, BarChart2 } = LucideIcons;
const Scale = (LucideIcons as any).Scale || BarChart2;

interface ProgramTradeoffProps {
  programId: string;
}

const ProgramTradeoff: React.FC<ProgramTradeoffProps> = ({ programId }) => {
  const { tradeoffScenarios } = useProgramData(programId);
  const theme = useTheme();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // Transform data for chart
  const chartData = tradeoffScenarios.map(s => ({
      name: s.name,
      benefit: s.benefitValue,
      exposure: s.costImpact + (s.riskScore * 10000), // Simple heuristic for exposure
      score: s.riskScore
  }));

  const activeScenario = tradeoffScenarios.find(s => s.id === selectedScenario);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <Scale className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Benefit-Risk Tradeoff Analysis</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Impact Matrix */}
            <div className={`lg:col-span-2 ${theme.colors.surface} p-6 rounded-xl border ${theme.colors.border} shadow-sm`}>
                <h3 className="font-bold text-slate-800 mb-4">Value vs. Exposure Matrix</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Scenario</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Benefit Value</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Exposure</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Risk Score</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase">Net Value</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {chartData.map((data) => {
                                const scenario = tradeoffScenarios.find(s => s.name === data.name);
                                if (!scenario) return null;
                                const netValue = scenario.benefitValue - scenario.costImpact;
                                return (
                                    <tr
                                        key={scenario.id}
                                        onClick={() => setSelectedScenario(scenario.id)}
                                        className={`hover:bg-slate-50 cursor-pointer ${selectedScenario === scenario.id ? 'bg-nexus-50' : ''}`}
                                    >
                                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{data.name}</td>
                                        <td className="px-6 py-4 text-sm text-right font-mono text-green-600">{formatCompactCurrency(data.benefit)}</td>
                                        <td className="px-6 py-4 text-sm text-right font-mono text-red-600">{formatCompactCurrency(data.exposure)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                data.score > 10 ? 'bg-red-100 text-red-700' :
                                                data.score > 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                                {data.score}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-center font-mono font-bold">
                                            <span className={netValue > 0 ? 'text-green-600' : 'text-red-600'}>
                                                {netValue > 0 ? '+' : ''}{formatCompactCurrency(netValue)}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Scenario Details */}
            <div className="space-y-6">
                <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <h3 className="font-bold text-slate-800">Scenarios</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {tradeoffScenarios.map(s => (
                            <div 
                                key={s.id} 
                                onClick={() => setSelectedScenario(s.id)}
                                className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${selectedScenario === s.id ? 'bg-nexus-50 border-l-4 border-nexus-500' : ''}`}
                            >
                                <h4 className="font-bold text-sm text-slate-900">{s.name}</h4>
                                <div className="flex justify-between mt-2 text-xs text-slate-500">
                                    <span className="flex items-center gap-1 text-green-600"><TrendingUp size={12}/> +{formatCompactCurrency(s.benefitValue)}</span>
                                    <span className="flex items-center gap-1 text-red-600"><AlertTriangle size={12}/> Score: {s.riskScore}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {activeScenario && (
                    <div className="p-5 bg-slate-800 text-white rounded-xl shadow-lg">
                        <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                            Recommendation: 
                            <span className={activeScenario.recommendation === 'Proceed' ? 'text-green-400' : 'text-red-400'}>
                                {activeScenario.recommendation}
                            </span>
                        </h4>
                        <p className="text-sm text-slate-300 mb-4">{activeScenario.description}</p>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b border-slate-700 pb-1">
                                <span className="text-slate-400">Net Value:</span>
                                <span className="font-mono font-bold text-green-400">+{formatCompactCurrency(activeScenario.benefitValue - activeScenario.costImpact)}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-700 pb-1">
                                <span className="text-slate-400">Cost Impact:</span>
                                <span className="font-mono text-red-300">-{formatCompactCurrency(activeScenario.costImpact)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default ProgramTradeoff;
