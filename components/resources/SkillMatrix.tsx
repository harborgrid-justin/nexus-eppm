import React from 'react';
import { useResourcePlanning } from '../../hooks/useResourcePlanning';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Award } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const SkillMatrix: React.FC = () => {
  const { skillMatrix } = useResourcePlanning();
  const theme = useTheme();

  return (
    <div className={`${theme.components.card} ${theme.layout.cardPadding} h-full flex flex-col`}>
        <h3 className={`${theme.typography.h3} mb-6 flex items-center gap-2`}>
            <Award size={18} className="text-purple-600"/> Enterprise Capability Matrix
        </h3>
        <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillMatrix} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={theme.charts.grid} />
                    <XAxis type="number" />
                    <YAxis dataKey="skill" type="category" width={100} tick={{fontSize: 12}} />
                    <Tooltip contentStyle={theme.charts.tooltip} />
                    <Bar dataKey="count" fill={theme.charts.palette[4]} barSize={20} radius={[0, 4, 4, 0]} name="Resource Count" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};