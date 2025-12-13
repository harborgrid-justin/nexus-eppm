
import React from 'react';
import { BadgeCheck, Plus, Lock } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { usePermissions } from '../../hooks/usePermissions';

const QualityStandards: React.FC = () => {
    const theme = useTheme();
    const { state } = useData();
    const { canEditProject } = usePermissions();

    return (
        <div className="h-full flex flex-col">
            <div className={`p-4 ${theme.layout.headerBorder} flex-shrink-0 flex items-center justify-between`}>
                <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                    <BadgeCheck size={16} /> Applicable Quality Standards
                </h3>
                {canEditProject() ? (
                    <button className={`px-3 py-2 ${theme.colors.accentBg} text-white rounded-lg flex items-center gap-2 hover:bg-nexus-700 shadow-sm text-sm font-medium`}>
                        <Plus size={16} /> Add Standard
                    </button>
                ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                        <Lock size={14}/> Read Only
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className={`${theme.colors.background} sticky top-0`}>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Standard Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Source</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
                        </tr>
                    </thead>
                    <tbody className={`${theme.colors.surface} divide-y divide-slate-100`}>
                        {state.qualityStandards.map(standard => (
                            <tr key={standard.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{standard.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                    <span className={`px-2 py-1 text-xs rounded-full ${standard.source === 'Internal' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}`}>{standard.source}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{standard.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default QualityStandards;
