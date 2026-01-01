
import React from 'react';
import { Project } from '../../types/index';
import { useScheduleAnalysis } from '../../hooks/useScheduleAnalysis';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts';
import { History } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface BaselineComparisonProps {
  project: Project;
}

const BaselineComparison: React.FC<BaselineComparisonProps> = ({ project }) => {
  const { varianceAnalysis } = useScheduleAnalysis(project);
  const theme = useTheme();

  return (
    <div className={`${theme.components.card} ${theme.layout.cardPadding} h-80 flex flex-col`}>
        <h3 className={`${theme.typography.h3} mb-4 flex items-center gap-2`}>
            <History size={18} className="text-orange-500"/> Schedule Variance (Days)
        </h3>
        <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={varianceAnalysis} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.charts.grid} />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} tick={{fontSize: 11}} />
                    <Tooltip contentStyle={theme.charts.tooltip} />
                    <ReferenceLine x={0} stroke={theme.colors.text.tertiary} />
                    <Bar dataKey="variance" fill={theme.charts.palette[5]} name="Variance" barSize={20} radius={[0, 4, 4, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default BaselineComparison;