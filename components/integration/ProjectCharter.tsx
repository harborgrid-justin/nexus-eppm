import React, { useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { Target, Shield, Users, Briefcase, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { FieldPlaceholder } from '../common/FieldPlaceholder';

const ProjectCharter: React.FC = () => {
  const { project, stakeholders } = useProjectWorkspace();
  const { state } = useData();
  const theme = useTheme();

  const sponsor = useMemo(() => 
    stakeholders.find(s => s.role === 'Sponsor' || s.interest === 'High'),
  [stakeholders]);

  const pm = useMemo(() => 
    state.resources.find(r => r.id === project.managerId),
  [state.resources, project.managerId]);

  return (
    <div className={`h-full overflow-y-auto ${theme.layout.pagePadding} space-y-6 animate-in fade-in`}>
        <div className="flex justify-between items-start">
            <div>
                <h2 className={theme.typography.h2}>Project Charter</h2>
                <p className={theme.typography.small}>Authorizing document for {project.name}</p>
            </div>
            <Badge variant={project.status === 'Active' ? 'success' : 'neutral'}>
                {project.status || 'Draft'}
            </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                    <h3 className={`font-bold ${theme.colors.text.primary} mb-4 flex items-center gap-2`}>
                        <Target size={18} className="text-nexus-600"/> Business Case & Justification
                    </h3>
                    {project.businessCase ? (
                        <p className={`text-sm ${theme.colors.text.secondary} leading-relaxed mb-4 whitespace-pre-wrap`}>
                            {project.businessCase}
                        </p>
                    ) : (
                        <FieldPlaceholder label="No business case narrative defined." onAdd={() => {}} className="mb-4" />
                    )}
                    
                    <div className={`${theme.colors.background} p-4 rounded-lg border ${theme.colors.border}`}>
                        <h4 className={`text-[10px] font-black ${theme.colors.text.secondary} uppercase tracking-widest mb-2`}>Mission Description</h4>
                        {project.description ? (
                            <p className={`text-sm ${theme.colors.text.primary} leading-relaxed`}>{project.description}</p>
                        ) : (
                            <FieldPlaceholder label="Specify project mission and scope boundaries..." onAdd={() => {}} />
                        )}
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className={`font-bold ${theme.colors.text.primary} mb-4 flex items-center gap-2`}>
                        <Shield size={18} className="text-blue-600"/> Execution Parameters
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className={`text-[10px] font-black ${theme.colors.text.secondary} uppercase tracking-widest mb-3`}>Financial Constraints</h4>
                            <ul className={`text-sm ${theme.colors.text.secondary} space-y-3`}>
                                <li className="flex justify-between border-b border-slate-50 pb-2">
                                    <span>Authorized Budget:</span> 
                                    <span className="font-bold text-slate-900 font-mono">{formatCurrency(project.budget)}</span>
                                </li>
                                <li className="flex justify-between border-b border-slate-50 pb-2">
                                    <span>Ceiling Delta:</span> 
                                    <span className="font-bold text-slate-700 font-mono">10% Authorization</span>
                                </li>
                                <li className="flex justify-between pb-1">
                                    <span>Planned Duration:</span> 
                                    <span className="font-bold text-slate-800">{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={`text-[10px] font-black ${theme.colors.text.secondary} uppercase tracking-widest mb-3`}>High-Level Assumptions</h4>
                            {project.assumptions && project.assumptions.length > 0 ? (
                                <ul className={`text-sm ${theme.colors.text.secondary} space-y-2`}>
                                    {project.assumptions.map((a, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="text-nexus-500 font-bold">•</span>
                                            {a.description}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <FieldPlaceholder label="No critical assumptions identified." onAdd={() => {}} />
                            )}
                        </div>
                    </div>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="p-6">
                    <h3 className={`font-bold ${theme.colors.text.primary} mb-6 flex items-center gap-2`}>
                        <Users size={18} className="text-purple-600"/> Governance Authority
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${theme.colors.background} flex items-center justify-center font-black text-lg ${theme.colors.text.tertiary} border ${theme.colors.border}`}>
                                {sponsor ? sponsor.name.charAt(0) : '?'}
                            </div>
                            <div>
                                <p className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-tighter`}>Project Sponsor</p>
                                <p className={`text-sm font-bold ${theme.colors.text.primary}`}>{sponsor?.name || 'Selection Pending'}</p>
                                <p className="text-[10px] text-green-600 font-bold">Authority Level: III</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl ${theme.colors.background} flex items-center justify-center font-black text-lg ${theme.colors.text.tertiary} border ${theme.colors.border}`}>
                                {pm ? pm.name.charAt(0) : '?'}
                            </div>
                            <div>
                                <p className={`text-[10px] font-black ${theme.colors.text.tertiary} uppercase tracking-tighter`}>Project Manager</p>
                                <p className={`text-sm font-bold ${theme.colors.text.primary}`}>{pm?.name || 'Unassigned'}</p>
                                <p className="text-[10px] text-blue-600 font-bold">ID: {pm?.id || '---'}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl relative overflow-hidden">
                    <h3 className={`font-bold mb-4 flex items-center gap-2 text-nexus-400 relative z-10`}>
                        <Info size={18} /> Official Record
                    </h3>
                    <div className="space-y-3 text-xs relative z-10">
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-slate-400">Ledger Code</span>
                            <span className="font-mono font-bold text-white">{project.code || 'PENDING'}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                            <span className="text-slate-400">Creation Date</span>
                            <span className="font-bold text-white">{project.startDate ? formatDate(project.startDate) : '---'}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                            <span className="text-slate-400">Original Baseline</span>
                            <span className="text-lg font-mono font-black text-green-400">{formatCurrency(project.originalBudget)}</span>
                        </div>
                    </div>
                    <Briefcase size={150} className="absolute -right-10 -bottom-10 opacity-5 text-white pointer-events-none" />
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProjectCharter;