
import React from 'react';
import { Risk } from '../../../types';
import { Layers, CheckSquare } from 'lucide-react';
import { CustomPieChart } from '../../charts/CustomPieChart';
import { formatCompactCurrency } from '../../../utils/formatters';
import { Badge } from '../../ui/Badge';
import { useTheme } from '../../../context/ThemeContext';

interface RiskAnalyticsViewProps {
  risks: Risk[];
  onSelectRisk: (id: string) => void;
}

export const RiskAnalyticsView: React.FC<RiskAnalyticsViewProps> = ({ risks, onSelectRisk }) => {
  const theme = useTheme();
  const categoryData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    risks.forEach(r => counts[r.category] = (counts[r.category] || 0) + 1);
    const colors = theme.charts.palette;
    return Object.entries(counts).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));
  }, [risks, theme]);

  return (
    <div className={`h-full p-6 overflow-auto ${theme.colors.background}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${theme.components.card} ${theme.layout.cardPadding}`}>
                <h3 className={`font-bold ${theme.colors.text.primary} mb-4 flex items-center gap-2`}><Layers size={18}/> Risk Category Distribution</h3>
                <CustomPieChart data={categoryData} height={300} />
            </div>
            <div className={`${theme.components.card} ${theme.layout.cardPadding}`}>
                <h3 className={`font-bold ${theme.colors.text.primary} mb-4 flex items-center gap-2`}><CheckSquare size={18}/> Top 5 Risks by EMV</h3>
                <div className="space-y-4">
                    {risks.sort((a,b) => (b.emv || 0) - (a.emv || 0)).slice(0, 5).map(r => (
                        <div key={r.id} className={`flex items-center justify-between p-3 ${theme.colors.background} rounded-lg cursor-pointer border border-transparent hover:${theme.colors.border}`} onClick={() => onSelectRisk(r.id)}>
                            <div>
                                <div className={`font-bold text-sm ${theme.colors.text.primary}`}>{r.description}</div>
                                <div className={`text-xs ${theme.colors.text.secondary}`}>ID: {r.id}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono font-bold text-nexus-600">{formatCompactCurrency(r.emv || 0)}</div>
                                <Badge variant={r.score >= 15 ? 'danger' : r.score >= 8 ? 'warning' : 'success'}>Score: {r.score}</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};
