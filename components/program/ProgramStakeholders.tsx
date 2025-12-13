
import React from 'react';
import { useProgramData } from '../../hooks/useProgramData';
import { Users, MessageSquare, Volume2, Shield } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../ui/Badge';

interface ProgramStakeholdersProps {
  programId: string;
}

const ProgramStakeholders: React.FC<ProgramStakeholdersProps> = ({ programId }) => {
  const { programStakeholders, communicationPlan } = useProgramData(programId);
  const theme = useTheme();

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-8 animate-in fade-in duration-300`}>
        <div className="flex items-center gap-2 mb-2">
            <Users className="text-nexus-600" size={24}/>
            <h2 className={theme.typography.h2}>Stakeholder Engagement & Communication</h2>
        </div>

        {/* Stakeholder Register */}
        <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Shield size={18} className="text-blue-500"/> Stakeholder Register</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Stakeholder</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Influence / Interest</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Engagement Level</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {programStakeholders.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                                    <div className="text-xs text-slate-500">{s.role}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        s.category === 'Strategic' ? 'bg-purple-100 text-purple-700' :
                                        s.category === 'Operational' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                                    }`}>{s.category}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {s.influence} / {s.interest}
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={
                                        s.engagementLevel === 'Supportive' ? 'success' :
                                        s.engagementLevel === 'Resistant' ? 'danger' : 'neutral'
                                    }>{s.engagementLevel}</Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Communication Plan */}
        <div className={`${theme.colors.surface} rounded-xl border ${theme.colors.border} shadow-sm overflow-hidden`}>
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2"><Volume2 size={18} className="text-green-500"/> Communication Strategy</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Audience</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Content / Information</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Frequency</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Channel</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Owner</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {communicationPlan.map(c => (
                            <tr key={c.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 text-sm font-medium text-slate-900">{c.audience}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{c.content}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{c.frequency}</td>
                                <td className="px-6 py-4 text-sm text-slate-600 flex items-center gap-2">
                                    <MessageSquare size={14} className="text-slate-400"/> {c.channel}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{c.owner}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default ProgramStakeholders;
