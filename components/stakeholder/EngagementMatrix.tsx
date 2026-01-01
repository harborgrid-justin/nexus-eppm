
import React from 'react';
import { EnrichedStakeholder } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { BarChart2, CheckCircle, ArrowRight } from 'lucide-react';

interface EngagementMatrixProps {
    stakeholders: EnrichedStakeholder[];
}

export const EngagementMatrix: React.FC<EngagementMatrixProps> = ({ stakeholders }) => {
    const theme = useTheme();
    const levels = ['Unaware', 'Resistant', 'Neutral', 'Supportive', 'Leading'];

    return (
        <div className={`p-6 rounded-xl border h-full overflow-auto ${theme.colors.surface} ${theme.colors.border}`}>
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <BarChart2 className="text-nexus-600" size={20} /> Engagement Assessment Matrix
            </h3>
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase">Stakeholder</th>
                        {levels.map(level => <th key={level} className="px-6 py-3 text-center text-xs uppercase">{level}</th>)}
                        <th className="px-6 py-3 text-left text-xs uppercase">Action Plan</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                {stakeholders.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4"><div className="font-bold text-sm">{s.name}</div><div className="text-xs text-slate-500">{s.role}</div></td>
                    {levels.map(level => {
                        const isC = s.engagement.current === level;
                        const isD = s.engagement.desired === level;
                        return (
                        <td key={level} className="px-6 py-4 text-center relative">
                            {isC && <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-slate-200 font-bold" title="Current">C</span>}
                            {isD && <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-nexus-600 text-white font-bold" title="Desired">D</span>}
                        </td>
                        );
                    })}
                    <td className="px-6 py-4">
                        {s.engagement.current !== s.engagement.desired ? (
                        <button className="text-xs text-nexus-600 font-medium hover:underline flex items-center gap-1">Create Plan <ArrowRight size={12}/></button>
                        ) : <span className="text-xs text-green-600 font-medium">Aligned</span>}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};
