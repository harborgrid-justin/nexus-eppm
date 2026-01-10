import React, { useMemo } from 'react';
import { useProjectWorkspace } from '../../context/ProjectWorkspaceContext';
import { useTheme } from '../../context/ThemeContext';
import { useData } from '../../context/DataContext';
import { usePermissions } from '../../hooks/usePermissions';
import { Target, Shield, Users, Briefcase, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { NarrativeField } from '../common/NarrativeField';

const ProjectCharter: React.FC = () => {
  const { project, stakeholders, financials } = useProjectWorkspace();
  const { state, dispatch } = useData();
  const theme = useTheme();
  const { canEditProject } = usePermissions();

  const sponsor = useMemo(() => 
    stakeholders.find(s => s.role === 'Sponsor' || s.interest === 'High'),
  [stakeholders]);

  const pm = useMemo(() => 
    state.resources.find(r => r.id === project.managerId),
  [state.resources, project.managerId]);

  const handleUpdate = (field: string, value: string) => {
      dispatch({
          type: 'PROJECT_UPDATE',
          payload: {
              projectId: project.id,
              updatedData: { [field]: value }
          }
      });
  };

  const handleAssumptionUpdate = (desc: string) => {
      const newAssumptions = project.assumptions && project.assumptions.length > 0 
          ? [{ ...project.assumptions[0], description: desc }]
          : [{ id: `ASM-${Date.now()}`, description: desc, ownerId: 'Unassigned', status: 'Active' }];
      handleUpdate('assumptions', newAssumptions as any);
  };

  return (
    <div className={`space-y-8 animate-in fade-in`}>
        <div className="flex justify-between items-start">
            <div>
                <h2 className={theme.typography.h2}>Project Charter</h2>
                <p className={theme.typography.small}>Authorizing document for corporate investment.</p>
            </div>
            <Badge variant={project.status === 'Active' ? 'success' : 'neutral'}>
                {project.status || 'Draft'}
            </Badge>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 ${theme.layout.gridGap}`}>
            <div className={`lg:col-span-2 space-y-8`}>
                <Card className={theme.layout.cardPadding}>
                    <h3 className={`${theme.typography.label} mb-6 flex items-center gap-2 border-b border-slate-100 pb-3`}>
                        <Target size={14} className="text-nexus-600"/> Authorization Strategy
                    </h3>
                    <div className="space-y-8">
                        <NarrativeField 
                            label="Strategic Business Case"
                            value={project.businessCase}
                            placeholderLabel="Define the overarching strategic mandate and justification for this project."
                            onSave={(val) => handleUpdate('businessCase', val)}
                            isReadOnly={!canEditProject()}
                        />
                        <NarrativeField 
                            label="Primary Mission & Success Criteria"
                            value={project.description}
                            placeholderLabel="Define the mission statement and acceptance criteria."
                            onSave={(val) => handleUpdate('description', val)}
                            isReadOnly={!canEditProject()}
                        />
                    </div>
                </Card>

                <Card className={theme.layout.cardPadding}>
                    <h3 className={`${theme.typography.label} mb-6 flex items-center gap-2 border-b border-slate-100 pb-3`}>
                        <Shield size={14} className="text-blue-600"/> Boundary Conditions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className={`text-xs font-bold ${theme.colors.text.primary} mb-4`}>Authorized Budgetary Ceilings</h4>
                            <ul className={`text-sm ${theme.colors.text.secondary} space-y-3`}>
                                <li className="flex justify-between border-b border-slate-50 pb-2">
                                    <span className="font-medium">Approved Funding:</span> 
                                    <span className={`font-black ${theme.colors.text.primary} font-mono`}>{formatCurrency(project.budget || 0)}</span>
                                </li>
                                <li className="flex justify-between border-b border-slate-50 pb-2">
                                    <span className="font-medium">Escalation Threshold:</span> 
                                    <span className="font-bold text-red-600 font-mono">+10.0%</span>
                                </li>
                                <li className="flex justify-between pb-1">
                                    <span className="font-medium">Lifecycle Dates:</span> 
                                    <span className={`font-bold ${theme.colors.text.primary}`}>{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <NarrativeField 
                                label="Critical Assumptions"
                                value={project.assumptions?.[0]?.description}
                                placeholderLabel="List external dependencies or resource assumptions."
                                onSave={handleAssumptionUpdate}
                                isReadOnly={!canEditProject()}
                            />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="space-y-8">
                <Card className={theme.layout.cardPadding}>
                    <h3 className={`${theme.typography.label} mb-6 flex items-center gap-2 border-b border-slate-100 pb-3`}>
                        <Users size={14} className="text-purple-600"/> Decision Authorities
                    </h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center font-black text-lg text-slate-400 border border-slate-200 shadow-inner`}>
                                {sponsor ? sponsor.name.charAt(0) : '?'}
                            </div>
                            <div>
                                <p className={theme.typography.label}>Portfolio Sponsor</p>
                                <p className={`text-sm font-bold ${theme.colors.text.primary}`}>{sponsor?.name || 'Unassigned'}</p>
                                <p className="text-[9px] text-green-600 font-black uppercase mt-0.5">Approved Sign-off</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center font-black text-lg text-slate-400 border border-slate-200 shadow-inner`}>
                                {pm ? pm.name.charAt(0) : '?'}
                            </div>
                            <div>
                                <p className={theme.typography.label}>Project Manager</p>
                                <p className={`text-sm font-bold ${theme.colors.text.primary}`}>{pm?.name || 'Unassigned'}</p>
                                <p className="text-[10px] text-blue-600 font-bold mt-0.5">Authority Level: III</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="p-8 bg-slate-900 text-white rounded-3xl shadow-2xl relative overflow-hidden">
                    <h3 className={`font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2 text-nexus-400 relative z-10`}>
                        <Info size={18} /> Metadata Token
                    </h3>
                    <div className="space-y-4 text-xs relative z-10">
                        <div className="flex justify-between border-b border-white/10 pb-3">
                            <span className="text-slate-500 font-bold uppercase">Ledger Ref</span>
                            <span className="font-mono font-black text-white">{project.code || 'PENDING'}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-3">
                            <span className="text-slate-500 font-bold uppercase">EPS Branch</span>
                            <span className="font-bold text-white uppercase">{project.epsId || 'ROOT'}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                            <span className="text-slate-500 font-bold uppercase">Original Basis</span>
                            <span className="text-xl font-mono font-black text-green-400">{formatCurrency(project.originalBudget || 0)}</span>
                        </div>
                    </div>
                    <Briefcase size={200} className="absolute -right-16 -bottom-16 opacity-5 text-white pointer-events-none" />
                </div>
            </div>
        </div>
    </div>
  );
};

export default ProjectCharter;